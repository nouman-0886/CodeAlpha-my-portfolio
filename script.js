

'use strict';

/* ──────────────────────────────────────────────────
   1. TYPEWRITER EFFECT
   Cycles through title strings in the hero section
────────────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Front-End Developer',
    'Creative Designer',
    'UI/UX Enthusiast',
    'Problem Solver',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 50;
  const PAUSE_END      = 1800; // ms to pause at end of phrase
  const PAUSE_START    = 300;  // ms before typing next phrase

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      // Add one character
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Reached the end — pause then start deleting
        isDeleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      // Remove one character
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Fully deleted — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }

    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Kick off after a brief delay so the hero animation lands first
  setTimeout(type, 800);
})();


/* ──────────────────────────────────────────────────
   2. STICKY NAVIGATION + ACTIVE LINK HIGHLIGHTING
   Adds .scrolled class on scroll; highlights the
   nav link matching the current section in viewport
────────────────────────────────────────────────── */
(function initNav() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky style
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section detection
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ──────────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks  = document.querySelectorAll('.mobile-link');

  function open() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  mobileOverlay.addEventListener('click', close);

  mobileLinks.forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ──────────────────────────────────────────────────
   4. SCROLL REVEAL ANIMATION
   Uses IntersectionObserver to add .visible class
   when elements with .reveal enter the viewport
────────────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Stagger children inside the same parent when they appear together
  function applyStagger(entry) {
    const el = entry.target;
    const siblings = el.parentElement.querySelectorAll('.reveal');
    let delay = 0;

    siblings.forEach(sib => {
      if (sib === el) {
        el.style.transitionDelay = `${delay}ms`;
      }
      delay += 80;
    });
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          applyStagger(entry);
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────
   5. SKILL BAR ANIMATION
   Animates the skill fill bars when they scroll
   into view by reading the data-width attribute
────────────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar  = entry.target;
          const fill = bar.querySelector('.skill-fill');
          const w    = bar.getAttribute('data-width') || '0';
          fill.style.width = `${w}%`;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* ──────────────────────────────────────────────────
   6. SCROLL-TO-TOP BUTTON
   Shows/hides the button based on scroll position
────────────────────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ──────────────────────────────────────────────────
   7. CONTACT FORM VALIDATION
   Called by the Send button's onclick handler in HTML
────────────────────────────────────────────────── */
function submitForm() {
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const sendBtn      = document.getElementById('sendBtn');
  const successMsg   = document.getElementById('formSuccess');

  // Clear previous errors
  [nameInput, emailInput, messageInput].forEach(el => el.classList.remove('error'));
  nameError.textContent    = '';
  emailError.textContent   = '';
  messageError.textContent = '';

  let valid = true;

  // Validate name
  if (nameInput.value.trim().length < 2) {
    nameError.textContent = 'Please enter your full name (min 2 characters).';
    nameInput.classList.add('error');
    valid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address.';
    emailInput.classList.add('error');
    valid = false;
  }

  // Validate message
  if (messageInput.value.trim().length < 10) {
    messageError.textContent = 'Message must be at least 10 characters.';
    messageInput.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  // Simulate sending (replace with real API call if needed)
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  setTimeout(() => {
    // Reset form
    nameInput.value    = '';
    emailInput.value   = '';
    messageInput.value = '';

    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';

    // Show success
    successMsg.hidden = false;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide after 5 seconds
    setTimeout(() => { successMsg.hidden = true; }, 5000);
  }, 1500);
}


/* ──────────────────────────────────────────────────
   8. FOOTER YEAR
────────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ──────────────────────────────────────────────────
   9. SMOOTH ANCHOR SCROLL (fallback for older browsers)
────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();