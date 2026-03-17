"use strict";
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
   1. CUSTOM CURSOR
══════════════════════════════════════ */
const cursorEl = document.getElementById('cursor');
if (cursorEl) {
    document.addEventListener('mousemove', (e) => {
        cursorEl.style.left = `${e.clientX}px`;
        cursorEl.style.top = `${e.clientY}px`;
    });
    const hoverTargets = document.querySelectorAll('a, button, .project-card, input, textarea');
    hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => cursorEl.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorEl.classList.remove('hover'));
    });
}
/* ══════════════════════════════════════
   2. SCROLL REVEAL
══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach((el) => revealObserver.observe(el));
/* ══════════════════════════════════════
   3. SKILL BAR ANIMATION
══════════════════════════════════════ */
const skillBarsSection = document.querySelector('.skill-bars');
if (skillBarsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const fills = entry.target
                    .querySelectorAll('.skill-bar-fill');
                fills.forEach((bar, i) => {
                    setTimeout(() => bar.classList.add('animated'), i * 150);
                });
            }
        });
    }, { threshold: 0.3 });
    skillObserver.observe(skillBarsSection);
}
/* ══════════════════════════════════════
   4. CONTACT FORM VALIDATION
══════════════════════════════════════ */
function validateForm(data) {
    if (!data.name.trim()) {
        return { valid: false, message: 'Please enter your name.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return { valid: false, message: 'Please enter a valid email address.' };
    }
    if (data.message.trim().length < 10) {
        return { valid: false, message: 'Message must be at least 10 characters.' };
    }
    return { valid: true, message: 'Form is valid.' };
}
const sendBtn = document.querySelector('.btn-send');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const nameInput = document.querySelector('input[type="text"]');
        const emailInput = document.querySelector('input[type="email"]');
        const msgTextarea = document.querySelector('textarea');
        if (!nameInput || !emailInput || !msgTextarea)
            return;
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: msgTextarea.value,
        };
        const result = validateForm(formData);
        if (!result.valid) {
            alert(result.message);
            return;
        }
        const spanEl = sendBtn.querySelector('span');
        if (spanEl) {
            spanEl.textContent = 'Message Sent ✓';
            setTimeout(() => {
                spanEl.textContent = 'Send Message →';
            }, 3000);
        }
        nameInput.value = '';
        emailInput.value = '';
        msgTextarea.value = '';
    });
}
/* ══════════════════════════════════════
   5. HERO CANVAS ANIMATION
══════════════════════════════════════ */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const COLORS = {
        rust: 'rgba(196, 70, 26,',
        gold: 'rgba(184, 147, 42,',
        dust: 'rgba(212, 201, 180,',
        ink: 'rgba(26, 20, 16,',
    };
    const COLOR_KEYS = Object.keys(COLORS);
    const SYMBOLS = [
        '?', '!', '<', '>', '"', ':', ';', '$',
        '&', '*', '=', '-', '%', '{', '}',
        '()', '//', '+=', '=>', '&&', '||',
        '!=', '==', '#', '@', 'ts', '::', '??',
    ];
    let particles = [];
    let animFrame;
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    class Particle {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.fontSize = 0;
            this.speedX = 0;
            this.speedY = 0;
            this.rotation = 0;
            this.rotationSpeed = 0;
            this.opacity = 0;
            this.symbol = '';
            this.colorBase = '';
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.fontSize = Math.random() * 22 + 10;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5 - 0.15;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.012;
            this.opacity = Math.random() * 0.28 + 0.10;
            this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            this.colorBase = COLORS[COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)]];
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = `${this.colorBase} ${this.opacity})`;
            ctx.font = `${this.fontSize}px 'DM Mono', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            const overflow = this.fontSize * 2;
            if (this.y < -overflow ||
                this.x < -overflow ||
                this.x > canvas.width + overflow) {
                this.reset();
                this.y = canvas.height + overflow;
            }
        }
    }
    function initParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < count; i++) {
            const p = new Particle();
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        animFrame = requestAnimationFrame(animate);
    }
    resize();
    initParticles();
    animate();
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animFrame);
        resize();
        initParticles();
        animate();
    });
}
/* ══════════════════════════════════════
   6. ACTIVE NAV HIGHLIGHT
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
                link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.6';
            });
        }
    });
}, { threshold: 0.4 });
sections.forEach((section) => navObserver.observe(section));
/* ══════════════════════════════════════
   7. BURGER MENU
══════════════════════════════════════ */
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobileMenu');
if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
    document.querySelectorAll('.nav-mobile-link').forEach((link) => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
}
