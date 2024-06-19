let sessions = JSON.parse(localStorage.getItem('sessions')) || {};
let currentSession = null;

function createSession() {
    const sessionName = document.getElementById('sessionName').value;
    if (sessionName !== '') {
        sessions[sessionName] = { players: [] };
        document.getElementById('sessionName').value = '';
        saveSessions();
        updateSessionSelect();
    }
}

function updateSessionSelect() {
    const sessionSelect = document.getElementById('sessionSelect');
    sessionSelect.innerHTML = '<option value="" disabled selected>W?hle eine Sitzung</option>';
    for (let session in sessions) {
        const option = document.createElement('option');
        option.value = session;
        option.textContent = session;
        sessionSelect.appendChild(option);
    }
}

function loadSession() {
    const sessionSelect = document.getElementById('sessionSelect');
    currentSession = sessionSelect.value;
    updatePlayerList();
    updatePlayerSelect();
    updateTotalScores();
}

function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    if (playerName !== '' && currentSession) {
        sessions[currentSession].players.push({ name: playerName, scores: [] });
        document.getElementById('playerName').value = '';
        saveSessions();
        updatePlayerList();
        updatePlayerSelect();
    }
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    if (currentSession) {
        sessions[currentSession].players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player.name;
            playerList.appendChild(li);
        });
    }
}

function updatePlayerSelect() {
    const playerSelect = document.getElementById('playerSelect');
    playerSelect.innerHTML = '<option value="" disabled selected>W?hle einen Spieler</option>';
    if (currentSession) {
        sessions[currentSession].players.forEach((player, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = player.name;
            playerSelect.appendChild(option);
        });
    }
}

function addPoints() {
    const playerIndex = document.getElementById('playerSelect').value;
    const points = parseInt(document.getElementById('points').value);
    if (playerIndex !== '' && !isNaN(points) && currentSession) {
        sessions[currentSession].players[playerIndex].scores.push(points);
        document.getElementById('points').value = '';
        saveSessions();
        updateTotalScores();
        updateDashboard();
    }
}

function updateTotalScores() {
    const totalScores = document.getElementById('totalScores');
    totalScores.innerHTML = '';
    if (currentSession) {
        sessions[currentSession].players.forEach(player => {
            const total = player.scores.reduce((sum, score) => sum + score, 0);
            const li = document.createElement('li');
            li.textContent = `${player.name}: ${total} Punkte`;
            totalScores.appendChild(li);
        });
    }
}

function updateDashboard() {
    const dashboard = document.getElementById('dashboard');
    const playerTotals = {};

    for (let session in sessions) {
        sessions[session].players.forEach(player => {
            if (!playerTotals[player.name]) {
                playerTotals[player.name] = 0;
            }
            playerTotals[player.name] += player.scores.reduce((sum, score) => sum + score, 0);
        });
    }

    const sortedPlayers = Object.keys(playerTotals).sort((a, b) => playerTotals[b] - playerTotals[a]);

    dashboard.innerHTML = '';
    sortedPlayers.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player}: ${playerTotals[player]} Punkte`;
        dashboard.appendChild(li);
    });
}

function saveSessions() {
    localStorage.setItem('sessions', JSON.stringify(sessions));
}

// Initial load
updateSessionSelect();
updateDashboard();
