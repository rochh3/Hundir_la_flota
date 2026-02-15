const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000; // ← IMPORTANTE: Usar variable de entorno

// Servir archivos estáticos
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Estado del juego
const gameState = {
    players: {
        blue: null,
        red: null
    },
    boards: {
        blue: Array(10).fill(null).map(() => Array(10).fill(null)),
        red: Array(10).fill(null).map(() => Array(10).fill(null))
    },
    attacks: {
        blue: Array(10).fill(null).map(() => Array(10).fill(0)),
        red: Array(10).fill(null).map(() => Array(10).fill(0))
    },
    shipsPlaced: {
        blue: {},
        red: {}
    },
    ready: {
        blue: false,
        red: false
    },
    turn: 'blue',
    gameStarted: false
};

// Gestión de conexiones
io.on('connection', (socket) => {
    console.log(`🔌 Nueva conexión: ${socket.id}`);

    // Enviar estado actual de equipos ocupados
    socket.emit('teams-status', {
        blue: gameState.players.blue !== null,
        red: gameState.players.red !== null
    });

    // Seleccionar equipo
    socket.on('select-team', (team) => {
        if (team !== 'blue' && team !== 'red') return;
        
        if (gameState.players[team] === null) {
            gameState.players[team] = socket.id;
            socket.team = team;
            
            socket.emit('team-selected', { 
                team, 
                success: true 
            });
            
            io.emit('teams-status', {
                blue: gameState.players.blue !== null,
                red: gameState.players.red !== null
            });
            
            console.log(`👤 Jugador ${socket.id} seleccionó equipo ${team}`);
        } else {
            socket.emit('team-selected', { 
                team, 
                success: false, 
                error: 'Equipo ya ocupado' 
            });
        }
    });

    // Colocar barco
    socket.on('place-ship', (data) => {
        const { team, shipId, positions } = data;
        
        if (socket.team !== team) return;
        
        gameState.shipsPlaced[team][shipId] = positions;
        
        positions.forEach(pos => {
            gameState.boards[team][pos.row][pos.col] = { shipId, ...pos };
        });
        
        console.log(`🚢 Barco ${shipId} colocado por equipo ${team}`);
    });

    // Marcar como listo
    socket.on('player-ready', (team) => {
        if (socket.team !== team) return;
        
        gameState.ready[team] = true;
        
        console.log(`✅ Equipo ${team} está listo`);
        
        if (gameState.ready.blue && gameState.ready.red) {
            gameState.gameStarted = true;
            gameState.turn = 'blue';
            
            io.emit('game-start', { 
                turn: gameState.turn 
            });
            
            console.log('🎮 ¡JUEGO INICIADO!');
        } else {
            io.emit('ready-status', {
                blue: gameState.ready.blue,
                red: gameState.ready.red
            });
        }
    });

    // Realizar ataque
    socket.on('attack', (data) => {
        const { team, row, col } = data;
        
        if (socket.team !== team) return;
        if (!gameState.gameStarted) return;
        if (gameState.turn !== team) {
            socket.emit('not-your-turn');
            return;
        }
        
        const enemyTeam = team === 'blue' ? 'red' : 'blue';
        
        if (gameState.attacks[team][row][col] !== 0) {
            socket.emit('already-attacked', { row, col });
            return;
        }
        
        const hasShip = gameState.boards[enemyTeam][row][col] !== null;
        const result = hasShip ? 'hit' : 'miss';
        
        gameState.attacks[team][row][col] = hasShip ? 2 : 1;
        
        io.emit('attack-result', {
            attacker: team,
            defender: enemyTeam,
            row,
            col,
            result,
            shipInfo: hasShip ? gameState.boards[enemyTeam][row][col] : null
        });
        
        console.log(`💥 ${team} ataca [${row},${col}] → ${result}`);
        
        const enemyShipCells = gameState.boards[enemyTeam].flat().filter(cell => cell !== null).length;
        const hitCells = gameState.attacks[team].flat().filter(cell => cell === 2).length;
        
        if (hitCells === enemyShipCells && enemyShipCells > 0) {
            io.emit('game-over', { 
                winner: team,
                loser: enemyTeam
            });
            console.log(`🏆 ¡${team.toUpperCase()} GANA!`);
        } else {
            gameState.turn = enemyTeam;
            io.emit('turn-change', { turn: gameState.turn });
        }
    });

    // Reiniciar juego
    socket.on('reset-game', () => {
        gameState.boards = {
            blue: Array(10).fill(null).map(() => Array(10).fill(null)),
            red: Array(10).fill(null).map(() => Array(10).fill(null))
        };
        gameState.attacks = {
            blue: Array(10).fill(null).map(() => Array(10).fill(0)),
            red: Array(10).fill(null).map(() => Array(10).fill(0))
        };
        gameState.shipsPlaced = {
            blue: {},
            red: {}
        };
        gameState.ready = {
            blue: false,
            red: false
        };
        gameState.turn = 'blue';
        gameState.gameStarted = false;
        
        io.emit('game-reset');
        console.log('🔄 Juego reiniciado');
    });

    // Desconexión
    socket.on('disconnect', () => {
        console.log(`❌ Desconexión: ${socket.id}`);
        
        if (socket.team) {
            gameState.players[socket.team] = null;
            gameState.ready[socket.team] = false;
            
            io.emit('teams-status', {
                blue: gameState.players.blue !== null,
                red: gameState.players.red !== null
            });
            
            io.emit('player-disconnected', { team: socket.team });
            
            console.log(`👋 Equipo ${socket.team} liberado`);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ⚓  BATALLA NAVAL MULTIPLAYER - SERVIDOR  ⚓          ║
║                                                           ║
║   🌊  Servidor corriendo en puerto ${PORT}              ║
║                                                           ║
║   👥  Esperando jugadores...                             ║
║   🎮  Modo: PvP en Tiempo Real                           ║
║   🔌  WebSockets: Activo                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
