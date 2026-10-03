/**
 * TerraPulse - Interactive Climate Platform & EcoBot Engine
 */

// ==========================================
// 1. Audio Effects (Web Audio API Synthesizer)
// ==========================================
let audioEnabled = true;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type = 'pop') {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'send') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'receive') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08);   // A5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'powerup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    console.debug('Audio not supported or interaction required', e);
  }
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const icon = document.getElementById('soundIcon');
  if (icon) {
    icon.className = audioEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  }
  showToast(audioEnabled ? 'Sonidos activados 🔔' : 'Sonidos silenciados 🔕', 'info');
}

// ==========================================
// 2. EcoBot Knowledge Base & Logic
// ==========================================
const ECOBOT_KB = [
  {
    keywords: ['que es', 'cambio climatico', 'definicion', 'concepto', 'que significa'],
    answer: "El **cambio climático** se refiere a las variaciones a largo plazo de las temperaturas y los patrones climáticos de la Tierra. Aunque históricamente han existido ciclos naturales, desde el siglo XIX **las actividades humanas han sido el principal motor**, debido principalmente a la quema de combustibles fósiles (carbón, petróleo y gas) que liberan gases de efecto invernadero."
  },
  {
    keywords: ['calentamiento global', 'diferencia'],
    answer: "¡Buena pregunta! A menudo se usan como sinónimos, pero no son lo mismo: <ul><li><strong>Calentamiento Global:</strong> Es el aumento continuo de la temperatura promedio del planeta debido al efecto invernadero artificial.</li><li><strong>Cambio Climático:</strong> Incluye tanto el calentamiento global como todas sus consecuencias colaterales: huracanes más intensos, sequías, derretimiento polar, incendios forestales y cambios en las corrientes oceánicas.</li></ul>"
  },
  {
    keywords: ['acciones', 'que puedo hacer', 'como ayudar', 'reducir', 'tips', 'consejos', 'faciles', 'hoy'],
    answer: "Aquí tienes <strong>5 acciones inmediatas de alto impacto</strong> que puedes hacer hoy: <ol><li><strong>Reduce el consumo de carne roja:</strong> Producir 1 kg de res emite hasta 60 kg de CO₂. Con un 'Lunes sin carne' ahorras miles de litros de agua.</li><li><strong>Prioriza movilidad activa:</strong> Camina, usa bicicleta o transporte público siempre que sea posible.</li><li><strong>Elimina vampiros eléctricos:</strong> Desconecta cargadores y electrodomésticos en modo espera; ahorras hasta un 10% en tu recibo.</li><li><strong>Evita el plástico de un solo uso:</strong> Lleva termo y bolsa de tela.</li><li><strong>Exige acción política y corporativa:</strong> Vota por líderes con agenda climática real y apoya empresas sustentables.</li></ol>"
  },
  {
    keywords: ['1.5', 'grados', 'paris', 'acuerdo', 'limite', 'porque importa'],
    answer: "El límite de **+1.5°C** fijado en el Acuerdo de París es una frontera biofísica crucial: <ul><li>Con +1.5°C, perdemos cerca del 70% de los corales del mundo. Con +2.0°C, <strong>desaparece más del 99%</strong>.</li><li>El riesgo de colapso de las capas de hielo de Groenlandia y la Antártida se dispara después de 1.5°C, elevando el mar metros en los próximos siglos.</li><li>Actualmente ya alcanzamos aproximadamente +1.28°C. Cada décima de grado prevenida salva vidas y ecosistemas.</li></ul>"
  },
  {
    keywords: ['paises', 'contaminan', 'emisiones', 'quien contamina', 'china', 'estados unidos'],
    answer: "En volumen anual total, los principales emisores son: <ol><li><strong>China:</strong> ~30% de las emisiones globales (fábrica del mundo, aunque lidera en producción solar).</li><li><strong>Estados Unidos:</strong> ~13% (históricamente es el país con mayor acumulación de CO₂).</li><li><strong>Unión Europea e India:</strong> ~7% cada uno.</li></ol> Sin embargo, en <em>emisiones por persona (per cápita)</em>, países como EE.UU., Australia y Canadá emiten más del triple que una persona promedio en Latinoamérica."
  },
  {
    keywords: ['reciclaje', 'reciclar', 'plastico', 'sirve', 'mito'],
    answer: "El reciclaje <strong>sí ayuda, pero no es la solución mágica</strong>: <ul><li>A nivel mundial, solo el <strong>9% del plástico</strong> se recicla eficazmente debido a la complejidad de los polímeros y costos.</li><li>La jerarquía más efectiva siempre es: <strong>1° Reducir</strong>, <strong>2° Reutilizar</strong>, y solo al final <strong>3° Reciclar</strong>.</li><li>Materiales como el aluminio y el vidrio sí se reciclan infinitamente con gran ahorro energético.</li></ul>"
  },
  {
    keywords: ['solar', 'eolica', 'energia limpia', 'renovable', 'paneles'],
    answer: "Las <strong>energías renovables</strong> son la herramienta número 1 contra la crisis: <ul><li>El costo de los paneles solares se redujo un 88% entre 2010 y 2024.</li><li>Hoy la energía solar es la fuente de electricidad más barata en la mayor parte del planeta.</li><li>A diferencia del carbón o gas, no producen emisiones operativas ni contaminantes atmosféricos que dañen la salud.</li></ul>"
  },
  {
    keywords: ['mexico', 'latinoamerica', 'latam', 'impacto local'],
    answer: "En México y Latinoamérica el cambio climático golpea con fuerza: <ul><li><strong>Sequías severas:</strong> Afectan presas críticas (como Cutzamala en CDMX) y reducen cosechas en el norte y centro.</li><li><strong>Huracanes categoría 5:</strong> El calentamiento de las aguas del Pacífico y Caribe alimenta fenómenos explosivos como el Huracán Otis.</li><li><strong>Pérdida de selvas:</strong> La deforestación en la Amazonía y Selva Maya acelera el ciclo de sequías regionales.</li></ul>"
  },
  {
    keywords: ['hola', 'buenos dias', 'buenas tardes', 'que tal', 'hey', 'saludos'],
    answer: "¡Hola! Qué gusto saludarte 🌿. Soy **EcoBot**, tu aliado para entender la ciencia climática y transformar nuestros hábitos. ¿Qué tema te inquieta hoy? Puedes preguntarme sobre tu huella, energías limpias o mitos comunes."
  },
  {
    keywords: ['gracias', 'excelente', 'chido', 'genial', 'perfecto'],
    answer: "¡Con muchísimo gusto! 💚 Cada persona informada y activa es un faro de cambio para el planeta. ¿Quieres saber cómo optimizar tu consumo eléctrico o explorar algún otro tema?"
  },
  {
    keywords: ['juego', 'juegos', 'jueguillo', 'jueguillos', 'arcade', 'minijuego', 'jugar', 'gamer'],
    answer: "¡Ámonos! 🕹️ En la sección <strong><a href='#arcade' style='color:#00ff9d; text-decoration:underline;'>Eco-Arcade</a></strong> tienes tres jueguillos listos: <ol><li><strong>Atrapa el CO₂:</strong> Maneja el Eco-Dron y evita el barril de petróleo.</li><li><strong>Clasifica en Fa:</strong> Separa basura en 30 segundos haciendo combos.</li><li><strong>Trivia Relámpago:</strong> Ponte a prueba con preguntas rápidas del clima.</li></ol> ¡Baja a la sección de Jueguillos y rómpela!"
  }
];

function getBotResponse(userText) {
  const cleanText = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Match keyword in database
  for (const item of ECOBOT_KB) {
    const match = item.keywords.some(kw => {
      const cleanKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return cleanText.includes(cleanKw);
    });
    if (match) {
      return item.answer;
    }
  }

  // Fallback intelligent responses
  const fallbacks = [
    "Es una pregunta muy interesante. El sistema climático de la Tierra está interconectado: cada tonelada de CO₂ que evitamos ayuda a estabilizar la temperatura global y proteger la biodiversidad. ¿Te gustaría calcular tus emisiones anuales en nuestra calculadora?",
    "Para profundizar en eso: la ciencia respalda que la transición a economías circulares y energías renovables es viable económica y técnicamente. Puedes preguntarme sobre: <em>energía solar, reducción de huella, o mitos sobre el calentamiento global</em>.",
    "El cambio climático es el mayor desafío de nuestra era, pero también la mayor oportunidad para rediseñar ciudades limpias, alimentos sostenibles y movilidad inteligente. ¿Hay alguna acción en particular que te gustaría evaluar en tu día a día?"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// Convert simple markdown in bot responses to HTML
function formatBotMessage(text) {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  return formatted;
}

// ==========================================
// Voice & Speech Synthesis Controls
// ==========================================
let voiceEnabled = true;
let availableVoices = [];

function loadVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function toggleVoiceSpeech() {
  voiceEnabled = !voiceEnabled;
  const btn = document.getElementById('voiceToggleBtn');
  const label = btn ? btn.querySelector('.voice-btn-label') : null;
  const icon = document.getElementById('voiceIcon');

  if (voiceEnabled) {
    if (btn) btn.classList.add('active');
    if (label) label.textContent = 'Voz Activa';
    if (icon) icon.className = 'fa-solid fa-microphone-lines';
    showToast('Voz de EcoBot activada 🔊', 'info');
  } else {
    if (btn) btn.classList.remove('active');
    if (label) label.textContent = 'Voz Silenciada';
    if (icon) icon.className = 'fa-solid fa-microphone-lines-slash';
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setBotSpeaking(false);
    showToast('Voz silenciada (solo texto) 🔇', 'info');
  }
}

function setBotSpeaking(isSpeaking) {
  const mainWrap = document.getElementById('mainBotAvatarWrap');
  const mainMouth = document.getElementById('mainBotMouth');
  const floatingWrap = document.getElementById('floatingBotAvatarWrap');
  const floatingMouth = document.getElementById('floatingBotMouth');
  const mainStatus = document.getElementById('mainBotStatus');
  const floatingStatus = document.getElementById('floatingStatusText');

  if (isSpeaking) {
    mainWrap?.classList.add('is-speaking');
    mainMouth?.classList.add('is-speaking');
    floatingWrap?.classList.add('is-speaking');
    floatingMouth?.classList.add('is-speaking');

    if (mainStatus) {
      mainStatus.innerHTML = '<i class="fa-solid fa-volume-high text-cyan"></i> <strong>Hablando...</strong>';
    }
    if (floatingStatus) {
      floatingStatus.textContent = 'Hablando...';
    }
  } else {
    mainWrap?.classList.remove('is-speaking');
    mainMouth?.classList.remove('is-speaking');
    floatingWrap?.classList.remove('is-speaking');
    floatingMouth?.classList.remove('is-speaking');

    if (mainStatus) {
      mainStatus.innerHTML = '<i class="fa-solid fa-circle text-emerald"></i> En línea y analizando datos';
    }
    if (floatingStatus) {
      floatingStatus.textContent = 'En línea y listo para hablar';
    }
  }
}

function cleanTextForSpeech(text) {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/CO₂|CO2/gi, ' dióxido de carbono ')
    .replace(/\+1\.5°C|\+1\.5 grados/gi, ' uno punto cinco grados ')
    .replace(/\+1\.28°C/gi, ' uno punto veintiocho grados ')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // remove emojis for cleaner speech
    .replace(/\s+/g, ' ')
    .trim();
}

// Append message to chat DOM
function appendMessage(sender, content, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}-msg`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = sender === 'bot' 
    ? '<i class="fa-solid fa-robot"></i>' 
    : '<i class="fa-solid fa-user"></i>';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = formatBotMessage(content);

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  bubble.appendChild(time);

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  container.appendChild(msgDiv);

  container.scrollTop = container.scrollHeight;
  return bubble;
}

// Deliver Bot Response with simultaneous Voice and Animated Mouth
function deliverBotResponse(responseText) {
  const containers = ['chatMessages', 'floatingMessages'];
  const formattedHTML = formatBotMessage(responseText);
  const plainText = cleanTextForSpeech(responseText);

  // Create message bubbles in both chats
  const bubbles = [];
  containers.forEach(id => {
    const c = document.getElementById(id);
    if (c) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg bot-msg';

      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar';
      avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      bubble.innerHTML = ''; // Start empty for typing/reveal

      const time = document.createElement('div');
      time.className = 'msg-time';
      time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      msgDiv.appendChild(avatar);
      msgDiv.appendChild(bubble);
      c.appendChild(msgDiv);
      c.scrollTop = c.scrollHeight;

      bubbles.push({ bubble, time });
    }
  });

  // Start Mouth Animation & Voice
  setBotSpeaking(true);
  playSound('receive');

  // Progressive text streaming reveal while speaking
  const words = formattedHTML.split(' ');
  let wordIdx = 0;
  const wordsInterval = Math.max(40, Math.min(120, Math.floor(4000 / (words.length || 1))));

  const streamInterval = setInterval(() => {
    wordIdx++;
    const currentText = words.slice(0, wordIdx).join(' ');
    bubbles.forEach(({ bubble, time }) => {
      bubble.innerHTML = currentText;
      bubble.appendChild(time);
    });

    if (wordIdx >= words.length) {
      clearInterval(streamInterval);
    }
  }, wordsInterval);

  // Handle Speech Audio
  if (voiceEnabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // cancel previous if any

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = 'es-MX';
    utterance.rate = 1.05;
    utterance.pitch = 1.05;

    // Pick Spanish voice
    if (availableVoices.length === 0) loadVoices();
    const spanishVoice = availableVoices.find(v => v.lang.startsWith('es') || v.lang.includes('Spanish') || v.lang.includes('Castilian'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => {
      setBotSpeaking(false);
      // Ensure all text is complete
      clearInterval(streamInterval);
      bubbles.forEach(({ bubble, time }) => {
        bubble.innerHTML = formattedHTML;
        bubble.appendChild(time);
      });
    };

    utterance.onerror = () => {
      setBotSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  } else {
    // If voice disabled or not supported, animate mouth during text reveal
    const estimatedDuration = Math.max(1600, words.length * wordsInterval + 400);
    setTimeout(() => {
      setBotSpeaking(false);
    }, estimatedDuration);
  }
}

// Show Typing Indicator
function showTypingIndicator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot-msg typing-msg';
  typingDiv.id = `${containerId}-typing`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble typing-bubble';
  bubble.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;

  typingDiv.appendChild(avatar);
  typingDiv.appendChild(bubble);
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  return typingDiv;
}

function removeTypingIndicator(containerId) {
  const typing = document.getElementById(`${containerId}-typing`);
  if (typing) typing.remove();
}

// Send user message in Main Showcase
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  playSound('send');
  appendMessage('user', text, 'chatMessages');
  appendMessage('user', text, 'floatingMessages');

  showTypingIndicator('chatMessages');
  showTypingIndicator('floatingMessages');

  setTimeout(() => {
    removeTypingIndicator('chatMessages');
    removeTypingIndicator('floatingMessages');
    const response = getBotResponse(text);
    deliverBotResponse(response);
  }, 600);
}

function handleInputKey(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Send quick prompt chip
function sendQuickPrompt(promptText) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = promptText;
    sendMessage();
  }
}

// Floating Chat Functions
function sendFloatingMessage() {
  const input = document.getElementById('floatingInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  playSound('send');
  appendMessage('user', text, 'floatingMessages');
  appendMessage('user', text, 'chatMessages');

  showTypingIndicator('floatingMessages');
  showTypingIndicator('chatMessages');

  setTimeout(() => {
    removeTypingIndicator('floatingMessages');
    removeTypingIndicator('chatMessages');
    const response = getBotResponse(text);
    deliverBotResponse(response);
  }, 600);
}

function handleFloatingInputKey(event) {
  if (event.key === 'Enter') {
    sendFloatingMessage();
  }
}

function toggleFloatingChat(forceOpen = null) {
  const container = document.getElementById('floatingBotContainer');
  const box = document.getElementById('floatingChatBox');
  const shouldOpen = forceOpen !== null ? forceOpen : !box.classList.contains('open');

  if (shouldOpen) {
    box.classList.add('open');
    container.classList.add('open');
    setTimeout(() => {
      document.getElementById('floatingInput')?.focus();
    }, 200);
  } else {
    box.classList.remove('open');
    container.classList.remove('open');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setBotSpeaking(false);
  }
}

function clearChatHistory() {
  const mainChat = document.getElementById('chatMessages');
  const floatingChat = document.getElementById('floatingMessages');
  
  const welcomeHTML = `
    <div class="chat-msg bot-msg">
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble">
        <p>¡Conversación reiniciada! 🌿 ¿En qué puedo asistirte ahora?</p>
        <div class="msg-time">Ahora</div>
      </div>
    </div>
  `;

  if (mainChat) mainChat.innerHTML = welcomeHTML;
  if (floatingChat) floatingChat.innerHTML = welcomeHTML;
  showToast('Historial reiniciado', 'info');
}

function focusEcoBotInput() {
  const section = document.getElementById('ecobot-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('chatInput')?.focus();
    }, 600);
  }
}

// ==========================================
// 3. Carbon Footprint Calculator Engine
// ==========================================
let currentDiet = 'high-meat';

function setDiet(dietType, buttonElement) {
  currentDiet = dietType;
  document.querySelectorAll('.diet-btn').forEach(btn => btn.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');
  updateCalculator();
}

function updateCalculator() {
  const transportKm = parseInt(document.getElementById('transportRange').value, 10);
  const flightsCount = parseInt(document.getElementById('flightsRange').value, 10);
  const electricLevel = parseInt(document.getElementById('electricRange').value, 10);

  // Update labels
  document.getElementById('transportVal').textContent = `${transportKm} km`;
  document.getElementById('flightsVal').textContent = `${flightsCount} ${flightsCount === 1 ? 'vuelo' : 'vuelos'}`;

  const electricLabels = [
    'Bajo (Ahorro ~150 kWh)',
    'Moderado (~250 kWh)',
    'Alto con A/C (~450 kWh)',
    'Muy Alto (~700+ kWh)'
  ];
  document.getElementById('electricVal').textContent = electricLabels[electricLevel - 1];

  // Calculation in metric Tonnes of CO2 per year
  // 1. Transport: km/week * 52 * 0.17 kg CO2/km / 1000
  const transportTonnes = (transportKm * 52 * 0.17) / 1000;

  // 2. Flights: ~0.85 tonnes per round-trip flight
  const flightsTonnes = flightsCount * 0.85;

  // 3. Diet
  const dietFactors = {
    'high-meat': 2.8,
    'low-meat': 1.8,
    'vegetarian': 1.3,
    'vegan': 0.8
  };
  const dietTonnes = dietFactors[currentDiet] || 2.0;

  // 4. Electricity
  const electricFactors = [0.8, 1.5, 2.7, 4.2];
  const electricTonnes = electricFactors[electricLevel - 1] || 1.5;

  const totalTonnes = transportTonnes + flightsTonnes + dietTonnes + electricTonnes;
  const roundedTotal = totalTonnes.toFixed(1);

  // Display Total
  const numElem = document.getElementById('calcTonsNumber');
  if (numElem) numElem.textContent = roundedTotal;

  // Update SVG Circle (Circumference ~ 534)
  // Max scale reference: 15 tonnes
  const maxBenchmark = 15;
  const percentage = Math.min(totalTonnes / maxBenchmark, 1);
  const circle = document.getElementById('calcCircleProgress');
  const badge = document.getElementById('resultLevelBadge');
  const tipText = document.getElementById('calcTipText');

  if (circle) {
    const offset = 534 - (534 * percentage);
    circle.style.strokeDashoffset = offset;

    if (totalTonnes < 3.0) {
      circle.style.stroke = '#00ff9d';
      if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-seedling"></i> Impacto Bajo (Sostenible)';
        badge.style.color = '#00ff9d';
        badge.style.borderColor = 'rgba(0,255,157,0.3)';
        badge.style.background = 'rgba(0,255,157,0.12)';
      }
      if (tipText) {
        tipText.textContent = '¡Felicidades! Tu huella está cerca de la meta climática de 2.0 Toneladas. Sigue inspirando a otros en tu comunidad.';
      }
    } else if (totalTonnes < 6.0) {
      circle.style.stroke = '#06b6d4';
      if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-gauge"></i> Impacto Moderado';
        badge.style.color = '#06b6d4';
        badge.style.borderColor = 'rgba(6,182,212,0.3)';
        badge.style.background = 'rgba(6,182,212,0.12)';
      }
      if (tipText) {
        tipText.textContent = transportTonnes > 1.5 
          ? 'Tu mayor área de oportunidad es el auto: compartir viajes o sustituir 2 días por semana bajaría 0.8 ton/año.'
          : 'Reducir el consumo de carne roja a 2 días por semana ahorraría de inmediato 1.0 tonelada de CO₂ al año.';
      }
    } else if (totalTonnes < 10.0) {
      circle.style.stroke = '#f59e0b';
      if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Impacto Alto';
        badge.style.color = '#f59e0b';
        badge.style.borderColor = 'rgba(245,158,11,0.3)';
        badge.style.background = 'rgba(245,158,11,0.12)';
      }
      if (tipText) {
        tipText.textContent = 'Tus vuelos o el uso intensivo del automóvil elevan notablemente tus emisiones. Plantéate optimizar rutas y regular la climatización.';
      }
    } else {
      circle.style.stroke = '#f43f5e';
      if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-fire"></i> Nivel Crítico';
        badge.style.color = '#f43f5e';
        badge.style.borderColor = 'rgba(244,63,94,0.3)';
        badge.style.background = 'rgba(244,63,94,0.12)';
      }
      if (tipText) {
        tipText.textContent = 'Emisiones muy por encima de la capacidad de regeneración planetaria. Se requieren cambios en movilidad aérea, hábitos alimenticios y eficiencia.';
      }
    }
  }
}

function askBotAboutMyFootprint() {
  const total = document.getElementById('calcTonsNumber').textContent;
  const prompt = `Calculé mi huella de carbono y obtuve ${total} toneladas de CO2 al año. ¿Qué plan de reducción específico me sugieres para mi nivel?`;
  
  focusEcoBotInput();
  setTimeout(() => {
    sendQuickPrompt(prompt);
  }, 400);
}

// ==========================================
// 4. Real-time Climate Ticker Counter
// ==========================================
let currentForestHa = 18450;
let currentIceTon = 124000;

function startLiveCounters() {
  setInterval(() => {
    // Deforestation increases ~0.4 ha per second globally
    currentForestHa += Math.floor(Math.random() * 2) + 1;
    const forestElem = document.getElementById('tickerForest');
    if (forestElem) forestElem.textContent = currentForestHa.toLocaleString();

    // Ice melt increases ~20-50 tons per second
    currentIceTon += Math.floor(Math.random() * 35) + 15;
    const iceElem = document.getElementById('tickerIce');
    if (iceElem) iceElem.textContent = currentIceTon.toLocaleString();
  }, 2000);
}

// ==========================================
// 5. Myths Accordion Toggle
// ==========================================
function toggleMyth(cardElement) {
  const isActive = cardElement.classList.contains('active');
  // Collapse others for clean accordion
  document.querySelectorAll('.myth-card').forEach(c => c.classList.remove('active'));
  if (!isActive) {
    cardElement.classList.add('active');
    playSound('pop');
  }
}

// ==========================================
// 6. Action Checklist / Eco-Score System
// ==========================================
function toggleAction(labelElement) {
  const checkbox = labelElement.querySelector('.action-check');
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    labelElement.classList.toggle('checked', checkbox.checked);
    playSound('pop');
    updateActionScore();
  }
}

function updateActionScore() {
  const allChecks = document.querySelectorAll('.action-check');
  const checked = document.querySelectorAll('.action-check:checked');
  const total = allChecks.length;
  const count = checked.length;
  const percentage = Math.round((count / total) * 100);

  const fill = document.getElementById('scoreFill');
  const text = document.getElementById('scorePercentage');
  const level = document.getElementById('scoreLevelText');

  if (fill) fill.style.width = `${percentage}%`;
  if (text) text.textContent = `${percentage}%`;

  if (level) {
    if (percentage === 0) level.textContent = 'Comenzando';
    else if (percentage <= 33) level.textContent = 'Semilla Verde 🌱';
    else if (percentage <= 66) level.textContent = 'Agente de Cambio ⚡';
    else if (percentage < 100) level.textContent = 'Guardián Planetario 🛡️';
    else {
      level.textContent = '¡Héroe Ecológico! 🏆';
      playSound('success');
      showToast('¡Increíble! Has desbloqueado el máximo nivel de compromiso 🌍✨', 'success');
    }
  }
}

// ==========================================
// 7. Toast Notification System
// ==========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' 
    ? 'fa-solid fa-circle-check' 
    : type === 'warn' 
      ? 'fa-solid fa-triangle-exclamation' 
      : 'fa-solid fa-circle-info';

  toast.innerHTML = `
    <i class="${icon} toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// Newsletter submit handler
function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsletterEmail');
  if (input && input.value) {
    showToast(`¡Gracias! Te enviaremos actualizaciones a ${input.value}`, 'success');
    playSound('success');
    input.value = '';
  }
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('mobile-open'));
    });
  }
}

// ==========================================
// 8. Eco-Arcade Gaming Zone Engines
// ==========================================
let currentActiveArcadeGame = 'catcher';

function switchArcadeGame(gameId, buttonElement) {
  currentActiveArcadeGame = gameId;
  document.querySelectorAll('.arcade-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.arcade-game-view').forEach(view => view.classList.remove('active'));

  if (buttonElement) buttonElement.classList.add('active');
  const targetView = document.getElementById(`game-${gameId}`);
  if (targetView) targetView.classList.add('active');

  playSound('pop');

  if (gameId === 'trivia') {
    initTriviaGame();
  }
}

/* ------------------------------------------
   Game 1: Atrapa el CO2 Canvas Arcade
--------------------------------------------- */
const canvas = document.getElementById('catcherCanvas');
let ctx = canvas ? canvas.getContext('2d') : null;

let catcherScore = 0;
let catcherTemp = 1.28;
let catcherHighScore = parseInt(localStorage.getItem('terrapulse_catcher_hi') || '0', 10);
let catcherRunning = false;
let catcherAnimId = null;
let lastSpawnTime = 0;
let floatingPops = [];
let catcherParticles = [];

const drone = {
  x: 400,
  y: 390,
  width: 70,
  height: 22,
  speed: 9,
  targetX: 400
};

let fallingItems = [];
const itemTypes = [
  { type: 'solar', icon: '☀️', pts: 15, tempDelta: -0.02, label: '+15 Solar' },
  { type: 'seed', icon: '🌱', pts: 20, tempDelta: -0.03, label: '+20 Semilla' },
  { type: 'water', icon: '💧', pts: 25, tempDelta: -0.04, label: '+25 Agua' },
  { type: 'co2', icon: '💨', pts: 30, tempDelta: -0.05, label: '+30 CO₂ Neutralizado' },
  { type: 'oil', icon: '🛢️', pts: -25, tempDelta: 0.16, label: '¡FÓSIL! +0.16°C' }
];

function initCatcherControls() {
  if (!canvas) return;

  // Mouse move
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    drone.targetX = (e.clientX - rect.left) * scaleX;
  });

  // Touch move
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      drone.targetX = (e.touches[0].clientX - rect.left) * scaleX;
    }
  }, { passive: false });

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (currentActiveArcadeGame !== 'catcher' || !catcherRunning) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      drone.targetX -= 40;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      drone.targetX += 40;
    }
  });

  const hiElem = document.getElementById('catcherHighScore');
  if (hiElem) hiElem.textContent = catcherHighScore;
}

function startCatcherGame() {
  const overlay = document.getElementById('catcherOverlay');
  if (overlay) overlay.classList.add('hidden');

  catcherScore = 0;
  catcherTemp = 1.28;
  fallingItems = [];
  floatingPops = [];
  catcherParticles = [];
  catcherRunning = true;

  updateCatcherHud();
  playSound('powerup');

  cancelAnimationFrame(catcherAnimId);
  lastSpawnTime = performance.now();
  requestAnimationFrame(catcherLoop);
}

function resetCatcherGame() {
  catcherRunning = false;
  cancelAnimationFrame(catcherAnimId);
  catcherScore = 0;
  catcherTemp = 1.28;
  updateCatcherHud();
  
  const overlay = document.getElementById('catcherOverlay');
  const title = document.getElementById('overlayTitle');
  const desc = document.getElementById('overlayDesc');
  if (overlay) overlay.classList.remove('hidden');
  if (title) title.textContent = '¡Misión: Salvar la Atmósfera!';
  if (desc) desc.innerHTML = 'Mueve el <strong>Eco-Dron</strong> con el ratón o flechas.<br>Atrapa energía limpia y CO₂ antes de que la temperatura suba demasiado.';
}

function spawnCatcherItem() {
  // 65% clean/co2, 35% oil hazard
  const isHazard = Math.random() < 0.3;
  let chosen;
  if (isHazard) {
    chosen = itemTypes[4]; // oil
  } else {
    chosen = itemTypes[Math.floor(Math.random() * 4)];
  }

  fallingItems.push({
    x: 40 + Math.random() * (canvas.width - 80),
    y: -30,
    speed: 2.2 + Math.random() * 2.5,
    size: 28,
    ...chosen
  });
}

function createParticles(x, y, color) {
  for (let i = 0; i < 8; i++) {
    catcherParticles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 1,
      color
    });
  }
}

function catcherLoop(timestamp) {
  if (!catcherRunning) return;

  // Smooth drone movement
  drone.x += (drone.targetX - drone.x) * 0.2;
  // Boundaries
  const halfW = drone.width / 2;
  if (drone.x < halfW) drone.x = halfW;
  if (drone.x > canvas.width - halfW) drone.x = canvas.width - halfW;

  // Spawning
  if (timestamp - lastSpawnTime > 750) {
    spawnCatcherItem();
    lastSpawnTime = timestamp;
  }

  // Update & Draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCatcherBackground();

  // Update items
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += item.speed;

    // Check catch with drone
    const droneLeft = drone.x - drone.width / 2;
    const droneRight = drone.x + drone.width / 2;
    const droneTop = drone.y - 10;
    const droneBottom = drone.y + drone.height;

    if (item.y + item.size >= droneTop && item.y <= droneBottom && item.x >= droneLeft && item.x <= droneRight) {
      // Caught!
      catcherScore += item.pts;
      if (catcherScore < 0) catcherScore = 0;
      catcherTemp += item.tempDelta;
      if (catcherTemp < 1.0) catcherTemp = 1.0;

      if (item.type === 'oil') {
        playSound('fail');
        createParticles(item.x, item.y, '#f43f5e');
      } else {
        playSound('receive');
        createParticles(item.x, item.y, '#00ff9d');
      }

      floatingPops.push({
        x: item.x,
        y: item.y - 15,
        text: item.label,
        color: item.type === 'oil' ? '#f43f5e' : '#00ff9d',
        life: 1
      });

      fallingItems.splice(i, 1);
      updateCatcherHud();
      continue;
    }

    // Missed item reaches bottom
    if (item.y > canvas.height + 20) {
      if (item.type === 'co2') {
        // Uncaptured CO2 heats up atmosphere
        catcherTemp += 0.04;
        updateCatcherHud();
      }
      fallingItems.splice(i, 1);
    }
  }

  // Draw Items
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const item of fallingItems) {
    ctx.fillText(item.icon, item.x, item.y);
  }

  // Draw Drone
  drawDrone();

  // Draw Particles
  for (let i = catcherParticles.length - 1; i >= 0; i--) {
    const p = catcherParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.04;
    if (p.life <= 0) {
      catcherParticles.splice(i, 1);
    } else {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Draw Floating Text Pops
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  for (let i = floatingPops.length - 1; i >= 0; i--) {
    const pop = floatingPops[i];
    pop.y -= 1;
    pop.life -= 0.025;
    if (pop.life <= 0) {
      floatingPops.splice(i, 1);
    } else {
      ctx.fillStyle = pop.color;
      ctx.globalAlpha = pop.life;
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.globalAlpha = 1;
    }
  }

  // Check Game Over or Win
  if (catcherTemp >= 2.5) {
    endCatcherGame(false);
    return;
  } else if (catcherScore >= 500) {
    endCatcherGame(true);
    return;
  }

  catcherAnimId = requestAnimationFrame(catcherLoop);
}

function drawCatcherBackground() {
  // Stars / Atmospheric Glow
  ctx.save();
  // Earth horizon at bottom
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height + 650, 720, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height + 650, 600, canvas.width / 2, canvas.height + 650, 720);
  grad.addColorStop(0, '#062822');
  grad.addColorStop(0.7, '#0d4a3e');
  grad.addColorStop(1, '#00ff9d');
  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(0, 255, 157, 0.4)';
  ctx.shadowBlur = 25;
  ctx.fill();
  ctx.restore();
}

function drawDrone() {
  ctx.save();
  const dx = drone.x;
  const dy = drone.y;

  // Drone energy shield glow
  ctx.beginPath();
  ctx.ellipse(dx, dy, drone.width / 2 + 8, 14, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 255, 157, 0.5)';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00ff9d';
  ctx.shadowBlur = 12;
  ctx.stroke();

  // Drone Body
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(dx - drone.width / 2, dy - 8, drone.width, 16, 8);
  ctx.fill();
  ctx.stroke();

  // Center Core
  ctx.beginPath();
  ctx.arc(dx, dy, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#00ff9d';
  ctx.fill();

  // Thrusters flame
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(dx - 18, dy + 8);
  ctx.lineTo(dx - 14, dy + 18);
  ctx.lineTo(dx - 10, dy + 8);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(dx + 10, dy + 8);
  ctx.lineTo(dx + 14, dy + 18);
  ctx.lineTo(dx + 18, dy + 8);
  ctx.fill();

  ctx.restore();
}

function updateCatcherHud() {
  const scoreElem = document.getElementById('catcherScore');
  const tempElem = document.getElementById('catcherTemp');
  const hiElem = document.getElementById('catcherHighScore');

  if (scoreElem) scoreElem.textContent = catcherScore;
  if (tempElem) {
    tempElem.textContent = `+${catcherTemp.toFixed(2)}°C`;
    tempElem.className = catcherTemp > 2.0 ? 'hud-value text-red' : catcherTemp > 1.6 ? 'hud-value text-amber' : 'hud-value text-emerald';
  }

  if (catcherScore > catcherHighScore) {
    catcherHighScore = catcherScore;
    localStorage.setItem('terrapulse_catcher_hi', catcherHighScore.toString());
    if (hiElem) hiElem.textContent = catcherHighScore;
  }
}

function endCatcherGame(won) {
  catcherRunning = false;
  cancelAnimationFrame(catcherAnimId);

  const overlay = document.getElementById('catcherOverlay');
  const title = document.getElementById('overlayTitle');
  const desc = document.getElementById('overlayDesc');

  if (won) {
    playSound('success');
    showToast('¡Victoria! Has alcanzado Cero Emisiones Netas 🏆🌱', 'success');
    if (title) title.innerHTML = '¡Planeta Salvado! 🏆🌱';
    if (desc) desc.innerHTML = `Puntaje final: <strong>${catcherScore} pts</strong> con una temperatura controlada de <strong>+${catcherTemp.toFixed(2)}°C</strong>.<br>¡EcoBot está orgulloso de tus reflejos ecológicos!`;
  } else {
    playSound('fail');
    showToast('¡Alerta de Colapso Climático! Inténtalo de nuevo 🔥', 'warn');
    if (title) title.innerHTML = '¡Alerta de Colapso Climático! 🔥';
    if (desc) desc.innerHTML = `La temperatura global superó el umbral crítico de <strong>+2.50°C</strong>.<br>Puntaje logrado: <strong>${catcherScore} pts</strong>. ¡El planeta necesita otra oportunidad!`;
  }

  if (overlay) overlay.classList.remove('hidden');
}

/* ------------------------------------------
   Game 2: Clasifica en Fa (Trash Sorter Blitz)
--------------------------------------------- */
const WASTE_ITEMS = [
  { name: 'Cáscara de Plátano', emoji: '🍌', type: 'organic', hint: 'Materia orgánica compostable' },
  { name: 'Botella PET de Agua', emoji: '🧴', type: 'recyclable', hint: 'Plástico transparente limpio' },
  { name: 'Pila Alcalina AA', emoji: '🔋', type: 'special', hint: 'Residuo químico con metales pesados' },
  { name: 'Caja de Cartón de Envíos', emoji: '📦', type: 'recyclable', hint: 'Papel y cartón seco' },
  { name: 'Corazón de Manzana', emoji: '🍏', type: 'organic', hint: 'Fruta biodegradable' },
  { name: 'Lata de Aluminio', emoji: '🥫', type: 'recyclable', hint: 'Metal 100% reciclable' },
  { name: 'Foco Incandescente', emoji: '💡', type: 'special', hint: 'Vidrio especial no reciclable' },
  { name: 'Bolsa de Papas Metalizada', emoji: '🍟', type: 'special', hint: 'Multicapa plástica no reciclable' },
  { name: 'Botella de Vidrio', emoji: '🍾', type: 'recyclable', hint: 'Vidrio limpio para fundición' },
  { name: 'Restos de Café', emoji: '☕', type: 'organic', hint: 'Excelente nutriente de composta' },
  { name: 'Colilla de Cigarro', emoji: '🚬', type: 'special', hint: 'Acetato de celulosa con nicotina' },
  { name: 'Periódico Viejo', emoji: '📰', type: 'recyclable', hint: 'Papel celulosa recuperable' },
  { name: 'Cáscaras de Huevo', emoji: '🥚', type: 'organic', hint: 'Calcio natural para la tierra' },
  { name: 'Termómetro de Mercurio', emoji: '🌡️', type: 'special', hint: 'Material tóxico de manejo especial' }
];

let sorterTimerVal = 30;
let sorterTimerInterval = null;
let sorterScore = 0;
let sorterStreak = 1;
let currentWasteItem = null;
let sorterRunning = false;

function startSorterGame() {
  const overlay = document.getElementById('sorterOverlay');
  if (overlay) overlay.classList.add('hidden');

  sorterTimerVal = 30;
  sorterScore = 0;
  sorterStreak = 1;
  sorterRunning = true;

  updateSorterHud();
  nextWasteItem();
  playSound('powerup');

  clearInterval(sorterTimerInterval);
  sorterTimerInterval = setInterval(() => {
    sorterTimerVal--;
    updateSorterHud();
    if (sorterTimerVal <= 0) {
      endSorterGame();
    }
  }, 1000);
}

function nextWasteItem() {
  currentWasteItem = WASTE_ITEMS[Math.floor(Math.random() * WASTE_ITEMS.length)];
  const emoji = document.getElementById('wasteEmoji');
  const name = document.getElementById('wasteName');
  const hint = document.getElementById('wasteHint');
  const card = document.getElementById('wasteCard');

  if (emoji) emoji.textContent = currentWasteItem.emoji;
  if (name) name.textContent = currentWasteItem.name;
  if (hint) hint.textContent = currentWasteItem.hint;

  if (card) {
    card.style.transform = 'scale(0.92)';
    setTimeout(() => { card.style.transform = 'scale(1)'; }, 100);
  }
}

function handleSortWaste(chosenCategory) {
  if (!sorterRunning || !currentWasteItem) return;

  const isCorrect = chosenCategory === currentWasteItem.type;

  if (isCorrect) {
    const gained = 10 * sorterStreak;
    sorterScore += gained;
    sorterStreak = Math.min(sorterStreak + 1, 5);
    playSound('success');
    showToast(`¡Correcto! +${gained} pts (Racha x${sorterStreak})`, 'success');
  } else {
    sorterStreak = 1;
    sorterScore = Math.max(0, sorterScore - 5);
    playSound('fail');
    showToast(`¡Ups! Era '${getCategoryName(currentWasteItem.type)}' (-5 pts)`, 'warn');
  }

  updateSorterHud();
  nextWasteItem();
}

function getCategoryName(type) {
  if (type === 'organic') return 'Orgánico';
  if (type === 'recyclable') return 'Reciclable';
  return 'No Reciclable / Especial';
}

function updateSorterHud() {
  const timer = document.getElementById('sorterTimer');
  const score = document.getElementById('sorterScore');
  const streak = document.getElementById('sorterStreak');

  if (timer) timer.textContent = `${sorterTimerVal}s`;
  if (score) score.textContent = sorterScore;
  if (streak) streak.textContent = `x${sorterStreak}`;
}

function endSorterGame() {
  sorterRunning = false;
  clearInterval(sorterTimerInterval);
  playSound('receive');

  const overlay = document.getElementById('sorterOverlay');
  const title = document.getElementById('sorterOverlayTitle');
  const desc = document.getElementById('sorterOverlayDesc');

  let rank = 'Reciclador Novato 🌱';
  if (sorterScore >= 180) rank = '¡Maestro Supremo de la Economía Circular! 🏆♻️';
  else if (sorterScore >= 100) rank = 'Clasificador Experto ⚡';
  else if (sorterScore >= 50) rank = 'Defensor Ambiental 🛡️';

  if (title) title.textContent = '¡Tiempo Cumplido!';
  if (desc) desc.innerHTML = `Lograste <strong>${sorterScore} puntos</strong>.<br>Nivel alcanzado: <strong class="text-emerald">${rank}</strong>.<br>¡Sigue separando la basura en casa!`;
  if (overlay) overlay.classList.remove('hidden');
}

// Keyboard shortcuts for waste sorter (Keys: 1, 2, 3)
window.addEventListener('keydown', (e) => {
  if (currentActiveArcadeGame !== 'sorter' || !sorterRunning) return;
  if (e.key === '1') handleSortWaste('organic');
  else if (e.key === '2') handleSortWaste('recyclable');
  else if (e.key === '3') handleSortWaste('special');
});

/* ------------------------------------------
   Game 3: Speed Trivia Challenge
--------------------------------------------- */
const TRIVIA_DATA = [
  {
    category: 'Ciencia del Clima',
    question: '¿Cuál es el gas de efecto invernadero emitido en mayor volumen neto por actividades humanas?',
    options: [
      'Dióxido de Carbono (CO₂)',
      'Metano (CH₄)',
      'Óxido Nitroso (N₂O)',
      'Ozono (O₃)'
    ],
    answer: 0,
    explanation: 'El CO₂ representa aproximadamente el 76% de todas las emisiones de gases de efecto invernadero generadas por la quema de carbón, petróleo y gas.'
  },
  {
    category: 'Océanos y Polos',
    question: '¿Qué porcentaje del exceso de calor atrapado en la Tierra es absorbido por los océanos?',
    options: [
      'Cerca del 30%',
      'Más del 90%',
      'Aproximadamente 50%',
      'Menos del 10%'
    ],
    answer: 1,
    explanation: 'Los océanos actúan como el gran amortiguador del planeta y han absorbido más del 90% del calor adicional, lo que provoca su acidificación y olas de calor marinas.'
  },
  {
    category: 'Energía Limpia',
    question: '¿Qué porcentaje cayeron los costos de la energía solar fotovoltaica en la última década?',
    options: [
      'Aproximadamente 15%',
      'Cerca del 40%',
      'Más del 85%',
      'Se mantuvieron iguales'
    ],
    answer: 2,
    explanation: 'La energía solar experimentó una revolución tecnológica que redujo sus costos en más del 85%, haciéndola la electricidad más económica del mundo hoy.'
  },
  {
    category: 'Impacto Global',
    question: '¿Por qué el límite de +1.5°C del Acuerdo de París es un punto crítico?',
    options: [
      'Porque con +2.0°C desaparecería el 99% de los arrecifes de coral',
      'Porque después de eso ya no llueve',
      'Porque el sol se apagará',
      'Es un número político sin base científica'
    ],
    answer: 0,
    explanation: 'Superar 1.5°C desencadena puntos de inflexión irreversibles: el 99% de los corales morirían y el colapso del hielo polar se aceleraría exponencialmente.'
  },
  {
    category: 'Hábitos y Acción',
    question: '¿Cuál de estos cambios individuales ahorra más agua y reduce más huella de carbono al año?',
    options: [
      'Cerrar la llave al lavarse los dientes',
      'Reducir drásticamente el consumo de carne roja y lácteos',
      'Desconectar el celular por las noches',
      'Usar servilletas de papel'
    ],
    answer: 1,
    explanation: 'La ganadería bovina consume miles de litros de agua por kilo y emite metano masivo. Adoptar una dieta basada en plantas o flexitariana reduce tu huella hasta un 50%.'
  }
];

let triviaIndex = 0;
let triviaScore = 0;
let triviaAnswered = false;

function initTriviaGame() {
  triviaIndex = 0;
  triviaScore = 0;
  renderTriviaQuestion();
}

function renderTriviaQuestion() {
  triviaAnswered = false;
  const current = TRIVIA_DATA[triviaIndex];

  const qNum = document.getElementById('triviaQuestionNum');
  const scoreElem = document.getElementById('triviaScore');
  const cat = document.getElementById('triviaCategory');
  const text = document.getElementById('triviaQuestionText');
  const grid = document.getElementById('triviaOptionsGrid');
  const expBox = document.getElementById('triviaExplanationBox');

  if (qNum) qNum.textContent = `${triviaIndex + 1} / ${TRIVIA_DATA.length}`;
  if (scoreElem) scoreElem.textContent = triviaScore;
  if (cat) cat.textContent = current.category;
  if (text) text.textContent = current.question;
  if (expBox) expBox.style.display = 'none';

  if (grid) {
    grid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    current.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-opt-btn';
      btn.innerHTML = `<span class="opt-letter">${letters[idx]}</span> <span>${opt}</span>`;
      btn.onclick = () => selectTriviaOption(idx, btn);
      grid.appendChild(btn);
    });
  }
}

function selectTriviaOption(selectedIdx, btnElement) {
  if (triviaAnswered) return;
  triviaAnswered = true;

  const current = TRIVIA_DATA[triviaIndex];
  const allBtns = document.querySelectorAll('.trivia-opt-btn');
  allBtns.forEach(btn => btn.disabled = true);

  const expBox = document.getElementById('triviaExplanationBox');
  const expText = document.getElementById('triviaExplanationText');
  const nextBtn = document.getElementById('triviaNextBtn');

  if (selectedIdx === current.answer) {
    btnElement.classList.add('correct');
    triviaScore++;
    playSound('success');
    showToast('¡Respuesta Correcta! 🌟', 'success');
  } else {
    btnElement.classList.add('wrong');
    allBtns[current.answer].classList.add('correct');
    playSound('fail');
    showToast('¡Casi! Revisa la explicación científica 💡', 'warn');
  }

  const scoreElem = document.getElementById('triviaScore');
  if (scoreElem) scoreElem.textContent = triviaScore;

  if (expBox && expText) {
    expText.textContent = current.explanation;
    expBox.style.display = 'flex';
  }

  if (nextBtn) {
    nextBtn.innerHTML = triviaIndex === TRIVIA_DATA.length - 1 
      ? 'Ver Resultado Final 🏆' 
      : 'Siguiente Pregunta <i class="fa-solid fa-arrow-right"></i>';
  }
}

function nextTriviaQuestion() {
  triviaIndex++;
  if (triviaIndex < TRIVIA_DATA.length) {
    renderTriviaQuestion();
    playSound('pop');
  } else {
    // End of Trivia
    playSound('success');
    const container = document.getElementById('triviaContainer');
    if (container) {
      container.innerHTML = `
        <div class="trivia-question-box">
          <div class="overlay-icon" style="font-size: 3.5rem; margin-bottom: 0.8rem;">🏆</div>
          <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem;">¡Trivia Completada!</h3>
          <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Aciertos: <strong class="text-emerald">${triviaScore} de ${TRIVIA_DATA.length}</strong>
          </p>
          <p style="font-size: 0.95rem; margin-bottom: 2rem;">
            ${triviaScore === 5 ? '¡Puntaje perfecto! Eres todo un erudito del clima y la sostenibilidad planetaria. 🌍✨' : '¡Excelente esfuerzo! El conocimiento es la primera herramienta para exigir e impulsar el cambio.'}
          </p>
          <button class="btn btn-primary btn-large" onclick="initTriviaGame()">
            <i class="fa-solid fa-rotate-right"></i> Jugar de Nuevo
          </button>
        </div>
      `;
    }
  }
}

// ==========================================
// 9. Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateCalculator();
  startLiveCounters();
  setupMobileMenu();
  initCatcherControls();
  initTriviaGame();

  // Welcome Toast
  setTimeout(() => {
    showToast('Bienvenido a TerraPulse. EcoBot y la Zona Gamer están listos.', 'info');
  }, 1000);
});
