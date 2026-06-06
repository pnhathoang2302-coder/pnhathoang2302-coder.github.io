/* ===== NAVIGATION ===== */
const nav = document.querySelector('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav && nav.classList.toggle('scrolled', window.scrollY > 20);
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    mobileMenu && mobileMenu.classList.remove('open');
  });
});

/* ===== REVEAL ON SCROLL ===== */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ===== SKILL BARS ===== */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill, .rs-fill');
  if (!fills.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.pct + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(el => io.observe(el));
}

/* ===== RADAR CHART ===== */
function drawRadar(canvasId, skills) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const size = 380;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = size / 2, cy = size / 2;
  const maxR = size / 2 - 50;
  const n = skills.length;
  const step = (2 * Math.PI) / n;
  const rings = 5;

  const angle = (i) => i * step - Math.PI / 2;
  const pt = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];

  /* rings */
  for (let r = 1; r <= rings; r++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const [x, y] = pt(i, (maxR * r) / rings);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(212,175,55,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (r === rings) {
      ctx.fillStyle = 'rgba(212,175,55,0.03)';
      ctx.fill();
    }
  }

  /* axes */
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, maxR);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(212,175,55,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /* data polygon */
  ctx.beginPath();
  skills.forEach((s, i) => {
    const [x, y] = pt(i, (maxR * s.level) / 100);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(212,175,55,0.18)';
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();

  /* dots */
  skills.forEach((s, i) => {
    const [x, y] = pt(i, (maxR * s.level) / 100);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
  });

  /* labels */
  const labelR = maxR + 28;
  ctx.font = '600 12px Ubuntu, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  skills.forEach((s, i) => {
    const [x, y] = pt(i, labelR);
    ctx.fillStyle = '#cccccc';
    ctx.fillText(s.name, x, y);
    const pctY = y + (y > cy ? 14 : -14);
    ctx.font = '10px Space Mono, monospace';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(s.level + '%', x, pctY);
    ctx.font = '600 12px Ubuntu, sans-serif';
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSkillBars();
});
