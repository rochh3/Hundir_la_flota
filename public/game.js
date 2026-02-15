// Conexión con Socket.IO
const socket = io();

// Estado del juego
const gameState = {
    myTeam: null,
    myBoard: Array(10).fill(null).map(() => Array(10).fill(null)),
    enemyBoard: Array(10).fill(null).map(() => Array(10).fill(0)),
    placedShips: {},
    isReady: false,
    gameStarted: false,
    currentTurn: null,
    stats: {
        shots: 0,
        hits: 0
    }
};

// Definición de barcos
const ships = [
    {
        id: 'carrier',
        name: 'Portaviones',
        size: 4,
        orientation: 'h',
        segments: [
            '<svg viewBox="0 0 100 100"><defs><linearGradient id="ship1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#78909C"/><stop offset="100%" style="stop-color:#546E7A"/></linearGradient></defs><rect x="15" y="30" width="70" height="40" fill="url(#ship1)" rx="8"/><polygon points="50,15 40,30 60,30" fill="#FF6B6B"/><circle cx="50" cy="50" r="10" fill="#FFD700"/><rect x="25" y="38" width="50" height="6" fill="#FF8C42" opacity="0.8"/><rect x="25" y="56" width="50" height="6" fill="#FF8C42" opacity="0.8"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="15" y="30" width="70" height="40" fill="url(#ship1)" rx="8"/><rect x="25" y="38" width="50" height="6" fill="#FF8C42" opacity="0.8"/><rect x="25" y="56" width="50" height="6" fill="#FF8C42" opacity="0.8"/><circle cx="35" cy="50" r="6" fill="#B0BEC5"/><circle cx="65" cy="50" r="6" fill="#B0BEC5"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="15" y="30" width="70" height="40" fill="url(#ship1)" rx="8"/><rect x="25" y="38" width="50" height="6" fill="#FF8C42" opacity="0.8"/><rect x="25" y="56" width="50" height="6" fill="#FF8C42" opacity="0.8"/><circle cx="35" cy="50" r="6" fill="#B0BEC5"/><circle cx="65" cy="50" r="6" fill="#B0BEC5"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="15" y="30" width="70" height="40" fill="url(#ship1)" rx="8"/><polygon points="85,50 75,30 75,70" fill="#37474F"/><rect x="55" y="43" width="20" height="14" fill="#1A659E" rx="3"/></svg>'
        ]
    },
    {
        id: 'battleship',
        name: 'Acorazado',
        size: 3,
        orientation: 'h',
        segments: [
            '<svg viewBox="0 0 100 100"><rect x="20" y="35" width="60" height="30" fill="#607D8B" rx="6"/><polygon points="50,20 43,35 57,35" fill="#FF6B6B"/><circle cx="50" cy="50" r="8" fill="#FFD700"/><rect x="30" y="43" width="40" height="5" fill="#4ECDC4" opacity="0.7"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="20" y="35" width="60" height="30" fill="#607D8B" rx="6"/><rect x="30" y="43" width="40" height="5" fill="#4ECDC4" opacity="0.7"/><circle cx="38" cy="50" r="6" fill="#B0BEC5"/><circle cx="62" cy="50" r="6" fill="#B0BEC5"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="20" y="35" width="60" height="30" fill="#607D8B" rx="6"/><polygon points="80,50 72,35 72,65" fill="#455A64"/><rect x="58" y="45" width="14" height="10" fill="#1A659E" rx="2"/></svg>'
        ]
    },
    {
        id: 'cruiser',
        name: 'Crucero',
        size: 2,
        orientation: 'h',
        segments: [
            '<svg viewBox="0 0 100 100"><rect x="25" y="38" width="50" height="24" fill="#78909C" rx="5"/><polygon points="50,25 45,38 55,38" fill="#FF6B6B"/><circle cx="50" cy="50" r="6" fill="#FFD700"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="25" y="38" width="50" height="24" fill="#78909C" rx="5"/><polygon points="75,50 68,38 68,62" fill="#546E7A"/><circle cx="42" cy="50" r="5" fill="#B0BEC5"/></svg>'
        ]
    },
    {
        id: 'submarine',
        name: 'Submarino',
        size: 1,
        orientation: 'h',
        segments: [
            '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="30" ry="18" fill="#455A64"/><rect x="47" y="28" width="6" height="22" fill="#546E7A"/><circle cx="50" cy="30" r="5" fill="#FFD700"/><circle cx="38" cy="50" r="4" fill="#4ECDC4" opacity="0.7"/><circle cx="62" cy="50" r="4" fill="#4ECDC4" opacity="0.7"/><ellipse cx="50" cy="50" rx="20" ry="12" fill="#607D8B" opacity="0.4"/></svg>'
        ]
    }
];

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// EVENTOS DE SOCKET.IO

socket.on('connect', () => {
    console.log('✅ Conectado al servidor');
    document.getElementById('connection-indicator').classList.add('connected');
    document.getElementById('connection-text').textContent = 'Conectado';
});

socket.on('disconnect', () => {
    console.log('❌ Desconectado del servidor');
    document.getElementById('connection-indicator').classList.remove('connected');
    document.getElementById('connection-indicator').classList.add('disconnected');
    document.getElementById('connection-text').textContent = 'Desconectado';
});

socket.on('teams-status', (data) => {
    const blueCard = document.getElementById('select-blue');
    const redCard = document.getElementById('select-red');
    const blueStatus = document.getElementById('blue-status');
    const redStatus = document.getElementById('red-status');
    
    if (data.blue) {
        blueCard.classList.add('occupied');
        blueStatus.textContent = 'Ocupado';
    } else {
        blueCard.classList.remove('occupied');
        blueStatus.textContent = 'Disponible';
    }
    
    if (data.red) {
        redCard.classList.add('occupied');
        redStatus.textContent = 'Ocupado';
    } else {
        redCard.classList.remove('occupied');
        redStatus.textContent = 'Disponible';
    }
});

socket.on('team-selected', (data) => {
    if (data.success) {
        gameState.myTeam = data.team;
        initGame();
    } else {
        alert('Este equipo ya está ocupado. Por favor, elige el otro.');
    }
});

socket.on('game-start', (data) => {
    gameState.gameStarted = true;
    gameState.currentTurn = data.turn;
    updateTurnDisplay();
    document.getElementById('game-status').textContent = '¡Juego iniciado!';
    document.getElementById('opponent-status').style.display = 'none';
    document.getElementById('ships-panel').style.display = 'none';
});

socket.on('turn-change', (data) => {
    gameState.currentTurn = data.turn;
    updateTurnDisplay();
});

socket.on('attack-result', (data) => {
    const { attacker, row, col, result } = data;
    
    if (attacker === gameState.myTeam) {
        // Mi ataque
        gameState.stats.shots++;
        if (result === 'hit') {
            gameState.stats.hits++;
        }
        updateStats();
        
        const enemyCell = document.querySelector(`#enemy-grid .grid-cell[data-row="${row}"][data-col="${col}"]`);
        enemyCell.classList.add(result);
        createEffect(enemyCell, result === 'hit' ? 'explosion' : 'splash');
    } else {
        // Ataque enemigo a mi tablero
        const myCell = document.querySelector(`#my-grid .grid-cell[data-row="${row}"][data-col="${col}"]`);
        myCell.classList.add(result);
        createEffect(myCell, result === 'hit' ? 'explosion' : 'splash');
    }
});

socket.on('game-over', (data) => {
    const modal = document.getElementById('game-over-modal');
    const icon = document.getElementById('result-icon');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    
    if (data.winner === gameState.myTeam) {
        icon.textContent = '🏆';
        title.textContent = '¡VICTORIA!';
        title.style.color = '#4CAF50';
        message.textContent = '¡Has hundido toda la flota enemiga!';
    } else {
        icon.textContent = '💔';
        title.textContent = 'DERROTA';
        title.style.color = '#F44336';
        message.textContent = 'Tu flota ha sido hundida...';
    }
    
    modal.style.display = 'flex';
});

socket.on('player-disconnected', (data) => {
    alert(`El jugador del equipo ${data.team} se ha desconectado`);
    location.reload();
});

socket.on('game-reset', () => {
    location.reload();
});

socket.on('not-your-turn', () => {
    alert('¡No es tu turno!');
});

socket.on('already-attacked', () => {
    alert('Ya atacaste esta casilla');
});

// SELECCIÓN DE EQUIPO

document.getElementById('select-blue').addEventListener('click', function() {
    if (!this.classList.contains('occupied')) {
        socket.emit('select-team', 'blue');
    }
});

document.getElementById('select-red').addEventListener('click', function() {
    if (!this.classList.contains('occupied')) {
        socket.emit('select-team', 'red');
    }
});

// INICIALIZAR JUEGO

function initGame() {
    document.getElementById('team-selection').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    // Configurar colores según equipo
    applyTeamColors();
    
    // Mostrar equipo
    const teamDisplay = document.getElementById('your-team-display');
    teamDisplay.textContent = `Equipo ${gameState.myTeam === 'blue' ? 'Azul' : 'Rojo'}`;
    teamDisplay.classList.add(gameState.myTeam);
    
    // Inicializar burbujas
    initBubbles();
    
    // Crear grids
    createGrid('my-grid', false);
    createGrid('enemy-grid', true);
    
    // Crear panel de barcos
    createShipsPanel();
}

function applyTeamColors() {
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const leftBoardWrapper = document.getElementById('left-board-wrapper');
    const rightBoardWrapper = document.getElementById('right-board-wrapper');
    
    leftPanel.classList.add(gameState.myTeam);
    leftBoardWrapper.classList.add(gameState.myTeam);
    
    const enemyTeam = gameState.myTeam === 'blue' ? 'red' : 'blue';
    rightPanel.classList.add(enemyTeam);
    rightBoardWrapper.classList.add(enemyTeam);
    
    // Colores de iconos
    const leftColor = gameState.myTeam === 'blue' ? '#2196F3' : '#F44336';
    const rightColor = enemyTeam === 'blue' ? '#2196F3' : '#F44336';
    
    document.getElementById('left-ship-color').setAttribute('fill', leftColor);
    document.getElementById('left-triangle-color').setAttribute('fill', leftColor);
    document.getElementById('left-circle-color').setAttribute('fill', leftColor);
    
    document.getElementById('right-target-stroke').setAttribute('stroke', rightColor);
    document.getElementById('right-inner-stroke').setAttribute('stroke', rightColor);
    document.getElementById('right-center-fill').setAttribute('fill', rightColor);
}

// CREAR GRIDS

function createGrid(containerId, isEnemyGrid) {
    const container = document.getElementById(containerId);
    
    const corner = document.createElement('div');
    corner.className = 'grid-cell header';
    container.appendChild(corner);
    
    for (let i = 1; i <= 10; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell header';
        cell.textContent = i;
        container.appendChild(cell);
    }
    
    for (let row = 0; row < 10; row++) {
        const letterCell = document.createElement('div');
        letterCell.className = 'grid-cell header';
        letterCell.textContent = letters[row];
        container.appendChild(letterCell);
        
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell water';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (isEnemyGrid) {
                cell.addEventListener('click', () => handleAttack(row, col, cell));
            } else {
                cell.addEventListener('dragover', (e) => e.preventDefault());
                cell.addEventListener('drop', () => handleDrop(row, col));
            }
            
            container.appendChild(cell);
        }
    }
}

// CREAR PANEL DE BARCOS

function createShipsPanel() {
    const container = document.getElementById('ships-container');
    
    ships.forEach(ship => {
        const shipItem = document.createElement('div');
        shipItem.className = 'ship-item';
        shipItem.draggable = true;
        shipItem.dataset.shipId = ship.id;
        
        shipItem.addEventListener('dragstart', () => {
            gameState.draggedShip = ship;
        });
        
        shipItem.addEventListener('dragend', () => {
            gameState.draggedShip = null;
        });
        
        const header = document.createElement('div');
        header.className = 'ship-header';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'ship-name';
        nameDiv.innerHTML = `
            <svg class="ship-icon-small" viewBox="0 0 100 100">
                ${ship.segments[0]}
            </svg>
            ${ship.name}
        `;
        
        const rotateBtn = document.createElement('button');
        rotateBtn.className = 'btn-rotate';
        rotateBtn.textContent = '🔄';
        rotateBtn.onclick = () => rotateShip(ship.id);
        
        header.appendChild(nameDiv);
        header.appendChild(rotateBtn);
        
        const visual = document.createElement('div');
        visual.className = `ship-visual ${ship.orientation === 'v' ? 'vertical' : ''}`;
        visual.id = `ship-visual-${ship.id}`;
        
        ship.segments.forEach((svg) => {
            const segment = document.createElement('div');
            segment.className = 'ship-segment';
            segment.innerHTML = svg;
            visual.appendChild(segment);
        });
        
        shipItem.appendChild(header);
        shipItem.appendChild(visual);
        container.appendChild(shipItem);
    });
}

function rotateShip(shipId) {
    const ship = ships.find(s => s.id === shipId);
    ship.orientation = ship.orientation === 'h' ? 'v' : 'h';
    
    const visual = document.getElementById(`ship-visual-${shipId}`);
    if (ship.orientation === 'v') {
        visual.classList.add('vertical');
    } else {
        visual.classList.remove('vertical');
    }
}

function handleDrop(row, col) {
    if (!gameState.draggedShip) return;
    
    const ship = gameState.draggedShip;
    if (canPlaceShip(row, col, ship)) {
        placeShip(row, col, ship);
        checkAllShipsPlaced();
    }
}

function canPlaceShip(row, col, ship) {
    const { size, orientation } = ship;
    
    if (orientation === 'h' && col + size > 10) return false;
    if (orientation === 'v' && row + size > 10) return false;
    
    for (let i = 0; i < size; i++) {
        const r = orientation === 'h' ? row : row + i;
        const c = orientation === 'h' ? col + i : col;
        
        if (gameState.myBoard[r][c] && gameState.myBoard[r][c].shipId !== ship.id) {
            return false;
        }
    }
    
    return true;
}

function placeShip(row, col, ship) {
    const { id, size, orientation, segments } = ship;
    
    // Limpiar posición anterior
    if (gameState.placedShips[id]) {
        const old = gameState.placedShips[id];
        old.positions.forEach(pos => {
            gameState.myBoard[pos.row][pos.col] = null;
            const cell = document.querySelector(`#my-grid .grid-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
            cell.classList.remove('ship');
            cell.innerHTML = '';
        });
    }
    
    // Colocar en nueva posición
    const positions = [];
    for (let i = 0; i < size; i++) {
        const r = orientation === 'h' ? row : row + i;
        const c = orientation === 'h' ? col + i : col;
        
        positions.push({ row: r, col: c, segmentIndex: i });
        gameState.myBoard[r][c] = { shipId: id, segmentIndex: i };
        
        const cell = document.querySelector(`#my-grid .grid-cell[data-row="${r}"][data-col="${c}"]`);
        cell.classList.add('ship');
        cell.innerHTML = `<svg class="cell-icon" viewBox="0 0 100 100" style="transform: rotate(${orientation === 'v' ? '90deg' : '0deg'})">${segments[i]}</svg>`;
    }
    
    gameState.placedShips[id] = { row, col, size, orientation, positions };
    
    // Marcar barco como colocado
    const shipItem = document.querySelector(`.ship-item[data-ship-id="${id}"]`);
    shipItem.classList.add('placed');
    
    // Enviar al servidor
    socket.emit('place-ship', {
        team: gameState.myTeam,
        shipId: id,
        positions
    });
}

function checkAllShipsPlaced() {
    const allPlaced = ships.every(ship => gameState.placedShips[ship.id]);
    if (allPlaced) {
        document.getElementById('ready-btn').disabled = false;
    }
}

document.getElementById('ready-btn').addEventListener('click', () => {
    gameState.isReady = true;
    document.getElementById('ready-btn').disabled = true;
    document.getElementById('ready-btn').textContent = '✓ Listo - Esperando...';
    socket.emit('player-ready', gameState.myTeam);
    
    document.getElementById('opponent-status').innerHTML = `
        <div class="status-box">
            <div class="status-icon">⏳</div>
            <div class="status-text">Esperando al oponente...</div>
        </div>
    `;
});

// ATAQUE

function handleAttack(row, col, cell) {
    if (!gameState.gameStarted) {
        alert('¡El juego aún no ha comenzado!');
        return;
    }
    
    if (gameState.currentTurn !== gameState.myTeam) {
        alert('¡No es tu turno!');
        return;
    }
    
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
        return;
    }
    
    socket.emit('attack', {
        team: gameState.myTeam,
        row,
        col
    });
}

// ACTUALIZAR UI

function updateTurnDisplay() {
    const turnText = document.getElementById('current-turn');
    const turnIndicator = document.getElementById('turn-indicator');
    const gameStatus = document.getElementById('game-status');
    
    if (gameState.currentTurn === gameState.myTeam) {
        turnText.textContent = '¡TU TURNO!';
        turnIndicator.classList.add('your-turn');
        gameStatus.textContent = '¡Es tu turno! Ataca al enemigo';
        gameStatus.style.color = '#4CAF50';
    } else {
        turnText.textContent = 'Turno del rival';
        turnIndicator.classList.remove('your-turn');
        gameStatus.textContent = 'Esperando ataque del rival...';
        gameStatus.style.color = '#FF9800';
    }
}

function updateStats() {
    document.getElementById('shots-count').textContent = gameState.stats.shots;
    document.getElementById('hits-count').textContent = gameState.stats.hits;
    const accuracy = gameState.stats.shots > 0 
        ? Math.round((gameState.stats.hits / gameState.stats.shots) * 100) 
        : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// EFECTOS VISUALES

function initBubbles() {
    const canvas = document.getElementById('bubbles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles = [];

    for (let i = 0; i < 25; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 15 + 8,
            speed: Math.random() * 0.8 + 0.4,
            opacity: Math.random() * 0.25 + 0.1
        });
    }

    function animateBubbles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            if (bubble.y + bubble.radius < 0) {
                bubble.y = canvas.height + bubble.radius;
                bubble.x = Math.random() * canvas.width;
            }

            const gradient = ctx.createRadialGradient(
                bubble.x - bubble.radius * 0.3,
                bubble.y - bubble.radius * 0.3,
                0,
                bubble.x,
                bubble.y,
                bubble.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 0.7})`);
            gradient.addColorStop(0.5, `rgba(179, 229, 252, ${bubble.opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(129, 212, 250, ${bubble.opacity * 0.15})`);

            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        });

        requestAnimationFrame(animateBubbles);
    }

    animateBubbles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function createEffect(cell, type) {
    const rect = cell.getBoundingClientRect();
    const container = document.getElementById('effects-container');
    
    const effect = document.createElement('div');
    effect.className = 'explosion-effect';
    effect.style.left = rect.left + rect.width / 2 + 'px';
    effect.style.top = rect.top + rect.height / 2 + 'px';
    effect.style.transform = 'translate(-50%, -50%)';
    
    if (type === 'explosion') {
        effect.innerHTML = `
            <svg class="explosion-core" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#F44336" opacity="0.8"/>
                <polygon points="50,10 60,40 90,50 60,60 50,90 40,60 10,50 40,40" fill="#FFD700"/>
                <circle cx="50" cy="50" r="20" fill="#FF8C42" opacity="0.9"/>
            </svg>
        `;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const distance = 50;
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.background = i % 2 === 0 ? '#F44336' : '#FFD700';
            particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            effect.appendChild(particle);
        }
    } else {
        effect.innerHTML = `
            <svg class="splash-effect" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="#2196F3" opacity="0.6"/>
                <circle cx="50" cy="50" r="18" fill="#BBDEFB" opacity="0.8"/>
            </svg>
        `;
        
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const distance = 35;
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.background = '#2196F3';
            particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            effect.appendChild(particle);
        }
    }
    
    container.appendChild(effect);
    
    setTimeout(() => effect.remove(), 800);
}

// JUGAR DE NUEVO

document.getElementById('play-again-btn').addEventListener('click', () => {
    socket.emit('reset-game');
});
