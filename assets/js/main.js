/**
 * Aditya Thete - AI Engineer Portfolio Main Application
 * Renders dynamic sections from DataManager, handles AI assistant chat, animations, and project filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load data from DataManager
  const data = window.DataManager ? window.DataManager.getData() : window.DEFAULT_PORTFOLIO_DATA;

  // Initialize all components
  initHero(data.profile);
  initStats(data.profile);
  initSkills(data.skillCategories);
  initProjects(data.projects);
  initExperience(data.experience);
  initEducationAndCerts(data.education, data.certifications);
  initContact(data.profile);
  initAiAssistant(data);
  initNeuralCanvas();
  initMobileMenu();

  // Re-run lucide icons if library loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* ---------------------------------------------------------
   1. HERO SECTION
--------------------------------------------------------- */
function initHero(profile) {
  const nameEl = document.getElementById('hero-name');
  const badgeEl = document.getElementById('hero-badge');
  const summaryEl = document.getElementById('hero-summary');
  const emailLink = document.getElementById('hero-email-btn');
  const githubLink = document.getElementById('hero-github-btn');
  const linkedinLink = document.getElementById('hero-linkedin-btn');
  const contactEmail = document.getElementById('contact-direct-email');
  const contactPhone = document.getElementById('contact-direct-phone');
  const contactLocation = document.getElementById('contact-direct-location');

  if (nameEl) nameEl.textContent = profile.name;
  if (badgeEl) badgeEl.textContent = profile.badge || "Open to GenAI & Agentic AI Roles";
  if (summaryEl) summaryEl.textContent = profile.summary;
  
  if (emailLink) emailLink.href = `mailto:${profile.email}`;
  if (githubLink) githubLink.href = profile.github || "https://github.com/adityathete";
  if (linkedinLink) linkedinLink.href = profile.linkedin || "https://linkedin.com/in/aditya-thete";
  
  if (contactEmail) {
    contactEmail.textContent = profile.email;
    contactEmail.href = `mailto:${profile.email}`;
  }
  if (contactPhone) {
    contactPhone.textContent = profile.phone;
    contactPhone.href = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`;
  }
  if (contactLocation) contactLocation.textContent = profile.location;

  // Typing effect for AI roles
  const typingEl = document.getElementById('hero-typing');
  if (typingEl) {
    const roles = [
      "Generative AI Engineer",
      "Production RAG Architect",
      "Agentic Systems Specialist",
      "LangChain & LangGraph Engineer",
      "LLM & MLOps Practitioner"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }
}

/* ---------------------------------------------------------
   2. STATS BAR
--------------------------------------------------------- */
function initStats(profile) {
  const statExp = document.getElementById('stat-exp');
  const statAccuracy = document.getElementById('stat-accuracy');
  const statProjects = document.getElementById('stat-projects');
  const statRecords = document.getElementById('stat-records');

  if (statExp) statExp.textContent = profile.yearsExperience || "3+";
  if (statAccuracy) statAccuracy.textContent = profile.modelAccuracy || "92%";
  if (statProjects) statProjects.textContent = profile.projectsCompleted || "10+";
  if (statRecords) statRecords.textContent = profile.recordsProcessed || "10k+";
}

/* ---------------------------------------------------------
   3. SKILLS SECTION
--------------------------------------------------------- */
function initSkills(categories) {
  const container = document.getElementById('skills-container');
  if (!container) return;

  container.innerHTML = categories.map((cat, idx) => `
    <div class="glass-panel p-6 rounded-xl hover:border-emerald-500/40 transition-all duration-300">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <i data-lucide="${getCategoryIcon(cat.icon || cat.name)}" class="w-5 h-5"></i>
        </div>
        <h3 class="text-lg font-semibold text-white">${cat.name}</h3>
      </div>
      <div class="flex flex-wrap gap-2">
        ${cat.skills.map(skill => `
          <span class="tech-tag">${skill}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function getCategoryIcon(name) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('gen') || lower.includes('agent') || lower.includes('bot')) return 'bot';
  if (lower.includes('llm') || lower.includes('model') || lower.includes('cpu')) return 'cpu';
  if (lower.includes('vector') || lower.includes('data') || lower.includes('embed')) return 'database';
  if (lower.includes('nlp') || lower.includes('search')) return 'search';
  if (lower.includes('deep') || lower.includes('learn') || lower.includes('layer')) return 'layers';
  if (lower.includes('cloud') || lower.includes('mlops') || lower.includes('tool')) return 'cloud';
  return 'code';
}

/* ---------------------------------------------------------
   4. PROJECTS SECTION & FILTERING
--------------------------------------------------------- */
let allProjects = [];

function initProjects(projects) {
  allProjects = projects || [];
  renderProjects(allProjects);

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-emerald-500', 'text-black', 'border-emerald-400'));
      filterBtns.forEach(b => b.classList.add('bg-gray-800/80', 'text-gray-300', 'border-gray-700'));
      btn.classList.remove('bg-gray-800/80', 'text-gray-300', 'border-gray-700');
      btn.classList.add('bg-emerald-500', 'text-black', 'font-semibold', 'border-emerald-400');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderProjects(allProjects);
      } else {
        const filtered = allProjects.filter(p => (p.category || '').toLowerCase().includes(filter.toLowerCase()));
        renderProjects(filtered);
      }
    });
  });
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 text-gray-400">
        <i data-lucide="folder-open" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
        <p>No projects found in this category.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  grid.innerHTML = projects.map((p, index) => `
    <div class="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between group border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
      <div class="p-6 md:p-8">
        <!-- Top meta bar -->
        <div class="flex items-center justify-between gap-2 mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ${p.category || 'AI Project'}
          </span>
          ${p.metrics ? `
            <span class="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold">
              ${p.metrics}
            </span>
          ` : ''}
        </div>

        <!-- Title & Tagline -->
        <h3 class="text-xl md:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
          ${p.title}
        </h3>
        ${p.tagline ? `
          <p class="text-sm font-medium text-emerald-300/80 mb-4">${p.tagline}</p>
        ` : ''}

        <p class="text-gray-400 text-sm leading-relaxed mb-5">
          ${p.description || ''}
        </p>

        <!-- Bullet Highlights -->
        ${p.highlights && p.highlights.length ? `
          <div class="space-y-2 mb-6">
            ${p.highlights.map(h => `
              <div class="flex items-start gap-2.5 text-xs text-gray-300">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5"></i>
                <span>${h}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Tech tags -->
        <div class="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
          ${(p.tags || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <!-- Footer Action Links -->
      <div class="px-6 py-4 bg-gray-900/60 border-t border-white/5 flex items-center justify-between">
        <a href="${p.github || 'https://github.com/adityathete'}" target="_blank" rel="noopener noreferrer" 
           class="inline-flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-emerald-400 transition-colors">
          <i data-lucide="github" class="w-4 h-4"></i>
          <span>View Source</span>
        </a>
        <a href="${p.demo || p.github || 'https://github.com/adityathete'}" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
          <span>Project Details</span>
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
        </a>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

/* ---------------------------------------------------------
   5. WORK EXPERIENCE TIMELINE
--------------------------------------------------------- */
function initExperience(experiences) {
  const container = document.getElementById('experience-timeline');
  if (!container) return;

  container.innerHTML = experiences.map((exp, idx) => `
    <div class="relative pl-8 md:pl-10 pb-12 last:pb-2 group">
      <!-- Bullet node -->
      <div class="timeline-dot top-1.5 group-hover:scale-125 transition-transform duration-300"></div>

      <!-- Experience Card -->
      <div class="glass-panel p-6 md:p-8 rounded-2xl hover:border-emerald-500/40 transition-all">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <h3 class="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              ${exp.role}
            </h3>
            <div class="text-emerald-400 font-medium text-sm flex items-center gap-2 mt-0.5">
              <i data-lucide="building" class="w-4 h-4"></i>
              <span>${exp.company}</span>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700/60 text-xs font-mono text-cyan-300 self-start md:self-auto">
            <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
            <span>${exp.period}</span>
          </div>
        </div>

        <!-- Bullets -->
        <ul class="space-y-2.5 my-4 text-sm text-gray-300 leading-relaxed">
          ${(exp.bullets || []).map(b => `
            <li class="flex items-start gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2"></span>
              <span>${b}</span>
            </li>
          `).join('')}
        </ul>

        <!-- Tags -->
        ${exp.tags && exp.tags.length ? `
          <div class="flex flex-wrap gap-2 pt-3 border-t border-white/5">
            ${exp.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

/* ---------------------------------------------------------
   6. EDUCATION & CERTIFICATIONS
--------------------------------------------------------- */
function initEducationAndCerts(education, certifications) {
  const eduContainer = document.getElementById('education-list');
  const certContainer = document.getElementById('certs-grid');

  if (eduContainer && education) {
    eduContainer.innerHTML = education.map(e => `
      <div class="glass-panel p-6 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-all">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="text-base font-bold text-white">${e.degree}</h4>
            <p class="text-sm text-cyan-400 font-medium">${e.institution}</p>
          </div>
          <span class="text-xs font-mono px-2.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
            ${e.year}
          </span>
        </div>
        ${e.details ? `<p class="text-xs text-gray-400 mt-2 leading-relaxed">${e.details}</p>` : ''}
      </div>
    `).join('');
  }

  if (certContainer && certifications) {
    certContainer.innerHTML = certifications.map(c => `
      <div class="glass-panel p-5 rounded-xl border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <i data-lucide="award" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white leading-tight">${c.title}</h4>
            <p class="text-xs text-gray-400 mt-0.5">${c.issuer}</p>
          </div>
        </div>
        ${c.badge ? `
          <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
            ${c.badge}
          </span>
        ` : ''}
      </div>
    `).join('');
  }
}

/* ---------------------------------------------------------
   7. CONTACT SECTION & INTERACTIVE SUBMISSION
--------------------------------------------------------- */
function initContact(profile) {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value || "Portfolio Inquiry";
    const message = document.getElementById('form-message').value;

    // Visual confirmation
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 mr-2"></i> Message Sent!`;
    btn.classList.add('bg-emerald-600');
    if (window.lucide) window.lucide.createIcons();

    // Show toast
    showToast(`Thank you ${name}! Opening your email client to reach ${profile.email}`);

    // Trigger mailto fallback after short delay
    setTimeout(() => {
      const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Aditya,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
      window.location.href = mailtoUrl;
      btn.innerHTML = originalText;
      btn.classList.remove('bg-emerald-600');
      form.reset();
      if (window.lucide) window.lucide.createIcons();
    }, 1200);
  });
}

/* ---------------------------------------------------------
   8. AI ASSISTANT SIMULATOR ("Ask AI About Aditya")
--------------------------------------------------------- */
function initAiAssistant(data) {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const quickChips = document.querySelectorAll('.chat-chip');

  if (!chatMessages || !chatForm || !chatInput) return;

  // Preset question chips
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      chatInput.value = q;
      handleUserQuery(q);
    });
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    chatInput.value = '';
    handleUserQuery(query);
  });

  function handleUserQuery(userText) {
    // Append user message
    appendMessage('user', userText);

    // Show thinking indicator
    const thinkingId = 'thinking-' + Date.now();
    appendThinking(thinkingId);

    // Generate response using resume knowledge base
    setTimeout(() => {
      removeThinking(thinkingId);
      const answer = generateAiResponse(userText, data);
      appendMessage('ai', answer);
    }, 700);
  }

  function appendMessage(role, text) {
    const isUser = role === 'user';
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`;
    
    msgDiv.innerHTML = `
      ${!isUser ? `
        <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <i data-lucide="bot" class="w-4 h-4"></i>
        </div>
      ` : ''}
      <div class="max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
        isUser 
          ? 'bg-emerald-500 text-gray-950 font-medium rounded-tr-none' 
          : 'bg-gray-800/90 text-gray-200 border border-white/10 rounded-tl-none shadow-lg'
      }">
        ${text}
      </div>
      ${isUser ? `
        <div class="w-8 h-8 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center text-white flex-shrink-0">
          <i data-lucide="user" class="w-4 h-4"></i>
        </div>
      ` : ''}
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  function appendThinking(id) {
    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex gap-3 justify-start items-center text-gray-400 text-xs italic py-1';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
        <i data-lucide="loader" class="w-4 h-4 animate-spin"></i>
      </div>
      <span>Querying Aditya's Vector Knowledge Base...</span>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  function removeThinking(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function generateAiResponse(query, data) {
    const q = query.toLowerCase();
    const p = data.profile;

    if (q.includes('rag') || q.includes('retrieval') || q.includes('medical') || q.includes('chromadb')) {
      return `Aditya is a specialist in <strong>Production RAG Architectures</strong>. In his Medical Question Answering project, he built an end-to-end RAG system using <strong>LangChain, ChromaDB, OpenAI text-embedding-ada-002, and GPT-4o</strong> with a FastAPI REST endpoint. He achieved a <strong>92% Faithfulness score on RAGAS</strong> evaluation benchmarks by engineering custom semantic chunking, prompt optimization, and Top-K vector retrieval!`;
    }

    if (q.includes('agent') || q.includes('langgraph') || q.includes('crewai') || q.includes('mcp')) {
      return `Aditya designs autonomous agentic workflows and multi-agent systems using <strong>LangGraph, LangChain, and CrewAI</strong>. At Techknomatic Pvt Ltd, he builds enterprise agentic workflows with tool use (function calling) and Model Context Protocol (MCP) integrations for automated decision-making and business pipelines.`;
    }

    if (q.includes('experience') || q.includes('company') || q.includes('work') || q.includes('years')) {
      return `Aditya has <strong>3+ years of professional experience</strong> across AI consulting and engineering:
      <br>• <strong>Generative AI Consultant</strong> at Techknomatic Pvt Ltd (Jun 2025–Present)
      <br>• <strong>Generative AI Engineer (Associate)</strong> at Restaverse Pvt Ltd (Mar 2025–May 2025)
      <br>• <strong>Junior ML Engineer</strong> at Loopway Pvt Ltd (Jan 2023–Feb 2025)
      <br>• <strong>Data Science Associate</strong> at The Math Company (May 2022–Jan 2023)`;
    }

    if (q.includes('project') || q.includes('portfolio') || q.includes('built')) {
      return `Key projects highlighted in his portfolio:
      <br>1. <strong>Production RAG Medical Chatbot</strong> (LangChain, ChromaDB, GPT-4o, 92% RAGAS score)
      <br>2. <strong>E-Commerce Complaint Classifier & Auto-Router</strong> (TensorFlow LSTM, 90%+ accuracy across 6 categories)
      <br>3. <strong>Employee Churn Prediction & Retention Analytics</strong> (Scikit-learn, XGBoost, 90%+ ROC-AUC)`;
    }

    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('python')) {
      return `Aditya's technical core includes:
      <br>• <strong>GenAI & Agents:</strong> LangChain, LangGraph, CrewAI, MCP, RAG, Prompt Engineering, Fine-Tuning
      <br>• <strong>LLMs:</strong> GPT-4o, Claude 3.5 Sonnet, Llama 3, Gemma 2, Mistral Large
      <br>• <strong>Vector DBs:</strong> ChromaDB, FAISS, Pinecone, AWS OpenSearch
      <br>• <strong>ML & MLOps:</strong> PyTorch, TensorFlow, Scikit-learn, MLflow, Docker, FastAPI, AWS & Azure`;
    }

    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach')) {
      return `You can reach Aditya directly via:
      <br>📧 Email: <a href="mailto:${p.email}" class="text-emerald-400 underline font-semibold">${p.email}</a>
      <br>📱 Phone: <a href="tel:${p.phone}" class="text-cyan-400 underline">${p.phone}</a>
      <br>🔗 LinkedIn: <a href="${p.linkedin}" target="_blank" class="text-emerald-400 underline">linkedin.com/in/aditya-thete</a>
      <br>💻 GitHub: <a href="${p.github}" target="_blank" class="text-cyan-400 underline">github.com/adityathete</a>
      <br>📍 Location: ${p.location}`;
    }

    if (q.includes('education') || q.includes('degree') || q.includes('college') || q.includes('mba')) {
      return `Aditya holds:
      <br>• <strong>MBA in Business Analytics (2023)</strong> from University of Pune
      <br>• <strong>Bachelor of Engineering (2016)</strong> from University of Pune
      <br>Plus certifications from <strong>DeepLearning.AI</strong>, <strong>Anthropic (Claude Platform 101 & Claude Cowork)</strong>, and <strong>Udemy</strong>!`;
    }

    return `Thanks for your interest! Aditya is a <strong>Machine Learning & Generative AI Engineer</strong> with 3+ years specializing in RAG architectures, Agentic workflows (LangGraph/LangChain), and ML systems. Feel free to ask about his projects, skills, tech stack, or drop an email to <strong>${p.email}</strong>!`;
  }
}

/* ---------------------------------------------------------
   9. NEURAL CANVAS PARTICLE BACKGROUND
--------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------------------------------------------------------
   10. MOBILE MENU TOGGLE
--------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    const links = mobileNav.querySelectorAll('a');
    links.forEach(l => {
      l.addEventListener('click', () => mobileNav.classList.add('hidden'));
    });
  }
}

/* ---------------------------------------------------------
   11. TOAST NOTIFICATIONS
--------------------------------------------------------- */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i> <span>${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

window.showToast = showToast;
