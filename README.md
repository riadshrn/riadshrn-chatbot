# Riadshrn Chatbot 💬

Un projet de chatbot en temps réel intégrant des services Azure et utilisant **FastAPI** pour le backend et des technologies modernes pour le frontend.

---

## 📁 Structure du Projet
```bash
riadshrn-chatbot/ 
├── backend/ 
│ ├── main.py 
│ ├── requirements.txt 
│ ├── startup.sh 
│ ├── .env 
│ └── README.md 
├── frontend/ 
│ ├── index.html 
│ ├── script.js 
│ ├── style.css 
│ └── README.md 
└── README.md
```


---

## 🚀 Technologies Utilisées

### **Frontend**
- ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) **HTML**
- ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) **CSS**
- ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) **JavaScript**

### **Backend**
- ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) **Python**
- ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white) **FastAPI**

### **Services Azure**
- ![Azure App Service](https://img.shields.io/badge/-Azure%20App%20Service-0078D4?logo=microsoft-azure&logoColor=white) **Azure App Service**
- ![Azure Blob Storage](https://img.shields.io/badge/-Azure%20Blob%20Storage-0078D4?logo=microsoft-azure&logoColor=white) **Azure Blob Storage**
- ![Azure Table Storage](https://img.shields.io/badge/-Azure%20Table%20Storage-0078D4?logo=microsoft-azure&logoColor=white) **Azure Table Storage**
- ![Azure Cognitive Services](https://img.shields.io/badge/-Azure%20Cognitive%20Services-0078D4?logo=microsoft-azure&logoColor=white) **Azure Cognitive Services**

---

## 🏗️ Fonctionnalités

1. **Chat en temps réel** grâce à WebSocket.
2. **Analyse de sentiment** avec Azure Cognitive Services.
3. **Stockage des messages** dans Azure Table Storage.
4. **Interface intuitive** pour les utilisateurs.

---

## 📄 Instructions de Déploiement

### Backend
1. Configurez les variables dans `.env`.
2. Installez les dépendances Python avec :
   ```bash
   pip install -r requirements.txt
   ```
3. Lancez le serveur avec :
    ```python
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```


### Frontend
1. Déployez les fichiers dans un conteneur $web d’Azure Blob Storage.
2. Accédez à l'URL pour voir l'application.

## 🖇️ Services Utilisés
Les services suivants sont intégrés pour répondre aux besoins du projet :

01. Azure App Service : Héberge l'API FastAPI.
02. Azure Blob Storage : Héberge le frontend.
03. Azure Table Storage : Stocke les messages.
04. Azure Cognitive Services : Analyse de sentiment.