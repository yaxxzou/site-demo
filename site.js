// Sandra Grinschgl — design demo: shared behaviour for every page.

const isHome = document.body.classList.contains('home');

// Demo only: menu items whose pages don't exist yet (href="#") do nothing when clicked.
document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

// ---------- Laptop dropdown ----------
// Opens on hover, stays open while the mouse is on the item or the panel,
// and waits a moment before closing so small mouse movements don't shut it.
// "Research Areas" itself is not a page: clicking it just opens/closes the dropdown.
document.querySelectorAll('.has-sub').forEach(li => {
  let timer;
  const open = () => { clearTimeout(timer); li.classList.add('open'); document.body.classList.add('menu-open'); };
  const close = () => { timer = setTimeout(() => { li.classList.remove('open'); document.body.classList.remove('menu-open'); }, 250); };
  li.addEventListener('mouseenter', open);
  li.addEventListener('mouseleave', close);
  li.addEventListener('focusin', open);
  li.addEventListener('focusout', close);
  li.querySelector('[data-parent]').addEventListener('click', e => {
    e.preventDefault();
    li.classList.contains('open') ? (li.classList.remove('open'), document.body.classList.remove('menu-open')) : open();
  });
});

// ---------- Phone menu ----------
const menuBtn = document.querySelector('.menu-btn');
function setMenu(open) {
  document.body.classList.toggle('mnav-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('mnav-open')));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
// Tapping the blurred page closes the menu (and doesn't follow a link hidden under the blur)
document.addEventListener('click', e => {
  if (!document.body.classList.contains('mnav-open')) return;
  if (e.target.closest('.mnav, .bar')) return;
  e.preventDefault();
  e.stopPropagation();
  setMenu(false);
}, true);
window.addEventListener('resize', () => { if (window.innerWidth > 980) setMenu(false); });
// Choosing a page in the phone menu closes the menu
document.querySelectorAll('.mnav a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Tapping anywhere on the "Research Areas" row (text or arrow) folds its sub-menu out / in
document.querySelectorAll('.row-btn').forEach(btn => btn.addEventListener('click', () => {
  const sub = document.getElementById(btn.getAttribute('aria-controls'));
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  sub.classList.toggle('open', open);
}));

// ---------- Layout helpers ----------
// Line up the dropdown list under its menu item
function alignPanel() {
  document.querySelectorAll('.has-sub').forEach(li => {
    const ul = li.querySelector('.panel ul');
    const inner = li.querySelector('.panel-inner');
    const offset = li.querySelector('a').getBoundingClientRect().left - inner.getBoundingClientRect().left
                   - parseFloat(getComputedStyle(inner).paddingLeft);
    ul.style.marginLeft = Math.max(0, offset) + 'px';
  });
}

// HOME only: fit on one screen (laptop/desktop) by shrinking the body size step by step
function fitHome() {
  const root = document.documentElement;
  root.style.removeProperty('--fs');
  if (window.innerWidth <= 760) return;        // phones: normal scrolling
  // Start from the shared size rule (same as every other page), shrink only if Home doesn't fit
  let fs = parseFloat(getComputedStyle(document.querySelector('.prose')).fontSize);
  root.style.setProperty('--fs', fs + 'px');
  while (root.scrollHeight > window.innerHeight && fs > 14) {
    fs -= 0.25;
    root.style.setProperty('--fs', fs + 'px');
  }
}

// HOME only, phones: size the name so "PD Dr. Sandra Grinschgl" fits on one line (max 30px, min 18px)
function fitName() {
  const h1 = document.querySelector('h1'), name = h1.querySelector('.name');
  if (window.innerWidth > 760) { h1.style.removeProperty('--name-fs'); return; }
  let size = 30;
  h1.style.setProperty('--name-fs', size + 'px');
  while (name.getBoundingClientRect().width > h1.clientWidth && size > 18) {
    size -= 0.5;
    h1.style.setProperty('--name-fs', size + 'px');
  }
}

function layout() {
  if (isHome) { fitHome(); fitName(); }
  alignPanel();
}
window.addEventListener('resize', layout);
window.addEventListener('load', layout);
document.fonts.ready.then(layout);
layout();
