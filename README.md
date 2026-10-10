# 🌍 TerraPulse - Plataforma Interactiva de Cambio Climático & EcoBot IA

Una plataforma web interactiva, moderna y con estética **dark cyber-eco** diseñada para concientizar, medir el impacto ecológico y guiar acciones sustentables con el poder de un asistente virtual inteligente (**EcoBot**).

---

## ✨ Características Principales

1. **🎨 Estética Futurista & Neón ("Colores Chidos"):**
   - Paleta inspirada en *Cyber-Eco*: Esmeralda neón (`#00ff9d`), Cian espacial (`#06b6d4`), fondo dark obsidiana (`#070c14`) y detalles en ámbar y carmesí de alerta.
   - Efectos de *glassmorphism*, bordes reactivos con resplandor neón (*glow*), badges flotantes y transiciones fluidas.
   - Tipografía moderna: **Outfit** (titulares de impacto) y **Plus Jakarta Sans** (cuerpo de lectura).

2. **🤖 EcoBot - Asistente Climático Inteligente:**
   - **Doble interfaz:** Vitrina principal interactiva y widget flotante expandible en la esquina inferior derecha.
   - **Base de conocimiento ambiental:** Responde preguntas sobre el efecto invernadero, acuerdos internacionales (+1.5°C de París), reciclaje, energías renovables, datos de México/Latinoamérica y hábitos diarios.
   - **Efectos de sonido sintetizados:** Usa la *Web Audio API* nativa para generar tonos futuristas y chimes de confirmación (con botón para silenciar o activar).
   - Indicador de escritura animado (*typing dots*) y botones de acceso rápido (*quick chips*).

3. **📊 Calculadora de Huella de Carbono en Tiempo Real:**
   - Sliders interactivos para transporte semanal en auto, vuelos anuales y nivel de consumo eléctrico.
   - Selector visual de hábitos de alimentación (Carnívora, Flexitariana, Vegetariana, Vegana).
   - **Medidor circular SVG dinámico:** Ajusta su porcentaje y transiciona de color en vivo (Verde Sostenible ➔ Cian ➔ Ámbar ➔ Rojo Crítico).
   - Generación de consejos personalizados y botón para pedirle a **EcoBot** una estrategia específica adaptada a tu resultado.

4. **⚡ Contador de Emergencia Planetaria en Vivo (Live Ticker):**
   - Simulación en tiempo real de hectáreas de bosque deforestadas y toneladas de hielo ártico derretidas cada segundo.
   - Métricas oficiales de CO₂ atmosférico (424+ ppm) y aumento térmico global (+1.28°C).

5. **🕹️ Eco-Arcade - Módulos de Juegos Educativos:**
   - **Juego 1: "Atrapa el CO₂" (Canvas Arcade):** Pilota un *Eco-Dron* con el ratón, dedo o flechas. Atrapa energía solar (☀️), semillas (🌱) y absorbe nubes de CO₂ (💨) antes de que toquen tierra, esquivando barriles de petróleo (🛢️) que aumentan la temperatura global hacia el límite de colapso (+2.5°C). ¡Llega a 500 puntos para lograr *Cero Emisiones Netas*!
   - **Juego 2: "Clasificación Rápida" (Blitz 30s):** Reto contrarreloj de 30 segundos para separar residuos orgánicos (🍏), reciclables (♻️) y especiales/no reciclables (⚠️) usando clics o las teclas numéricas `1`, `2` y `3`. Incluye multiplicador de racha (*Combos x1 a x5*).
   - **Juego 3: "Trivia Relámpago":** Preguntas rápidas de ciencia climática con retroalimentación instantánea, explicaciones didácticas y cómputo de aciertos.

6. **🛡️ Mitos vs Realidad Científica:**
   - Tarjetas interactivas tipo acordeón que desmienten las falacias más comunes sobre el calentamiento global con argumentos del IPCC y la NASA.

7. **🏆 Plan de Acción & Tracker de Eco-Score:**
   - Lista de compromisos prácticos que calcula en tiempo real tu nivel de impacto verde, desde *Semilla Verde* hasta *¡Héroe Ecológico!* con notificaciones toast y sonido de logro.

---

## 🚀 Cómo Abrir el Proyecto

Puedes abrir directamente el archivo `index.html` en cualquier navegador:
1. Haz doble clic en `index.html`.
2. O bien, si deseas verlo con un servidor local, ejecuta en tu terminal:
   ```bash
   python -m http.server 8080
   ```
   Y entra en tu navegador a: [http://localhost:8080](http://localhost:8080)

---

## 📁 Estructura del Proyecto

```
Proyecto Python/
├── index.html            # Estructura semántica, accesibilidad y componentes
├── styles.css            # Sistema de diseño, glassmorphism, temas y animaciones
├── app.js                # Lógica de EcoBot, calculadora CO2, audio synth y tracker
├── assets/
│   └── hero-banner.jpg   # Arte conceptual de alta resolución del planeta Tierra
└── README.md             # Documentación del proyecto
```
