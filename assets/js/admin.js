/**
 * Aditya Thete - Admin Panel Controller
 * Handles content editing, authentication, live data updates, export/import, and persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

let currentData = null;

/* ---------------------------------------------------------
   1. AUTHENTICATION & SESSION
--------------------------------------------------------- */
function initAuth() {
  currentData = window.DataManager.getData();
  const authOverlay = document.getElementById('auth-overlay');
  const adminMain = document.getElementById('admin-main');
  const pinInput = document.getElementById('pin-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const authError = document.getElementById('auth-error');

  const storedPin = currentData.settings?.adminPin || "aditya2026";
  const isAuth = sessionStorage.getItem('aditya_admin_auth') === 'true';

  if (isAuth) {
    showAdmin();
  } else {
    authOverlay.classList.remove('hidden');
    adminMain.classList.add('hidden');
  }

  function handleUnlock() {
    const entered = pinInput.value.trim();
    if (entered === storedPin) {
      sessionStorage.setItem('aditya_admin_auth', 'true');
      authError.classList.add('hidden');
      showAdmin();
    } else {
      authError.classList.remove('hidden');
      pinInput.classList.add('border-red-500');
    }
  }

  unlockBtn.addEventListener('click', handleUnlock);
  pinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUnlock();
  });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('aditya_admin_auth');
      window.location.reload();
    });
  }
}

function showAdmin() {
  document.getElementById('auth-overlay').classList.add('hidden');
  document.getElementById('admin-main').classList.remove('hidden');

  // Load current data into forms
  populateForms();
  initTabNavigation();
  initActionButtons();

  if (window.lucide) window.lucide.createIcons();
}

/* ---------------------------------------------------------
   2. TAB NAVIGATION
--------------------------------------------------------- */
function initTabNavigation() {
  const tabs = document.querySelectorAll('.admin-tab-btn');
  const panels = document.querySelectorAll('.admin-panel-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('border-emerald-500', 'text-emerald-400', 'bg-gray-800/60');
        t.classList.add('border-transparent', 'text-gray-400');
      });
      tab.classList.add('border-emerald-500', 'text-emerald-400', 'bg-gray-800/60');
      tab.classList.remove('border-transparent', 'text-gray-400');

      const targetId = tab.getAttribute('data-target');
      panels.forEach(p => {
        if (p.id === targetId) {
          p.classList.remove('hidden');
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });
}

/* ---------------------------------------------------------
   3. POPULATE FORMS WITH CURRENT DATA
--------------------------------------------------------- */
function populateForms() {
  currentData = window.DataManager.getData();
  const p = currentData.profile;

  // Profile Form
  setValue('prof-name', p.name);
  setValue('prof-title', p.title);
  setValue('prof-badge', p.badge);
  setValue('prof-email', p.email);
  setValue('prof-phone', p.phone);
  setValue('prof-location', p.location);
  setValue('prof-linkedin', p.linkedin);
  setValue('prof-github', p.github);
  setValue('prof-summary', p.summary);
  setValue('prof-exp', p.yearsExperience);
  setValue('prof-projects-count', p.projectsCompleted);
  setValue('prof-accuracy', p.modelAccuracy);
  setValue('prof-records', p.recordsProcessed);

  // Settings
  setValue('setting-pin', currentData.settings?.adminPin || "aditya2026");

  // Render lists
  renderSkillsEditor();
  renderProjectsEditor();
  renderExperienceEditor();
  renderEducationEditor();
  renderCertificationsEditor();
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined ? val : '';
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/* ---------------------------------------------------------
   4. SKILLS EDITOR
--------------------------------------------------------- */
function renderSkillsEditor() {
  const container = document.getElementById('skills-editor-container');
  if (!container) return;

  container.innerHTML = currentData.skillCategories.map((cat, catIdx) => `
    <div class="glass-panel p-5 rounded-xl border border-white/10 space-y-4">
      <div class="flex items-center justify-between">
        <input type="text" class="admin-input text-base font-semibold w-2/3" 
               value="${cat.name}" onchange="updateCategoryName(${catIdx}, this.value)" />
        <button type="button" onclick="deleteCategory(${catIdx})" class="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/40 border border-red-500/30">
          Delete Category
        </button>
      </div>

      <!-- Skill Tags -->
      <div class="flex flex-wrap gap-2 items-center" id="cat-skills-${catIdx}">
        ${cat.skills.map((skill, sIdx) => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-800 text-xs text-gray-200 border border-gray-700">
            ${skill}
            <button type="button" onclick="removeSkill(${catIdx}, ${sIdx})" class="text-gray-400 hover:text-red-400 font-bold">&times;</button>
          </span>
        `).join('')}
      </div>

      <!-- Add skill input -->
      <div class="flex gap-2 pt-2">
        <input type="text" id="new-skill-input-${catIdx}" placeholder="Add skill (e.g. LangGraph)..." 
               class="admin-input text-xs py-1.5" onkeypress="if(event.key==='Enter'){event.preventDefault(); addSkill(${catIdx});}" />
        <button type="button" onclick="addSkill(${catIdx})" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold rounded text-white flex-shrink-0">
          + Add
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

window.updateCategoryName = function(catIdx, newName) {
  currentData.skillCategories[catIdx].name = newName;
};

window.removeSkill = function(catIdx, sIdx) {
  currentData.skillCategories[catIdx].skills.splice(sIdx, 1);
  renderSkillsEditor();
};

window.addSkill = function(catIdx) {
  const input = document.getElementById(`new-skill-input-${catIdx}`);
  const val = input.value.trim();
  if (val) {
    currentData.skillCategories[catIdx].skills.push(val);
    input.value = '';
    renderSkillsEditor();
  }
};

window.deleteCategory = function(catIdx) {
  if (confirm(`Delete category "${currentData.skillCategories[catIdx].name}"?`)) {
    currentData.skillCategories.splice(catIdx, 1);
    renderSkillsEditor();
  }
};

window.addNewCategory = function() {
  const name = prompt("Enter new skill category name (e.g. MLOps & Infrastructure):");
  if (name && name.trim()) {
    currentData.skillCategories.push({
      name: name.trim(),
      icon: "code",
      skills: ["New Skill"]
    });
    renderSkillsEditor();
  }
};

/* ---------------------------------------------------------
   5. PROJECTS EDITOR
--------------------------------------------------------- */
function renderProjectsEditor() {
  const container = document.getElementById('projects-editor-container');
  if (!container) return;

  container.innerHTML = currentData.projects.map((proj, pIdx) => `
    <div class="glass-panel p-6 rounded-xl border border-white/10 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-white/5">
        <span class="text-xs font-mono text-emerald-400 font-semibold">Project #${pIdx + 1}</span>
        <button type="button" onclick="deleteProject(${pIdx})" class="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded bg-red-950/40 border border-red-500/30">
          Delete Project
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Project Title</label>
          <input type="text" class="admin-input" value="${proj.title}" onchange="currentData.projects[${pIdx}].title = this.value" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Category</label>
          <input type="text" class="admin-input" value="${proj.category}" onchange="currentData.projects[${pIdx}].category = this.value" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Tagline</label>
          <input type="text" class="admin-input" value="${proj.tagline || ''}" onchange="currentData.projects[${pIdx}].tagline = this.value" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Metrics Badge</label>
          <input type="text" class="admin-input" value="${proj.metrics || ''}" onchange="currentData.projects[${pIdx}].metrics = this.value" placeholder="e.g. 92% RAGAS Score" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-400 mb-1">Description</label>
        <textarea rows="2" class="admin-input" onchange="currentData.projects[${pIdx}].description = this.value">${proj.description || ''}</textarea>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-400 mb-1">Bullet Highlights (one per line)</label>
        <textarea rows="3" class="admin-input font-mono text-xs" onchange="currentData.projects[${pIdx}].highlights = this.value.split('\\n').filter(s=>s.trim())">${(proj.highlights || []).join('\n')}</textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Tech Tags (comma separated)</label>
          <input type="text" class="admin-input" value="${(proj.tags || []).join(', ')}" onchange="currentData.projects[${pIdx}].tags = this.value.split(',').map(s=>s.trim()).filter(Boolean)" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">GitHub / Code Link</label>
          <input type="text" class="admin-input" value="${proj.github || ''}" onchange="currentData.projects[${pIdx}].github = this.value" />
        </div>
      </div>
    </div>
  `).join('');
}

window.deleteProject = function(pIdx) {
  if (confirm(`Delete project "${currentData.projects[pIdx].title}"?`)) {
    currentData.projects.splice(pIdx, 1);
    renderProjectsEditor();
  }
};

window.addNewProject = function() {
  currentData.projects.push({
    id: "project-" + Date.now(),
    title: "New AI Project",
    category: "Generative AI",
    tagline: "End-to-end Machine Learning Solution",
    description: "Brief summary of the architecture, pipeline, and problem statement solved.",
    highlights: [
      "Key highlight 1: Architecture and technologies used.",
      "Key highlight 2: Accuracy or performance metrics achieved."
    ],
    tags: ["Python", "LangChain", "FastAPI"],
    metrics: "Production Ready",
    github: "https://github.com/adityathete",
    demo: "https://github.com/adityathete"
  });
  renderProjectsEditor();
};

/* ---------------------------------------------------------
   6. EXPERIENCE EDITOR
--------------------------------------------------------- */
function renderExperienceEditor() {
  const container = document.getElementById('experience-editor-container');
  if (!container) return;

  container.innerHTML = currentData.experience.map((exp, eIdx) => `
    <div class="glass-panel p-6 rounded-xl border border-white/10 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-white/5">
        <span class="text-xs font-mono text-emerald-400 font-semibold">Experience #${eIdx + 1}</span>
        <button type="button" onclick="deleteExperience(${eIdx})" class="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded bg-red-950/40 border border-red-500/30">
          Delete Role
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Job Role</label>
          <input type="text" class="admin-input" value="${exp.role}" onchange="currentData.experience[${eIdx}].role = this.value" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Company Name</label>
          <input type="text" class="admin-input" value="${exp.company}" onchange="currentData.experience[${eIdx}].company = this.value" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Duration / Period</label>
          <input type="text" class="admin-input" value="${exp.period}" onchange="currentData.experience[${eIdx}].period = this.value" placeholder="e.g. Jun 2025 – Present" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Tech Stack Tags (comma separated)</label>
          <input type="text" class="admin-input" value="${(exp.tags || []).join(', ')}" onchange="currentData.experience[${eIdx}].tags = this.value.split(',').map(s=>s.trim()).filter(Boolean)" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-400 mb-1">Responsibilities & Achievements (one per line)</label>
        <textarea rows="4" class="admin-input font-mono text-xs" onchange="currentData.experience[${eIdx}].bullets = this.value.split('\\n').filter(s=>s.trim())">${(exp.bullets || []).join('\n')}</textarea>
      </div>
    </div>
  `).join('');
}

window.deleteExperience = function(eIdx) {
  if (confirm(`Delete experience at "${currentData.experience[eIdx].company}"?`)) {
    currentData.experience.splice(eIdx, 1);
    renderExperienceEditor();
  }
};

window.addNewExperience = function() {
  currentData.experience.push({
    id: "exp-" + Date.now(),
    role: "Senior AI Engineer",
    company: "Company Name",
    period: "2026 – Present",
    bullets: [
      "Designed and deployed production-grade AI solutions and enterprise pipelines.",
      "Collaborated with cross-functional stakeholders to deliver measurable AI outcomes."
    ],
    tags: ["Generative AI", "Python", "Cloud"]
  });
  renderExperienceEditor();
};

/* ---------------------------------------------------------
   7. EDUCATION & CERTIFICATIONS EDITOR
--------------------------------------------------------- */
function renderEducationEditor() {
  const container = document.getElementById('education-editor-container');
  if (!container) return;

  container.innerHTML = currentData.education.map((edu, idx) => `
    <div class="p-4 rounded-lg bg-gray-900/60 border border-white/5 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-xs font-mono text-cyan-400">Degree #${idx + 1}</span>
        <button type="button" onclick="deleteEducation(${idx})" class="text-xs text-red-400">&times; Delete</button>
      </div>
      <input type="text" class="admin-input text-xs" value="${edu.degree}" onchange="currentData.education[${idx}].degree = this.value" placeholder="Degree name" />
      <div class="grid grid-cols-2 gap-2">
        <input type="text" class="admin-input text-xs" value="${edu.institution}" onchange="currentData.education[${idx}].institution = this.value" placeholder="Institution" />
        <input type="text" class="admin-input text-xs" value="${edu.year}" onchange="currentData.education[${idx}].year = this.value" placeholder="Year" />
      </div>
      <input type="text" class="admin-input text-xs" value="${edu.details || ''}" onchange="currentData.education[${idx}].details = this.value" placeholder="Specialization details" />
    </div>
  `).join('');
}

window.deleteEducation = function(idx) {
  currentData.education.splice(idx, 1);
  renderEducationEditor();
};

window.addNewEducation = function() {
  currentData.education.push({
    degree: "Degree Title",
    institution: "University Name",
    year: "2026",
    details: "Specialization or key coursework"
  });
  renderEducationEditor();
};

function renderCertificationsEditor() {
  const container = document.getElementById('certs-editor-container');
  if (!container) return;

  container.innerHTML = currentData.certifications.map((c, idx) => `
    <div class="p-4 rounded-lg bg-gray-900/60 border border-white/5 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-xs font-mono text-emerald-400">Cert #${idx + 1}</span>
        <button type="button" onclick="deleteCert(${idx})" class="text-xs text-red-400">&times; Delete</button>
      </div>
      <input type="text" class="admin-input text-xs" value="${c.title}" onchange="currentData.certifications[${idx}].title = this.value" placeholder="Certification Title" />
      <div class="grid grid-cols-2 gap-2">
        <input type="text" class="admin-input text-xs" value="${c.issuer}" onchange="currentData.certifications[${idx}].issuer = this.value" placeholder="Issuer (e.g. DeepLearning.AI)" />
        <input type="text" class="admin-input text-xs" value="${c.badge || ''}" onchange="currentData.certifications[${idx}].badge = this.value" placeholder="Badge (e.g. GenAI)" />
      </div>
    </div>
  `).join('');
}

window.deleteCert = function(idx) {
  currentData.certifications.splice(idx, 1);
  renderCertificationsEditor();
};

window.addNewCert = function() {
  currentData.certifications.push({
    title: "New Certification",
    issuer: "Certifying Body",
    badge: "AI"
  });
  renderCertificationsEditor();
};

/* ---------------------------------------------------------
   8. ACTION BUTTONS & SAVE LOGIC
--------------------------------------------------------- */
function initActionButtons() {
  // Save All Changes Button
  const saveBtn = document.getElementById('save-all-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      syncProfileFromInputs();
      syncSettingsFromInputs();

      const success = window.DataManager.saveData(currentData);
      if (success) {
        showToast("✓ Changes saved successfully! Stored in browser.");
      } else {
        alert("Failed to save changes to storage.");
      }
    });
  }

  // Export data.json Button
  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      syncProfileFromInputs();
      syncSettingsFromInputs();
      window.DataManager.saveData(currentData);
      window.DataManager.exportJSON();
      showToast("✓ Downloaded updated data.json! Replace your project's data.json with this file.");
    });
  }

  // Import JSON File
  const importFile = document.getElementById('import-json-input');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        window.DataManager.importJSON(file, (err, importedData) => {
          if (err) {
            alert("Error importing file: " + err.message);
          } else {
            currentData = importedData;
            populateForms();
            showToast("✓ JSON imported successfully!");
          }
        });
      }
    });
  }

  // Reset to Defaults
  const resetBtn = document.getElementById('reset-defaults-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Reset all content back to original resume data? Any unsaved edits will be lost.")) {
        window.DataManager.resetToDefaults();
        currentData = window.DataManager.getData();
        populateForms();
        showToast("✓ Reset to original resume data!");
      }
    });
  }
}

function syncProfileFromInputs() {
  currentData.profile.name = getValue('prof-name');
  currentData.profile.title = getValue('prof-title');
  currentData.profile.badge = getValue('prof-badge');
  currentData.profile.email = getValue('prof-email');
  currentData.profile.phone = getValue('prof-phone');
  currentData.profile.location = getValue('prof-location');
  currentData.profile.linkedin = getValue('prof-linkedin');
  currentData.profile.github = getValue('prof-github');
  currentData.profile.summary = getValue('prof-summary');
  currentData.profile.yearsExperience = getValue('prof-exp');
  currentData.profile.projectsCompleted = getValue('prof-projects-count');
  currentData.profile.modelAccuracy = getValue('prof-accuracy');
  currentData.profile.recordsProcessed = getValue('prof-records');
}

function syncSettingsFromInputs() {
  if (!currentData.settings) currentData.settings = {};
  const newPin = getValue('setting-pin');
  if (newPin) {
    currentData.settings.adminPin = newPin;
  }
}

function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i> <span>${msg}</span>`;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
