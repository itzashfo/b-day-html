/* =========================================================
   BIRTHDAY EXPERIENCE
   Joanna Manuel • 17 • 17 September 2026
========================================================= */

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


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) =>
  Array.from(document.querySelectorAll(selector));

const wait = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   ELEMENTS
========================================================= */

const opening = $("#opening");
const threshold = $("#threshold");
const cinematic = $("#cinematic");
const hero = $("#hero");
const message = $("#message");
const memories = $("#memories");
const transition = $("#transition");
const seventeen = $("#seventeen");
const birthdayCard = $("#birthday-card");
const finale = $("#finale");

const readyBtn = $("#readyBtn");
const enterBtn = $("#enterBtn");

const thresholdOne = $("#thresholdOne");
const thresholdTwo = $("#thresholdTwo");

const cinematicText = $("#cinematicText");
const revealStack = $("#revealStack");

const progressNav = $("#progressNav");
const audioToggle = $("#audioToggle");

const bgMusic = $("#bgMusic");
const audioFallback = $("#audioFallback");

const gallery = $("#gallery");

const bigSeventeen = $("#bigSeventeen");

const cardPre = $("#cardPre");
const openCardBtn = $("#openCardBtn");
const cardWrap = $("#cardWrap");
const cardCover = $("#cardCover");
const continueBtn = $("#continueBtn");

const secretStar = $("#secretStar");
const eggOverlay = $("#eggOverlay");
const closeEgg = $("#closeEgg");

const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxClose = $("#lightboxClose");
const lightboxPrev = $("#lightboxPrev");
const lightboxNext = $("#lightboxNext");
const lightboxCounter = $("#lightboxCounter");

const replayBtn = $("#replayBtn");

const particleCanvas = $("#particleCanvas");
const particleCtx = particleCanvas.getContext("2d");


/* =========================================================
   STATE
========================================================= */

let experienceStarted = false;
let experienceFinished = false;

let currentPhoto = 0;

let musicStarted = false;
let musicMuted = false;

const reducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* =========================================================
   SECTION FLOW
========================================================= */

const sections = [
  hero,
  message,
  memories,
  transition,
  seventeen,
  birthdayCard,
  finale
];

function showSection(section) {

  if (!section) return;

  section.hidden = false;

  requestAnimationFrame(() => {
    section.classList.add("section-active");
  });
}

function hideSection(section) {

  if (!section) return;

  section.classList.remove("section-active");
  section.hidden = true;
}

function hideAllMainSections() {

  sections.forEach(hideSection);

  transition.hidden = true;
}


/* =========================================================
   AUDIO
========================================================= */

const AudioSystem = {

  targetVolume: 0.38,

  async start() {

    if (musicStarted) return;

    try {

      bgMusic.src = birthdayConfig.music;
      bgMusic.loop = true;
      bgMusic.volume = 0;

      await bgMusic.play();

      musicStarted = true;
      musicMuted = false;

      this.fadeTo(this.targetVolume, 2200);

      audioToggle.classList.add("visible");
      audioToggle.setAttribute("aria-pressed", "true");

    } catch (error) {

      console.warn("Audio could not start:", error);

      audioFallback.hidden = false;

      setTimeout(() => {
        audioFallback.hidden = true;
      }, 5000);
    }
  },

  fadeTo(target, duration = 1000) {

    const start = bgMusic.volume;
    const difference = target - start;
    const startTime = performance.now();

    const animate = (now) => {

      const progress = Math.min(
        (now - startTime) / duration,
        1
      );

      bgMusic.volume =
        start + difference * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  toggle() {

    if (!musicStarted) return;

    if (musicMuted) {

      musicMuted = false;

      this.fadeTo(this.targetVolume, 500);

      audioToggle.setAttribute(
        "aria-pressed",
        "true"
      );

    } else {

      musicMuted = true;

      this.fadeTo(0, 500);

      audioToggle.setAttribute(
        "aria-pressed",
        "false"
      );
    }
  },

  async restart() {

    try {

      bgMusic.currentTime = 0;
      bgMusic.volume = 0;

      await bgMusic.play();

      musicStarted = true;
      musicMuted = false;

      this.fadeTo(this.targetVolume, 1200);

      audioToggle.classList.add("visible");

    } catch (error) {

      console.warn("Could not restart audio:", error);
    }
  },

  fadeOut(duration = 5000) {

    this.fadeTo(0, duration);
  }
};

audioToggle.addEventListener(
  "click",
  () => AudioSystem.toggle()
);


/* =========================================================
   PARTICLES
========================================================= */

const ParticleEngine = {

  particles: [],
  mode: "ambient",

  resize() {

    const dpr =
      Math.min(window.devicePixelRatio || 1, 2);

    particleCanvas.width =
      window.innerWidth * dpr;

    particleCanvas.height =
      window.innerHeight * dpr;

    particleCanvas.style.width =
      `${window.innerWidth}px`;

    particleCanvas.style.height =
      `${window.innerHeight}px`;

    particleCtx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  },

  create() {

    this.particles = [];

    const count =
      reducedMotion ? 25 : 85;

    for (let i = 0; i < count; i++) {

      this.particles.push({

        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,

        size: Math.random() * 1.8 + 0.4,

        alpha: Math.random() * 0.6 + 0.1,

        color: [
          "#FFFFFF",
          "#BFA7FF",
          "#FFD76A",
          "#FF7EB6"
        ][
          Math.floor(Math.random() * 4)
        ]
      });
    }
  },

  update() {

    const centerX =
      window.innerWidth / 2;

    const centerY =
      window.innerHeight / 2;

    for (const p of this.particles) {

      if (this.mode === "gather") {

        const dx = centerX - p.x;
        const dy = centerY - p.y;

        p.vx += dx * 0.0007;
        p.vy += dy * 0.0007;

        p.vx *= 0.96;
        p.vy *= 0.96;

      } else {

        p.vx +=
          (Math.random() - 0.5) * 0.002;

        p.vy +=
          (Math.random() - 0.5) * 0.002;

        p.vx *= 0.995;
        p.vy *= 0.995;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;

      if (p.y < -20) p.y = window.innerHeight + 20;
      if (p.y > window.innerHeight + 20) p.y = -20;
    }
  },

  draw() {

    particleCtx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    for (const p of this.particles) {

      particleCtx.globalAlpha = p.alpha;

      particleCtx.fillStyle = p.color;

      particleCtx.beginPath();

      particleCtx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );

      particleCtx.fill();
    }

    particleCtx.globalAlpha = 1;
  },

  animate() {

    this.update();
    this.draw();

    requestAnimationFrame(
      () => this.animate()
    );
  },

  gather() {

    this.mode = "gather";
  },

  ambient() {

    this.mode = "ambient";
  },

  burst() {

    const centerX =
      window.innerWidth / 2;

    const centerY =
      window.innerHeight / 2;

    for (const p of this.particles) {

      p.x = centerX;
      p.y = centerY;

      const angle =
        Math.random() * Math.PI * 2;

      const speed =
        Math.random() * 7 + 2;

      p.vx =
        Math.cos(angle) * speed;

      p.vy =
        Math.sin(angle) * speed;

      p.alpha = 0.9;
    }

    this.mode = "ambient";
  }
};

ParticleEngine.resize();
ParticleEngine.create();
ParticleEngine.animate();

window.addEventListener(
  "resize",
  () => ParticleEngine.resize()
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursorDot = $(".cursor-dot");
const cursorRing = $(".cursor-ring");

if (
  window.matchMedia("(hover: hover) and (pointer: fine)").matches
) {

  let mouseX = 0;
  let mouseY = 0;

  let ringX = 0;
  let ringY = 0;

  window.addEventListener(
    "pointermove",
    (event) => {

      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left =
        `${mouseX}px`;

      cursorDot.style.top =
        `${mouseY}px`;
    }
  );

  function cursorLoop() {

    ringX +=
      (mouseX - ringX) * 0.15;

    ringY +=
      (mouseY - ringY) * 0.15;

    cursorRing.style.left =
      `${ringX}px`;

    cursorRing.style.top =
      `${ringY}px`;

    requestAnimationFrame(cursorLoop);
  }

  cursorLoop();

  $$("button").forEach(button => {

    button.addEventListener(
      "mouseenter",
      () => cursorRing.classList.add("hover")
    );

    button.addEventListener(
      "mouseleave",
      () => cursorRing.classList.remove("hover")
    );
  });
}


/* =========================================================
   OPENING
========================================================= */

readyBtn.addEventListener(
  "click",
  async () => {

    if (experienceStarted) return;

    experienceStarted = true;

    document.body.classList.add("locked");

    await AudioSystem.start();

    opening
      .querySelector(".opening-inner")
      .classList.add("exit");

    await wait(reducedMotion ? 50 : 750);

    opening.hidden = true;

    threshold.hidden = false;

    await runThreshold();
  }
);


/* =========================================================
   THRESHOLD
========================================================= */

async function runThreshold() {

  await wait(reducedMotion ? 20 : 300);

  thresholdOne.classList.add("show");

  await wait(reducedMotion ? 20 : 1100);

  thresholdTwo.classList.add("show");

  await wait(reducedMotion ? 20 : 900);

  enterBtn.hidden = false;

  enterBtn.classList.add("show");
}

enterBtn.addEventListener(
  "click",
  async () => {

    threshold.hidden = true;

    cinematic.hidden = false;

    await runCinematicIntro();
  }
);


/* =========================================================
   CINEMATIC INTRO
========================================================= */

async function runCinematicIntro() {

  const lines = [
    "Some days…",
    "…are just dates.",
    "But some dates…",
    "…are worth remembering."
  ];

  const lineDuration =
    reducedMotion ? 250 : 1100;

  for (const line of lines) {

    cinematicText.textContent = line;

    cinematicText.classList.add("show");

    await wait(lineDuration);

    cinematicText.classList.remove("show");

    await wait(
      reducedMotion ? 20 : 350
    );
  }

  cinematicText.textContent = "";

  ParticleEngine.gather();

  await wait(
    reducedMotion ? 50 : 900
  );

  revealStack.hidden = false;

  const revealItems = [
    $(".reveal-happy"),
    $(".reveal-jo"),
    $(".reveal-age")
  ];

  for (const item of revealItems) {

    item.classList.add("show");

    await wait(
      reducedMotion ? 30 : 600
    );
  }

  await wait(
    reducedMotion ? 50 : 900
  );

  ParticleEngine.burst();

  cinematic.style.transition =
    reducedMotion
      ? "opacity 0.1s"
      : "opacity 1s ease";

  cinematic.style.opacity = "0";

  await wait(
    reducedMotion ? 50 : 900
  );

  cinematic.hidden = true;
  cinematic.style.opacity = "";

  showSection(hero);

  document.body.classList.remove("locked");

  progressNav.classList.add("visible");
  audioToggle.classList.add("visible");

  initExperience();
}


/* =========================================================
   EXPERIENCE INITIALIZATION
========================================================= */

let initialized = false;

function initExperience() {

  if (initialized) return;

  initialized = true;

  setupNavigation();
  setupRevealObserver();
  setupGallery();
  setupSeventeen();
  setupCard();
  setupSecret();
  setupFinale();

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

  $$(".progress-nav .dot").forEach(dot => {

    dot.addEventListener(
      "click",
      () => {

        const target =
          document.getElementById(
            dot.dataset.target
          );

        if (!target) return;

        target.scrollIntoView({
          behavior: reducedMotion
            ? "auto"
            : "smooth"
        });
      }
    );
  });


  const observableSections = [
    hero,
    message,
    memories,
    seventeen,
    birthdayCard,
    finale
  ];

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          $$(".progress-nav .dot")
            .forEach(dot => {

              dot.classList.toggle(
                "active",
                dot.dataset.target === id
              );

            });
        });
      },
      {
        threshold: 0.45
      }
    );

  observableSections.forEach(
    section => observer.observe(section)
  );
}


/* =========================================================
   REVEALS
========================================================= */

function setupRevealObserver() {

  const items = $$(
    ".reveal-item, .transition-line, .phrase"
  );

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        });

      },
      {
        threshold: 0.2
      }
    );

  items.forEach(item =>
    observer.observe(item)
  );
}


/* =========================================================
   GALLERY
========================================================= */

function setupGallery() {

  gallery.innerHTML = "";

  birthdayConfig.photos.forEach(
    (photo, index) => {

      const item =
        document.createElement("div");

      item.className = "photo-item";

      const button =
        document.createElement("button");

      button.type = "button";

      button.setAttribute(
        "aria-label",
        `Open photo ${index + 1}`
      );

      const img =
        document.createElement("img");

      img.src = photo;

      img.alt =
        `Photo ${index + 1} of Jo`;

      img.loading =
        index < 2 ? "eager" : "lazy";

      img.onerror = () => {

        item.style.display = "none";

        console.warn(
          "Could not load image:",
          photo
        );
      };

      const number =
        document.createElement("span");

      number.className =
        "photo-number";

      number.textContent =
        `${String(index + 1).padStart(2, "0")}`;

      button.appendChild(img);
      button.appendChild(number);

      item.appendChild(button);

      gallery.appendChild(item);

      button.addEventListener(
        "click",
        () => openLightbox(index)
      );
    }
  );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          (entry, index) => {

            if (!entry.isIntersecting) return;

            setTimeout(
              () =>
                entry.target.classList.add(
                  "visible"
                ),
              index * 120
            );

            observer.unobserve(entry.target);
          }
        );
      },
      {
        threshold: 0.1
      }
    );

  $$(".photo-item").forEach(
    item => observer.observe(item)
  );
}


/* =========================================================
   LIGHTBOX
========================================================= */

function openLightbox(index) {

  currentPhoto = index;

  updateLightbox();

  lightbox.hidden = false;

  document.body.classList.add("locked");

  lightboxClose.focus();
}

function closeLightbox() {

  lightbox.hidden = true;

  document.body.classList.remove("locked");
}

function updateLightbox() {

  const photo =
    birthdayConfig.photos[currentPhoto];

  lightboxImg.src = photo;

  lightboxImg.alt =
    `Photo ${currentPhoto + 1} of Jo`;

  lightboxCounter.textContent =
    `${currentPhoto + 1} / ${birthdayConfig.photos.length}`;
}

function nextPhoto() {

  currentPhoto =
    (currentPhoto + 1) %
    birthdayConfig.photos.length;

  updateLightbox();
}

function previousPhoto() {

  currentPhoto =
    (currentPhoto - 1 +
      birthdayConfig.photos.length) %
    birthdayConfig.photos.length;

  updateLightbox();
}

lightboxClose.addEventListener(
  "click",
  closeLightbox
);

lightboxNext.addEventListener(
  "click",
  nextPhoto
);

lightboxPrev.addEventListener(
  "click",
  previousPhoto
);

lightbox.addEventListener(
  "click",
  event => {

    if (event.target === lightbox) {
      closeLightbox();
    }
  }
);

document.addEventListener(
  "keydown",
  event => {

    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      nextPhoto();
    }

    if (event.key === "ArrowLeft") {
      previousPhoto();
    }
  }
);


/* =========================================================
   17 SECTION
========================================================= */

function setupSeventeen() {

  bigSeventeen.addEventListener(
    "click",
    () => {

      ParticleEngine.burst();

      bigSeventeen.animate(
        [
          {
            transform: "scale(1)"
          },
          {
            transform: "scale(1.06)"
          },
          {
            transform: "scale(1)"
          }
        ],
        {
          duration: 650,
          easing: "cubic-bezier(.22,1,.36,1)"
        }
      );
    }
  );
}


/* =========================================================
   CARD
========================================================= */

function setupCard() {

  openCardBtn.addEventListener(
    "click",
    async () => {

      cardPre.classList.add("hide");

      await wait(
        reducedMotion ? 20 : 500
      );

      cardPre.hidden = true;

      cardWrap.hidden = false;

      await wait(
        reducedMotion ? 20 : 100
      );

      cardCover.classList.add("open");

      cardWrap.classList.add("opened");

      ParticleEngine.burst();
    }
  );


  continueBtn.addEventListener(
    "click",
    () => {

      finale.scrollIntoView({
        behavior: reducedMotion
          ? "auto"
          : "smooth"
      });
    }
  );
}


/* =========================================================
   SECRET EASTER EGG
========================================================= */

function setupSecret() {

  secretStar.hidden = false;

  seventeen.appendChild(secretStar);

  secretStar.addEventListener(
    "click",
    () => {

      eggOverlay.hidden = false;

      document.body.classList.add("locked");
    }
  );

  closeEgg.addEventListener(
    "click",
    () => {

      eggOverlay.hidden = true;

      document.body.classList.remove("locked");
    }
  );
}


/* =========================================================
   FINALE
========================================================= */

function setupFinale() {

  const finaleObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            !entry.isIntersecting ||
            experienceFinished
          ) {
            return;
          }

          experienceFinished = true;

          ParticleEngine.burst();

          AudioSystem.fadeOut(5000);

        });

      },
      {
        threshold: 0.55
      }
    );

  finaleObserver.observe(finale);
}


/* =========================================================
   REPLAY
========================================================= */

replayBtn.addEventListener(
  "click",
  async () => {

    experienceFinished = false;

    await AudioSystem.restart();

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    setTimeout(
      () => window.location.reload(),
      200
    );
  }
);


/* =========================================================
   AUDIO ERROR HANDLING
========================================================= */

bgMusic.addEventListener(
  "error",
  () => {

    console.warn(
      "Audio file could not be loaded:",
      birthdayConfig.music
    );

    audioFallback.hidden = false;

    setTimeout(() => {
      audioFallback.hidden = true;
    }, 5000);
  }
);


/* =========================================================
   SAFETY CHECK
========================================================= */

window.addEventListener(
  "error",
  event => {

    console.error(
      "Birthday site error:",
      event.error || event.message
    );
  }
);

console.log(
  "%cBirthday experience loaded ✦",
  "color:#BFA7FF;font-size:16px;"
);
