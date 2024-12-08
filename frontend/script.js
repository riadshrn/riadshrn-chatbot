let websocket;
let username;

/// Endpoint WebSocket sÃ©curisÃ©
const WS_ENDPOINT = "wss://riadshrnfastapiapp.azurewebsites.net/ws/";
const WS_local = "ws://127.0.0.1:8000/ws/";
async function fetchUserScoresFromAzure() {
    try {
        const response = await fetch("https://riadshrnfastapiapp.azurewebsites.net/api/scores");
        const data = await response.json();
        console.log("Scores rÃ©cupÃ©rÃ©s depuis Azure :", data);
        return data;
    } catch (error) {
        console.error("Erreur lors de la rÃ©cupÃ©ration des scores :", error);
        return [];
    }
}

function joinRoom() {
    username = document.getElementById("username").value;
    const room = document.getElementById("room").value;

    if (!username || !room) {
        alert("Veuillez entrer votre nom et le nom de la salle.");
        return;
    }

    console.log(`Tentative de connexion Ã  la salle : ${room} avec le nom d'utilisateur : ${username}`);
    websocket = new WebSocket(`${WS_ENDPOINT}${room}/${username}`);

    websocket.onopen = async () => {
        console.log("Connexion au WebSocket rÃ©ussie.");
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('chat-section').classList.remove('hidden');
        document.getElementById('room-name').innerText = room;

        // RÃ©cupÃ©rer les scores initiaux
        const scoresFromAzure = await fetchUserScoresFromAzure();
        updateUserList(scoresFromAzure);
    };

    websocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("DonnÃ©es reÃ§ues du WebSocket :", data);

        // Gestion des anciens messages
        if (data.old_messages) {
            updateChatBox(data.old_messages);
        }

        // Gestion des nouveaux messages
        if (data.message) {
            const newMessage = [{
                username: data.username,
                message: data.message,
            }];
            updateChatBox(newMessage, false); // Ajouter sans rÃ©initialiser
        }

        // Mise Ã  jour des scores
        const scoresFromAzure = await fetchUserScoresFromAzure();
        updateUserList(scoresFromAzure);
    };

    websocket.onclose = () => {
        console.log("Connexion au WebSocket fermÃ©e.");
        alert("Connexion au chat fermÃ©e.");
        location.reload();
    };

    websocket.onerror = (error) => {
        console.error("Erreur WebSocket :", error);
    };
}

function sendMessage() {
    const message = document.getElementById("message").value;

    if (message) {
        console.log(`Envoi du message : ${message}`);
        websocket.send(message);
        document.getElementById("message").value = "";
    } else {
        console.log("Aucun message Ã  envoyer.");
    }
}

function updateChatBox(messages, reset = true) {
    const chatBox = document.getElementById("chat-box");
    if (reset) {
        chatBox.innerHTML = ""; // RÃ©initialiser la boÃ®te de chat
    }

    messages.forEach(msg => {
        const messageClass = msg.username === username ? "message sent" : "message received";
        chatBox.innerHTML += `
            <div class="${messageClass}">
                <b>${msg.username} :</b> ${msg.message}
            </div>`;
    });

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll automatique
}

function updateUserList(scores) {
    const usersList = document.getElementById("users-list");
    usersList.innerHTML = ""; // RÃ©initialiser la liste des utilisateurs

    scores.forEach(user => {
        if (user.username && typeof user.average_score === "number") {
            const emoji = getEmoji(user.average_score);
            usersList.innerHTML += `
                <li data-username="${user.username}" data-score="${user.average_score}">
                    <b>${user.username}:</b> ${user.average_score.toFixed(2)} ${emoji}
                </li>`;
        } else {
            console.warn(`Utilisateur ou score invalide : ${JSON.stringify(user)}`);
        }
    });

    const totalScore = scores.reduce((sum, user) => sum + (typeof user.average_score === "number" ? user.average_score : 0), 0);
    const validUsersCount = scores.filter(user => typeof user.average_score === "number").length;
    const averageScore = validUsersCount > 0 ? (totalScore / validUsersCount).toFixed(2) : "0.00";
    document.getElementById("chat-score").innerText = `Score moyen du chat : ${averageScore}`;
}

function getEmoji(score) {
    if (score > 0.1) return "ðŸ˜Š";
    if (score < -0.1) return "ðŸ˜¡";
    return "ðŸ˜";
}

// Liste des phrases motivantes
const motivationalPhrases = [
    "Vous Ãªtes capable de tout accomplirÂ !",
    "Chaque jour est une nouvelle opportunitÃ©.",
    "N'abandonnez jamais vos rÃªves.",
    "Croyez en vous et tout est possible.",
    "Un sourire peut tout changer.",
    "Le succÃ¨s commence par une seule Ã©tape.",
    "Prenez soin de vous, vous Ãªtes important.",
    "Vous Ãªtes plus fort que vous ne le pensez.",
    "Chaque dÃ©fi est une chance de grandir."
];

function showRandomPhrase() {
    const overlay = document.getElementById("motivational-overlay");
    const textElement = document.getElementById("motivational-text");

    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    textElement.innerText = motivationalPhrases[randomIndex];

    overlay.classList.remove("hidden");
    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 3000);
}

setInterval(showRandomPhrase, 30000);



/*
let websocket;
let username;
/// https://riadshrnfastapiapp.azurewebsites.net http://127.0.0.1:8000
async function fetchUserScoresFromAzure() {
    try {
        const response = await fetch("https://riadshrnfastapiapp.azurewebsites.net/api/scores"); // Remplacez par l'URL de votre API FastAPI
        const data = await response.json();
        console.log("Scores rÃ©cupÃ©rÃ©s depuis Azure :", data);
        return data; // Doit Ãªtre un tableau d'objets { username, average_score }
    } catch (error) {
        console.error("Erreur lors de la rÃ©cupÃ©ration des scores :", error);
        return [];
    }
}

function joinRoom() {
    username = document.getElementById("username").value;
    const room = document.getElementById("room").value;

    if (!username || !room) {
        alert("Veuillez entrer votre nom et le nom de la salle.");
        return;
    }

    console.log(`Tentative de connexion Ã  la salle : ${room} avec le nom d'utilisateur : ${username}`);
    //ws://127.0.0.1:8000/ws/ wss://riadshrnfastapiapp.azurewebsites.net/ws/
    websocket = new WebSocket(`wss://riadshrnfastapiapp.azurewebsites.net/ws/${room}/${username}`);

    websocket.onopen = async () => {
        console.log("Connexion au WebSocket rÃ©ussie.");
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('chat-section').classList.remove('hidden');
        document.getElementById('room-name').innerText = room;

        // RÃ©cupÃ©rer les scores initiaux depuis Azure
        const scoresFromAzure = await fetchUserScoresFromAzure();
        updateUserList(scoresFromAzure);
    };

    websocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("DonnÃ©es reÃ§ues du WebSocket :", data);
    
        const chatBox = document.getElementById("chat-box");
    
        // Ajouter des anciens messages si prÃ©sents
        if (data.old_messages) {
            data.old_messages.forEach((msg) => {
                const messageClass = msg.username === username ? "message sent" : "message received";
                chatBox.innerHTML += `
                    <div class="${messageClass}">
                        <b>${msg.username} :</b> ${msg.message}
                    </div>`;
            });
        }
    
        // Ajouter un nouveau message
        if (data.message) {
            const messageClass = data.username === username ? "message sent" : "message received";
            chatBox.innerHTML += `
                <div class="${messageClass}">
                    <b>${data.username} :</b> ${data.message}
                </div>`;
        }
    
        // Scroll automatique
        chatBox.scrollTop = chatBox.scrollHeight;
    
        // Actualiser les scores en temps rÃ©el
        const scoresFromAzure = await fetchUserScoresFromAzure();
        updateUserList(scoresFromAzure);
    };
    

    websocket.onclose = () => {
        console.log("Connexion au WebSocket fermÃ©e.");
        alert("Connexion au chat fermÃ©e.");
        location.reload();
    };

    websocket.onerror = (error) => {
        console.error("Erreur WebSocket :", error);
    };
}

function sendMessage() {
    const message = document.getElementById("message").value;

    if (message) {
        console.log(`Envoi du message : ${message}`);
        websocket.send(message);
        document.getElementById("message").value = "";
    } else {
        console.log("Aucun message Ã  envoyer.");
    }
}

function updateUserList(scores) {
    const usersList = document.getElementById("users-list");
    usersList.innerHTML = ""; // RÃ©initialiser la liste des utilisateurs

    scores.forEach(user => {
        if (user.username && typeof user.average_score === "number") {
            const emoji = getEmoji(user.average_score);
            usersList.innerHTML += `
                <li data-username="${user.username}" data-score="${user.average_score}">
                    <b>${user.username}:</b> ${user.average_score.toFixed(2)} ${emoji}
                </li>`;
        } else {
            console.warn(`Utilisateur ou score invalide : ${JSON.stringify(user)}`);
        }
    });

    const totalScore = scores.reduce((sum, user) => sum + (typeof user.average_score === "number" ? user.average_score : 0), 0);
    const validUsersCount = scores.filter(user => typeof user.average_score === "number").length;
    const averageScore = validUsersCount > 0 ? (totalScore / validUsersCount).toFixed(2) : "0.00";
    document.getElementById("chat-score").innerText = `Score moyen du chat : ${averageScore}`;
}

function getEmoji(score) {
    if (score > 0.1) return "ðŸ˜Š";
    if (score < -0.1) return "ðŸ˜¡";
    return "ðŸ˜";
}


// Liste des phrases motivantes
const motivationalPhrases = [
    "Vous Ãªtes capable de tout accomplirÂ !",
    "Chaque jour est une nouvelle opportunitÃ©.",
    "N'abandonnez jamais vos rÃªves.",
    "Croyez en vous et tout est possible.",
    "Un sourire peut tout changer.",
    "Le succÃ¨s commence par une seule Ã©tape.",
    "Prenez soin de vous, vous Ãªtes important.",
    "Vous Ãªtes plus fort que vous ne le pensez.",
    "Chaque dÃ©fi est une chance de grandir."
];

// Fonction pour afficher une phrase alÃ©atoire
function showRandomPhrase() {
    const overlay = document.getElementById("motivational-overlay");
    const textElement = document.getElementById("motivational-text");

    // Choisir une phrase alÃ©atoire
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    textElement.innerText = motivationalPhrases[randomIndex];

    // Afficher l'overlay
    overlay.classList.remove("hidden");

    // Masquer l'overlay aprÃ¨s 3 secondes
    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 3000); // Phrase visible pendant 3 secondes
}

// Lancer l'affichage toutes les 10 secondes
setInterval(showRandomPhrase, 30000);

*/