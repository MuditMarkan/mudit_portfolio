/* ============================================================
   Portfolio AI Chatbot — Powered by Google Gemini
   API key is loaded from config.js (not committed to GitHub)
   ============================================================ */

// GEMINI_API_KEY is defined in config.js (loaded before this script in index.html)
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent?key=" +
  GEMINI_API_KEY;

const MAX_MESSAGES_PER_SESSION = 10;

/* ── System prompt: everything about Mudit ── */
const SYSTEM_PROMPT = `You are an AI assistant representing Mudit Markan on his personal portfolio website.
Your job is to answer questions from recruiters, hiring managers, and visitors about Mudit — his skills,
experience, projects, education, and availability. Be professional, friendly, concise, and accurate.
Only answer based on the information below. If asked something you don't know, say:
"I don't have that detail, but you can reach Mudit directly at muditmarkan@gmail.com or on LinkedIn at linkedin.com/in/muditmarkan."

Never make up information. Never answer questions unrelated to Mudit or hiring topics.
If someone asks something inappropriate, politely redirect them.

--- ABOUT MUDIT ---
Full Name: Mudit Markan
Pronouns: He/Him
Location: Canada (Ontario / Quebec) — open to on-site, hybrid, and fully remote roles across Canada
Email: muditmarkan@gmail.com
Phone: (437) 955-5045
LinkedIn: linkedin.com/in/muditmarkan
GitHub: github.com/MuditMarkan (main) and github.com/Markanmudit (secondary)
Portfolio: This website

--- CAREER OBJECTIVE ---
Mudit is actively looking for roles in:
- AI Developer
- Generative AI Developer
- Agentic AI Developer
- AI Engineer
- Machine Learning Engineer
- Full-Stack AI Application Developer
He is open to positions in Ontario, Quebec, or fully remote across Canada.

--- PROFESSIONAL SUMMARY ---
Mudit is an AI and software developer with hands-on experience building Generative AI systems,
agentic workflows, RAG pipelines, and full-stack web applications. He currently works at Vosyn Inc.
as a Software Developer – AI & Automation, where he is building an AI-powered QA agent using
LangGraph and LangChain. He also has strong full-stack experience with React, Next.js, TypeScript,
and REST APIs from his previous role as a Software Team Lead at Vosyn.

--- WORK EXPERIENCE ---

1. Software Developer – AI & Automation | Vosyn Inc. | Jul 2026 – Present | Mississauga, ON | Hybrid
   - Building an AI-powered QA agent using LangGraph and LangChain that autonomously identifies
     potential bugs, improves issue analysis, and generates structured test reports.
   - Reproducing defects, reviewing technical logs, and validating PostgreSQL database behaviour
     to support root-cause analysis.
   - Testing fixes end-to-end and documenting findings shared directly with developers.
   - Contributing to the Vosyn Careers dashboard — full-stack development, database work, and testing.
   Skills: LangGraph, LangChain, Python, PostgreSQL, AI Agents, QA Automation

2. Software Developer & Team Lead | Vosyn Inc. | Feb 2025 – Jul 2026 | Mississauga, ON | Remote
   - Led a cross-functional team of 20+ developers across 4 concurrent product streams.
   - Daily standups, sprint planning, code reviews in a fully remote Agile environment.
   - Built responsive UI components using React.js, Next.js, and MUI for video, audio, and
     transcript localization features.
   - Reviewed 30+ pull requests per sprint — drove 25% increase in team velocity and 20%
     reduction in production bugs.
   - Integrated REST APIs with backend and data engineering services across microservices.
   - Delivered 520+ verified hours across 4 product streams, confirmed by Vosyn leadership.
   Skills: React.js, Next.js, TypeScript, JavaScript, REST APIs, Redux, MUI, Agile, Git

3. Student Ambassador | George Brown Polytechnic | Aug 2025 – Jul 2026 | Toronto, ON | On-site
   - Primary point of contact for 200+ students daily.
   - Audited the GBP website and documented 15+ usability and AODA accessibility bugs.

4. Educational Consultant | YES Germany | Dec 2022 – Dec 2023 | India | On-site

5. Database Engineer (Intern) | Trisha Management Services | Sep 2022 – Mar 2023 | Delhi, India | Remote

6. Technical Department Specialist (Intern) | Techmihir Naik Group | Jul 2021 – Oct 2021 | Delhi, India | Remote
   - Assisted in software development, writing, testing, and debugging code.
   - Led onboarding and delivery for 25+ interns across 2 full-stack web projects.

--- TECHNICAL SKILLS ---

AI & Machine Learning:
  LangChain, LangGraph, Retrieval-Augmented Generation (RAG), Vector Embeddings, Prompt Engineering,
  Ollama (Qwen), Agentic AI Workflows, Multi-step Reasoning, Hallucination Mitigation,
  Structured Output Validation, AI QA Agent Development, Generative AI

Programming Languages:
  Python, TypeScript, JavaScript, Java, C#, SQL

Frontend:
  React.js, Next.js, MUI (Material UI), HTML5, CSS3, Redux

Backend & APIs:
  Node.js, REST APIs, Express.js, Microservices Architecture

Databases:
  PostgreSQL, SQL, Vector Databases (for RAG)

DevOps & Tools:
  Git, GitHub, Docker, Vercel, Jira, Linux, Notion, VS Code

Testing & QA:
  AI-powered QA agent development, Bug reproduction, Log analysis,
  Test case design, Fix validation, Structured reporting, AODA accessibility auditing

--- PROJECTS ---

1. ClaimAssist AI (github.com/MuditMarkan/claimassist-ai)
   - AI-powered insurance claims assistant built with Python.
   - Uses LLM-backed logic with structured validation and intelligent triage.
   - Most recently updated AI project.
   Stack: Python, GenAI, LLM, Automation

2. Budget Tracker Agent (github.com/MuditMarkan/budget_tracker_agent)
   Live demo: budget-tracker-agent.vercel.app
   - Agentic budget tracking application deployed on Vercel.
   - Uses AI-driven logic to categorize, track, and analyze financial data.
   Stack: TypeScript, AI Agent, Vercel, Full-Stack

3. CGC AI Project — George Brown (github.com/MuditMarkan/CGC_Project_AI)
   - Substantial Python AI project built as part of George Brown's Computer Programming program.
   - Largest repo by size (~18MB), demonstrating applied AI development with real data and models.
   Stack: Python, AI/ML, Applied AI

4. Vosyn AI Platform — Full-Stack & QA Agent (vosyn.ai)
   - As Software Team Lead: built React/Next.js localization features across 4 product streams.
   - As AI & Automation Developer: building an autonomous QA agent (LangGraph + LangChain)
     that identifies bugs, coordinates multi-step test analysis, validates PostgreSQL data,
     and generates structured reports.
   Stack: LangGraph, LangChain, Python, React.js, Next.js, PostgreSQL, AI Agents

5. Emotion Bot Robot (github.com/Markanmudit/Emotion-Bot-Robot)
   - Built a real physical robot that detects and responds to human emotions.
   - GitHub repo includes multiple working demo videos.
   - Combines hardware integration, sensor input, programming logic, and embedded systems.
   Stack: Robotics, Embedded Systems, Emotion Detection, AI, Hardware

6. Local-first GenAI RAG System (private / described on LinkedIn)
   - Fully local GenAI system using Python and Qwen via Ollama.
   - Implemented RAG with vector embeddings for context retrieval.
   - LangChain + LangGraph for multi-step agentic workflows.
   - Structured output validation, evidence checks, rule-based hallucination safeguards.
   Stack: Python, LangChain, LangGraph, RAG, Ollama, Qwen

--- EDUCATION ---

1. Postgraduate Diploma — Computer Programming
   George Brown Polytechnic, Toronto, ON | Sep 2024 – May 2026
   GPA: 3.68 / 4.0
   Relevant: Agile Software Development, Database Management, Software QA, Full-Stack Development

2. Postgraduate Diploma — Computer Programming
   Collège LaSalle, Montréal | Jan 2024 – Sep 2024
   Relevant: C#, Computer Architecture, Object-Oriented Programming

3. Bachelor of Computer Applications (BCA)
   Tecnia Institute of Advanced Studies, New Delhi, India | Aug 2019 – Jul 2022

--- CERTIFICATIONS ---
- Cybersecurity at Work — LinkedIn Learning (Dec 2025)

--- TOP LINKEDIN SKILLS ---
Generative AI for Web Developers, Retrieval-Augmented Generation (RAG),
AI Agents, LangChain, LangGraph, PostgreSQL, Python, TypeScript, React.js

--- AVAILABILITY ---
- Currently employed at Vosyn Inc. (open to new opportunities)
- Available for interviews immediately
- Open to: On-site (Toronto/Mississauga/Montreal), Hybrid, Remote across Canada
- Work authorization: Eligible to work in Canada

--- LETTERS OF RECOMMENDATION ---
1. Prof. Harshvir Singh Gurm, George Brown College — praised Mudit's academic excellence
   (full marks in all labs), deep understanding of material, communication skills, and leadership.
2. Adeel Khan, Vosyn Inc. — confirmed 520+ hours of strong full-stack development work
   using React.js, MUI, Redux, and collaboration with backend/cloud engineering teams.
`;

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
  // Floating toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "chatbot-toggle";
  toggleBtn.setAttribute("aria-label", "Chat with Mudit's AI assistant");
  toggleBtn.innerHTML = `<i class="ri-robot-2-line"></i>`;

  // Main chat panel
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

  // Wire up events
  toggleBtn.addEventListener("click", toggleChat);
  document.getElementById("chatbot-close").addEventListener("click", closeChat);
  document.getElementById("chatbot-send").addEventListener("click", handleSend);
  document.getElementById("chatbot-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Starter question buttons
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

  // Remove starters if still showing
  const starters = document.getElementById("chatbot-starters");
  if (starters) starters.remove();

  sendMessage(text);
}

/* ── Core send + API call ── */
async function sendMessage(userText) {
  if (messageCount >= MAX_MESSAGES_PER_SESSION) {
    showLimitMessage();
    return;
  }

  // Show user message
  appendMessage("user", userText);
  messageCount++;

  // Show typing indicator
  const typingId = showTyping();
  isTyping = true;
  document.getElementById("chatbot-send").disabled = true;
  document.getElementById("chatbot-input").disabled = true;

  // Add to history
  conversationHistory.push({ role: "user", parts: [{ text: userText }] });

  try {
    const response = await callGemini(userText);
    removeTyping(typingId);
    appendMessage("bot", response);
    conversationHistory.push({ role: "model", parts: [{ text: response }] });
  } catch (err) {
    removeTyping(typingId);
    appendMessage(
      "bot",
      "Sorry, I ran into an issue. Please try again or contact Mudit directly at muditmarkan@gmail.com"
    );
    console.error("Gemini API error:", err);
  } finally {
    isTyping = false;
    document.getElementById("chatbot-send").disabled = false;
    document.getElementById("chatbot-input").disabled = false;
    document.getElementById("chatbot-input").focus();
  }

  // Show limit warning when getting close
  if (messageCount >= MAX_MESSAGES_PER_SESSION) {
    showLimitMessage();
  }
}

/* ── Call Gemini API ── */
async function callGemini(userText) {
  // Build contents array: system context as first user turn, then history
  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT + "\n\nNow answer the recruiter's question below accurately and helpfully." }],
    },
    {
      role: "model",
      parts: [{ text: "Understood! I'm ready to answer questions about Mudit Markan. What would you like to know?" }],
    },
    ...conversationHistory,
  ];

  const body = {
    contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 512,
      topP: 0.8,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  const res = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I couldn't generate a response. Please try again.";
  return text;
}

/* ── UI helpers ── */
function appendMessage(role, text) {
  const messages = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = `chatbot-msg chatbot-msg--${role}`;

  // Convert markdown-style **bold** and line breaks for display
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

/* ── Init on DOM ready ── */
document.addEventListener("DOMContentLoaded", buildChatUI);
