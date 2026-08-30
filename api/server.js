const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS: only allow requests from your GitHub Pages domain ──
const ALLOWED_ORIGINS = [
  "https://muditmarkan.github.io",
  "http://127.0.0.1:5500",  // VS Code Live Server (local dev)
  "http://localhost:5500",
  "null"                     // file:// opened locally in browser
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman) only in dev
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

// ── Main proxy endpoint ──
app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server." });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'message' field." });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: "Message too long. Max 500 characters." });
  }

  // ── System prompt — everything about Mudit ──
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
   Live: budget-tracker-agent.vercel.app
   Agentic budget tracking app deployed on Vercel. TypeScript, AI-driven logic.

3. CGC AI Project — github.com/MuditMarkan/CGC_Project_AI
   Large Python AI project (~18MB) from George Brown. Applied AI with real data and models.

4. Vosyn AI Platform — vosyn.ai
   Full-stack localization platform + autonomous QA agent (LangGraph + LangChain + PostgreSQL).

5. Emotion Bot Robot — github.com/Markanmudit/Emotion-Bot-Robot
   Physical robot that detects and responds to human emotions. Includes working demo videos.
   Robotics, embedded systems, emotion detection, hardware integration.

6. Local-first GenAI RAG System
   Fully local GenAI using Python + Qwen via Ollama. RAG with vector embeddings,
   LangChain + LangGraph multi-step workflows, hallucination safeguards.

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

  // Build Gemini request contents
  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT + "\n\nNow answer the recruiter's question below accurately and helpfully." }]
    },
    {
      role: "model",
      parts: [{ text: "Understood! I'm ready to answer questions about Mudit Markan. What would you like to know?" }]
    }
  ];

  // Append conversation history if provided
  if (Array.isArray(history)) {
    const safeHistory = history.slice(-10); // max last 10 turns
    contents.push(...safeHistory);
  }

  // Append current user message
  contents.push({ role: "user", parts: [{ text: message }] });

  const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  try {
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 512,
          topP: 0.8
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT",   threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH",  threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
      })
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      console.error("Gemini error:", errData);
      return res.status(502).json({ error: "Gemini API error: " + (errData?.error?.message || geminiRes.status) });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
    return res.json({ reply: text });

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy server error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Mudit AI proxy running on port ${PORT}`);
});
