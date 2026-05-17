/**
 * Portfolio Website - Main JavaScript
 * Handles: Preloader, Theme, Navigation, Animations, Form Validation
 */

(function () {
  'use strict';

  /* ============================================
     DOM ELEMENTS
     ============================================ */
  const preloader = document.getElementById('preloader');
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
  const typingText = document.getElementById('typing-text');
  const backToTop = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const feedbackTrack = document.getElementById('feedback-track');
  const feedbackPrev = document.getElementById('feedback-prev');
  const feedbackNext = document.getElementById('feedback-next');
  const feedbackDots = document.getElementById('feedback-dots');
  const yearEl = document.getElementById('year');

  /* ============================================
     CONSTANTS
     ============================================ */
  const TYPING_PHRASES = [
  "Frontend Developer",
  "Engineering Student",
  "JavaScript Developer",
  "Problem Solver"
];
  const TYPING_SPEED = 80;
  const DELETING_SPEED = 40;
  const PAUSE_DURATION = 2000;

  let currentSlide = 0;
  let feedbackInterval = null;

  /* ============================================
     PRELOADER
     ============================================ */
  function initPreloader() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader?.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }, 1600);
    });

    document.body.classList.add('no-scroll');
  }

  /* ============================================
     THEME TOGGLE (Dark / Light Mode)
     ============================================ */
  function getPreferredTheme() {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (themeIcon) {
      themeIcon.className = theme === 'dark'
        ? 'fas fa-moon theme-toggle__icon'
        : 'fas fa-sun theme-toggle__icon';
    }
  }

  function initTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);

    themeToggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';

      themeToggle.classList.add('rotating');
      setTimeout(() => themeToggle.classList.remove('rotating'), 500);

      setTheme(next);
    });
  }

  /* ============================================
     MOBILE NAVIGATION
     ============================================ */
  function openMenu() {
    navMenu?.classList.add('show-menu');
    document.body.classList.add('no-scroll');
    navToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navMenu?.classList.remove('show-menu');
    document.body.classList.remove('no-scroll');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  function initNavigation() {
    navToggle?.addEventListener('click', openMenu);
    navClose?.addEventListener('click', closeMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (
        navMenu?.classList.contains('show-menu') &&
        !navMenu.contains(e.target) &&
        !navToggle?.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ============================================
     STICKY HEADER & ACTIVE NAV LINK
     ============================================ */
  function initScrollEffects() {
  const sections = document.querySelectorAll('section[id]');

    function onScroll() {
      const scrollY = window.scrollY;

      // Sticky header shadow
      header?.classList.toggle('scrolled', scrollY > 50);

      // Back to top button
      backToTop?.classList.toggle('visible', scrollY > 400);

      // Active nav link
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     TYPING EFFECT
     ============================================ */
  function initTypingEffect() {
    if (!typingText) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentPhrase = TYPING_PHRASES[phraseIndex];

      if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? DELETING_SPEED : TYPING_SPEED;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = PAUSE_DURATION;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  /* ============================================
     SCROLL REVEAL (Intersection Observer)
     ============================================ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ============================================
     ANIMATED COUNTERS
     ============================================ */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-card__number[data-count]');

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          el.textContent = target + '+';
        }
      };

      update();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ============================================
     SKILL PROGRESS BARS
     ============================================ */
  function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const percent = card.getAttribute('data-skill');
            const progress = card.querySelector('.skill-card__progress');
            if (progress && percent) {
              progress.style.width = `${percent}%`;
            }
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillCards.forEach((card) => observer.observe(card));
  }

  /* ============================================
     FEEDBACK CAROUSEL
     ============================================ */
  function initFeedbackSlider() {
    const cards = feedbackTrack?.querySelectorAll('.feedback-card');
    if (!cards?.length) return;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `feedback__dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      feedbackDots?.appendChild(dot);
    });

    const dots = feedbackDots?.querySelectorAll('.feedback__dot');

    function goToSlide(index) {
      currentSlide = (index + cards.length) % cards.length;

      cards.forEach((card, i) => {
        card.classList.toggle('feedback-card--active', i === currentSlide);
      });

      dots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    feedbackNext?.addEventListener('click', nextSlide);
    feedbackPrev?.addEventListener('click', prevSlide);

    // Auto-play
    function startAutoplay() {
      feedbackInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      clearInterval(feedbackInterval);
    }

    feedbackTrack?.addEventListener('mouseenter', stopAutoplay);
    feedbackTrack?.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  /* ============================================
     CONTACT FORM VALIDATION
     ============================================ */
  function initContactForm() {
    if (!contactForm) return;

    const fields = {
      name: {
        el: document.getElementById('name'),
        error: document.getElementById('name-error'),
        validate: (v) => v.trim().length >= 2 || 'Name must be at least 2 characters'
      },
      email: {
        el: document.getElementById('email'),
        error: document.getElementById('email-error'),
        validate: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email'
      },
      subject: {
        el: document.getElementById('subject'),
        error: document.getElementById('subject-error'),
        validate: (v) => v.trim().length >= 3 || 'Subject must be at least 3 characters'
      },
      message: {
        el: document.getElementById('message'),
        error: document.getElementById('message-error'),
        validate: (v) => v.trim().length >= 10 || 'Message must be at least 10 characters'
      }
    };

    function validateField(key) {
      const field = fields[key];
      const value = field.el.value;
      const result = field.validate(value);

      if (result === true) {
        field.el.classList.remove('error');
        field.error.textContent = '';
        return true;
      }

      field.el.classList.add('error');
      field.error.textContent = result;
      return false;
    }

    Object.keys(fields).forEach((key) => {
      fields[key].el?.addEventListener('blur', () => validateField(key));
      fields[key].el?.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formSuccess = document.getElementById('form-success');
      let isValid = true;

      Object.keys(fields).forEach((key) => {
        if (!validateField(key)) isValid = false;
      });

      if (!isValid) return;

      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        formSuccess.hidden = false;

        setTimeout(() => {
          formSuccess.hidden = true;
        }, 5000);
      }, 1500);
    });
  }

  /* ============================================
     FOOTER YEAR
     ============================================ */
  function initFooter() {
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     INITIALIZE ALL
     ============================================ */
  function init() {
    initPreloader();
    initTheme();
    initNavigation();
    initScrollEffects();
    initTypingEffect();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initFeedbackSlider();
    initContactForm();
    initFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
