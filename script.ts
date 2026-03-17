/* ─────────────────────────────────────────
   Portfolio — Sasni Lasadi
   script.ts  ← TypeScript source (CORE LANGUAGE)

   HOW TO COMPILE:
     npx tsc                 (uses tsconfig.json)
     npx tsc --watch         (auto-recompile on save)

   OUTPUT:  script.js  ← loaded by index.html
   DO NOT edit script.js directly — edit this file.
───────────────────────────────────────── */

/* ══════════════════════════════════════
   INTERFACES & TYPES
══════════════════════════════════════ */

interface ColorMap {
  rust: string;
  gold: string;
  dust: string;
  ink:  string;
}

interface ContactFormData {
  name:    string;
  email:   string;
  message: string;
}

interface ValidationResult {
  valid:   boolean;
  message: string;
}

/* ══════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════ */

const cursorEl = document.getElementById('cursor') as HTMLDivElement | null;

if (cursorEl) {
  document.addEventListener('mousemove', (e: MouseEvent): void => {
    cursorEl.style.left = `${e.clientX}px`;
    cursorEl.style.top  = `${e.clientY}px`;
  });

  const hoverTargets = document.querySelectorAll<HTMLElement>(
    'a, button, .project-card, input, textarea'
  );

  hoverTargets.forEach((el: HTMLElement): void => {
    el.addEventListener('mouseenter', (): void => cursorEl.classList.add('hover'));
    el.addEventListener('mouseleave', (): void => cursorEl.classList.remove('hover'));
  });
}

/* ══════════════════════════════════════
   2. SCROLL REVEAL
══════════════════════════════════════ */

const revealEls = document.querySelectorAll<HTMLElement>('.reveal');

const revealObserver = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry: IntersectionObserverEntry, i: number): void => {
      if (entry.isIntersecting) {
        setTimeout((): void => {
          (entry.target as HTMLElement).classList.add('visible');
        }, i * 80);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el: HTMLElement): void => revealObserver.observe(el));

/* ══════════════════════════════════════
   3. SKILL BAR ANIMATION
══════════════════════════════════════ */

const skillBarsSection = document.querySelector<HTMLElement>('.skill-bars');

if (skillBarsSection) {
  const skillObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry: IntersectionObserverEntry): void => {
        if (entry.isIntersecting) {
          const fills = (entry.target as HTMLElement)
            .querySelectorAll<HTMLElement>('.skill-bar-fill');

          fills.forEach((bar: HTMLElement, i: number): void => {
            setTimeout((): void => bar.classList.add('animated'), i * 150);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  skillObserver.observe(skillBarsSection);
}

/* ══════════════════════════════════════
   4. CONTACT FORM VALIDATION
══════════════════════════════════════ */

function validateForm(data: ContactFormData): ValidationResult {
  if (!data.name.trim()) {
    return { valid: false, message: 'Please enter your name.' };
  }

  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  if (data.message.trim().length < 10) {
    return { valid: false, message: 'Message must be at least 10 characters.' };
  }

  return { valid: true, message: 'Form is valid.' };
}

const sendBtn = document.querySelector<HTMLButtonElement>('.btn-send');

if (sendBtn) {
  sendBtn.addEventListener('click', (): void => {
    const nameInput   = document.querySelector<HTMLInputElement>('input[type="text"]');
    const emailInput  = document.querySelector<HTMLInputElement>('input[type="email"]');
    const msgTextarea = document.querySelector<HTMLTextAreaElement>('textarea');

    if (!nameInput || !emailInput || !msgTextarea) return;

    const formData: ContactFormData = {
      name:    nameInput.value,
      email:   emailInput.value,
      message: msgTextarea.value,
    };

    const result: ValidationResult = validateForm(formData);

    if (!result.valid) {
      alert(result.message);
      return;
    }

    const spanEl = sendBtn.querySelector<HTMLSpanElement>('span');
    if (spanEl) {
      spanEl.textContent = 'Message Sent ✓';
      setTimeout((): void => {
        spanEl.textContent = 'Send Message →';
      }, 3000);
    }

    nameInput.value   = '';
    emailInput.value  = '';
    msgTextarea.value = '';
  });
}

/* ══════════════════════════════════════
   5. HERO CANVAS ANIMATION
══════════════════════════════════════ */

const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;

if (canvas) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const COLORS: ColorMap = {
    rust: 'rgba(196, 70, 26,',
    gold: 'rgba(184, 147, 42,',
    dust: 'rgba(212, 201, 180,',
    ink:  'rgba(26, 20, 16,',
  };

  const COLOR_KEYS = Object.keys(COLORS) as (keyof ColorMap)[];

  const SYMBOLS: string[] = [
    '?', '!', '<', '>', '"', ':', ';', '$',
    '&', '*', '=', '-', '%', '{', '}',
    '()', '//', '+=', '=>', '&&', '||',
    '!=', '==', '#', '@', 'ts', '::', '??',
  ];

  let particles: Particle[] = [];
  let animFrame:  number;

  function resize(): void {
    canvas!.width  = canvas!.offsetWidth;
    canvas!.height = canvas!.offsetHeight;
  }

  class Particle {
    x:             number = 0;
    y:             number = 0;
    fontSize:      number = 0;
    speedX:        number = 0;
    speedY:        number = 0;
    rotation:      number = 0;
    rotationSpeed: number = 0;
    opacity:       number = 0;
    symbol:        string = '';
    colorBase:     string = '';

    constructor() { this.reset(); }

    reset(): void {
      this.x             = Math.random() * canvas!.width;
      this.y             = Math.random() * canvas!.height;
      this.fontSize      = Math.random() * 22 + 10;
      this.speedX        = (Math.random() - 0.5) * 0.5;
      this.speedY        = (Math.random() - 0.5) * 0.5 - 0.15;
      this.rotation      = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.012;
      this.opacity       = Math.random() * 0.28 + 0.10;
      this.symbol        = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.colorBase     = COLORS[COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)]];
    }

    draw(): void {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle    = `${this.colorBase} ${this.opacity})`;
      ctx.font         = `${this.fontSize}px 'DM Mono', monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }

    update(): void {
      this.x        += this.speedX;
      this.y        += this.speedY;
      this.rotation += this.rotationSpeed;

      const overflow: number = this.fontSize * 2;
      if (
        this.y < -overflow ||
        this.x < -overflow ||
        this.x > canvas!.width + overflow
      ) {
        this.reset();
        this.y = canvas!.height + overflow;
      }
    }
  }

  function initParticles(): void {
    particles = [];
    const count: number = Math.floor((canvas!.width * canvas!.height) / 10000);
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas!.height;
      particles.push(p);
    }
  }

  function animate(): void {
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    particles.forEach((p: Particle): void => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  window.addEventListener('resize', (): void => {
    cancelAnimationFrame(animFrame);
    resize();
    initParticles();
    animate();
  });
}

/* ══════════════════════════════════════
   6. ACTIVE NAV HIGHLIGHT
══════════════════════════════════════ */

const sections = document.querySelectorAll<HTMLElement>('section[id]');
const navLinks  = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      if (entry.isIntersecting) {
        const id: string = (entry.target as HTMLElement).id;
        navLinks.forEach((link: HTMLAnchorElement): void => {
          link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.6';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section: HTMLElement): void => navObserver.observe(section));


