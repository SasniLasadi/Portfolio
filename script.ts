/* ─────────────────────────────────────────
   Portfolio — Sasni Lasadi
   script.ts  ← TypeScript source (CORE LANGUAGE)

   HOW TO COMPILE:
     npx tsc                    (uses tsconfig.json)
     npx tsc --watch            (auto-recompile on save)

   OUTPUT:  script.js  ← loaded by index.html
   DO NOT edit script.js directly — edit this file.
───────────────────────────────────────── */

/* INTERFACES & TYPES */

/** RGBA prefix strings for canvas particle colours */
interface ColorMap {
  rust: string;
  gold: string;
  dust: string;
  ink:  string;
}

/** Form field data collected before submission */
interface ContactFormData {
  name:    string;
  email:   string;
  message: string;
}

/** Result returned by form validation */
interface ValidationResult {
  valid:   boolean;
  message: string;
}

/* 1. CUSTOM CURSOR
   Typed: HTMLDivElement, MouseEvent */

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

/* 2. SCROLL REVEAL
   Typed: IntersectionObserver, NodeListOf */

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

/* 3. SKILL BAR ANIMATION
   Typed: IntersectionObserver, HTMLElement */

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
