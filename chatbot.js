/* ============================================================
   Portfolio AI Chatbot — Powered by Google Gemini
   API key is securely stored on the Render proxy server.
   No secrets in this file — safe to push to GitHub.
   ============================================================ */

// ── Render proxy URL ──
const PROXY_URL = "https://mudit-portfolio.onrender.com/api/chat";

const MAX_MESSAGES_PER_SESSION = 10;

/* ── Suggested starter questions ── */
const STARTER_QUESTIONS = [
  "What AI skills does Mudit have?",
  "Tell me about his work at Vosyn",
  "What projects has he built?",
  "Is he open to remote work?",
  "What roles is he looking for?",
];

/* ── State ── */
let messageCount = 0;
let conversationHistory = [];
let isOpen = false;
let isTyping = false;

/* ── Build the chat UI ── */
function buildChatUI() {
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "chatbot-toggle";
  toggleBtn.setAttribute("aria-label", "Chat with Mudit's AI assistant");
  toggleBtn.innerHTML = `<i class="ri-robot-2-line"></i>`;

  const panel = document.createElement("div");
  panel.id = "chatbot-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat with Mudit's AI assistant");
  panel.innerHTML = `
    <div id="chatbot-header">
      <div id="chatbot-header-left">
        <div id="chatbot-avatar"><i class="ri-robot-2-line"></i></div>
        <div>
          <p id="chatbot-name">Ask about Mudit</p>
          <p id="chatbot-status"><span class="chatbot-dot"></span> AI-powered · Gemini</p>
        </div>
      </div>
      <button id="chatbot-close" aria-label="Close chat"><i class="ri-close-line"></i></button>
    </div>

    <div id="chatbot-messages" role="log" aria-live="polite">
      <div class="chatbot-msg chatbot-msg--bot">
        <div class="chatbot-bubble">
          Hi! I'm Mudit's AI assistant. Ask me anything about his experience, skills, or projects — I'm here to help recruiters get quick answers. 👋
        </div>
      </div>
      <div id="chatbot-starters">
        ${STARTER_QUESTIONS.map(
          (q) => `<button class="chatbot-starter-btn">${q}</button>`
        ).join("")}
      </div>
    </div>

    <div id="chatbot-limit-msg" hidden>
      <i class="ri-information-line"></i>
      Session limit reached. Reach Mudit directly at
      <a href="mailto:muditmarkan@gmail.com">muditmarkan@gmail.com</a>
    </div>

    <div id="chatbot-input-area">
      <input
        type="text"
        id="chatbot-input"
        placeholder="Ask about skills, projects, availability..."
        maxlength="300"
        autocomplete="off"
        aria-label="Type your question"
      />
      <button id="chatbot-send" aria-label="Send message">
        <i class="ri-send-plane-fill"></i>
      </button>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(panel);

  toggleBtn.addEventListener("click", toggleChat);
  document.getElementById("chatbot-close").addEventListener("click", closeChat);
  document.getElementById("chatbot-send").addEventListener("click", handleSend);
  document.getElementById("chatbot-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  panel.querySelectorAll(".chatbot-starter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendMessage(btn.textContent);
      document.getElementById("chatbot-starters").remove();
    });
  });
}

/* ── Toggle / open / close ── */
function toggleChat() {
  isOpen ? closeChat() : openChat();
}

function openChat() {
  isOpen = true;
  document.getElementById("chatbot-panel").classList.add("chatbot-panel--open");
  document.getElementById("chatbot-toggle").classList.add("chatbot-toggle--active");
  document.getElementById("chatbot-input").focus();
}

function closeChat() {
  isOpen = false;
  document.getElementById("chatbot-panel").classList.remove("chatbot-panel--open");
  document.getElementById("chatbot-toggle").classList.remove("chatbot-toggle--active");
}

/* ── Handle send ── */
function handleSend() {
  const input = document.getElementById("chatbot-input");
  const text = input.value.trim();
  if (!text || isTyping) return;
  input.value = "";

  const starters = document.getElementById("chatbot-starters");
  if (starters) starters.remove();

  sendMessage(text);
}

/* ── Core send + proxy call ── */
async function sendMessage(userText) {
  if (messageCount >= MAX_MESSAGES_PER_SESSION) {
    showLimitMessage();
    return;
  }

  appendMessage("user", userText);
  messageCount++;

  const typingId = showTyping();
  isTyping = true;
  document.getElementById("chatbot-send").disabled = true;
  document.getElementById("chatbot-input").disabled = true;

  try {
    const response = await callProxy(userText);
    removeTyping(typingId);
    appendMessage("bot", response);
    // Store in history for context continuity
    conversationHistory.push(
      { role: "user",  parts: [{ text: userText }] },
      { role: "model", parts: [{ text: response }] }
    );
  } catch (err) {
    removeTyping(typingId);
    appendMessage(
      "bot",
      "Sorry, I ran into an issue. Please try again or contact Mudit directly at muditmarkan@gmail.com"
    );
    console.error("Chatbot error:", err);
  } finally {
    isTyping = false;
    document.getElementById("chatbot-send").disabled = false;
    document.getElementById("chatbot-input").disabled = false;
    document.getElementById("chatbot-input").focus();
  }

  if (messageCount >= MAX_MESSAGES_PER_SESSION) {
    showLimitMessage();
  }
}

/* ── Call the Render proxy ── */
async function callProxy(userText) {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userText,
      history: conversationHistory.slice(-10), // send last 10 turns for context
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  return data.reply || "I couldn't generate a response. Please try again.";
}

/* ── UI helpers ── */
function appendMessage(role, text) {
  const messages = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = `chatbot-msg chatbot-msg--${role}`;

  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  div.innerHTML = `<div class="chatbot-bubble">${formatted}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById("chatbot-messages");
  const id = "typing-" + Date.now();
  const div = document.createElement("div");
  div.id = id;
  div.className = "chatbot-msg chatbot-msg--bot";
  div.innerHTML = `
    <div class="chatbot-bubble chatbot-typing">
      <span></span><span></span><span></span>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function showLimitMessage() {
  document.getElementById("chatbot-limit-msg").hidden = false;
  document.getElementById("chatbot-input-area").hidden = true;
}

/* ── Init ── */
document.addEventListener("DOMContentLoaded", buildChatUI);
