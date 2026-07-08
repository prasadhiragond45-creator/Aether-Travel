/* ═══════════════════════════════════════
   AETHER TRAVEL — JavaScript
   ═══════════════════════════════════════ */

'use strict';

// ─── Wait for DOM ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ════════════════════════════════════════
  // 1. LOADING SCREEN
  // ════════════════════════════════════════
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
      // Kick off hero animations after load
      initHeroAnimations();
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  // ════════════════════════════════════════
  // 2. SCROLL PROGRESS BAR
  // ════════════════════════════════════════
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  // ════════════════════════════════════════
  // 3. NAVBAR SCROLL BEHAVIOUR
  // ════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Glass effect after scroll
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link tracking
    updateActiveNavLink();

    lastScrollY = scrollY;
  }, { passive: true });

  // Active nav link
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = 'hero';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ════════════════════════════════════════
  // 4. BACK TO TOP
  // ════════════════════════════════════════
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ════════════════════════════════════════
  // 5. DARK MODE TOGGLE
  // ════════════════════════════════════════
  const darkToggle = document.getElementById('dark-mode-toggle');
  const htmlEl = document.documentElement;

  // Persist preference
  const savedTheme = localStorage.getItem('aether-theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);

  darkToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('aether-theme', next);

    // Re-create icons after theme change
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  // ════════════════════════════════════════
  // 6. HAMBURGER / MOBILE MENU
  // ════════════════════════════════════════
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ════════════════════════════════════════
  // 7. PARALLAX HERO
  // ════════════════════════════════════════
  const heroImg = document.getElementById('hero-parallax-img');

  window.addEventListener('scroll', () => {
    if (heroImg && window.scrollY < window.innerHeight) {
      // Use translateY only — no scaling that blurs 4K image
      const offset = window.scrollY * 0.25;
      heroImg.style.transform = `translateY(${offset}px)`;
    }
  }, { passive: true });

  // ════════════════════════════════════════
  // 8. SEARCH BOX TABS
  // ════════════════════════════════════════
  const tabs = document.querySelectorAll('.search-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Set default check-in / check-out dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const formatDate = d => d.toISOString().split('T')[0];
  const checkinInput = document.getElementById('search-checkin');
  const checkoutInput = document.getElementById('search-checkout');
  if (checkinInput) checkinInput.value = formatDate(tomorrow);
  if (checkoutInput) checkoutInput.value = formatDate(nextWeek);
  if (checkinInput) checkinInput.min = formatDate(today);

  // Validate checkout > checkin
  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', () => {
      if (checkoutInput.value <= checkinInput.value) {
        const next = new Date(checkinInput.value);
        next.setDate(next.getDate() + 1);
        checkoutInput.value = formatDate(next);
      }
    });
  }

  // Search button
  const searchBtn = document.getElementById('search-submit-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      addRipple(searchBtn);
      const dest = document.getElementById('search-destination').value.trim();
      if (!dest) {
        document.getElementById('search-destination').focus();
        shakEl(document.getElementById('search-destination'));
        return;
      }
      // Simulate search loading state
      searchBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i><span>Searching...</span>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      setTimeout(() => {
        searchBtn.innerHTML = '<i data-lucide="search"></i><span>Search</span>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
      }, 1500);
    });
  }

  // ════════════════════════════════════════
  // 9. WISHLIST HEARTS
  // ════════════════════════════════════════
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        btn.style.animation = 'none';
        requestAnimationFrame(() => {
          btn.style.animation = 'heartBeat 0.4s ease';
        });
      }
    });
  });

  // ════════════════════════════════════════
  // 10. BOOK NOW RIPPLE
  // ════════════════════════════════════════
  document.querySelectorAll('.btn-book, .btn-primary, .btn-subscribe, .btn-search').forEach(btn => {
    btn.addEventListener('click', function(e) {
      addRipple(this, e);
    });
  });

  function addRipple(el, event) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
    const y = event ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;top:${y}px;left:${x}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  // ════════════════════════════════════════
  // 11. REVIEWS CAROUSEL
  // ════════════════════════════════════════
  const track = document.getElementById('reviews-track');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-review');
  const nextBtn = document.getElementById('next-review');

  let currentSlide = 0;
  let cardsPerView = getCardsPerView();
  let totalSlides = 0;
  let autoplayTimer = null;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function updateCarousel() {
    if (!track) return;
    cardsPerView = getCardsPerView();
    const cards = track.querySelectorAll('.review-card');
    totalSlides = Math.max(0, cards.length - cardsPerView);
    currentSlide = Math.min(currentSlide, totalSlides);

    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  function goToSlide(idx) {
    const cards = track ? track.querySelectorAll('.review-card') : [];
    cardsPerView = getCardsPerView();
    totalSlides = Math.max(0, cards.length - cardsPerView);
    currentSlide = Math.max(0, Math.min(idx, totalSlides));
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.idx));
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      if (!track) return;
      const cards = track.querySelectorAll('.review-card');
      cardsPerView = getCardsPerView();
      totalSlides = Math.max(0, cards.length - cardsPerView);
      if (currentSlide >= totalSlides) {
        goToSlide(0);
      } else {
        goToSlide(currentSlide + 1);
      }
    }, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  window.addEventListener('resize', updateCarousel);
  setTimeout(() => { updateCarousel(); startAutoplay(); }, 300);

  // Touch/swipe for carousel
  if (track) {
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
        resetAutoplay();
      }
    });
  }

  // ════════════════════════════════════════
  // 12. VIDEO MODAL
  // ════════════════════════════════════════
  const videoBtn = document.getElementById('video-btn');
  const videoModal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function openModal() {
    videoModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => lucide && lucide.createIcons(), 100);
  }

  function closeModal() {
    videoModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (videoBtn) videoBtn.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !videoModal.hasAttribute('hidden')) closeModal();
  });

  // ════════════════════════════════════════
  // 13. NEWSLETTER FORM
  // ════════════════════════════════════════
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (!emailInput.value || !emailInput.validity.valid) {
        shakEl(emailInput);
        return;
      }
      newsletterForm.style.display = 'none';
      newsletterSuccess.classList.add('show');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  // ════════════════════════════════════════
  // 14. ANIMATED COUNTERS
  // ════════════════════════════════════════
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const step = 16;
    const totalSteps = duration / step;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      current = target * (count / totalSteps);
      if (count >= totalSteps) {
        current = target;
        clearInterval(timer);
      }
      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else if (target >= 1000) {
        el.textContent = Math.floor(current / 1000) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, step);
  }

  // Observe stat section
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(n => statObserver.observe(n));

  // ════════════════════════════════════════
  // 15. GSAP SCROLL ANIMATIONS
  // ════════════════════════════════════════
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: just make elements visible
      document.querySelectorAll('[data-gsap]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // General fade-up elements
    document.querySelectorAll('[data-gsap="fade-up"]').forEach((el) => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Fade left elements
    document.querySelectorAll('[data-gsap="fade-left"]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Feature cards stagger
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length) {
      gsap.fromTo(featureCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 85%',
          }
        }
      );
    }

    // Destination cards stagger
    const destCards = document.querySelectorAll('.dest-card');
    if (destCards.length) {
      gsap.fromTo(destCards,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.destinations-grid',
            start: 'top 85%',
          }
        }
      );
    }

    // Stat items
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length) {
      gsap.fromTo(statItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 85%',
          }
        }
      );
    }

    // Gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
      gsap.fromTo(galleryItems,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 85%',
          }
        }
      );
    }

    // Package cards
    const pkgCards = document.querySelectorAll('.pkg-card');
    if (pkgCards.length) {
      gsap.fromTo(pkgCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.packages-grid',
            start: 'top 85%',
          }
        }
      );
    }
  }

  // ════════════════════════════════════════
  // 16. HERO ENTRANCE ANIMATIONS
  // ════════════════════════════════════════
  function initHeroAnimations() {
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    const heroBadge = document.querySelector('.hero-badge');
    const heroHeading = document.querySelector('.hero-heading');
    const heroSub = document.querySelector('.hero-subtitle');
    const heroCtas = document.querySelector('.hero-ctas');
    const scrollInd = document.querySelector('.scroll-indicator');

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (heroBadge) tl.fromTo(heroBadge, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2);
      if (heroHeading) tl.fromTo(heroHeading, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0.4);
      if (heroSub) tl.fromTo(heroSub, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.65);
      if (heroCtas) tl.fromTo(heroCtas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.85);
      if (heroRight) tl.fromTo(heroRight, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9 }, 0.5);
      if (scrollInd) tl.fromTo(scrollInd, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.3);
    } else {
      // Fallback without GSAP
      [heroBadge, heroHeading, heroSub, heroCtas, heroRight, scrollInd].forEach(el => {
        if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
      });
    }

    // Init scroll animations
    initGSAPAnimations();
  }

  // ════════════════════════════════════════
  // 17. UTILITY FUNCTIONS
  // ════════════════════════════════════════
  function shakEl(el) {
    if (!el) return;
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      el.style.animation = 'shake 0.4s ease';
    });
  }

  // Add CSS animation for shake
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    @keyframes heartBeat {
      0% { transform: scale(1); }
      30% { transform: scale(1.3); }
      60% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    .spin { animation: spinAnim 1s linear infinite; }
    @keyframes spinAnim { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(shakeStyle);

  // ════════════════════════════════════════
  // 18. SMOOTH ANCHOR SCROLLING
  // ════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ════════════════════════════════════════
  // 19. LAZY LOADING IMAGES
  // ════════════════════════════════════════
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  // ════════════════════════════════════════
  // 20. DESTINATION SEARCH AUTOCOMPLETE
  // ════════════════════════════════════════
  const destinations = [
    'Santorini, Greece', 'Maldives', 'Bali, Indonesia', 'Switzerland',
    'Dubai, UAE', 'Iceland', 'Venice, Italy', 'Kyoto, Japan',
    'Patagonia, Argentina', 'Morocco', 'New Zealand', 'Paris, France',
    'New York, USA', 'Sydney, Australia', 'Cape Town, South Africa'
  ];

  const destInput = document.getElementById('search-destination');
  if (destInput) {
    let suggestionBox = null;

    destInput.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      removeSuggestions();
      if (!val) return;

      const matches = destinations.filter(d => d.toLowerCase().includes(val)).slice(0, 5);
      if (!matches.length) return;

      suggestionBox = document.createElement('ul');
      suggestionBox.className = 'autocomplete-list';
      suggestionBox.style.cssText = `
        position:absolute; z-index:100; background:var(--surface);
        border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow-lg);
        padding:0.5rem; list-style:none; margin-top:0.5rem;
        min-width:200px; max-width:300px;
      `;

      matches.forEach(match => {
        const li = document.createElement('li');
        li.textContent = match;
        li.style.cssText = `
          padding:0.65rem 1rem; border-radius:10px; cursor:pointer;
          font-size:0.9rem; color:var(--text); transition:all 0.2s ease;
        `;
        li.addEventListener('mouseenter', () => { li.style.background = 'var(--bg-alt)'; li.style.color = 'var(--primary)'; });
        li.addEventListener('mouseleave', () => { li.style.background = ''; li.style.color = 'var(--text)'; });
        li.addEventListener('click', () => {
          destInput.value = match;
          removeSuggestions();
        });
        suggestionBox.appendChild(li);
      });

      const field = destInput.closest('.search-field');
      field.style.position = 'relative';
      field.appendChild(suggestionBox);
    });

    document.addEventListener('click', e => {
      if (!destInput.contains(e.target)) removeSuggestions();
    });

    function removeSuggestions() {
      if (suggestionBox) { suggestionBox.remove(); suggestionBox = null; }
    }
  }

  // ════════════════════════════════════════
  // 21. PACKAGE BOOK NOW MODAL ALERT
  // ════════════════════════════════════════
  document.querySelectorAll('.btn-book').forEach((btn, i) => {
    btn.addEventListener('click', function(e) {
      addRipple(this, e);
      const card = this.closest('.pkg-card');
      const title = card ? card.querySelector('.pkg-title')?.textContent : 'this package';
      setTimeout(() => {
        alert(`✈️ Booking "${title}" — our team will contact you shortly to confirm your luxury getaway!`);
      }, 300);
    });
  });

  // ════════════════════════════════════════
  // 22. DESTINATION CARD CLICK
  // ════════════════════════════════════════
  document.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('.wishlist-btn')) {
        document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Re-create lucide icons after all DOM manipulation
  setTimeout(() => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 2500);

});
