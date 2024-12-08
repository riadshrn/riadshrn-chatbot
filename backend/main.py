import os
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
from azure.data.tables import TableServiceClient
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uuid
from datetime import datetime



load_dotenv()

app = FastAPI()

# Charger les variables d'environnement
endpoint = os.getenv("AZURE_COGNITIVE_ENDPOINT")
key = os.getenv("AZURE_COGNITIVE_KEY")
connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")

# Vérifications
if not endpoint or not isinstance(endpoint, str):
    raise ValueError("L'endpoint Azure Cognitive est manquant ou invalide.")
if not key or not isinstance(key, str):
    raise ValueError("La clé Azure Cognitive est manquante ou invalide.")
if not connection_string or not isinstance(connection_string, str):
    raise ValueError("La chaîne de connexion Azure Storage est manquante ou invalide.")

# Configuration des clients Azure
text_analytics_client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))
table_service = TableServiceClient.from_connection_string(conn_str=connection_string)
table_client = table_service.get_table_client(table_name="Conversations")




app = FastAPI()

# Stockage des utilisateurs connectés
rooms = {}

def analyse_sentiment(text):
    """Analyse le sentiment d'un message et retourne le score."""
    response = text_analytics_client.analyze_sentiment(documents=[text])[0]
    score = response.confidence_scores.positive - response.confidence_scores.negative
    sentiment = "positif" if score > 0.1 else "neutre" if abs(score) <= 0.1 else "négatif"
    return score, sentiment

def save_message_to_table(room, username, message, score, sentiment):
    """Sauvegarder un message dans Azure Table Storage."""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    entity = {
        "PartitionKey": room,
        "RowKey": f"{timestamp}_{uuid.uuid4()}",
        "Username": username,
        "Message": message,
        "Score": score,
        "Sentiment": sentiment
    }
    table_client.create_entity(entity)

def get_messages_from_table(room):
    """Récupérer les anciens messages d'une RoomChat depuis Azure Table Storage."""
    entities = table_client.query_entities(f"PartitionKey eq '{room}'")
    
    messages = []
    for e in entities:
        print(e)  # Affichez chaque entité pour vérifier son contenu
        if "RowKey" in e:
            messages.append({
                "username": e.get("Username", "Unknown"),
                "message": e.get("Message", ""),
                "score": e.get("Score", 0),
                "sentiment": e.get("Sentiment", "Unknown"),
                "RowKey": e["RowKey"]  # Ajoutez RowKey si disponible
            })
        else:
            print("RowKey non trouvé dans l'entité:", e)
    
    return sorted(messages, key=lambda x: x["RowKey"])

@app.websocket("/ws/{room}/{username}")
async def websocket_endpoint(websocket: WebSocket, room: str, username: str):
    await websocket.accept()

    # Ajouter l'utilisateur à la salle
    if room not in rooms:
        rooms[room] = {"users": []}
    rooms[room]["users"].append({"username": username, "websocket": websocket})

    try:
        # Récupérer les anciens messages
        old_messages = get_messages_from_table(room)
        await websocket.send_json({"old_messages": old_messages})

        # Écouter les messages en temps réel
        while True:
            data = await websocket.receive_text()

            # Analyse du message
            score, sentiment = analyse_sentiment(data)

            # Sauvegarder le message dans Table Storage
            save_message_to_table(room, username, data, score, sentiment)

            # Diffuser le message à tous les utilisateurs de la salle
            for user in rooms[room]["users"]:
                await user["websocket"].send_json({
                    "username": username,
                    "message": data,
                    "score": score,
                    "sentiment": sentiment
                })

    except WebSocketDisconnect:
        # Supprimer l'utilisateur déconnecté
        rooms[room]["users"] = [user for user in rooms[room]["users"] if user["username"] != username]

        # Nettoyer la salle si elle est vide
        if not rooms[room]["users"]:
            del rooms[room]



from fastapi.middleware.cors import CORSMiddleware

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Remplacez par les origines autorisées (ex: votre frontend)
    allow_credentials=True,
    allow_methods=["*"],  # Autoriser toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"]   # Autoriser tous les en-têtes
)

@app.get("/api/scores")
async def get_scores(room: str = None):
    """
    Récupérer les scores moyens des utilisateurs pour une salle spécifique.
    Si aucune salle n'est spécifiée, récupérer les scores pour toutes les salles.
    """
    try:
        # Définir un filtre pour la salle, ou récupérer toutes les entités si la salle n'est pas spécifiée
        query_filter = f"PartitionKey eq '{room}'" if room else "PartitionKey ne ''"
        
        # Exécuter la requête sur Azure Table Storage
        entities = table_client.query_entities(query_filter=query_filter)
        
        scores = {}
        for entity in entities:
            username = entity["Username"]
            score = float(entity["Score"])
            if username in scores:
                scores[username].append(score)
            else:
                scores[username] = [score]

        # Calculer la moyenne pour chaque utilisateur
        result = [{"username": user, "average_score": sum(scores[user]) / len(scores[user])} for user in scores]
        
        return result
    except Exception as e:
        return {"error": str(e)}

@app.websocket("/ws/{room}/{username}")
async def websocket_endpoint(websocket: WebSocket, room: str, username: str):
    # Logs pour la connexion
    print(f"{username} a rejoint la salle : {room}")
    print(f"Utilisateurs dans la salle {room}: {[user['username'] for user in rooms[room]['users']]}")
    
    # Logs pour la réception de messages
    while True:
        data = await websocket.receive_text()
        print(f"Message reçu de {username} : {data}")


@app.get("/api/messages")
async def get_messages(room: str):
    """
    Récupérer tous les messages d'une salle spécifique.
    """
    try:
        # Appeler la fonction pour récupérer les messages triés
        messages = get_messages_from_table(room)
        
        # Vérifiez si des messages ont été récupérés
        if not messages:
            return {"messages": [], "message": "Aucun message trouvé pour cette salle."}
        
        # Retourner les messages triés
        return {"messages": messages}
    
    except Exception as e:
        # En cas d'erreur, retourner un message d'erreur explicite
        return {"error": f"Une erreur est survenue : {str(e)}"}
