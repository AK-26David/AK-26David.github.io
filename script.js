// ---- Starfield canvas ----
(function () {
  const c = document.getElementById('stars'), x = c.getContext('2d');
  let W, H, stars = [], shooting = [];
  function resize() {
    W = c.width = innerWidth; H = c.height = innerHeight;
    stars = Array.from({ length: Math.min(220, W * H / 9000) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + .3, s: Math.random() * .35 + .05,
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() < .12 ? 315 : 190
    }));
  }
  resize(); addEventListener('resize', resize);
  function spawnShooting() {
    shooting.push({ x: Math.random() * W * .8, y: Math.random() * H * .3, vx: 7 + Math.random() * 5, vy: 3 + Math.random() * 2, life: 1 });
    setTimeout(spawnShooting, 3500 + Math.random() * 5000);
  }
  setTimeout(spawnShooting, 2000);
  (function tick() {
    x.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.y += s.s; s.tw += .03;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      const a = .35 + Math.abs(Math.sin(s.tw)) * .55;
      x.beginPath(); x.arc(s.x, s.y, s.r, 0, 7);
      x.fillStyle = `hsla(${s.hue},100%,72%,${a})`; x.fill();
    }
    shooting = shooting.filter(sh => sh.life > 0);
    for (const sh of shooting) {
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= .02;
      const g = x.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 10, sh.y - sh.vy * 10);
      g.addColorStop(0, `rgba(0,240,255,${sh.life})`); g.addColorStop(1, 'transparent');
      x.strokeStyle = g; x.lineWidth = 2; x.beginPath();
      x.moveTo(sh.x, sh.y); x.lineTo(sh.x - sh.vx * 10, sh.y - sh.vy * 10); x.stroke();
    }
    requestAnimationFrame(tick);
  })();
})();

// ---- Typing effect ----
(function () {
  const el = document.getElementById('typed');
  const lines = [
    'Machine Learning Engineer',
    'MS in Artificial Intelligence @ Northeastern',
    'Vision · Language · Reinforcement Learning',
    'Building robots that grasp & models that heal'
  ];
  let li = 0, ci = 0, del = false;
  (function type() {
    const line = lines[li];
    el.textContent = line.slice(0, ci);
    if (!del) { ci++; if (ci > line.length) { del = true; return setTimeout(type, 1700); } }
    else { ci--; if (ci === 0) { del = false; li = (li + 1) % lines.length; } }
    setTimeout(type, del ? 28 : 55);
  })();
})();

// ---- Scroll reveal ----
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ---- Count-up stats ----
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1600;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(target * ease) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
    io.unobserve(el);
  }), { threshold: .6 });
  document.querySelectorAll('.stat-num').forEach(el => io.observe(el));
})();

// ---- Cursor glow + nav ----
(function () {
  const g = document.getElementById('cursorGlow');
  addEventListener('mousemove', e => { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
  const nav = document.getElementById('nav');
  addEventListener('scroll', () => {
    nav.style.boxShadow = scrollY > 40 ? '0 8px 32px rgba(0,240,255,.12)' : 'none';
  });
  const ham = document.getElementById('hamburger'), links = document.querySelector('.nav-links');
  ham.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

// ---- Card tilt ----
document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - .5) * -7;
    const ry = ((e.clientX - r.left) / r.width - .5) * 7;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
