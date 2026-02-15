# 🚢 BATALLA NAVAL MULTIPLAYER 🌊

## ⚡ JUEGO MULTIJUGADOR EN TIEMPO REAL ⚡

### 🎮 CARACTERÍSTICAS PREMIUM:

✅ **Multijugador Real-Time** - 2 jugadores simultáneos vía WebSockets
✅ **Selección de Equipos** - Azul vs Rojo
✅ **Tableros Lado a Lado** - Interfaz profesional
✅ **Sincronización Automática** - Ver ataques en tiempo real
✅ **Sistema de Turnos** - Gestión automática de turnos
✅ **Efectos Visuales Espectaculares** - Explosiones y salpicaduras
✅ **Estadísticas en Vivo** - Disparos, impactos, precisión
✅ **Responsive Design** - Funciona en todas las pantallas

---

## 🚀 INSTALACIÓN Y USO:

### 1️⃣ Instalar Dependencias:

```bash
cd batalla-naval-multiplayer
npm install
```

### 2️⃣ Iniciar Servidor:

```bash
npm start
```

Verás este mensaje:
```
╔═══════════════════════════════════════════════════════════╗
║     ⚓  BATALLA NAVAL MULTIPLAYER - SERVIDOR  ⚓          ║
║   🌊  Servidor corriendo en http://localhost:3000  🌊    ║
║   👥  Esperando jugadores...                             ║
╚═══════════════════════════════════════════════════════════╝
```

### 3️⃣ Conectar Jugadores:

**Jugador 1:**
- Abre: `http://localhost:3000`
- Selecciona equipo AZUL o ROJO

**Jugador 2:**
- Abre en OTRA PESTAÑA o DISPOSITIVO: `http://localhost:3000`
- Selecciona el equipo contrario

---

## 🎯 CÓMO JUGAR:

### FASE 1: Selección de Equipo

1. Al entrar, verás 2 opciones:
   - **Equipo Azul** (izquierda)
   - **Equipo Rojo** (derecha)

2. Click en tu equipo preferido
3. El otro equipo se marcará como "Ocupado"
4. Espera a que llegue el segundo jugador

### FASE 2: Colocación de Barcos

**Tu Tablero (Izquierda):**
- Color de TU equipo (azul o rojo)
- Arrastra los 4 barcos desde el panel inferior
- Click en 🔄 para rotar cada barco
- Coloca todos los barcos

**Barcos disponibles:**
- 🚢 Portaviones (4 casillas)
- ⚓ Acorazado (3 casillas)
- 🛥️ Crucero (2 casillas)
- 🔱 Submarino (1 casilla)

**Cuando termines:**
- Click en "✓ Estoy Listo"
- Espera a que el rival termine

### FASE 3: ¡Batalla!

**Tablero Enemigo (Derecha):**
- Color del equipo contrario
- Click en una casilla para atacar
- Solo puedes atacar EN TU TURNO

**Resultados:**
- 💥 **Rojo** = ¡Tocaste un barco!
- 💧 **Azul** = Agua (fallaste)

**En TU Tablero:**
- Verás automáticamente los ataques del rival
- 💥 **Rojo** = Te tocaron
- 💧 **Azul** = El rival falló

**Sistema de Turnos:**
- El Equipo Azul empieza
- Después de cada ataque, cambia el turno
- Indicador muestra: "¡TU TURNO!" o "Turno del rival"

### FASE 4: Victoria

🏆 **Ganas** cuando hundes todos los barcos enemigos
💔 **Pierdes** si hunden todos tus barcos

Al terminar:
- Aparece modal con resultado
- Click en "Jugar de Nuevo" para reiniciar

---

## 🎨 CARACTERÍSTICAS TÉCNICAS:

### Backend (Node.js + Socket.IO):

- **Express** - Servidor web
- **Socket.IO** - WebSockets para tiempo real
- **Estado global** - Gestión de partidas
- **Validación** - Verificación de movimientos
- **Turnos automáticos** - Sistema de turnos

### Frontend:

- **HTML5** - Estructura semántica
- **CSS3** - Animaciones y gradientes
- **JavaScript Vanilla** - Lógica del juego
- **Socket.IO Client** - Comunicación en tiempo real
- **Canvas API** - Burbujas animadas

### Sistema de Colores:

**Equipo Azul:**
- Primary: `#2196F3`
- Dark: `#1976D2`
- Light: `#BBDEFB`

**Equipo Rojo:**
- Primary: `#F44336`
- Dark: `#D32F2F`
- Light: `#FFCDD2`

---

## 🔥 EVENTOS WEBSOCKET:

### Cliente → Servidor:

- `select-team` - Seleccionar equipo
- `place-ship` - Colocar barco
- `player-ready` - Jugador listo
- `attack` - Realizar ataque
- `reset-game` - Reiniciar juego

### Servidor → Cliente:

- `teams-status` - Estado de equipos (ocupado/libre)
- `team-selected` - Confirmación de selección
- `game-start` - Inicio de partida
- `turn-change` - Cambio de turno
- `attack-result` - Resultado de ataque
- `game-over` - Fin de partida
- `player-disconnected` - Jugador desconectado

---

## 📊 ESTADÍSTICAS:

El juego rastrea en tiempo real:
- **Disparos** - Total de ataques
- **Impactos** - Barcos tocados
- **Precisión** - % de efectividad

---

## 🎯 REGLAS DEL JUEGO:

1. ✅ Cada jugador coloca 4 barcos
2. ✅ Los barcos NO pueden superponerse
3. ✅ Deben estar dentro del tablero
4. ✅ El Equipo Azul siempre empieza
5. ✅ Solo puedes atacar en TU turno
6. ✅ No puedes atacar la misma casilla 2 veces
7. ✅ Gana quien hunde toda la flota enemiga

---

## 🛠️ ESTRUCTURA DE ARCHIVOS:

```
batalla-naval-multiplayer/
├── server.js              # Servidor Node.js + Socket.IO
├── package.json           # Dependencias
├── README.md             # Este archivo
└── public/
    ├── index.html        # Cliente HTML
    ├── styles.css        # Estilos CSS
    └── game.js           # Lógica JavaScript
```

---

## 🌐 JUGAR EN RED LOCAL:

### Misma Red WiFi:

1. Obtén tu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Busca algo como: `192.168.1.X`

3. Jugador 1 inicia el servidor:
   ```bash
   npm start
   ```

4. Jugador 2 abre en su navegador:
   ```
   http://192.168.1.X:3000
   ```
   (Reemplaza X con tu IP)

---

## 🎮 CONTROLES:

### Mouse:
- **Click** - Seleccionar equipo / Atacar casilla
- **Arrastrar** - Colocar barcos
- **Hover** - Ver efectos visuales

### Botones:
- **🔄 Rotar** - Cambiar orientación del barco
- **✓ Estoy Listo** - Confirmar barcos colocados
- **Jugar de Nuevo** - Reiniciar partida

---

## 💡 TIPS:

1. 🎯 **Estrategia**: Dispersa tus barcos
2. 🧠 **Lógica**: Si tocas un barco, ataca alrededor
3. ⚡ **Velocidad**: Ataca rápido en tu turno
4. 📊 **Estadísticas**: Revisa tu precisión
5. 🎨 **Visual**: Observa los colores (rojo=tocado, azul=agua)

---

## 🐛 TROUBLESHOOTING:

### El servidor no inicia:
```bash
# Verificar puerto 3000
lsof -i :3000

# Cambiar puerto en server.js
const PORT = 4000; // Usar otro puerto
```

### No se conectan los jugadores:
- Verifica que ambos usen la misma URL
- Revisa el firewall
- Asegúrate de estar en la misma red

### Los ataques no funcionan:
- Verifica que sea tu turno
- Refresca la página (F5)
- Revisa la consola del navegador (F12)

---

## 🎉 ¡LISTO PARA JUGAR!

**Desarrollado con:**
- ❤️ Pasión por los juegos
- ⚡ Tecnologías modernas
- 🎨 Diseño profesional

**¡Que gane el mejor estratega! 🏆**

---

## 📝 NOTAS:

- Requiere Node.js 14+
- Compatible con Chrome, Firefox, Safari, Edge
- Responsive: funciona en móvil y desktop
- Sin base de datos: todo en memoria
- Partidas no persistentes (se borran al cerrar servidor)

---

**Made with 🌊 and ⚓**
