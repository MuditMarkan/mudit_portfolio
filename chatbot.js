/* ============================================================
   Portfolio AI Chatbot
   Powered by Groq / Gemini through Azure API
   ============================================================ */

// ── Azure API proxy URL ──
const PROXY_URL =
  "https://muditportfolio-hve9bah3apaybudg.eastus2-01.azurewebsites.net/api/chat";

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

/* ============================================================
   Build Chat UI
   ============================================================ */

function buildChatUI() {
  const toggleBtn = document.createElement("button");

  toggleBtn.id = "chatbot-toggle";
  toggleBtn.setAttribute(
    "aria-label",
    "Chat with Mudit's AI assistant"
  );

  toggleBtn.innerHTML = `
    <i class="ri-robot-2-line"></i>
  `;

  const panel = document.createElement("div");

  panel.id = "chatbot-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute(
    "aria-label",
    "Chat with Mudit's AI assistant"
  );

  panel.innerHTML = `
    <div id="chatbot-header">

      <div id="chatbot-header-left">

        <div id="chatbot-avatar">
          <i class="ri-robot-2-line"></i>
        </div>

        <div>
          <p id="chatbot-name">Ask about Mudit</p>

          <p id="chatbot-status">
            <span class="chatbot-dot"></span>
            AI-powered · Groq / Gemini
          </p>
        </div>

      </div>

      <button
        id="chatbot-close"
        aria-label="Close chat"
      >
        <i class="ri-close-line"></i>
      </button>

    </div>

    <div
      id="chatbot-messages"
      role="log"
      aria-live="polite"
    >

      <div class="chatbot-msg chatbot-msg--bot">

        <div class="chatbot-bubble">

          Hi! I'm Mudit's AI assistant.

          Ask me anything about his experience, skills,
          projects, or availability — I'm here to help
          recruiters get quick answers. 👋

        </div>

      </div>

      <div id="chatbot-starters">

        ${STARTER_QUESTIONS.map(
          (question) => `
            <button class="chatbot-starter-btn">
              ${escapeHTML(question)}
            </button>
          `
        ).join("")}

      </div>

    </div>

    <div id="chatbot-limit-msg" hidden>

      <i class="ri-information-line"></i>

      Session limit reached.

      Reach Mudit directly at
      <a href="mailto:muditmarkan@gmail.com">
        muditmarkan@gmail.com
      </a>

    </div>

    <div id="chatbot-input-area">

      <input
        type="text"
        id="chatbot-input"
        placeholder="Ask about skills, projects, availability..."
        maxlength="500"
        autocomplete="off"
        aria-label="Type your question"
      />

      <button
        id="chatbot-send"
        aria-label="Send message"
      >
        <i class="ri-send-plane-fill"></i>
      </button>

    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(panel);

  /* ── Event listeners ── */

  toggleBtn.addEventListener("click", toggleChat);

  document
    .getElementById("chatbot-close")
    .addEventListener("click", closeChat);

  document
    .getElementById("chatbot-send")
    .addEventListener("click", handleSend);

  document
    .getElementById("chatbot-input")
    .addEventListener("keydown", (event) => {

      if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        handleSend();

      }

    });

  /* ── Starter questions ── */

  panel
    .querySelectorAll(".chatbot-starter-btn")
    .forEach((button) => {

      button.addEventListener("click", () => {

        sendMessage(button.textContent.trim());

        const starters =
          document.getElementById("chatbot-starters");

        if (starters) {
          starters.remove();
        }

      });

    });
}

/* ============================================================
   Toggle / Open / Close
   ============================================================ */

function toggleChat() {

  if (isOpen) {
    closeChat();
  } else {
    openChat();
  }

}

function openChat() {

  isOpen = true;

  document
    .getElementById("chatbot-panel")
    .classList.add("chatbot-panel--open");

  document
    .getElementById("chatbot-toggle")
    .classList.add("chatbot-toggle--active");

  const input =
    document.getElementById("chatbot-input");

  if (input) {
    input.focus();
  }

}

function closeChat() {

  isOpen = false;

  document
    .getElementById("chatbot-panel")
    .classList.remove("chatbot-panel--open");

  document
    .getElementById("chatbot-toggle")
    .classList.remove("chatbot-toggle--active");

}

/* ============================================================
   Handle User Message
   ============================================================ */

function handleSend() {

  const input =
    document.getElementById("chatbot-input");

  const text = input.value.trim();

  if (!text || isTyping) {
    return;
  }

  input.value = "";

  const starters =
    document.getElementById("chatbot-starters");

  if (starters) {
    starters.remove();
  }

  sendMessage(text);

}

/* ============================================================
   Send Message
   ============================================================ */

async function sendMessage(userText) {

  if (messageCount >= MAX_MESSAGES_PER_SESSION) {

    showLimitMessage();

    return;
  }

  appendMessage("user", userText);

  messageCount++;

  const typingId = showTyping();

  isTyping = true;

  const sendButton =
    document.getElementById("chatbot-send");

  const input =
    document.getElementById("chatbot-input");

  sendButton.disabled = true;
  input.disabled = true;

  try {

    const response = await callProxy(userText);

    removeTyping(typingId);

    appendMessage("bot", response);

    /*
     * Store conversation context.
     *
     * Only the last few messages are sent to Azure.
     */
    conversationHistory.push(
      {
        role: "user",
        parts: [
          {
            text: userText,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: response,
          },
        ],
      }
    );

  } catch (error) {

    console.error("Chatbot error:", error);

    removeTyping(typingId);

    appendMessage(
      "bot",
      "The AI service is temporarily busy. Please wait a moment and try again, or contact Mudit directly at muditmarkan@gmail.com"
    );

  } finally {

    isTyping = false;

    sendButton.disabled = false;
    input.disabled = false;

    input.focus();

  }

  if (messageCount >= MAX_MESSAGES_PER_SESSION) {
    showLimitMessage();
  }

}

/* ============================================================
   Call Azure API
   ============================================================ */

async function callProxy(userText) {

  const response = await fetch(PROXY_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({

      message: userText,

      /*
       * Send only recent conversation history.
       * This keeps the request small.
       */
      history: conversationHistory.slice(-10),

    }),

  });

  if (!response.ok) {

    const errorData =
      await response.json().catch(() => ({}));

    throw new Error(
      errorData?.error ||
      `Server error ${response.status}`
    );

  }

  const data = await response.json();

  return (
    data.reply ||
    "I couldn't generate a response. Please try again."
  );

}

/* ============================================================
   Append Message
   ============================================================ */

function appendMessage(role, text) {

  const messages =
    document.getElementById("chatbot-messages");

  const div =
    document.createElement("div");

  div.className =
    `chatbot-msg chatbot-msg--${role}`;

  const bubble =
    document.createElement("div");

  bubble.className =
    "chatbot-bubble";

  /*
   * User messages are treated as plain text.
   *
   * AI messages get our safe formatting.
   */
  if (role === "user") {

    bubble.textContent = text;

  } else {

    bubble.innerHTML =
      formatAIResponse(text);

  }

  div.appendChild(bubble);

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;

}

/* ============================================================
   Format AI Response
   ============================================================ */

function formatAIResponse(text) {

  if (!text) {
    return "";
  }

  let html = escapeHTML(text);

  /*
   * Markdown links
   *
   * Example:
   * [GitHub](https://github.com/MuditMarkan)
   */
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  /*
   * Plain URLs
   *
   * Example:
   * https://github.com/MuditMarkan
   */
  html = html.replace(
    /(^|[\s>])(https?:\/\/[^\s<]+)/g,
    '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'
  );

  /*
   * Bold
   *
   * **important**
   */
  html = html.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  /*
   * Headings
   */
  html = html.replace(
    /^### (.+)$/gm,
    "<h4>$1</h4>"
  );

  html = html.replace(
    /^## (.+)$/gm,
    "<h3>$1</h3>"
  );

  html = html.replace(
    /^# (.+)$/gm,
    "<h3>$1</h3>"
  );

  /*
   * Bullet points
   */
  html = html.replace(
    /^[•*-]\s+(.+)$/gm,
    "<li>$1</li>"
  );

  /*
   * Group bullet points.
   */
  html = html.replace(
    /((?:<li>.*?<\/li>\s*)+)/gs,
    "<ul>$1</ul>"
  );

  /*
   * Numbered lists
   */
  html = html.replace(
    /^\d+\.\s+(.+)$/gm,
    "<li>$1</li>"
  );

  /*
   * Convert remaining line breaks.
   */
  html = html.replace(/\n/g, "<br>");

  /*
   * Clean up unnecessary <br> tags.
   */
  html = html
    .replace(
      /<br>\s*<ul>/g,
      "<ul>"
    )
    .replace(
      /<\/ul>\s*<br>/g,
      "</ul>"
    )
    .replace(
      /<br>\s*<h([34])>/g,
      "<h$1>"
    )
    .replace(
      /<\/h([34])>\s*<br>/g,
      "</h$1>"
    );

  return html;

}

/* ============================================================
   Escape HTML
   ============================================================ */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* ============================================================
   Typing Indicator
   ============================================================ */

function showTyping() {

  const messages =
    document.getElementById("chatbot-messages");

  const id =
    "typing-" + Date.now();

  const div =
    document.createElement("div");

  div.id = id;

  div.className =
    "chatbot-msg chatbot-msg--bot";

  div.innerHTML = `
    <div class="chatbot-bubble chatbot-typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;

  return id;

}

/* ============================================================
   Remove Typing Indicator
   ============================================================ */

function removeTyping(id) {

  const element =
    document.getElementById(id);

  if (element) {
    element.remove();
  }

}

/* ============================================================
   Session Limit
   ============================================================ */

function showLimitMessage() {

  const limitMessage =
    document.getElementById("chatbot-limit-msg");

  const inputArea =
    document.getElementById("chatbot-input-area");

  limitMessage.hidden = false;

  inputArea.hidden = true;

}

/* ============================================================
   Initialize
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  buildChatUI
);

Add this to the bottom of chatbot.css
/* ============================================================
   AI RESPONSE FORMATTING
   ============================================================ */

.chatbot-bubble a {
  color: #7dd3fc;
  text-decoration: underline;
  font-weight: 500;
  word-break: break-word;
}

.chatbot-bubble a:hover {
  color: #bae6fd;
}

.chatbot-bubble strong {
  font-weight: 700;
}

.chatbot-bubble h3,
.chatbot-bubble h4 {
  margin: 0 0 8px;
  line-height: 1.35;
}

.chatbot-bubble h3 {
  font-size: 1rem;
}

.chatbot-bubble h4 {
  font-size: 0.95rem;
}

.chatbot-bubble ul {
  margin: 8px 0;
  padding-left: 20px;
}

.chatbot-bubble li {
  margin: 5px 0;
  line-height: 1.45;
}

.chatbot-bubble p {
  margin: 0 0 8px;
}

.chatbot-bubble ul + br {
  display: none;
}

One change to your server prompt

In your server.js, inside SYSTEM_PROMPT, add this section near the beginning:

--- RESPONSE FORMAT ---
Format answers for a small website chat window.

Do NOT use Markdown tables.

Prefer:
- Short paragraphs
- Bullet points
- Numbered lists when useful
- **Bold** for important names, technologies, and companies
- Markdown links when a relevant URL is available

Keep responses concise and easy to scan.
Do not include unnecessary introductions or conclusions.


This is important because formatting the frontend alone isn't enough. We also want the AI to stop producing those large tables in the first place.

For example, instead of the table you received, the AI should naturally produce:

**Projects Mudit has built**

- **ClaimAssist AI** — AI-powered insurance claims assistant using LLM-backed logic and structured validation.
  [GitHub](https://github.com/MuditMarkan/claimassist-ai)

- **Budget Tracker Agent** — Agentic budget-tracking app built with TypeScript and Gemini AI.
  [GitHub](https://github.com/MuditMarkan/budget_tracker_agent)

- **CGC AI Project** — Python AI project from George Brown using real data and models.
  [GitHub](https://github.com/MuditMarkan/CGC_Project_AI)

- **Vosyn AI Platform** — Full-stack localization platform with an autonomous QA agent using LangGraph, LangChain, and PostgreSQL.
  [Visit vosyn.ai](https://vosyn.ai)

- **Emotion Bot Robot** — Physical robot that detects and responds to human emotions.
  [GitHub](https://github.com/Markanmudit/Emotion-Bot-Robot)

- **Local-first GenAI RAG System** — Fully local GenAI system using Python, Qwen, Ollama, LangChain, and LangGraph.


That will be much cleaner inside the chat window, especially on mobile.

After replacing chatbot.js and updating the CSS/prompt, commit and push:

git add chatbot.js chatbot.css api/server.js
git commit -m "improve chatbot response formatting"
git push origin master


Your Azure GitHub Actions deployment should then pick it up automatically.
