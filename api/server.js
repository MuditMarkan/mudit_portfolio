const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS ──
const ALLOWED_ORIGINS = [
  "https://muditmarkan.github.io",
  "https://mudit-portfolio.onrender.com",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "null"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS: origin not allowed — " + origin));
    }
  }
}));

app.use(express.json({ limit: "20kb" }));

// ── Health check ──
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Mudit Portfolio AI Proxy" });
});

// ── System prompt ──
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
   - Reproducing defects, reviewing technical logs, and validating PostgreSQL database behaviour.
   - Testing fixes end-to-end and documenting findings shared directly with developers.
   - Contributing to the Vosyn Careers dashboard — full-stack development, database work, and testing.
   Skills: LangGraph, LangChain, Python, PostgreSQL, AI Agents, QA Automation

2. Software Developer & Team Lead | Vosyn Inc. | Feb 2025 – Jul 2026 | Mississauga, ON | Remote
   - Led a cross-functional team of 20+ developers across 4 concurrent product streams.
   - Built responsive UI components using React.js, Next.js, and MUI.
   - Reviewed 30+ pull requests per sprint — 25% increase in team velocity, 20% reduction in bugs.
   - Integrated REST APIs across microservices architecture.
   - Delivered 520+ verified hours across 4 product streams.
   Skills: React.js, Next.js, TypeScript, JavaScript, REST APIs, Redux, MUI, Agile, Git

3. Student Ambassador | George Brown Polytechnic | Aug 2025 – Jul 2026 | Toronto, ON | On-site
   - Primary point of contact for 200+ students daily.
   - Documented 15+ usability and AODA accessibility bugs on the GBP website.

4. Database Engineer (Intern) | Trisha Management Services | Sep 2022 – Mar 2023 | Delhi, India | Remote

5. Technical Department Specialist (Intern) | Techmihir Naik Group | Jul 2021 – Oct 2021 | Delhi, India
   - Led onboarding and delivery for 25+ interns across 2 full-stack web projects.

--- TECHNICAL SKILLS ---
AI & ML: LangChain, LangGraph, RAG, Vector Embeddings, Prompt Engineering, Ollama (Qwen),
         Agentic AI Workflows, Hallucination Mitigation, AI QA Agent Development, Generative AI
Languages: Python, TypeScript, JavaScript, Java, C#, SQL
Frontend: React.js, Next.js, MUI, HTML5, CSS3, Redux
Backend: Node.js, REST APIs, Express.js
Databases: PostgreSQL, SQL, Vector Databases
Tools: Git, GitHub, Docker, Vercel, Jira, Linux, Notion

--- PROJECTS ---
1. ClaimAssist AI — github.com/MuditMarkan/claimassist-ai
   AI-powered insurance claims assistant. Python, LLM-backed logic, structured validation.

2. Budget Tracker Agent — github.com/MuditMarkan/budget_tracker_agent
   Agentic budget tracking app. TypeScript, Gemini AI-driven logic.

3. CGC AI Project — github.com/MuditMarkan/CGC_Project_AI
   Large Python AI project (~18MB) from George Brown. Applied AI with real data and models.

4. Vosyn AI Platform — vosyn.ai
   Full-stack localization platform + autonomous QA agent (LangGraph + LangChain + PostgreSQL).

5. Emotion Bot Robot — github.com/Markanmudit/Emotion-Bot-Robot
   Physical robot that detects and responds to human emotions. Includes working demo videos.

6. Local-first GenAI RAG System
   Fully local GenAI using Python + Qwen via Ollama. RAG, LangChain + LangGraph workflows.

--- EDUCATION ---
1. Postgraduate Diploma — Computer Programming | George Brown Polytechnic | Sep 2024 – May 2026 | GPA: 3.68/4.0
2. Postgraduate Diploma — Computer Programming | Collège LaSalle, Montréal | Jan 2024 – Sep 2024
3. Bachelor of Computer Applications (BCA) | Tecnia Institute, New Delhi | Aug 2019 – Jul 2022

--- CERTIFICATIONS ---
Cybersecurity at Work — LinkedIn Learning (Dec 2025)

--- AVAILABILITY ---
Currently employed at Vosyn Inc. Open to new opportunities immediately.
Open to: On-site (Toronto/Mississauga/Montreal), Hybrid, Remote across Canada.
Work authorization: Eligible to work in Canada.`;

// ── Call Groq (primary) ──
async function callGroq(messages, groqKey) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqKey}`
    },
    body: JSON.stringify({
      model: "qwen/qwen3.6-27b",
      messages,
      max_tokens: 1024,
      temperature: 0.4
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, message: err?.error?.message || res.status };
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

// ── Call Gemini (fallback) ──
async function callGemini(messages, geminiKey) {
  // Convert OpenAI-style messages to Gemini format
  const systemMsg = messages.find(m => m.role === "system")?.content || "";
  const chatMsgs  = messages.filter(m => m.role !== "system");

  const contents = [
    { role: "user",  parts: [{ text: systemMsg + "\n\nNow answer the recruiter's question below accurately and helpfully." }] },
    { role: "model", parts: [{ text: "Understood! I'm ready to answer questions about Mudit Markan." }] },
    ...chatMsgs.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }))
  ];

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024, topP: 0.8 }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, message: err?.error?.message || res.status };
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// ── Main chat endpoint ──
app.post("/api/chat", async (req, res) => {
  const groqKey   = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!groqKey && !geminiKey) {
    return res.status(500).json({ error: "No API keys configured on server." });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'message' field." });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: "Message too long. Max 500 characters." });
  }

  // Build OpenAI-format messages (works for both Groq and Gemini converter)
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];

  if (Array.isArray(history)) {
    history.slice(-10).forEach(turn => {
      const content = turn.parts?.[0]?.text || turn.content || "";
      if (turn.role === "user")  messages.push({ role: "user",      content });
      if (turn.role === "model") messages.push({ role: "assistant", content });
    });
  }

  messages.push({ role: "user", content: message });

  // ── Try Groq first, fallback to Gemini ──
  let text = null;
  let usedProvider = "";

  // 1. Try Groq (up to 2 attempts)
  if (groqKey) {
    for (let i = 1; i <= 2; i++) {
      try {
        text = await callGroq(messages, groqKey);
        usedProvider = "groq";
        break;
      } catch (err) {
        console.warn(`Groq attempt ${i} failed (${err.status}): ${err.message}`);
        if (i < 2 && (err.status === 503 || err.status === 429)) {
          await new Promise(r => setTimeout(r, i * 1000));
        }
      }
    }
  }

  // 2. Fallback to Gemini if Groq failed
  if (!text && geminiKey) {
    for (let i = 1; i <= 2; i++) {
      try {
        text = await callGemini(messages, geminiKey);
        usedProvider = "gemini";
        break;
      } catch (err) {
        console.warn(`Gemini attempt ${i} failed (${err.status}): ${err.message}`);
        if (i < 2 && (err.status === 503 || err.status === 429)) {
          await new Promise(r => setTimeout(r, i * 1000));
        }
      }
    }
  }

  if (!text) {
    return res.status(500).json({ error: "Service temporarily busy. Please try again in a moment." });
  }

  console.log(`Responded via ${usedProvider}`);
  return res.json({ reply: text });
});

app.listen(PORT, () => {
  console.log(`Mudit AI proxy running on port ${PORT}`);
});
