# ⚓ Batalla Naval Multiplayer

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Hosted_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io">
</p>

---

### 🚀 ¡Juega ahora mismo!
Puedes probar la aplicación en vivo haciendo clic en el siguiente enlace:
> [**https://hundir-la-flota.onrender.com**](https://hundir-la-flota.onrender.com/)

*Nota: Debido al plan gratuito de Render, la aplicación puede tardar unos 30 segundos en cargar si no ha tenido actividad reciente.*

---

## 🎮 Descripción del Juego
Una experiencia clásica de **Batalla Naval** reinventada para la web moderna. Enfrenta a tus amigos en tiempo real con una interfaz fluida, efectos visuales dinámicos y un sistema de turnos totalmente automatizado.

### ✨ Características Premium
* **Multijugador Real-Time:** 2 jugadores simultáneos vía WebSockets.
* **Interfaz Profesional:** Tableros "Lado a Lado" con selección de equipo (Azul vs Rojo).
* **Feedback Visual:** Animaciones de explosiones, salpicaduras y efectos de burbujas.
* **Estadísticas en Vivo:** Seguimiento de disparos, impactos y precisión en tiempo real.
* **Responsive Design:** Optimizado para móviles, tablets y PC.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Backend** | Node.js + Express |
| **Comunicación** | Socket.io (WebSockets) |
| **Frontend** | HTML5 / CSS3 / JavaScript Vanilla |
| **Despliegue** | Render (Web Service) |

---

## 📖 Instrucciones de Juego

### 1. Preparación
- **Selección:** Elige tu bando (**Azul** o **Rojo**).
- **Posicionamiento:** Arrastra tus 4 barcos al tablero izquierdo. Usa el botón **🔄** para rotarlos.
- **Confirmación:** Una vez colocados, pulsa **"✓ Estoy Listo"**.

### 2. Combate
- Ataca el tablero enemigo (derecha) en tu turno.
- **Rojo (💥):** ¡Impacto directo!
- **Azul (💧):** Agua (fallo).
- Gana quien logre hundir la flota completa del rival primero.

---

## 💻 Instalación Local

```bash
# 1. Clonar el repositorio y entrar a la carpeta
cd batalla-naval-multiplayer

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```

---

<p align="center">
  Desarrollado con ❤️ para estrategas navales. <br>
  <b>¡Que gane el mejor capitán!</b> 🏆
</p>