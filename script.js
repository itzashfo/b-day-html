/* ==========================================================
   CONFIGURATION — change these to reuse the site for someone else
   ========================================================== */
const birthdayConfig = {
  fullName: "Joanna Manuel",
  nickname: "Jo",
  age: 17,
  birthday: "17 September 2026",
  music: "audio/birthday-remake.mp3",
  photos: [
    "images/jo01.jpg",
    "images/jo02.jpg",
    "images/jo03.jpg",
    "images/jo04.jpg",
    "images/jo05.jpg",
    "images/jo06.jpg"
  ]
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ==========================================================
   AUDIO SYSTEM
   ========================================================== */
const AudioSystem = (() => {
  const el = document.getElementById("bgMusic");
  const fallback = document.getElementById("audioFallback");
  const toggle = document.getElementById("audioToggle");
  let ready = false;
  let muted = false;
  let fadeTimer = null;
  const TARGET_VOLUME = 0.55;

  el.addEventListener("error", () => {
    fallback.hidden = false;
    setTimeout(() => { fallback.hidden = true; }, 4000);
  });

  function fadeTo(target, duration){
    clearInterval(fadeTimer);
    const steps = 24;
    const stepTime = duration / steps;
    const start = el.volume;
    const delta = (target - start) / steps;
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      el.volume = Math.min(1, Math.max(0, start + delta * i));
      if (i >= steps) clearInterval(fadeTimer);
    }, stepTime);
  }

  function start(){
    if (ready) return;
    ready = true;
    el.volume = 0.03;
    el.play().then(() => {
      fadeTo(TARGET_VOLUME, 2200);
    }).catch(() => {
      fallback.hidden = false;
      setTimeout(() => { fallback.hidden = true; }, 4000);
    });
    toggle.classList.add("is-visible");
  }

  function toggleMute(){
    muted = !muted;
    toggle.setAttribute("aria-pressed", String(muted));
    if (muted){
      fadeTo(0, 400);
    } else {
      fadeTo(TARGET_VOLUME, 400);
    }
  }

  function fadeOutFinal(duration){
    fadeTo(0, duration);
  }

  function restart(){
    el.pause();
    el.currentTime = 0;
    ready = false;
    muted = false;
    toggle.setAttribute("aria-pressed", "false");
  }

  toggle.addEventListener("click", toggleMute);

  return { start, fadeOutFinal, restart };
})();

/* ==========================================================
   AMBIENT PARTICLE ENGINE (Canvas)
   ========================================================== */
const ParticleEngine = (() => {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h, dpr;
  let mode = "ambient"; // ambient | gathering | celebration
  let mouse = { x: -9999, y: -9999 };
  let raf;

  const colors = ["#FFFFFF", "#BFA7FF", "#FFD76A", "#FF7EB6"];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
  window.addEventListener("resize", resize);
  resize();

  function count(){
    const base = isTouch ? 45 : 90;
    return reduceMotion ? Math.round(base * 0.3) : base;
  }

  function makeParticle(){
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.4 + 0.4) * dpr,
      vx: (Math.random() - 0.5) * 0.08 * dpr,
      vy: (Math.random() - 0.5) * 0.08 * dpr,
      baseAlpha: Math.random() * 0.5 + 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      tw: Math.random() * Math.PI * 2
    };
  }

  function init(){
    particles = Array.from({ length: count() }, makeParticle);
  }
  init();
  window.addEventListener("resize", () => { init(); });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
  });

  const cx = () => w / 2;
  const cy = () => h / 2;

  function step(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.tw += 0.01;
      const twinkle = (Math.sin(p.tw) + 1) / 2;

      if (mode === "ambient"){
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        // gentle cursor displacement, desktop only
        if (!isTouch){
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90 * dpr){
            const force = (90 * dpr - dist) / (90 * dpr);
            p.x += (dx / (dist || 1)) * force * 1.4;
            p.y += (dy / (dist || 1)) * force * 1.4;
          }
        }
      } else if (mode === "gathering"){
        p.x += (cx() - p.x) * 0.02;
        p.y += (cy() - p.y) * 0.02;
      } else if (mode === "celebration"){
        p.x += p.vx * 6;
        p.y += p.vy * 6;
      }

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.baseAlpha * (0.5 + twinkle * 0.5);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  }
  step();

  function setMode(m, duration){
    mode = m;
    if (m === "celebration"){
      particles.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.2 + 0.4;
        p.x = cx(); p.y = cy();
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      });
      if (duration){
        setTimeout(() => { mode = "ambient"; init(); }, duration);
      }
    }
  }

  function burstAt(x, y){
    const burst = Array.from({ length: isTouch ? 20 : 40 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      return {
        x, y,
        r: (Math.random() * 1.6 + 0.5) * dpr,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseAlpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        tw: Math.random() * Math.PI * 2,
        life: 60
      };
    });
    let frame = 0;
    function animateBurst(){
      ctx.save();
      burst.forEach(p => {
        p.x += p.vx * dpr;
        p.y += p.vy * dpr;
        p.baseAlpha *= 0.96;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.baseAlpha, 0);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      frame++;
      if (frame < 60) requestAnimationFrame(animateBurst);
    }
    animateBurst();
  }

  return { setMode, burstAt };
})();

/* ==========================================================
   CUSTOM CURSOR
   ========================================================== */
if (!isTouch){
  document.body.classList.add("cursor-ready");
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let rx = 0, ry = 0, tx = 0, ty = 0;

  window.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    tx = e.clientX; ty = e.clientY;
  });
  function ringLoop(){
    rx += (tx - rx) * 0.18;
    ry += (ty - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(ringLoop);
  }
  ringLoop();

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("button, a, .photo-item")){
      ring.classList.add("is-active");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("button, a, .photo-item")){
      ring.classList.remove("is-active");
    }
  });
}

/* ==========================================================
   BUTTON RIPPLE (glass buttons)
   ========================================================== */
document.querySelectorAll(".btn-glass").forEach(btn => {
  btn.addEventListener("pointerdown", (e) => {
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
    btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
    btn.classList.remove("is-rippling");
    void btn.offsetWidth;
    btn.classList.add("is-rippling");
  });
});

/* ==========================================================
   SEQUENCE: OPENING -> THRESHOLD -> CINEMATIC -> HERO
   ========================================================== */
const openingScreen = document.getElementById("opening");
const openingInner = document.querySelector(".opening-inner");
const readyBtn = document.getElementById("readyBtn");
const thresholdScreen = document.getElementById("threshold");
const enterBtn = document.getElementById("enterBtn");
const cinematicScreen = document.getElementById("cinematic-intro");
const cinematicText = document.getElementById("cinematicText");
const revealStack = document.getElementById("revealStack");
const heroSection = document.getElementById("hero");
const progressNav = document.querySelector(".progress-nav");

function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

async function runOpening(){
  readyBtn.addEventListener("click", async () => {
    AudioSystem.start();
    openingInner.classList.add("is-leaving");
    await wait(900);
    openingScreen.hidden = true;
    thresholdScreen.hidden = false;
    runThreshold();
  }, { once: true });
}

async function runThreshold(){
  const lines = thresholdScreen.querySelectorAll(".threshold-line");
  lines[0].classList.add("is-in");
  await wait(1500);
  lines[1].classList.add("is-in");
  await wait(1200);
  enterBtn.hidden = false;
  enterBtn.classList.add("is-in");

  enterBtn.addEventListener("click", async () => {
    thresholdScreen.style.transition = "opacity 0.8s ease";
    thresholdScreen.style.opacity = "0";
    await wait(800);
    thresholdScreen.hidden = true;
    cinematicScreen.hidden = false;
    runCinematicIntro();
  }, { once: true });
}

async function runCinematicIntro(){
  const lines = [
    "Some days…",
    "…are just dates.",
    "But some dates…",
    "…are worth remembering."
  ];
  for (const line of lines){
    cinematicText.textContent = line;
    cinematicText.classList.add("is-in");
    await wait(1600);
    cinematicText.classList.remove("is-in");
    cinematicText.classList.add("is-out");
    await wait(600);
    cinematicText.classList.remove("is-out");
  }
  cinematicText.textContent = "";

  ParticleEngine.setMode("gathering");
  await wait(1400);

  revealStack.hidden = false;
  const revealLines = revealStack.querySelectorAll(".reveal-line");
  for (const line of revealLines){
    line.classList.add("is-in");
    await wait(800);
  }
  await wait(1600);

  cinematicScreen.style.transition = "opacity 1s ease";
  cinematicScreen.style.opacity = "0";
  await wait(1000);
  cinematicScreen.hidden = true;
  ParticleEngine.setMode("ambient");
  heroSection.hidden = false;
  progressNav.classList.add("is-visible");
  initScrollBehaviors();
}

runOpening();

/* ==========================================================
   SCROLL INVITE HIDE + PROGRESS DOTS + REVEAL-ON-SCROLL
   ========================================================== */
function initScrollBehaviors(){
  const scrollInvite = document.querySelector(".scroll-invite");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) scrollInvite.classList.add("is-hidden");
    else scrollInvite.classList.remove("is-hidden");
  }, { passive: true });

  // progress dots
  const dots = document.querySelectorAll(".progress-nav .dot");
  const navSections = [...dots].map(d => document.getElementById(d.dataset.target)).filter(Boolean);
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        dots.forEach(d => d.classList.remove("is-active"));
        const activeDot = [...dots].find(d => d.dataset.target === entry.target.id);
        if (activeDot) activeDot.classList.add("is-active");
      }
    });
  }, { threshold: 0.5 });
  navSections.forEach(s => navObserver.observe(s));

  // generic reveal-on-scroll for text
  const revealTargets = document.querySelectorAll(".reveal-p, .phrase, .transition-line, .finale-line, .finale-phrase, .finale-happy, .finale-name, .finale-date");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add("is-visible"), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  revealTargets.forEach(t => revealObserver.observe(t));

  initGallery();
  initSeventeen();
  initCard();
  initSecretStar();
  initFinale();
}

/* ==========================================================
   PHOTO GALLERY
   ========================================================== */
function initGallery(){
  const gallery = document.getElementById("gallery");
  const spans = ["span-a", "span-b", "span-c", "span-d", "span-e", "span-f"];
  const captions = ["A little moment.", "One for the memories.", "Another chapter.", "A moment worth keeping."];

  birthdayConfig.photos.forEach((src, i) => {
    const item = document.createElement("button");
    item.className = `photo-item ${spans[i % spans.length]}`;
    item.setAttribute("aria-label", `Open photo ${i + 1} of ${birthdayConfig.photos.length}`);
    item.dataset.index = i;

    const img = document.createElement("img");
    img.src = src;
    img.alt = `A photo of ${birthdayConfig.nickname}`;
    img.loading = i < 2 ? "eager" : "lazy";
    img.onerror = () => { item.style.display = "none"; };

    const scrim = document.createElement("div");
    scrim.className = "photo-scrim";

    const label = document.createElement("span");
    label.className = "photo-label";
    label.textContent = "Open memory";

    item.append(img, scrim, label);
    item.addEventListener("click", () => Lightbox.open(i));
    gallery.appendChild(item);
  });

  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add("is-visible"), i * 100);
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  gallery.querySelectorAll(".photo-item").forEach(el => galleryObserver.observe(el));
}

/* ==========================================================
   LIGHTBOX
   ========================================================== */
const Lightbox = (() => {
  const el = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const counter = document.getElementById("lightboxCounter");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  let current = 0;
  let touchStartX = null;

  function show(i){
    current = (i + birthdayConfig.photos.length) % birthdayConfig.photos.length;
    img.src = birthdayConfig.photos[current];
    img.alt = `A photo of ${birthdayConfig.nickname}, ${current + 1} of ${birthdayConfig.photos.length}`;
    counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(birthdayConfig.photos.length).padStart(2, "0")}`;
  }

  function open(i){
    show(i);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-visible"));
    document.addEventListener("keydown", onKey);
  }
  function close(){
    el.classList.remove("is-visible");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => { el.hidden = true; }, 400);
  }
  function onKey(e){
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  }

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));
  el.addEventListener("click", (e) => { if (e.target === el) close(); });

  el.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 50) show(current - 1);
    else if (dx < -50) show(current + 1);
    touchStartX = null;
  }, { passive: true });

  return { open };
})();

/* ==========================================================
   17 SECTION INTERACTION
   ========================================================== */
function initSeventeen(){
  const btn = document.getElementById("bigSeventeen");
  btn.addEventListener("click", (e) => {
    ParticleEngine.burstAt(e.clientX * (window.devicePixelRatio || 1), e.clientY * (window.devicePixelRatio || 1));
  });
}

/* ==========================================================
   BIRTHDAY CARD
   ========================================================== */
function initCard(){
  const openCardBtn = document.getElementById("openCardBtn");
  const cardPre = document.getElementById("cardPre");
  const cardWrap = document.getElementById("cardWrap");
  const cardCover = document.querySelector(".card-cover");
  const cardInner = document.querySelector(".card-inner");
  const continueBtn = document.getElementById("continueBtn");

  openCardBtn.addEventListener("click", async () => {
    cardPre.style.transition = "opacity 0.6s ease";
    cardPre.style.opacity = "0";
    await wait(500);
    cardPre.hidden = true;
    cardWrap.hidden = false;
    await wait(300);
    cardCover.classList.add("is-open");
    cardInner.classList.add("is-visible");
    if (!reduceMotion){
      const rect = cardWrap.getBoundingClientRect();
      ParticleEngine.burstAt(
        (rect.left + rect.width / 2) * (window.devicePixelRatio || 1),
        (rect.top + rect.height / 2) * (window.devicePixelRatio || 1)
      );
    }
  });

  continueBtn.addEventListener("click", () => {
    document.getElementById("finale").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
}

/* ==========================================================
   SECRET STAR EASTER EGG
   ========================================================== */
function initSecretStar(){
  const star = document.getElementById("secretStar");
  const overlay = document.getElementById("eggOverlay");

  // place it somewhere unobtrusive, inside the 17 section footer area
  const host = document.getElementById("seventeen");
  host.style.position = "relative";
  star.style.bottom = "1.5rem";
  star.style.right = "2rem";
  host.appendChild(star);

  star.addEventListener("click", async () => {
    overlay.hidden = false;
    const lines = overlay.querySelectorAll(".egg-line");
    lines[0].classList.add("is-in");
    await wait(1400);
    lines[1].classList.add("is-in");
    await wait(1800);
    overlay.style.transition = "opacity 0.8s ease";
    overlay.style.opacity = "0";
    await wait(800);
    overlay.hidden = true;
    overlay.style.opacity = "1";
    lines.forEach(l => l.classList.remove("is-in"));
  });
}

/* ==========================================================
   FINALE + REPLAY
   ========================================================== */
function initFinale(){
  const finale = document.getElementById("finale");
  const replayBtn = document.getElementById("replayBtn");
  let burst = false;

  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !burst){
        burst = true;
        ParticleEngine.setMode("celebration", 2600);
        AudioSystem.fadeOutFinal(6000);
      }
    });
  }, { threshold: 0.6 });
  finaleObserver.observe(finale);

  replayBtn.addEventListener("click", () => {
    AudioSystem.restart();
    window.scrollTo({ top: 0, behavior: "auto" });
    location.reload();
  });
}
