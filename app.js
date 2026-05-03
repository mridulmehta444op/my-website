// ════════════════════════════════════════
//  STATE
// ════════════════════════════════════════
const state = {
  template: 'modern',
  apiKey: '',
  personal: { name:'', email:'', phone:'', linkedin:'', github:'', location:'', jobtitle:'' },
  summary: '',
  skills: [],
  softSkills: [],
  experience: [],
  education: [],
  projects: [],
  certs: []
};

// ════════════════════════════════════════
//  TABS
// ════════════════════════════════════════
document.getElementById('tabBar').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
});

// ════════════════════════════════════════
//  TEMPLATE
// ════════════════════════════════════════
function selectTemplate(tpl) {
  state.template = tpl;
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[data-tpl="${tpl}"]`).classList.add('selected');
  renderResume();
}

// ════════════════════════════════════════
//  SKILLS TAGS
// ════════════════════════════════════════
function handleSkillInput(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (val) { state.skills.push(val); renderSkills(); renderResume(); }
    e.target.value = '';
  } else if (e.key === 'Backspace' && !e.target.value) {
    state.skills.pop(); renderSkills(); renderResume();
  }
}
function handleSoftSkillInput(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (val) { state.softSkills.push(val); renderSoftSkills(); renderResume(); }
    e.target.value = '';
  } else if (e.key === 'Backspace' && !e.target.value) {
    state.softSkills.pop(); renderSoftSkills(); renderResume();
  }
}
function removeSkill(i) { state.skills.splice(i,1); renderSkills(); renderResume(); }
function removeSoftSkill(i) { state.softSkills.splice(i,1); renderSoftSkills(); renderResume(); }

function renderSkills() {
  const wrap = document.getElementById('skills-tags');
  const inp = document.getElementById('skill-input');
  wrap.innerHTML = '';
  state.skills.forEach((s,i) => {
    const t = document.createElement('div');
    t.className = 'tag';
    t.innerHTML = `${esc(s)} <span class="remove" onclick="removeSkill(${i})">×</span>`;
    wrap.appendChild(t);
  });
  wrap.appendChild(inp);
}
function renderSoftSkills() {
  const wrap = document.getElementById('soft-skills-tags');
  const inp = document.getElementById('soft-skill-input');
  wrap.innerHTML = '';
  state.softSkills.forEach((s,i) => {
    const t = document.createElement('div');
    t.className = 'tag';
    t.innerHTML = `${esc(s)} <span class="remove" onclick="removeSoftSkill(${i})">×</span>`;
    wrap.appendChild(t);
  });
  wrap.appendChild(inp);
}

// ════════════════════════════════════════
//  ENTRY CARDS
// ════════════════════════════════════════
const entryConfigs = {
  experience: {
    listId: 'experience-list',
    fields: [
      { id:'title',   label:'Job Title',               placeholder:'Software Engineer',       full:true },
      { id:'company', label:'Company',                  placeholder:'Acme Corp',               half:true },
      { id:'location',label:'Location',                 placeholder:'Remote',                  half:true },
      { id:'start',   label:'Start',                    placeholder:'Jan 2022',                half:true },
      { id:'end',     label:'End',                      placeholder:'Present',                 half:true },
      { id:'desc',    label:'Description / Achievements',placeholder:'• Led migration to…',  full:true, area:true, ai:true }
    ]
  },
  education: {
    listId: 'education-list',
    fields: [
      { id:'degree',   label:'Degree',          placeholder:'B.Sc. Computer Science', full:true },
      { id:'school',   label:'Institution',      placeholder:'MIT',                    half:true },
      { id:'year',     label:'Year',             placeholder:'2022',                   half:true },
      { id:'gpa',      label:'GPA / Grade',      placeholder:'3.9 / 4.0',             half:true },
      { id:'location', label:'Location',         placeholder:'Cambridge, MA',          half:true }
    ]
  },
  projects: {
    listId: 'projects-list',
    fields: [
      { id:'name',  label:'Project Name', placeholder:'My Awesome App',           full:true },
      { id:'stack', label:'Tech Stack',   placeholder:'React, Node.js, PostgreSQL',half:true },
      { id:'link',  label:'Link',         placeholder:'github.com/…',              half:true },
      { id:'desc',  label:'Description',  placeholder:'Built a platform that…',   full:true, area:true, ai:true }
    ]
  },
  certs: {
    listId: 'certs-list',
    fields: [
      { id:'name',   label:'Certification', placeholder:'AWS Solutions Architect', full:true },
      { id:'issuer', label:'Issuer',        placeholder:'Amazon Web Services',     half:true },
      { id:'year',   label:'Year',          placeholder:'2024',                    half:true }
    ]
  }
};

function addEntry(type) {
  state[type].push({});
  renderEntries(type);
}
function removeEntry(type, idx) {
  state[type].splice(idx, 1);
  renderEntries(type);
  renderResume();
}
function updateEntry(type, idx, field, val) {
  if (!state[type][idx]) state[type][idx] = {};
  state[type][idx][field] = val;
  renderResume();
}

function renderEntries(type) {
  const cfg = entryConfigs[type];
  const container = document.getElementById(cfg.listId);
  container.innerHTML = '';
  state[type].forEach((entry, idx) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    let fieldsHTML = '';

    cfg.fields.filter(f => f.full).forEach(f => {
      fieldsHTML += `<div class="form-group">
        <label>${f.label}</label>
        ${f.area
          ? `<textarea placeholder="${f.placeholder}" oninput="updateEntry('${type}',${idx},'${f.id}',this.value)">${esc(entry[f.id]||'')}</textarea>`
          : `<input type="text" placeholder="${f.placeholder}" value="${esc(entry[f.id]||'')}" oninput="updateEntry('${type}',${idx},'${f.id}',this.value)">`
        }
        ${f.ai ? `<button class="btn btn-ai btn-sm" style="margin-top:.35rem;" onclick="enhanceDesc('${type}',${idx})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 9.19 2 12l7.19 2.81L12 22l2.81-7.19L22 12l-7.19-2.81z"/></svg>
          AI Improve
        </button>` : ''}
      </div>`;
    });

    const halves = cfg.fields.filter(f => f.half);
    for (let i = 0; i < halves.length; i += 2) {
      const a = halves[i], b = halves[i+1];
      fieldsHTML += `<div class="form-row">
        <div class="form-group">
          <label>${a.label}</label>
          <input type="text" placeholder="${a.placeholder}" value="${esc(entry[a.id]||'')}" oninput="updateEntry('${type}',${idx},'${a.id}',this.value)">
        </div>
        ${b ? `<div class="form-group">
          <label>${b.label}</label>
          <input type="text" placeholder="${b.placeholder}" value="${esc(entry[b.id]||'')}" oninput="updateEntry('${type}',${idx},'${b.id}',this.value)">
        </div>` : ''}
      </div>`;
    }

    card.innerHTML = `
      <div class="entry-card-header">
        <span>${type.charAt(0).toUpperCase()+type.slice(1)} #${idx+1}</span>
        <button class="btn btn-danger btn-sm" onclick="removeEntry('${type}',${idx})">Remove</button>
      </div>
      ${fieldsHTML}
    `;
    container.appendChild(card);
  });
}

// ════════════════════════════════════════
//  SYNC & RENDER
// ════════════════════════════════════════
function renderResume() {
  const p = state.personal;
  p.name     = v('f-name');
  p.email    = v('f-email');
  p.phone    = v('f-phone');
  p.linkedin = v('f-linkedin');
  p.github   = v('f-github');
  p.location = v('f-location');
  p.jobtitle = v('f-jobtitle');
  state.summary = v('f-summary');

  const paper = document.getElementById('resume-preview');
  paper.className = `resume-paper tpl-${state.template}`;

  const builders = {
    modern:    buildModern,
    minimal:   buildMinimal,
    tech:      buildTech,
    executive: buildExecutive,
    creative:  buildCreative,
    elegant:   buildElegant,
  };
  paper.innerHTML = (builders[state.template] || buildModern)();
}

function v(id)    { return document.getElementById(id)?.value || ''; }
function esc(s='') {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
function nl2br(s='') { return esc(s).replace(/\n/g,'<br>'); }

function contactItem(icon, text, link) {
  if (!text) return '';
  const content = link
    ? `<a href="${link}" target="_blank">${esc(text)}</a>`
    : esc(text);
  return `<span class="contact-item">${icon ? `<span>${icon}</span>` : ''}${content}</span>`;
}

function formatDesc(text) {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length <= 1) return `<p style="margin:0;">${nl2br(text)}</p>`;
  return `<ul class="bullet-list">${lines.map(l => `<li>${esc(l.replace(/^[•\-\*▸◆]\s*/,''))}</li>`).join('')}</ul>`;
}

// ════════════════════════════════════════
//  TEMPLATE 1: MODERN PROFESSIONAL
// ════════════════════════════════════════
function buildModern() {
  const p = state.personal;
  return `
  <div class="resume-header">
    <div class="resume-name">${esc(p.name) || 'Your Name'}</div>
    ${p.jobtitle ? `<div class="resume-role">${esc(p.jobtitle)}</div>` : ''}
    <div class="resume-contact-bar">
      ${contactItem('✉', p.email, `mailto:${p.email}`)}
      ${contactItem('☎', p.phone)}
      ${contactItem('⌖', p.location)}
      ${p.linkedin ? contactItem('in', p.linkedin, `https://${p.linkedin}`) : ''}
      ${p.github ? contactItem('{ }', p.github, `https://${p.github}`) : ''}
    </div>
  </div>
  <div class="gold-bar"></div>
  <div class="resume-body">
    <div class="main-col">
      ${state.summary ? `<div class="sec-title">Profile</div><p class="summary-text">${nl2br(state.summary)}</p>` : ''}
      ${state.experience.length ? `<div class="sec-title">Experience</div>
        ${state.experience.map(e => `<div class="entry">
          <div class="exp-title">${esc(e.title||'')}</div>
          <div class="exp-sub">${esc(e.company||'')}${e.location?' · '+esc(e.location):''}</div>
          <div class="exp-date">${esc(e.start||'')}${e.end?' – '+esc(e.end):''}</div>
          ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
        </div>`).join('')}` : ''}
      ${state.projects.length ? `<div class="sec-title">Projects</div>
        ${state.projects.map(e => `<div class="entry">
          <div class="exp-title">${esc(e.name||'')}${e.link?` <span style="font-size:8pt;font-weight:400;color:#888;">· ${esc(e.link)}</span>`:''}
          </div>
          ${e.stack ? `<div class="exp-sub">${esc(e.stack)}</div>` : ''}
          ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
        </div>`).join('')}` : ''}
    </div>
    <div class="side-col">
      ${(state.skills.length||state.softSkills.length) ? `<div class="sec-title">Skills</div>
        <div>${state.skills.map(s=>`<span class="skill-badge">${esc(s)}</span>`).join('')}</div>
        ${state.softSkills.length ? `<div style="margin-top:.5rem;">${state.softSkills.map(s=>`<span class="skill-badge" style="background:#4a6741;">${esc(s)}</span>`).join('')}</div>` : ''}
      ` : ''}
      ${state.education.length ? `<div class="sec-title">Education</div>
        ${state.education.map(e => `<div class="entry">
          <div class="exp-title" style="font-size:9.5pt;">${esc(e.degree||'')}</div>
          <div class="exp-sub">${esc(e.school||'')}</div>
          <div class="exp-date">${esc(e.year||'')}${e.gpa?' · GPA: '+esc(e.gpa):''}</div>
        </div>`).join('')}` : ''}
      ${state.certs.length ? `<div class="sec-title">Certifications</div>
        ${state.certs.map(c => `<div class="cert-item">
          <strong>${esc(c.name||'')}</strong><br>${esc(c.issuer||'')}${c.year?' · '+esc(c.year):''}
        </div>`).join('')}` : ''}
    </div>
  </div>`;
}

// ════════════════════════════════════════
//  TEMPLATE 2: SIMPLE MINIMAL
// ════════════════════════════════════════
function buildMinimal() {
  const p = state.personal;
  return `
  <div class="resume-header">
    <div class="resume-name">${esc(p.name) || 'Your Name'}</div>
    ${p.jobtitle ? `<div class="resume-role">${esc(p.jobtitle)}</div>` : ''}
    <div class="resume-contact-bar">
      ${contactItem('', p.email, `mailto:${p.email}`)}
      ${contactItem('', p.phone)}
      ${contactItem('', p.location)}
      ${p.linkedin ? contactItem('', p.linkedin, `https://${p.linkedin}`) : ''}
      ${p.github ? contactItem('', p.github, `https://${p.github}`) : ''}
    </div>
  </div>
  <div class="resume-body">
    ${state.summary ? `<div class="sec-title">About</div><p class="summary-text">${nl2br(state.summary)}</p><div class="divider"></div>` : ''}
    ${state.experience.length ? `<div class="sec-title">Experience</div>
      ${state.experience.map(e => `<div class="entry">
        <div class="entry-main">
          <div class="exp-title">${esc(e.title||'')} <span style="font-weight:400;color:#555;">@ ${esc(e.company||'')}</span></div>
          ${e.location ? `<div class="exp-sub">${esc(e.location)}</div>` : ''}
        </div>
        <div class="exp-date">${esc(e.start||'')}${e.end?' – '+esc(e.end):''}</div>
        ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
      </div>`).join('')}<div class="divider"></div>` : ''}
    ${state.education.length ? `<div class="sec-title">Education</div>
      ${state.education.map(e => `<div class="entry">
        <div class="entry-main">
          <div class="exp-title">${esc(e.degree||'')}</div>
          <div class="exp-sub">${esc(e.school||'')}</div>
        </div>
        <div class="exp-date">${esc(e.year||'')}</div>
      </div>`).join('')}<div class="divider"></div>` : ''}
    ${state.projects.length ? `<div class="sec-title">Projects</div>
      ${state.projects.map(e => `<div class="entry">
        <div class="entry-main">
          <div class="exp-title">${esc(e.name||'')}${e.stack?` <span style="font-weight:400;font-size:8.5pt;color:#888;">— ${esc(e.stack)}</span>`:''}</div>
        </div>
        ${e.link ? `<div class="exp-date" style="font-size:7.5pt;">${esc(e.link)}</div>` : ''}
        ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
      </div>`).join('')}<div class="divider"></div>` : ''}
    ${(state.skills.length||state.softSkills.length) ? `<div class="sec-title">Skills</div>
      <div class="skill-list">${[...state.skills,...state.softSkills].map(s=>`<span class="skill-badge">${esc(s)}</span>`).join('')}</div>` : ''}
    ${state.certs.length ? `<div class="divider"></div><div class="sec-title">Certifications</div>
      ${state.certs.map(c => `<div class="cert-item"><strong>${esc(c.name||'')}</strong> <span style="color:#888;">· ${esc(c.issuer||'')} ${esc(c.year||'')}</span></div>`).join('')}` : ''}
  </div>`;
}

// ════════════════════════════════════════
//  TEMPLATE 3: TECH DEVELOPER
// ════════════════════════════════════════
function buildTech() {
  const p = state.personal;
  const nameParts = (p.name || 'Your Name').split(' ');
  const firstName = nameParts.slice(0,-1).join(' ');
  const lastName  = nameParts.slice(-1)[0];
  return `
  <div class="resume-header">
    <div class="resume-name">${esc(firstName)} <span>${esc(lastName)}</span></div>
    ${p.jobtitle ? `<div class="resume-role">// ${esc(p.jobtitle)}</div>` : ''}
    <div class="resume-contact-bar">
      ${contactItem('✉', p.email, `mailto:${p.email}`)}
      ${contactItem('⌖', p.location)}
      ${p.linkedin ? contactItem('in', p.linkedin, `https://${p.linkedin}`) : ''}
      ${p.github ? contactItem('gh', p.github, `https://${p.github}`) : ''}
      ${contactItem('☎', p.phone)}
    </div>
  </div>
  <div class="resume-body">
    <div class="main-col">
      ${state.summary ? `<div class="sec-title">About</div><p class="summary-text">${nl2br(state.summary)}</p>` : ''}
      ${state.experience.length ? `<div class="sec-title">Experience</div>
        ${state.experience.map(e => `<div class="entry">
          <div class="exp-title">${esc(e.title||'')}</div>
          <div class="exp-sub">${esc(e.company||'')}${e.location?' · '+esc(e.location):''}</div>
          <div class="exp-date">${esc(e.start||'')}${e.end?' → '+esc(e.end):''}</div>
          ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
        </div>`).join('')}` : ''}
      ${state.projects.length ? `<div class="sec-title">Projects</div>
        ${state.projects.map(e => `<div class="entry">
          <div class="exp-title">${esc(e.name||'')}</div>
          ${e.stack ? `<div class="exp-sub" style="font-family:'JetBrains Mono',monospace;font-size:7.5pt;">${esc(e.stack)}</div>` : ''}
          ${e.link ? `<div class="exp-date">${esc(e.link)}</div>` : ''}
          ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
        </div>`).join('')}` : ''}
    </div>
    <div class="side-col">
      ${state.skills.length ? `<div class="sec-title">Tech Stack</div>
        ${state.skills.map(s=>`<span class="skill-badge">${esc(s)}</span>`).join('')}` : ''}
      ${state.softSkills.length ? `<div class="sec-title">Soft Skills</div>
        ${state.softSkills.map(s=>`<span class="skill-badge" style="background:#dcfce7;color:#166534;border-color:#86efac;">${esc(s)}</span>`).join('')}` : ''}
      ${state.education.length ? `<div class="sec-title">Education</div>
        ${state.education.map(e => `<div class="cert-item">
          <strong>${esc(e.degree||'')}</strong><br>
          ${esc(e.school||'')} · ${esc(e.year||'')}
          ${e.gpa?`<br><span style="font-size:7.5pt;color:#94a3b8;">GPA: ${esc(e.gpa)}</span>`:''}
        </div>`).join('')}` : ''}
      ${state.certs.length ? `<div class="sec-title">Certs</div>
        ${state.certs.map(c => `<div class="cert-item">
          <strong>${esc(c.name||'')}</strong><br>${esc(c.issuer||'')} ${esc(c.year||'')}
        </div>`).join('')}` : ''}
    </div>
  </div>`;
}

// ════════════════════════════════════════
//  TEMPLATE 4: EXECUTIVE
// ════════════════════════════════════════
function buildExecutive() {
  const p = state.personal;
  return `
  <div class="resume-header">
    <div class="resume-name">${esc(p.name) || 'Your Name'}</div>
    ${p.jobtitle ? `<div class="resume-role">${esc(p.jobtitle)}</div>` : ''}
    <div class="resume-contact-bar">
      ${contactItem('✉', p.email, `mailto:${p.email}`)}
      ${contactItem('☎', p.phone)}
      ${contactItem('⌖', p.location)}
      ${p.linkedin ? contactItem('in', p.linkedin, `https://${p.linkedin}`) : ''}
      ${p.github ? contactItem('{ }', p.github, `https://${p.github}`) : ''}
    </div>
  </div>
  <div class="resume-body">
    <div class="side-col">
      ${(state.skills.length) ? `<div class="sec-title">Core Competencies</div>
        ${state.skills.map(s=>`<span class="skill-badge">${esc(s)}</span>`).join('')}` : ''}
      ${state.softSkills.length ? `<div class="sec-title">Leadership Skills</div>
        ${state.softSkills.map(s=>`<span class="soft-badge">${esc(s)}</span>`).join('')}` : ''}
      ${state.education.length ? `<div class="sec-title">Education</div>
        ${state.education.map(e => `<div class="cert-item">
          <strong style="font-size:9pt;color:#1a2744;">${esc(e.degree||'')}</strong><br>
          <span style="color:#555;">${esc(e.school||'')}</span><br>
          <span style="color:#888;font-size:8pt;">${esc(e.year||'')}${e.gpa?' · GPA '+esc(e.gpa):''}</span>
        </div>`).join('')}` : ''}
      ${state.certs.length ? `<div class="sec-title">Certifications</div>
        ${state.certs.map(c => `<div class="cert-item">
          <strong style="font-size:9pt;color:#1a2744;">${esc(c.name||'')}</strong><br>
          <span style="color:#777;">${esc(c.issuer||'')}${c.year?' · '+esc(c.year):''}</span>
        </div>`).join('')}` : ''}
    </div>
    <div class="main-col">
      ${state.summary ? `<div class="sec-title">Executive Profile</div><p class="summary-text">${nl2br(state.summary)}</p>` : ''}
      ${state.experience.length ? `<div class="sec-title">Professional Experience</div>
        ${state.experience.map(e => `<div class="entry">
          <div class="exp-title">${esc(e.title||'')}</div>
          <div class="exp-sub">${esc(e.company||'')}${e.location?' · '+esc(e.location):''}</div>
          <div class="exp-date">${esc(e.start||'')}${e.end?' – '+esc(e.end):''}</div>
          ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
        </div>`).join('')}` : ''}
      ${state.projects.length ? `<div class="sec-title">Key Projects</div>
        ${state.projects.map(e => `<div class="entry">
          <div class="exp-title">${esc(e.name||'')}${e.stack?` <span style="font-size:8pt;font-weight:400;color:#888;">· ${esc(e.stack)}</span>`:''}</div>
          ${e.link ? `<div class="exp-sub" style="font-size:8pt;">${esc(e.link)}</div>` : ''}
          ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
        </div>`).join('')}` : ''}
    </div>
  </div>`;
}

// ════════════════════════════════════════
//  TEMPLATE 5: CREATIVE SPLIT
// ════════════════════════════════════════
function buildCreative() {
  const p = state.personal;
  const initials = (p.name || 'Y')
    .split(' ')
    .map(w => w[0] || '')
    .slice(0,2)
    .join('')
    .toUpperCase();
  return `
  <div class="resume-layout">
    <div class="resume-sidebar">
      <div class="resume-name-block">
        <div class="avatar-placeholder">${initials}</div>
        <div class="resume-name">${esc(p.name) || 'Your Name'}</div>
        ${p.jobtitle ? `<div class="resume-role">${esc(p.jobtitle)}</div>` : ''}
      </div>
      ${(p.email||p.phone||p.location||p.linkedin||p.github) ? `
      <div>
        <div class="side-sec-title">Contact</div>
        ${p.email ? `<div class="side-contact-item">✉ <a href="mailto:${p.email}">${esc(p.email)}</a></div>` : ''}
        ${p.phone ? `<div class="side-contact-item">☎ ${esc(p.phone)}</div>` : ''}
        ${p.location ? `<div class="side-contact-item">⌖ ${esc(p.location)}</div>` : ''}
        ${p.linkedin ? `<div class="side-contact-item">in <a href="https://${p.linkedin}">${esc(p.linkedin)}</a></div>` : ''}
        ${p.github ? `<div class="side-contact-item">gh <a href="https://${p.github}">${esc(p.github)}</a></div>` : ''}
      </div>` : ''}
      ${state.skills.length ? `<div>
        <div class="side-sec-title">Tech Skills</div>
        <div>${state.skills.map(s=>`<span class="side-skill">${esc(s)}</span>`).join('')}</div>
      </div>` : ''}
      ${state.softSkills.length ? `<div>
        <div class="side-sec-title">Soft Skills</div>
        <div>${state.softSkills.map(s=>`<span class="side-skill">${esc(s)}</span>`).join('')}</div>
      </div>` : ''}
      ${state.education.length ? `<div>
        <div class="side-sec-title">Education</div>
        ${state.education.map(e => `<div class="side-cert">
          <strong style="color:rgba(255,255,255,.85);">${esc(e.degree||'')}</strong><br>
          ${esc(e.school||'')}${e.year?' · '+esc(e.year):''}
        </div>`).join('')}
      </div>` : ''}
      ${state.certs.length ? `<div>
        <div class="side-sec-title">Certifications</div>
        ${state.certs.map(c=>`<div class="side-cert">
          <strong style="color:rgba(255,255,255,.85);">${esc(c.name||'')}</strong><br>
          ${esc(c.issuer||'')}${c.year?' · '+esc(c.year):''}
        </div>`).join('')}
      </div>` : ''}
    </div>
    <div class="resume-main">
      <div class="resume-main-body">
        ${state.summary ? `<div class="sec-title">Profile</div><p class="summary-text">${nl2br(state.summary)}</p>` : ''}
        ${state.experience.length ? `<div class="sec-title">Experience</div>
          ${state.experience.map(e => `<div class="entry">
            <div class="exp-title">${esc(e.title||'')}</div>
            <div class="exp-sub">${esc(e.company||'')}${e.location?' · '+esc(e.location):''}</div>
            <div class="exp-date">${esc(e.start||'')}${e.end?' – '+esc(e.end):''}</div>
            ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
          </div>`).join('')}` : ''}
        ${state.projects.length ? `<div class="sec-title">Projects</div>
          ${state.projects.map(e => `<div class="entry">
            <div class="exp-title">${esc(e.name||'')}${e.stack?` <span style="font-size:8pt;font-weight:400;color:#888;">· ${esc(e.stack)}</span>`:''}</div>
            ${e.link ? `<div class="exp-sub" style="font-size:8pt;">${esc(e.link)}</div>` : ''}
            ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
          </div>`).join('')}` : ''}
      </div>
    </div>
  </div>`;
}

// ════════════════════════════════════════
//  TEMPLATE 6: ELEGANT CLASSIC
// ════════════════════════════════════════
function buildElegant() {
  const p = state.personal;
  const hasBottom = state.skills.length || state.softSkills.length ||
                    state.education.length || state.certs.length;
  return `
  <div class="resume-header">
    <div class="resume-name">${esc(p.name) || 'Your Name'}</div>
    ${p.jobtitle ? `<div class="resume-role">${esc(p.jobtitle)}</div>` : ''}
    <div class="resume-contact-bar">
      ${contactItem('', p.email, `mailto:${p.email}`)}
      ${contactItem('', p.phone)}
      ${contactItem('', p.location)}
      ${p.linkedin ? contactItem('', p.linkedin, `https://${p.linkedin}`) : ''}
      ${p.github ? contactItem('', p.github, `https://${p.github}`) : ''}
    </div>
  </div>
  <div class="resume-body">
    ${state.summary ? `<div class="sec-title">Professional Summary</div>
      <p class="summary-text">${nl2br(state.summary)}</p>` : ''}

    ${state.experience.length ? `<div class="sec-title">Career History</div>
      ${state.experience.map(e => `<div class="entry">
        <div class="entry-header">
          <div>
            <div class="exp-title">${esc(e.title||'')}</div>
            <div class="exp-sub">${esc(e.company||'')}${e.location?', '+esc(e.location):''}</div>
          </div>
          <div class="exp-date">${esc(e.start||'')}${e.end?' – '+esc(e.end):''}</div>
        </div>
        ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
      </div>`).join('')}` : ''}

    ${state.projects.length ? `<div class="sec-title">Notable Projects</div>
      ${state.projects.map(e => `<div class="entry">
        <div class="entry-header">
          <div>
            <div class="exp-title">${esc(e.name||'')}</div>
            ${e.stack ? `<div class="exp-sub">${esc(e.stack)}</div>` : ''}
          </div>
          ${e.link ? `<div class="exp-date">${esc(e.link)}</div>` : ''}
        </div>
        ${e.desc ? `<div class="exp-desc">${formatDesc(e.desc)}</div>` : ''}
      </div>`).join('')}` : ''}

    ${hasBottom ? `
    <div class="elegant-grid">
      <div>
        ${state.education.length ? `<div class="sec-title" style="text-align:left;">Education</div>
          ${state.education.map(e => `<div class="cert-item">
            <strong style="font-style:italic;font-size:11pt;">${esc(e.degree||'')}</strong><br>
            <span style="font-family:'DM Sans',sans-serif;font-size:9pt;color:#666;">${esc(e.school||'')} ${esc(e.year||'')}${e.gpa?' · GPA '+esc(e.gpa):''}</span>
          </div>`).join('')}` : ''}
        ${state.certs.length ? `<div class="sec-title" style="text-align:left;">Certifications</div>
          ${state.certs.map(c => `<div class="cert-item">
            <strong style="font-style:italic;font-size:11pt;">${esc(c.name||'')}</strong><br>
            <span style="font-family:'DM Sans',sans-serif;font-size:9pt;color:#666;">${esc(c.issuer||'')} ${esc(c.year||'')}</span>
          </div>`).join('')}` : ''}
      </div>
      <div>
        ${state.skills.length ? `<div class="sec-title" style="text-align:left;">Expertise</div>
          <div>${state.skills.map(s=>`<span class="skill-badge">${esc(s)}</span>`).join('')}</div>` : ''}
        ${state.softSkills.length ? `<div style="margin-top:.75rem;">${state.softSkills.map(s=>`<span class="skill-badge" style="border-color:#c0a060;color:#6b5630;">${esc(s)}</span>`).join('')}</div>` : ''}
      </div>
    </div>` : ''}
  </div>`;
}

// ════════════════════════════════════════
//  AI FEATURES
// ════════════════════════════════════════
async function callAI(prompt) {
  if (!state.apiKey) return null;
  try {
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${state.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.5
      })
    });
    const data = await res.json();
    if (!res.ok) { console.error("HF API ERROR:", data); return null; }
    return data?.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error("HF FETCH ERROR:", e);
    return null;
  }
}

async function enhanceSummary() {
  const btn = document.getElementById('btnEnhanceSummary');
  const status = document.getElementById('ai-summary-status');
  const current = document.getElementById('f-summary').value;
  if (!state.apiKey) { showToast('⚙ Please add your API key in AI Settings first.'); openApiKeyModal(); return; }
  if (!current.trim()) { showToast('Write a summary first, then enhance it.'); return; }
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Enhancing…';
  status.textContent = 'AI is improving your summary…';
  const result = await callAI(`You are a professional resume writer. Improve this professional summary to be more impactful, ATS-friendly, and concise (3–4 sentences max). Return only the improved summary, no explanation:\n\n${current}`);
  if (result) {
    document.getElementById('f-summary').value = result;
    renderResume();
    status.textContent = '✓ Summary enhanced by AI';
    showToast('✦ Summary enhanced!');
  } else {
    status.textContent = '✗ AI enhancement failed. Check your API key.';
    showToast('AI is temporarily busy. Please wait a few seconds and try again.');
  }
  btn.disabled = false;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 9.19 2 12l7.19 2.81L12 22l2.81-7.19L22 12l-7.19-2.81z"/></svg> AI Enhance Summary`;
}

async function enhanceDesc(type, idx) {
  if (!state.apiKey) { showToast('⚙ Please add your API key in AI Settings first.'); openApiKeyModal(); return; }
  const entry = state[type][idx];
  const current = entry.desc || '';
  if (!current.trim()) { showToast('Add a description first.'); return; }
  showToast('✦ AI improving description…');
  const context = type === 'experience'
    ? `Job Title: ${entry.title||''}, Company: ${entry.company||''}`
    : `Project: ${entry.name||''}, Stack: ${entry.stack||''}`;
  const result = await callAI(`You are a professional resume writer. Improve these bullet points to be more impactful, quantified, and ATS-friendly for a ${type} section. Context: ${context}. Return only the improved bullet points (one per line, starting with •), no explanation:\n\n${current}`);
  if (result) {
    state[type][idx].desc = result;
    renderEntries(type);
    renderResume();
    showToast('✦ Description improved!');
  } else {
    showToast('AI enhancement failed. Check your API key.');
  }
}

// ════════════════════════════════════════
//  JOB DESCRIPTION TAILOR (NEW FEATURE)
// ════════════════════════════════════════
let tailoredSummaryText = '';

async function tailorToJob() {
  const btn = document.getElementById('btnTailorJob');
  const status = document.getElementById('ai-jobdesc-status');
  const panel = document.getElementById('job-match-panel');
  const body  = document.getElementById('job-match-body');

  const jobDesc    = document.getElementById('f-jobdesc').value.trim();
  const targetJob  = document.getElementById('f-targetjob').value.trim();
  const currSummary = document.getElementById('f-summary').value.trim();

  if (!state.apiKey) {
    showToast('⚙ Please add your API key in AI Settings first.');
    openApiKeyModal();
    return;
  }
  if (!jobDesc) {
    showToast('Please paste a job description first.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Tailoring…';
  status.textContent = 'AI is analyzing the job description and tailoring your resume…';
  panel.style.display = 'none';

  const currentSummarySection = currSummary
    ? `My current summary: "${currSummary}"\n\n`
    : '';

  const targetJobSection = targetJob
    ? `Target Role: ${targetJob}\n\n`
    : '';

  const prompt = `You are a professional resume writer and ATS (Applicant Tracking System) expert.

${targetJobSection}${currentSummarySection}Job Description:
"${jobDesc}"

Task: Write a powerful, ATS-optimized professional summary (3-4 sentences max) that:
1. Incorporates key skills and keywords from the job description
2. Highlights relevant experience that matches the role requirements
3. Uses strong action verbs and quantifiable language
4. Is tailored specifically to this job posting

Return ONLY the improved summary text, nothing else. No labels, no explanations.`;

  const result = await callAI(prompt);

  if (result) {
    tailoredSummaryText = result.trim();
    body.textContent = tailoredSummaryText;
    panel.style.display = 'block';
    status.textContent = '✓ AI has tailored your resume to the job description!';
    showToast('✦ Resume tailored to job description!');
  } else {
    status.textContent = '✗ Tailoring failed. Check your API key and try again.';
    showToast('AI tailoring failed. Please try again.');
  }

  btn.disabled = false;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 9.19 2 12l7.19 2.81L12 22l2.81-7.19L22 12l-7.19-2.81z"/></svg> AI Tailor Resume to Job`;
}

function applyTailoredSummary() {
  if (!tailoredSummaryText) return;
  document.getElementById('f-summary').value = tailoredSummaryText;
  state.summary = tailoredSummaryText;
  renderResume();
  showToast('✓ Tailored summary applied to your resume!');
  // Switch to summary tab so user can see it
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-tab="summary"]').classList.add('active');
  document.getElementById('tab-summary').classList.add('active');
}

// ════════════════════════════════════════
//  API KEY MODAL
// ════════════════════════════════════════
function openApiKeyModal() {
  document.getElementById('apiKeyInput').value = state.apiKey;
  document.getElementById('apiKeyModal').classList.add('open');
}
function closeApiKeyModal() {
  document.getElementById('apiKeyModal').classList.remove('open');
}
function saveApiKey() {
  state.apiKey = document.getElementById('apiKeyInput').value.trim();
  closeApiKeyModal();
  showToast(state.apiKey ? '✓ API key saved!' : 'API key cleared.');
}
document.getElementById('apiKeyModal').addEventListener('click', e => {
  if (e.target === document.getElementById('apiKeyModal')) closeApiKeyModal();
});

// ════════════════════════════════════════
//  PDF DOWNLOAD
// ════════════════════════════════════════
function downloadPDF() {
  const name = state.personal.name || 'Resume';
  const el = document.getElementById('resume-preview');
  showToast('⬇ Generating PDF…');
  const opt = {
    margin: 0,
    filename: `${name.replace(/\s+/g,'-')}-Resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(el).save().then(() => showToast('✓ PDF downloaded!'));
}

// ════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ════════════════════════════════════════
//  SAMPLE DATA
// ════════════════════════════════════════
function fillSampleData() {
  document.getElementById('f-name').value     = 'Alex Johnson';
  document.getElementById('f-email').value    = 'alex@example.com';
  document.getElementById('f-phone').value    = '+1 (415) 555-0192';
  document.getElementById('f-linkedin').value = 'linkedin.com/in/alexjohnson';
  document.getElementById('f-github').value   = 'github.com/alexj';
  document.getElementById('f-location').value = 'San Francisco, CA';
  document.getElementById('f-jobtitle').value = 'Senior Full-Stack Engineer';
  document.getElementById('f-summary').value  = 'Innovative full-stack engineer with 6+ years crafting scalable web applications and leading cross-functional teams. Proven track record of reducing load times by 40% and shipping features that reach millions of users. Passionate about clean architecture, developer experience, and mentoring emerging engineers.';

  state.skills = ['React','TypeScript','Node.js','Python','PostgreSQL','AWS','Docker','GraphQL','Redis'];
  state.softSkills = ['Leadership','Mentoring','Communication','Problem Solving'];
  renderSkills(); renderSoftSkills();

  state.experience = [
    { title:'Senior Software Engineer', company:'Stripe', location:'San Francisco, CA', start:'Mar 2022', end:'Present',
      desc:'• Led migration of legacy monolith to microservices, reducing p99 latency by 35%\n• Architected real-time payment dashboard serving 2M+ merchants\n• Mentored 4 junior engineers and drove quarterly OKR planning\n• Shipped React component library adopted by 12 internal teams' },
    { title:'Software Engineer', company:'Airbnb', location:'Remote', start:'Jun 2019', end:'Feb 2022',
      desc:'• Built host onboarding flow that increased host conversion by 22%\n• Improved core web vitals score from 62 to 94 via code splitting and lazy loading\n• Developed A/B testing framework enabling 50+ experiments per quarter' }
  ];
  state.education = [
    { degree:'B.Sc. Computer Science', school:'UC Berkeley', year:'2019', gpa:'3.85', location:'Berkeley, CA' }
  ];
  state.projects = [
    { name:'OpenMetrics', stack:'Go, Prometheus, Grafana, K8s', link:'github.com/alexj/openmetrics',
      desc:'• Open-source observability toolkit with 2.3k GitHub stars\n• Reduced infrastructure monitoring setup time from 4hrs to 15 mins\n• Active community with 40+ contributors across 3 continents' }
  ];
  state.certs = [
    { name:'AWS Certified Solutions Architect', issuer:'Amazon Web Services', year:'2023' }
  ];

  renderEntries('experience');
  renderEntries('education');
  renderEntries('projects');
  renderEntries('certs');
  renderResume();
  showToast('✓ Sample data loaded!');
}

// ════════════════════════════════════════
//  INIT
// ════════════════════════════════════════
renderResume();
