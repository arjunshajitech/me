// ── Duration calculator ──────────────────────────────────────────────────
function calcDuration(startYear, startMonth, endYear, endMonth) {
  let years = endYear - startYear;
  let months = endMonth - startMonth;
  if (months < 0) { years--; months += 12; }
  const parts = [];
  if (years > 0)  parts.push(years  + ' yr'  + (years  > 1 ? 's' : ''));
  if (months > 0) parts.push(months + ' mo'  + (months > 1 ? 's' : ''));
  return parts.join(' ') || '< 1 mo';
}

(function fillDurations() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1-indexed

  // Techgentsia total: Apr 2023 → now
  document.getElementById('company-total').textContent =
    calcDuration(2023, 4, y, m);

  // R&D Engineer: Oct 2024 → now
  document.getElementById('duration-rnd').textContent =
    calcDuration(2024, 10, y, m);

  // Software Engineer: Apr 2023 → Oct 2024 (fixed range)
  document.getElementById('duration-swe').textContent =
    calcDuration(2023, 4, 2024, 10);
})();

// ── Custom cursor ────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function tick() {
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(tick);
})();

document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    ring.style.width = '50px';
    ring.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    ring.style.width = '36px';
    ring.style.height = '36px';
  });
});

// ── Scroll fade-in ───────────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1 });

document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
