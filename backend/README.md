# Backend du Chatbot 💬

Ce dossier contient l'API backend développée avec **FastAPI** pour gérer la logique métier et la communication en temps réel.

---

## 📂 Structure

```bash 
backend/ 
├── main.py # Code principal du backend 
├── requirements.txt # Liste des dépendances 
├── startup.sh # Script de démarrage 
├── .env # Variables d'environnement 
├── .gitignore # Fichiers à ignorer 
└── README.md # Documentation du backend
```


---

## 🚀 Technologies Utilisées

- ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) **Python**
- ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white) **FastAPI**
- ![Azure App Service](https://img.shields.io/badge/-Azure%20App%20Service-0078D4?logo=microsoft-azure&logoColor=white) **Azure App Service**

---

## 📄 Fonctionnalités

1. **WebSocket** : Communication en temps réel.
2. **Analyse de sentiment** : Utilisation d’Azure Cognitive Services.
3. **Stockage** : Sauvegarde des messages dans Azure Table Storage.

---

## 🖇️ Services Intégrés

1. **Azure App Service** : Hébergement de l’API backend.
2. **Azure Cognitive Services** : Analyse de sentiment.
3. **Azure Table Storage** : Stockage des messages.

---

## 📖 Instructions de Déploiement

1. Configurez le fichier `.env` avec vos clés Azure :
   ```env
   AZURE_COGNITIVE_ENDPOINT=<votre_endpoint>
   AZURE_COGNITIVE_KEY=<votre_clé>
   AZURE_STORAGE_CONNECTION_STRING=<votre_chaine_de_connexion>
    ```

2. Installez les dépendances :
    ```python
    pip install -r requirements.txt
    ```

3. Déployez l’API sur Azure App Service :
    ```python
    az webapp up --name <nom_de_votre_app>
    ```