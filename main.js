// Atualiza relógio da taskbar a cada segundo
function updateClock() {
  const clock = document.getElementById("taskbar-clock");
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  clock.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Toggle menu iniciar
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
startButton.addEventListener("click", () => {
  startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
});

// Fecha start menu ao clicar fora
window.addEventListener("click", (e) => {
  if (!startMenu.contains(e.target) && e.target !== startButton) {
    startMenu.style.display = "none";
  }
});

// Abrir/fechar janelas ao clicar em ícones ou opções
function toggleWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (win.classList.contains("hidden")) {
    win.classList.remove("hidden");
    // traz para frente
    win.style.zIndex = ++zIndexCounter;
    // foco no input do terminal
    if (id === "terminal") {
      terminalInput.focus();
    }
  } else {
    win.classList.add("hidden");
  }
}

// Controla z-index das janelas para trazer para frente
let zIndexCounter = 1200;

// Ícones da barra e opções do menu
document.querySelectorAll(".task-icon").forEach((el) => {
  el.addEventListener("click", () => {
    toggleWindow(el.getAttribute("data-window"));
    startMenu.style.display = "none";
  });
});
document.querySelectorAll(".start-option").forEach((el) => {
  el.addEventListener("click", () => {
    toggleWindow(el.getAttribute("data-window"));
    startMenu.style.display = "none";
  });
});

// Botões fechar janela
document.querySelectorAll(".btn-close").forEach((btn) => {
  btn.addEventListener("click", () => {
    const win = btn.getAttribute("data-window");
    document.getElementById(win).classList.add("hidden");
  });
});

// Terminal: comando e output
const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-input");

// Simula comandos Linux básicos
const commands = {
  help: () => `Comandos disponíveis:\nhelp - mostra esta ajuda\nclear - limpa o terminal\nexit - fecha o terminal\nls - lista arquivos\npwd - mostra diretório atual\necho [texto] - exibe texto\ndata - data e hora atual\nwhoami - mostra usuário\ncontato - informações de contato\nsobre - informações sobre o terminal\nlinkedin - abre o LinkedIn\ngit - abre o GitHub\nmanual - abre o manual do usuário\nchat - Explica sobre Assistente Virtual\nchatbot - abre o assistente virtual com foco no input\npoweroff - desliga o sistema`,
  clear: () => { terminalOutput.textContent = ""; return ""; },
  exit: () => { toggleWindow("terminal"); return ""; },
  ls: () => `Desktop  Documentos  Downloads  Musicas  Fotos  Videos`,
  pwd: () => `/home/user`,
  data: () => new Date().toString(),
  whoami: () => `user`,
  echo: (args) => args.join(" "),
  contato: () => `Email: herbertonline1@hotmail.com \nFone: +55 81 99275-7332\nLinkedIn: https://www.linkedin.com/in/herbertonline/`,
  sobre: () => `Este é um terminal simulado com comandos básicos. Desenvolvido por Herbert.`,
  chat: () => `um assistente virtual que pode responder perguntas e ajudar com tarefas simples. Digite "chatbot" para abrir o chat.`,
  chatbot: () => {
     {
    const chatBox = document.getElementById("chat-box");
    if (chatBox.style.display === "none" || chatBox.style.display === "") {
      chatBox.style.display = "flex";
      setTimeout(() => {
        const chatInput = document.getElementById("chat-input");
        if (chatInput) chatInput.focus();
      }, 100);
      return "Abrindo assistente virtual...";
    }
    return "O assistente virtual já está aberto.";
  }
  },
  poweroff: () => {
const shutdownScreen = document.getElementById('shutdown-screen');
    shutdownScreen.classList.remove('hidden');
   

  },
  linkedin: () => {
    window.open("https://www.linkedin.com/in/herbert-frontend/", "_blank");
    return "Abrindo LinkedIn...";
  },
  git: () => {
    window.open("https://github.com/herbertonline1", "_blank");
    return "Abrindo LinkedIn...";
  },
  manual: () => {
    toggleWindow("manual");
    return "Abrindo manual do usuário...";
  },  // Histórico simples

  
};

// Histórico simples
let commandHistory = [];
let historyIndex = -1;

// Adiciona linha de comando e resultado no terminal
function addTerminalLine(command, output) {
  terminalOutput.textContent += `user@desktop:~$ ${command}\n`;
  if (output) terminalOutput.textContent += `${output}\n`;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Processa comando digitado
function processCommand(input) {
  if (!input.trim()) return;
  addTerminalLine(input, "");
  commandHistory.push(input);
  historyIndex = commandHistory.length;

  const parts = input.trim().split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (commands[cmd]) {
    const result = commands[cmd](args);
    if (result !== "") {
      addTerminalLine("", result);
    }
  } else {
    addTerminalLine("", `bash: comando não encontrado: ${cmd}`);
  }
}

// Input teclado no terminal
terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = terminalInput.value;
    processCommand(input);
    terminalInput.value = "";
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      terminalInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      terminalInput.value = "";
    }
  }
});

// Tornar janelas "draggable"
function makeDraggable(el) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  const header = el.querySelector(".window-header");
  if (!header) return;

  header.style.cursor = "grab";

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = el.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    header.style.cursor = "grabbing";
    e.preventDefault();
    // traz janela para frente ao arrastar
    el.style.zIndex = ++zIndexCounter;
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = "grab";
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    el.style.left = startLeft + dx + "px";
    el.style.top = startTop + dy + "px";
  });
}

// Aplica draggable nas janelas
document.querySelectorAll(".draggable").forEach(makeDraggable);



// JAVASCRIPT PARA O CHAT ASSISTENTE-------------------------------------------------------------------------

const chatButton = document.getElementById("chat-button");
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const voiceToggle = document.getElementById("voice-toggle");
const voiceControls = document.getElementById("voice-controls");
const playVoice = document.getElementById("play-voice");
const stopVoice = document.getElementById("stop-voice");

let userName = localStorage.getItem("userName");
let voiceEnabled = localStorage.getItem("voiceEnabled") === "true";

voiceToggle.checked = voiceEnabled;
voiceControls.style.display = voiceEnabled ? "block" : "none";

let isSpeaking = false;
let utterance = null;

voiceToggle.addEventListener("change", () => {
  voiceEnabled = voiceToggle.checked;
  localStorage.setItem("voiceEnabled", voiceEnabled);
  voiceControls.style.display = voiceEnabled ? "block" : "none";

  if (!voiceEnabled) {
    stopSpeech();
  }
});

chatButton.addEventListener("click", () => {
  const wasHidden = chatBox.style.display === "none" || chatBox.style.display === "";
  chatBox.style.display = wasHidden ? "flex" : "none";
  if (wasHidden) {
    setTimeout(() => {
      chatInput.focus();
      if (!userName) {
        const pergunta = "Olá! Qual é o seu nome?";
        appendMessage("Assistente", pergunta, "bot");
        botSpeak(pergunta);
      } else {
        greetUser(userName);
      }
    }, 300);
  }
});

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message === "") return;

  appendMessage("Você", message, "user");
  chatInput.value = "";

  if (!userName) {
    userName = message;
    localStorage.setItem("userName", userName);
    const greeting = `Prazer em conhecer você, ${userName}. Como posso te ajudar hoje?`;
    appendMessage("Assistente", greeting, "bot");
    botSpeak(greeting);
    return;
  }

  fetch("responder.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "pergunta=" + encodeURIComponent(message) + "&nome=" + encodeURIComponent(userName)
  })
    .then(res => res.text())
    .then(resposta => {
      appendMessage("Assistente", resposta, "bot");
      botSpeak(resposta);
    })
    .catch(err => {
      appendMessage("Assistente", "Falha ao conectar com o servidor.", "bot");
      botSpeak("Desculpe, houve um erro na conexão.");
      console.error(err);
    });
});

function appendMessage(sender, text, type) {
  const msg = document.createElement("div");
  msg.classList.add("msg", type);
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function botSpeak(text) {
  if (!voiceEnabled || !window.speechSynthesis) return;

  stopSpeech();

  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 1;
  utterance.pitch = 1.1;

  utterance.onstart = () => {
    isSpeaking = true;
    updatePlayButton(true);
  };

  utterance.onend = () => {
    isSpeaking = false;
    updatePlayButton(false);
  };

  utterance.onerror = () => {
    isSpeaking = false;
    updatePlayButton(false);
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if (window.speechSynthesis && isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    updatePlayButton(false);
  }
}

function updatePlayButton(speaking) {
  if (speaking) {
    playVoice.textContent = "⏸";
    playVoice.title = "Pausar fala";
    stopVoice.disabled = false;
  } else {
    playVoice.textContent = "🔊";
    playVoice.title = "Tocar resposta";
    stopVoice.disabled = true;
  }
}

function greetUser(name) {
  const welcome = `Olá novamente, ${name}. Em que posso ajudar?`;
  appendMessage("Assistente", welcome, "bot");
  botSpeak(welcome);
}

playVoice.addEventListener("click", () => {
  if (!voiceEnabled) return;
  if (isSpeaking) {
    // Pausar (cancelar)
    stopSpeech();
  } else {
    // Reproduzir a última fala
    const lastBotMessage = [...chatMessages.querySelectorAll(".msg.bot")].pop();
    if (lastBotMessage) {
      const text = lastBotMessage.textContent.replace("Assistente:", "").trim();
      botSpeak(text);
    }
  }
});

stopVoice.addEventListener("click", () => {
  if (!voiceEnabled) return;
  stopSpeech();
});

// Inicializa estado do botão Stop desabilitado
stopVoice.disabled = true;



function updateInternetStatus() {
  const statusIcon = document.getElementById('internet-status');
  if (navigator.onLine) {
    statusIcon.textContent = '📺'; // online
    statusIcon.title = 'Conectado à Internet';
  } else {
    statusIcon.textContent = '❌📺'; // offline
    statusIcon.title = 'Sem conexão com a Internet';
  }
}

window.addEventListener('load', updateInternetStatus);
window.addEventListener('online', updateInternetStatus);
window.addEventListener('offline', updateInternetStatus);



document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const windowName = icon.dataset.window;
    if (windowName) {
      const windowElement = document.getElementById(windowName);
      if (windowElement) {
        windowElement.classList.remove('hidden');
      }
    }
  });
});














