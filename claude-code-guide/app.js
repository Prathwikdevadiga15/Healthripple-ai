/* ============================================
   CAREsaathi AI — Interactive Healthcare Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initParticleCanvas();
  initNavbar();
  initMobileMenu();
  initLanguageSelector();
  initRevealAnimations();
  initCounterAnimations();
  initBackToTop();
  initSmoothScroll();
  initNavActiveState();
  initAICommandCenter();
  initHospitalMap();
});

/* ---- PRELOADER ---- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const statusEl = document.getElementById('preloader-status');
  const statuses = ['Initializing Healthcare AI...', 'Loading CARE Agent...', 'Loading MED Agent...', 'Loading EMERGENCY Agent...', 'Connecting Safety Engine...', 'Starting RAG Pipeline...', 'System Ready ✓'];
  let idx = 0;
  const si = setInterval(() => { idx++; if (idx < statuses.length && statusEl) statusEl.textContent = statuses[idx]; if (idx >= statuses.length - 1) clearInterval(si); }, 300);
  window.addEventListener('load', () => { setTimeout(() => { preloader.classList.add('done'); document.body.style.overflow = ''; }, 2200); });
  setTimeout(() => preloader.classList.add('done'), 4000);
}

/* ---- CURSOR ---- */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot'), ring = document.getElementById('cursor-ring');
  if (!dot || !ring || !window.matchMedia('(hover:hover)').matches) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; dot.style.transform = 'translate(-50%,-50%)'; });
  (function anim() { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(anim); })();
  document.querySelectorAll('a,button,.agent-card,.problem-card,.team-card,.cc-quick-btn,.impact-card,.future-item,.arch-chip,.dash-card,.cg-item,.safety-level').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.borderColor = 'rgba(0,212,170,.8)'; dot.style.transform = 'translate(-50%,-50%) scale(2)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(0,212,170,.5)'; dot.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });
}

/* ---- PARTICLES ---- */
function initParticleCanvas() {
  const c = document.getElementById('particle-canvas'); if (!c) return;
  const ctx = c.getContext('2d'); let ps = [], w, h;
  function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
  class P { constructor() { this.reset(); } reset() { this.x = Math.random() * w; this.y = Math.random() * h; this.vx = (Math.random() - .5) * .3; this.vy = (Math.random() - .5) * .3; this.r = Math.random() * 1.5 + .5; this.o = Math.random() * .4 + .1; const cs = ['0,212,170','14,165,233','139,92,246']; this.c = cs[Math.floor(Math.random() * cs.length)]; } update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > w) this.vx *= -1; if (this.y < 0 || this.y > h) this.vy *= -1; } draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${this.c},${this.o})`; ctx.fill(); } }
  function init() { const n = Math.min(Math.floor(w * h / 14000), 70); ps = []; for (let i = 0; i < n; i++) ps.push(new P()); }
  function conn() { for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y); if (d < 140) { ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.strokeStyle = `rgba(0,212,170,${.05 * (1 - d / 140)})`; ctx.lineWidth = .5; ctx.stroke(); } } }
  function anim() { ctx.clearRect(0, 0, w, h); ps.forEach(p => { p.update(); p.draw(); }); conn(); requestAnimationFrame(anim); }
  resize(); init(); anim();
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); init(); }, 200); });
}

/* ---- NAV ---- */
function initNavbar() { const n = document.getElementById('nav'); let t = false; window.addEventListener('scroll', () => { if (!t) { requestAnimationFrame(() => { n.classList.toggle('scrolled', scrollY > 80); t = false; }); t = true; } }); }

/* ---- MOBILE MENU ---- */
function initMobileMenu() {
  const h = document.getElementById('hamburger'), m = document.getElementById('mobile-menu'); if (!h || !m) return;
  h.addEventListener('click', () => { h.classList.toggle('active'); m.classList.toggle('active'); document.body.style.overflow = m.classList.contains('active') ? 'hidden' : ''; });
  m.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { h.classList.remove('active'); m.classList.remove('active'); document.body.style.overflow = ''; }));
}

/* ---- LANGUAGE SELECTOR ---- */
function initLanguageSelector() {
  const b = document.getElementById('lang-btn'), d = document.getElementById('lang-dropdown'), cl = document.getElementById('current-lang'); if (!b || !d) return;
  b.addEventListener('click', e => { e.stopPropagation(); d.classList.toggle('show'); });
  document.addEventListener('click', () => d.classList.remove('show'));
  d.querySelectorAll('.lang-option').forEach(o => o.addEventListener('click', () => { const lm = { en: 'EN', kn: 'ಕನ್ನ', hi: 'हिं', ta: 'தமி', te: 'తెలు', ml: 'മല', tu: 'ತುಳು' }; cl.textContent = lm[o.dataset.lang] || o.dataset.lang.toUpperCase(); d.querySelectorAll('.lang-option').forEach(x => x.classList.remove('active')); o.classList.add('active'); d.classList.remove('show'); }));
}

/* ---- REVEAL ---- */
function initRevealAnimations() {
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), parseInt(e.target.dataset.delay || 0)); obs.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '-40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ---- COUNTERS ---- */
function initCounterAnimations() {
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const el = e.target, t = parseInt(el.dataset.count); animC(el, 0, t, 1500); obs.unobserve(el); } }), { threshold: 0.5 });
  document.querySelectorAll('.stat-value[data-count]').forEach(c => obs.observe(c));
}
function animC(el, s, e, d) { const st = performance.now(); (function u(n) { const p = Math.min((n - st) / d, 1), v = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(s + (e - s) * v); if (p < 1) requestAnimationFrame(u); else el.textContent = e + '+'; })(st); }

/* ---- BACK TO TOP ---- */
function initBackToTop() { const b = document.getElementById('back-to-top'); if (!b) return; window.addEventListener('scroll', () => b.classList.toggle('visible', scrollY > 600)); b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); }

/* ---- SMOOTH SCROLL ---- */
function initSmoothScroll() { document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function (e) { const h = this.getAttribute('href'); if (h === '#') return; const t = document.querySelector(h); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } })); }

/* ---- NAV ACTIVE ---- */
function initNavActiveState() {
  const ss = document.querySelectorAll('section[id]'), ls = document.querySelectorAll('.nav-link[data-section]');
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const id = e.target.id; ls.forEach(l => l.classList.toggle('active', l.dataset.section === id)); } }), { threshold: 0.15, rootMargin: '-72px 0px -40% 0px' }).observe;
  ss.forEach(s => { const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) ls.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id)); }), { threshold: 0.15, rootMargin: '-72px 0px -40% 0px' }); obs.observe(s); });
}

/* ============================================
   AI COMMAND CENTER — Full Healthcare Chat
   ============================================ */
function initAICommandCenter() {
  const msgs = document.getElementById('cc-messages');
  const input = document.getElementById('cc-input');
  const sendBtn = document.getElementById('cc-send-btn');
  const voiceBtn = document.getElementById('cc-voice-btn');
  const actionLog = document.getElementById('action-log');
  const careState = document.getElementById('care-state');
  const medState = document.getElementById('med-state');
  const emgState = document.getElementById('emg-state');
  if (!msgs || !input) return;

  document.querySelectorAll('.cc-quick-btn').forEach(b => b.addEventListener('click', () => { if (b.dataset.msg) { addUser(b.dataset.msg); process(b.dataset.msg); } }));
  sendBtn.addEventListener('click', send);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });
  function send() { const m = input.value.trim(); if (m) { addUser(m); process(m); input.value = ''; } }

  voiceBtn.addEventListener('click', () => {
    voiceBtn.classList.toggle('recording');
    if (voiceBtn.classList.contains('recording')) {
      log('🎤 Voice recording started...');
      setTimeout(() => {
        voiceBtn.classList.remove('recording');
        const vm = ['ನನಗೆ ಜ್ವರ ಮತ್ತು ತಲೆನೋವು ಇದೆ', 'मुझे बुखार और खांसी है', 'I need help finding a hospital nearby'];
        const m = vm[Math.floor(Math.random() * vm.length)];
        log('🎤 Transcribed: "' + m.substring(0, 30) + '..."');
        addUser(m); process(m);
      }, 2000);
    } else log('🎤 Cancelled');
  });

  function addUser(t) { const d = document.createElement('div'); d.className = 'cc-msg user'; d.innerHTML = `<div class="cc-msg-avatar">👤</div><div class="cc-msg-content"><p>${esc(t)}</p></div>`; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  function addAI(h) { const d = document.createElement('div'); d.className = 'cc-msg ai'; d.innerHTML = `<div class="cc-msg-avatar">🤖</div><div class="cc-msg-content">${h}</div>`; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  function addThink() { const d = document.createElement('div'); d.className = 'cc-msg ai'; d.id = 'think'; d.innerHTML = `<div class="cc-msg-avatar">🤖</div><div class="cc-msg-content"><div class="agent-thinking"><span class="think-dot"></span><span class="think-dot"></span><span class="think-dot"></span><span class="think-label">Analyzing...</span></div></div>`; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  function rmThink() { const e = document.getElementById('think'); if (e) e.remove(); }
  function log(t) { const n = new Date(), ts = n.getHours().toString().padStart(2, '0') + ':' + n.getMinutes().toString().padStart(2, '0'); const i = document.createElement('div'); i.className = 'action-item'; i.innerHTML = `<span class="action-time">${ts}</span><span class="action-text">${t}</span>`; actionLog.appendChild(i); while (actionLog.children.length > 10) actionLog.removeChild(actionLog.firstChild); }
  function setAgent(c, m, e) { if (careState) careState.textContent = c; if (medState) medState.textContent = m; if (emgState) emgState.textContent = e; }

  function process(text) {
    const t = text.toLowerCase();
    setAgent('Processing...', 'Ready', 'Ready');
    log('🔍 Intent classification...');
    addThink();

    setTimeout(() => log('🧠 Agent routing...'), 400);

    setTimeout(() => {
      rmThink();

      // ---- EMERGENCY ----
      if (t.includes('chest pain') || t.includes('severe') || t.includes('emergency') || t.includes('accident') || t.includes('bleeding') || t.includes('breathing') || t.includes('unconscious')) {
        setAgent('Ready', 'Ready', 'ACTIVE');
        log('🚨 EMERGENCY intent detected!');
        log('🛡️ Safety Engine: Risk=CRITICAL');
        log('🏥 Finding nearest facilities...');
        log('📞 Emergency contact workflow...');

        // Extract danger signs from input
        const signs = [];
        if (t.includes('chest pain')) signs.push('Chest Pain');
        if (t.includes('breathing')) signs.push('Breathing Difficulty');
        if (t.includes('unconscious')) signs.push('Unconsciousness');
        if (t.includes('bleeding')) signs.push('Severe Bleeding');
        if (signs.length === 0) signs.push('Emergency Situation');

        addAI(`
          <div style="padding:14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:12px;margin-bottom:12px;">
            <p style="font-size:15px;font-weight:700;color:var(--danger);margin-bottom:8px;">⚠️ POTENTIAL EMERGENCY DETECTED</p>
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;">Risk indicators detected:</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">${signs.map(s => `<span style="font-size:11px;padding:4px 10px;background:rgba(239,68,68,.12);color:var(--danger);border-radius:100px;font-weight:600;">🔴 ${s}</span>`).join('')}</div>
            <p style="font-size:14px;font-weight:700;color:var(--text-white);margin-bottom:10px;">Recommended: Seek immediate professional medical assistance.</p>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div style="padding:8px 12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;font-size:13px;"><strong>🏥 KMC Hospital</strong> — 2.3 km · ER Available</div>
              <div style="padding:8px 12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;font-size:13px;"><strong>🚑 Ambulance #108</strong> — Call immediately</div>
              <div style="padding:8px 12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;font-size:13px;"><strong>📞 Emergency Contacts</strong> — Ready to notify</div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--warning);padding:8px 12px;background:rgba(245,158,11,.06);border-left:3px solid var(--warning);border-radius:4px;">⚕️ This is AI-assisted guidance. Please call 112 for professional emergency help immediately.</p>
          <p style="font-size:11px;color:var(--text-dim);margin-top:8px;">🛡️ Safety: CRITICAL | 👨‍⚕️ Human escalation: REQUIRED</p>
        `);
        log('✅ Emergency response delivered');
        setTimeout(() => setAgent('Ready', 'Ready', 'Monitoring'), 2000);
        return;
      }

      // ---- SYMPTOMS ----
      if (t.includes('fever') || t.includes('cough') || t.includes('headache') || t.includes('pain') || t.includes('nausea') || t.includes('symptom') || t.match(/[\u0C80-\u0CFF].*[\u0C80-\u0CFF]/) || t.includes('ಜ್ವರ') || t.includes('बुखार') || t.includes('खांसी')) {
        setAgent('ACTIVE', 'Ready', 'Ready');
        log('🩺 CARE Agent activated');
        log('📊 Symptom analysis via RAG...');
        log('📚 Sources: Clinical guidance, ICMR');
        log('🛡️ Safety Engine: Risk=MODERATE');

        addAI(`
          <p style="margin-bottom:10px;">I understand you're experiencing symptoms. Let me assess this for you using our agentic pipeline:</p>
          <div style="padding:10px;background:rgba(0,0,0,.2);border-radius:8px;margin-bottom:12px;">
            <p style="font-size:11px;color:var(--accent);font-weight:700;margin-bottom:8px;">AGENTIC FLOW</p>
            <div style="display:flex;gap:4px;flex-wrap:wrap;font-size:11px;font-family:var(--font-mono);">
              <span style="color:var(--success);">✓ Understand</span><span style="color:var(--text-dim);">→</span>
              <span style="color:var(--success);">✓ Plan</span><span style="color:var(--text-dim);">→</span>
              <span style="color:var(--success);">✓ Retrieve</span><span style="color:var(--text-dim);">→</span>
              <span style="color:var(--success);">✓ Assess</span><span style="color:var(--text-dim);">→</span>
              <span style="color:var(--success);">✓ Act</span><span style="color:var(--text-dim);">→</span>
              <span style="color:var(--success);">✓ Verify</span><span style="color:var(--text-dim);">→</span>
              <span style="color:var(--accent);font-weight:700;">→ Explain</span>
            </div>
          </div>
          <div style="padding:12px;background:rgba(0,0,0,.2);border-radius:10px;margin-bottom:12px;">
            <p style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">🔬 Risk Assessment</p>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><span style="font-size:12px;min-width:100px;color:var(--text-secondary)">Viral Infection</span><div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:68%;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:3px"></div></div><span style="font-size:12px;font-weight:700;font-family:var(--font-mono);color:var(--warning)">68%</span></div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><span style="font-size:12px;min-width:100px;color:var(--text-secondary)">Stress/Fatigue</span><div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:42%;background:var(--gradient);border-radius:3px"></div></div><span style="font-size:12px;font-weight:700;font-family:var(--font-mono);color:var(--accent)">42%</span></div>
            <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:12px;min-width:100px;color:var(--text-secondary)">Dehydration</span><div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:30%;background:var(--gradient);border-radius:3px"></div></div><span style="font-size:12px;font-weight:700;font-family:var(--font-mono);color:var(--accent)">30%</span></div>
          </div>
          <p style="font-size:13px;margin-bottom:6px;">📋 <strong>Recommended Next Steps:</strong></p>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;">1. Stay hydrated — drink warm fluids<br>2. Rest adequately<br>3. Monitor temperature regularly<br>4. If symptoms persist beyond 3 days, consult a healthcare professional</p>
          <div style="margin-top:10px;padding:8px 12px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.1);border-radius:8px;font-size:12px;display:flex;align-items:center;gap:6px;"><span style="color:var(--success);font-weight:700;">🟢 General Information</span><span style="color:var(--text-muted)">— Educational guidance provided</span></div>
          <p style="font-size:11px;color:var(--text-dim);margin-top:8px;">📚 Sources: WHO Clinical Guidelines, ICMR Advisory | 🛡️ Safety: PASSED | 👨‍⚕️ Escalation: Optional</p>
        `);
        log('✅ Symptom assessment delivered');
        setTimeout(() => setAgent('Ready', 'Ready', 'Ready'), 2000);
        return;
      }

      // ---- MEDICINE ----
      if (t.includes('medicine') || t.includes('medication') || t.includes('reminder') || t.includes('metformin') || t.includes('drug') || t.includes('dose') || t.includes('दवाई') || t.includes('prescription')) {
        setAgent('Ready', 'ACTIVE', 'Ready');
        log('💊 MED Agent activated');
        log('📋 Medication schedule created');
        log('🛡️ Safety: Drug interaction check');

        addAI(`
          <p style="margin-bottom:10px;">💊 <strong>MED Agent</strong> has set up your medication reminder:</p>
          <div style="padding:14px;background:rgba(14,165,233,.05);border:1px solid rgba(14,165,233,.12);border-radius:12px;margin-bottom:12px;">
            <p style="font-size:14px;font-weight:700;margin-bottom:10px;color:var(--accent-2);">✅ Medication Reminder Created</p>
            <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
              <strong>Medicine:</strong> Metformin 500mg<br>
              <strong>Schedule:</strong> Daily at 8:00 AM<br>
              <strong>Instructions:</strong> Take with breakfast<br>
              <strong>Alerts:</strong> Voice + Push Notification<br>
              <strong>Interaction Check:</strong> No known conflicts ✓
            </div>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);">🔔 Say "mark as taken" or "snooze 30 min" when reminded.</p>
          <p style="font-size:12px;color:var(--text-dim);margin-top:8px;">⚕️ Always follow your doctor's prescription. | 📚 Source: Drug Database</p>
        `);
        log('✅ Medication reminder set');
        setTimeout(() => setAgent('Ready', 'Ready', 'Ready'), 2000);
        return;
      }

      // ---- HOSPITAL / FIND ----
      if (t.includes('hospital') || t.includes('clinic') || t.includes('doctor') || t.includes('nearby') || t.includes('find') || t.includes('healthcare') || t.includes('pharmacy')) {
        setAgent('Ready', 'Ready', 'Ready');
        log('🗺️ Healthcare directory search...');
        log('📍 Location: Mangalore, Karnataka');

        addAI(`
          <p style="margin-bottom:12px;">🗺️ Here are the nearest healthcare facilities:</p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
            <div style="padding:10px 14px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;gap:10px;"><span style="font-size:18px">🏥</span><div><strong style="font-size:13px">KMC Hospital</strong><span style="display:block;font-size:12px;color:var(--text-muted)">2.3 km · Multi-specialty · 24/7 ER · 4.5★</span></div></div>
            <div style="padding:10px 14px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;gap:10px;"><span style="font-size:18px">🏥</span><div><strong style="font-size:13px">AJ Hospital</strong><span style="display:block;font-size:12px;color:var(--text-muted)">3.1 km · General · 24/7 · 4.3★</span></div></div>
            <div style="padding:10px 14px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;gap:10px;"><span style="font-size:18px">💊</span><div><strong style="font-size:13px">City Pharmacy</strong><span style="display:block;font-size:12px;color:var(--text-muted)">1.2 km · Open till 10 PM</span></div></div>
            <div style="padding:10px 14px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;gap:10px;"><span style="font-size:18px">🧪</span><div><strong style="font-size:13px">Mangalore Diagnostics</strong><span style="display:block;font-size:12px;color:var(--text-muted)">2.8 km · Lab Tests · 9 AM-6 PM</span></div></div>
          </div>
          <p style="font-size:13px;color:var(--accent);">👇 See the Healthcare Access Map section for directions.</p>
          <p style="font-size:11px;color:var(--text-dim);margin-top:8px;">📍 DEMO DATA — Facility info is simulated for prototype.</p>
        `);
        log('✅ Healthcare facility results');
        return;
      }

      // ---- REPORT ----
      if (t.includes('report') || t.includes('hemoglobin') || t.includes('blood') || t.includes('wbc') || t.includes('sugar') || t.includes('test result')) {
        setAgent('ACTIVE', 'Ready', 'Ready');
        log('📄 Medical Report Assistant...');
        log('🔍 Extracting parameters...');
        log('📚 Cross-referencing normal ranges');
        log('🛡️ Safety: Educational only');

        addAI(`
          <p style="margin-bottom:12px;">📄 <strong>Report Assistant</strong> — Let me explain your results:</p>
          <div style="padding:14px;background:rgba(0,0,0,.2);border-radius:10px;margin-bottom:12px;">
            <p style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:10px;">YOUR REPORT — Blood Test</p>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;"><span>Hemoglobin</span><span style="font-weight:700;font-family:var(--font-mono)">12.4 g/dL</span><span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px;background:rgba(34,197,94,.1);color:var(--success)">Normal ✓</span></div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;"><span>WBC Count</span><span style="font-weight:700;font-family:var(--font-mono)">8,500 /µL</span><span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px;background:rgba(34,197,94,.1);color:var(--success)">Normal ✓</span></div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;"><span>Fasting Sugar</span><span style="font-weight:700;font-family:var(--font-mono)">115 mg/dL</span><span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px;background:rgba(245,158,11,.1);color:var(--warning)">Borderline ⚠</span></div>
          </div>
          <div style="padding:10px;background:rgba(14,165,233,.05);border:1px solid rgba(14,165,233,.1);border-radius:8px;font-size:13px;color:var(--text-secondary);margin-bottom:8px;">💡 <strong>What this means:</strong> Your blood sugar (115 mg/dL) is slightly above the normal fasting range (70-100 mg/dL). This may indicate pre-diabetes risk. Regular monitoring is recommended.</div>
          <p style="font-size:12px;color:var(--text-dim);padding:8px;background:rgba(245,158,11,.04);border-radius:6px;">⚕️ This explanation is educational and does not constitute a diagnosis. Please consult your doctor for clinical interpretation.</p>
        `);
        log('✅ Report analysis delivered');
        setTimeout(() => setAgent('Ready', 'Ready', 'Ready'), 2000);
        return;
      }

      // ---- HEALTH EDUCATION ----
      if (t.includes('diabetes') || t.includes('signs') || t.includes('education') || t.includes('prevention') || t.includes('tips') || t.includes('what are') || t.includes('how to')) {
        setAgent('ACTIVE', 'Ready', 'Ready');
        log('🧠 Health Education module...');
        log('📚 RAG: Retrieved health info');

        addAI(`
          <p style="margin-bottom:12px;">🧠 <strong>Health Education</strong> — Here's what you should know:</p>
          <div style="padding:14px;background:rgba(0,212,170,.04);border:1px solid rgba(0,212,170,.1);border-radius:12px;margin-bottom:12px;">
            <p style="font-size:14px;font-weight:700;margin-bottom:10px;">Early Signs of Diabetes</p>
            <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
              <p>🔹 Increased thirst and frequent urination</p>
              <p>🔹 Unexplained weight loss</p>
              <p>🔹 Fatigue and weakness</p>
              <p>🔹 Blurred vision</p>
              <p>🔹 Slow healing of wounds</p>
              <p>🔹 Tingling/numbness in hands or feet</p>
            </div>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">📋 <strong>Recommended:</strong> Annual blood sugar screening, especially if family history exists. Maintain healthy weight and regular physical activity.</p>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;padding:8px 12px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.1);border-radius:8px;"><span style="color:var(--success);font-weight:700;">🟢 General Information</span><span style="color:var(--text-muted)">— Educational content</span></div>
          <p style="font-size:11px;color:var(--text-dim);margin-top:8px;">📚 Source: WHO Diabetes Fact Sheet, ICMR Guidelines</p>
        `);
        log('✅ Health education delivered');
        setTimeout(() => setAgent('Ready', 'Ready', 'Ready'), 2000);
        return;
      }

      // ---- KANNADA ----
      if (text.match(/[\u0C80-\u0CFF]/) || t.includes('kannada')) {
        log('🌐 Language: Kannada detected');
        log('🔄 Translation pipeline active');
        addAI(`
          <p>ನಮಸ್ಕಾರ! 🙏 ನಾನು CAREsaathi AI, ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ.</p>
          <p style="margin-top:8px;font-size:13px;color:var(--text-secondary);">ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ನೀಡಿ. ನಾನು ಲಕ್ಷಣಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಬಲ್ಲೆ, ಔಷಧಿ ನೆನಪೊಲೆಗಳನ್ನು ಹೊಂದಿಸಬಲ್ಲೆ, ಮತ್ತು ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಬಲ್ಲೆ.</p>
          <p style="margin-top:8px;font-size:12px;color:var(--text-dim);">[Translated: Hello! I'm CAREsaathi AI, your health assistant. Share more about your health concern. I can assess symptoms, set medication reminders, and find nearby hospitals.]</p>
          <p style="font-size:11px;color:var(--text-dim);margin-top:6px;">🌐 Powered by NLLB + Indic Translation Engine</p>
        `);
        log('✅ Kannada response generated');
        return;
      }

      // ---- HINDI ----
      if (text.match(/[\u0900-\u097F]/) || t.includes('hindi')) {
        log('🌐 Language: Hindi detected');
        addAI(`
          <p>नमस्ते! 🙏 मैं CAREsaathi AI, आपकी स्वास्थ्य सहायक।</p>
          <p style="margin-top:8px;font-size:13px;color:var(--text-secondary);">आपकी स्वास्थ्य चिंता में मैं मदद कर सकती हूं। लक्षण जांच, दवा रिमाइंडर, और नजदीकी अस्पताल खोजने में सहायता उपलब्ध है।</p>
          <p style="margin-top:8px;font-size:12px;color:var(--text-dim);">[Translated: Hello! I'm CAREsaathi AI, your health assistant. I can help with symptom check, medicine reminders, and finding nearby hospitals.]</p>
        `);
        log('✅ Hindi response generated');
        return;
      }

      // ---- DEFAULT ----
      log('📚 General query — RAG retrieval');
      addAI(`
        <p>Namaskara! 🙏 I'm <strong>CAREsaathi AI</strong>, your intelligent healthcare companion.</p>
        <p style="margin-top:10px;font-size:14px;">I can help you with:</p>
        <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;">
          <div style="font-size:13px;color:var(--text-secondary);">🩺 <strong>CARE Agent</strong> — Symptom guidance, risk screening, health education</div>
          <div style="font-size:13px;color:var(--text-secondary);">💊 <strong>MED Agent</strong> — Medication reminders, drug info, adherence tracking</div>
          <div style="font-size:13px;color:var(--text-secondary);">🚑 <strong>EMERGENCY</strong> — Hospital finder, emergency help, contact workflow</div>
          <div style="font-size:13px;color:var(--text-secondary);">📄 <strong>Reports</strong> — Understand your medical reports in simple language</div>
          <div style="font-size:13px;color:var(--text-secondary);">🧠 <strong>Education</strong> — Learn about health conditions and prevention</div>
        </div>
        <p style="margin-top:10px;font-size:13px;color:var(--accent);">Try the quick action buttons above, or ask me anything!</p>
        <p style="font-size:12px;color:var(--text-dim);margin-top:6px;">🌐 I support English, ಕನ್ನಡ, हिन्दी, தமிழ், తెలుగు, മലയാളം, and ತುಳು (planned).</p>
      `);
      log('✅ Welcome response');
      setAgent('Ready', 'Ready', 'Ready');

    }, 1200 + Math.random() * 800);
  }

  function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
}

/* ---- HEALTHCARE ACCESS MAP ---- */
function initHospitalMap() {
  const mc = document.getElementById('hospital-map'); if (!mc) return;
  if (typeof L === 'undefined') { setTimeout(initHospitalMap, 500); return; }

  const map = L.map('hospital-map', { scrollWheelZoom: false }).setView([12.9141, 74.8560], 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);

  function icon(emoji, color) {
    return L.divIcon({ html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid rgba(255,255,255,.3);box-shadow:0 4px 12px rgba(0,0,0,.4)">${emoji}</div>`, className: 'custom-marker', iconSize: [36, 36], iconAnchor: [18, 18] });
  }

  const facilities = [
    { name: 'KMC Hospital', lat: 12.8698, lng: 74.8431, emoji: '🏥', color: 'rgba(0,212,170,.9)', type: 'Hospital', desc: 'Multi-specialty · 24/7 ER · 4.5★', services: 'Emergency, Cardiology, Pediatrics, Surgery', emergency: 'Yes', contact: '+91 824 244 5858' },
    { name: 'AJ Hospital', lat: 12.8863, lng: 74.8495, emoji: '🏥', color: 'rgba(14,165,233,.9)', type: 'Hospital', desc: 'General Hospital · 24/7 · 4.3★', services: 'General Medicine, OB-GYN, Ortho', emergency: 'Yes', contact: '+91 824 222 5533' },
    { name: 'Father Muller Hospital', lat: 12.8818, lng: 74.8326, emoji: '🏥', color: 'rgba(139,92,246,.9)', type: 'Hospital', desc: 'Medical College · Trauma Center · 4.6★', services: 'Trauma, Neuro, Cardiac, ICU', emergency: 'Yes', contact: '+91 824 223 8000' },
    { name: 'City Pharmacy', lat: 12.875, lng: 74.845, emoji: '💊', color: 'rgba(245,158,11,.9)', type: 'Pharmacy', desc: 'Retail Pharmacy · Open till 10 PM', services: 'Prescription, OTC, Home Delivery', emergency: 'No', contact: '+91 824 244 0000' },
    { name: 'PHC Mangalore', lat: 12.910, lng: 74.855, emoji: '🩺', color: 'rgba(0,212,170,.7)', type: 'Clinic', desc: 'Primary Health Center · Govt', services: 'General Consultation, Vaccination', emergency: 'No', contact: '+91 824 242 0000' },
    { name: 'Mangalore Diagnostics', lat: 12.895, lng: 74.840, emoji: '🧪', color: 'rgba(139,92,246,.7)', type: 'Diagnostics', desc: 'Lab & Imaging · 9 AM-6 PM', services: 'Blood Tests, X-Ray, Ultrasound', emergency: 'No', contact: '+91 824 243 0000' },
    { name: 'Emergency Station', lat: 12.890, lng: 74.860, emoji: '🚑', color: 'rgba(239,68,68,.9)', type: 'Emergency', desc: 'Ambulance Station · 24/7', services: 'Ambulance Dispatch, First Aid', emergency: 'Yes', contact: '108' },
  ];

  facilities.forEach(f => {
    const m = L.marker([f.lat, f.lng], { icon: icon(f.emoji, f.color) }).addTo(map);
    m.bindPopup(`
      <div style="font-family:'Inter',sans-serif;padding:4px;min-width:200px;">
        <strong style="font-size:14px;">${f.name}</strong>
        <br><span style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;">${f.type}</span>
        <br><span style="font-size:12px;color:#666;">${f.desc}</span>
        <hr style="border:none;border-top:1px solid #eee;margin:6px 0;">
        <span style="font-size:12px;color:#444;"><strong>Services:</strong> ${f.services}</span>
        <br><span style="font-size:12px;color:#444;"><strong>Emergency:</strong> ${f.emergency}</span>
        <br><span style="font-size:12px;color:#444;"><strong>Contact:</strong> ${f.contact}</span>
        <br><span style="font-size:10px;color:#aaa;margin-top:4px;display:inline-block;">📍 DEMO DATA</span>
      </div>
    `);
  });

  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { setTimeout(() => map.invalidateSize(), 100); } }), { threshold: 0.1 }).observe(mc);
}
