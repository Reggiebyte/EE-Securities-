/* ============================================================
   EE Solutions – Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll to top button (created first so scroll handlers can use it) ---------- */
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  scrollTopBtn.setAttribute('aria-label', 'Back to top');
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(scrollTopBtn);

  /* ---------- Navbar: sticky + hamburger ---------- */
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Fade-in on scroll ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: if observers aren't supported, just show everything
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // Safety net: never leave content permanently hidden
  window.setTimeout(() => {
    fadeEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('visible');
    });
  }, 1500);

  /* ---------- Counter animation ---------- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    let current    = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, step);
  }

  /* ---------- Form validation & submission ---------- */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        const err = field.closest('.form-group')?.querySelector('.form-error-msg');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (err) err.textContent = 'This field is required.';
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.classList.add('error');
          if (err) err.textContent = 'Please enter a valid email address.';
          valid = false;
        } else {
          field.classList.remove('error');
          if (err) err.textContent = '';
        }
      });

      if (!valid) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const origText  = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      }

      // Simulate async submit
      setTimeout(() => {
        const successEl = form.nextElementSibling;
        if (successEl && successEl.classList.contains('form-success')) {
          form.style.display = 'none';
          successEl.style.display = 'block';
        } else {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent! We\'ll be in touch shortly.';
            submitBtn.style.background = '#16a34a';
          }
        }
      }, 1200);
    });

    // Clear error on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const err = field.closest('.form-group')?.querySelector('.form-error-msg');
        if (err) err.textContent = '';
      });
    });
  });

  /* ---------- Gallery filter ---------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Live chat widget ---------- */
  const chatToggle = document.querySelector('.chat-toggle');
  const chatPanel  = document.querySelector('.chat-panel');
  const chatClose  = document.querySelector('.chat-close');
  const chatSend   = document.querySelector('.chat-send');
  const chatBadge  = document.querySelector('.chat-badge');

  if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => {
      chatPanel.classList.toggle('open');
      if (chatBadge) chatBadge.style.display = 'none';
    });

    if (chatClose) {
      chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));
    }

    if (chatSend) {
      chatSend.addEventListener('click', () => {
        const nameInput = chatPanel.querySelector('input[name="chat-name"]');
        const msgInput  = chatPanel.querySelector('textarea[name="chat-msg"]');
        if (!nameInput?.value.trim() || !msgInput?.value.trim()) return;

        const msgArea = chatPanel.querySelector('.chat-messages');
        if (msgArea) {
          const reply = document.createElement('div');
          reply.className = 'chat-message';
          reply.style.cssText = 'background: var(--navy); color: rgba(255,255,255,0.85); border-radius: 12px 12px 0 12px; margin-left: auto;';
          reply.textContent = msgInput.value;
          msgArea.appendChild(reply);

          setTimeout(() => {
            const resp = document.createElement('div');
            resp.className = 'chat-message';
            resp.textContent = 'Thanks! A member of our team will contact you within the hour. For emergencies call +44 7471 642878.';
            msgArea.appendChild(resp);
            msgArea.scrollTop = msgArea.scrollHeight;
          }, 900);

          nameInput.value = '';
          msgInput.value  = '';
        }
      });
    }
  }

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 84;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Testimonial slider (mobile) ---------- */
  // Just ensure all are visible on desktop; on mobile horizontal scroll works via CSS

});
