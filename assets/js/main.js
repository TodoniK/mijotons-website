/**
 * Main JavaScript file for Mijotons website
 */
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    e.stopPropagation();
    const navbar = select('#navbar ul');
    navbar.classList.toggle('active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
    
    // Add body class to prevent scrolling when menu is open
    if (navbar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  /**
   * Close mobile nav when clicking outside
   */
  document.addEventListener('click', function(e) {
    const navbar = select('#navbar ul');
    const toggle = select('.mobile-nav-toggle');
    const navbarContainer = select('#navbar');
    
    if (navbar.classList.contains('active') && 
        !navbarContainer.contains(e.target) && 
        !toggle.contains(e.target)) {
      navbar.classList.remove('active');
      toggle.classList.remove('bi-x');
      toggle.classList.add('bi-list');
      document.body.style.overflow = '';
    }
  });

  /**
   * Close mobile nav when clicking on a nav item
   */
  on('click', '.navbar .nav-link', function() {
    const navbar = select('#navbar ul');
    const toggle = select('.mobile-nav-toggle');
    
    navbar.classList.remove('active');
    toggle.classList.remove('bi-x');
    toggle.classList.add('bi-list');
    document.body.style.overflow = '';
  }, true);

  /**
   * Close mobile nav on window resize
   */
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991) {
      const navbar = select('#navbar ul');
      const toggle = select('.mobile-nav-toggle');
      
      navbar.classList.remove('active');
      toggle.classList.remove('bi-x');
      toggle.classList.add('bi-list');
      document.body.style.overflow = '';
    }
  });

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
    
    // Add click event to scroll to top
    backtotop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();

      let body = select('body');
      let navbar = select('#navbar');
      let header = select('#header');
      let offset = header.offsetHeight;

      if (!navbar.classList.contains('navbar-mobile')) {
        offset = offset;
      }

      let elementPos = select(this.hash).offsetTop;
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      });
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        setTimeout(() => {
          let header = select('#header');
          let offset = header.offsetHeight;
          let elementPos = select(window.location.hash).offsetTop;
          window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
          });
        }, 300);
      }
    }
  });

  /**
   * Animation on scroll
   */
  function aos_init() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  /**
   * Screenshots slider initialization
   */
  const screensSlider = new Swiper('.screens-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    }
  });

  /**
   * Add smooth scrolling with easing
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /**
   * Add intersection observer for animations
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe feature blocks
  document.querySelectorAll('.feature-block').forEach(block => {
    observer.observe(block);
  });

  /**
   * Add hover effects for interactive elements
   */
  document.querySelectorAll('.feature-block').forEach(block => {
    block.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    block.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  /**
   * Navigation active state based on scroll position
   */
  function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');
    
    if (sections.length === 0) return;
    
    const scrollPos = window.scrollY + 200; // Offset pour prendre en compte le header
    
    // Déterminer quelle section est actuellement visible
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });
    
    // Mettre à jour les liens de navigation
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Exécuter au chargement de la page
  window.addEventListener('load', updateActiveNavigation);
  
  // Exécuter lors du défilement
  window.addEventListener('scroll', () => {
    updateActiveNavigation();
  });

  // Exécuter lors du clic sur un lien de navigation
  document.querySelectorAll('.navbar .nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function() {
      // Retirer la classe active de tous les liens
      document.querySelectorAll('.navbar .nav-link').forEach(l => l.classList.remove('active'));
      // Ajouter la classe active au lien cliqué
      this.classList.add('active');
      
      // Après l'animation de défilement, mettre à jour l'état
      setTimeout(() => {
        updateActiveNavigation();
      }, 1000);
    });
  });
});
