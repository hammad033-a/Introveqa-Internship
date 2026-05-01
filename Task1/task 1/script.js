// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');
navToggle && navToggle.addEventListener('click', ()=>{
  if(siteNav.style.display === 'flex'){
    siteNav.style.display = '';
  } else {
    siteNav.style.display = 'flex';
  }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      if(window.innerWidth < 700 && siteNav) siteNav.style.display = '';
    }
  });
});

// 3D tilt effect for hero card
const heroCard = document.querySelector('.hero-card');
if(heroCard){
  const rect = () => heroCard.getBoundingClientRect();
  heroCard.addEventListener('mousemove', (e)=>{
    const r = rect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = (x / r.width) - 0.5; // -0.5..0.5
    const py = (y / r.height) - 0.5;
    const rotateY = px * 8; // degrees
    const rotateX = -py * 8;
    heroCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
  });
  heroCard.addEventListener('mouseleave', ()=>{
    heroCard.style.transform = '';
  });
}

// subtle 3D tilt for header (navbar)
const header = document.querySelector('.site-header');
if(header){
  const rectH = () => header.getBoundingClientRect();
  header.addEventListener('mousemove', (e)=>{
    const r = rectH();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const ry = x * 4; const rx = -y * 2;
    header.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  header.addEventListener('mouseleave', ()=> header.style.transform = '');
}

// Try cache-busted reload for avatar if it fails to load (helps when file is newly added)
const avatarImg = document.getElementById('hero-avatar');
if(avatarImg){
  avatarImg.addEventListener('error', ()=>{
    console.warn('Hero avatar failed to load, attempting fallback and cache-bust.');
    const alternates = ['avatar.jpg','profile.jpg','avatar.svg'];
    let tried = 0;
    const tryNext = ()=>{
      if(tried >= alternates.length) return console.error('No avatar found in project folder. Place avatar.jpg or profile.jpg in the project root.');
      const name = alternates[tried++];
      avatarImg.src = name + '?v=' + Date.now();
      setTimeout(()=>{
        if(avatarImg.complete && avatarImg.naturalWidth>0){
          console.log('Loaded avatar:', name);
        } else {
          tryNext();
        }
      }, 400);
    };
    tryNext();
  });
}

// Skill box 3D pop interactions
(() => {
  const boxes = Array.from(document.querySelectorAll('.skill-box'));
  if(!boxes.length) return;
  const closeAll = (except) => boxes.forEach(b=>{
    if(b===except) return;
    b.classList.remove('is-open');
    b.setAttribute('aria-expanded','false');
  });

  boxes.forEach(box => {
    const open = () => {
      const isOpen = box.classList.toggle('is-open');
      box.setAttribute('aria-expanded', String(isOpen));
      if(isOpen) closeAll(box);
    };
    box.addEventListener('click', (e)=>{ open(); e.stopPropagation(); });
    box.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      if(e.key === 'Escape') { box.classList.remove('is-open'); box.setAttribute('aria-expanded','false'); }
    });
  });

  // click outside closes
  document.addEventListener('click', ()=> closeAll());
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeAll(); });
})();
