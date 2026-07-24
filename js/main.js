/* ============================================
   BoxifyPack – Global JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Nav Toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
      toggle.innerHTML = expanded ? '&#10005;' : '&#9776;';
    });
    navLinks.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;';
      });
    });
  }

  /* ---------- Dropdown Menu ---------- */
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const toggleBtn = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('open'); });
        dropdown.classList.toggle('open');
      });
    }
  });
  document.addEventListener('click', () => { dropdowns.forEach(d => d.classList.remove('open')); });

  /* ---------- Highlight Current Page ---------- */
  const pagePath = window.location.pathname;

  // Check if we're on a product subpage
  const isProductPage = pagePath.includes('/products/');
  if (isProductPage) {
    // Activate Products dropdown toggle
    const productsToggle = document.querySelector('.nav-dropdown-toggle');
    if (productsToggle && productsToggle.textContent.trim() === 'Products') {
      productsToggle.classList.add('active');
    }
  }

  document.querySelectorAll('.nav-links a:not(.nav-dropdown-toggle)').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    // Resolve relative path against current page location
    const linkUrl = new URL(href, window.location.href);
    if (linkUrl.pathname === pagePath) {
      link.classList.add('active');
    }
  });

  /* ---------- Image Lightbox ---------- */
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.lightbox-trigger');
    if (img) {
      e.preventDefault();
      const src = img.src || img.getAttribute('data-original') || img.href;
      if (!src) return;
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = `<button class="lightbox-close" aria-label="Close">&times;</button><img src="${src}" alt="Enlarged">`;
      overlay.addEventListener('click', (ev) => { if (ev.target !== overlay.querySelector('img')) overlay.remove(); });
      overlay.querySelector('.lightbox-close').addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    }
  });

  // Close lightbox on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lb = document.querySelector('.lightbox-overlay');
      if (lb) lb.remove();
    }
  });

  /* ---------- Contact Form: URL Param Handling ---------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const params = new URLSearchParams(window.location.search);

    // Auto-check sample checkbox if sample=true
    if (params.get('sample') === 'true') {
      const cb = contactForm.querySelector('#sample');
      if (cb) cb.checked = true;
    }

    // Auto-select product type if type param exists
    const typeParam = params.get('type');
    if (typeParam) {
      const sel = contactForm.querySelector('#product-type');
      if (sel) sel.value = typeParam;
    }

    // Intercept form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((val, key) => { if (key !== 'design-file') data[key] = val; });

      const productLabels = {
        food: 'Food & Confectionery Box',
        'health-beauty': 'Health & Beauty Box',
        pharma: 'Pharma & Supplement Box',
        gift: 'Gift Box'
      };
      const productDisplay = productLabels[data.product_type] || data.product_type || '—';
      const sampleRequested = data.request_sample ? 'Yes' : 'No';

      const summaryHTML = `
        <div class="form-success-overlay" id="formSuccessOverlay">
          <div class="form-success-modal">
            <div class="form-success-icon"><i class="fa-solid fa-circle-check"></i></div>
            <h2>Inquiry Submitted!</h2>
            <p class="form-success-subtitle">Here's a summary of your submission:</p>
            <table class="form-summary-table">
              <tr><th>Name</th><td>${data.name || '—'}</td></tr>
              <tr><th>Company</th><td>${data.company || '—'}</td></tr>
              <tr><th>Email</th><td>${data.email || '—'}</td></tr>
              <tr><th>Product Type</th><td>${productDisplay}</td></tr>
              <tr><th>Quantity</th><td>${data.quantity || '—'}</td></tr>
              <tr><th>Sample Requested</th><td>${sampleRequested}</td></tr>
              <tr><th>Message</th><td>${data.message || '—'}</td></tr>
            </table>
            <p class="form-success-note">This is a local demo – no data was sent. In production, this form will submit to your email or Formspree.</p>
            <button class="btn btn-primary" onclick="document.getElementById('formSuccessOverlay').remove()">Close</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', summaryHTML);
    });
  }

  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ---------- Quick Quote Popup (Auto-inject on all pages) ---------- */
  // Inject popup HTML if not already present
  if (!document.getElementById('quotePopupOverlay')) {
    const popupHTML = `
      <div class="quote-popup-overlay" id="quotePopupOverlay">
        <div class="quote-popup">
          <button class="quote-popup-close" id="closeQuotePopup" aria-label="Close">&times;</button>
          <h2>Request a Quick Quote</h2>
          <p>Fill in the form below and we'll get back to you within 24 hours.</p>
          <form id="quickQuoteForm" class="quote-popup-form">
            <div class="quote-popup-row">
              <input type="text" name="name" placeholder="Your Name *" required>
              <input type="email" name="email" placeholder="Email *" required>
            </div>
            <div class="quote-popup-row">
              <input type="text" name="company" placeholder="Company Name">
              <select name="product_type">
                <option value="">Select Product Type</option>
                <option value="food">Food &amp; Confectionery</option>
                <option value="health-beauty">Health &amp; Beauty</option>
                <option value="pharma">Pharma &amp; Supplements</option>
                <option value="gift">Gift Box</option>
              </select>
            </div>
            <input type="text" name="quantity" placeholder="Estimated Quantity (e.g. 10,000 pcs)">
            <textarea name="message" placeholder="Tell us about your project: size, material, printing, timeline..." rows="3"></textarea>
            <label class="quote-popup-check">
              <input type="checkbox" name="request_sample" value="yes"> I'd like to request a physical sample
            </label>
            <button type="submit" class="btn btn-primary">Send Inquiry</button>
            <p class="quote-popup-note">We respond within 24 hours. Your information is confidential.</p>
          </form>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }

  // Global openPopup function (callable via onclick="openPopup()")
  window.openPopup = function() {
    const overlay = document.getElementById('quotePopupOverlay');
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  // Convert all float-btn-sample links to popup triggers
  const sampleBtns = document.querySelectorAll('.float-btn-sample');
  sampleBtns.forEach(btn => {
    // Replace <a> with <button> behavior
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });
  });

  const closePopupBtn = document.getElementById('closeQuotePopup');
  const popupOverlay = document.getElementById('quotePopupOverlay');
  const quickQuoteForm = document.getElementById('quickQuoteForm');

  if (closePopupBtn && popupOverlay) {
    closePopupBtn.addEventListener('click', () => {
      popupOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Close popup on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay && popupOverlay.classList.contains('open')) {
      popupOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Handle quick quote form submission
  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(quickQuoteForm);
      const data = {};
      formData.forEach((val, key) => { data[key] = val; });

      const productLabels = {
        food: 'Food & Confectionery',
        'health-beauty': 'Health & Beauty',
        pharma: 'Pharma & Supplements',
        gift: 'Gift Box'
      };
      const productDisplay = productLabels[data.product_type] || 'Not specified';
      const sampleRequested = data.request_sample ? 'Yes' : 'No';

      // Replace form with success message
      quickQuoteForm.innerHTML = `
        <div style="text-align:center; padding:20px 0;">
          <div style="font-size:3rem; color:#22c55e; margin-bottom:12px;"><i class="fa-solid fa-circle-check"></i></div>
          <h3 style="font-size:1.3rem; color:var(--primary); margin-bottom:.5rem;">Inquiry Submitted!</h3>
          <p style="color:var(--text-light); margin-bottom:1rem;">Thank you, ${data.name || 'there'}! We'll get back to you within 24 hours.</p>
          <table class="form-summary-table">
            <tr><th>Name</th><td>${data.name || '—'}</td></tr>
            <tr><th>Email</th><td>${data.email || '—'}</td></tr>
            <tr><th>Company</th><td>${data.company || '—'}</td></tr>
            <tr><th>Product Type</th><td>${productDisplay}</td></tr>
            <tr><th>Quantity</th><td>${data.quantity || '—'}</td></tr>
            <tr><th>Sample Requested</th><td>${sampleRequested}</td></tr>
          </table>
          <p style="font-size:.82rem; color:var(--text-light); font-style:italic; margin-bottom:1rem;">This is a demo – no data was sent. In production, this form will submit to your email or Formspree.</p>
          <button class="btn btn-primary" onclick="document.getElementById('quotePopupOverlay').classList.remove('open'); document.body.style.overflow='';">Close</button>
        </div>
      `;
    });
  }

  /* ---------- Page Fade-in ---------- */
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });

  /* ---------- Back to Top Button ---------- */
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const toggleBackToTop = () => {
    const floatButtons = document.querySelector('.float-buttons');
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
      if (floatButtons) floatButtons.classList.add('shifted');
    } else {
      backToTop.classList.remove('visible');
      if (floatButtons) floatButtons.classList.remove('shifted');
    }
  };
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  /* ---------- Scroll Reveal Animations ---------- */
  // Auto-add reveal classes to common block elements
  const revealSelectors = [
    '.section-title', '.section-subtitle',
    '.product-card', '.card', '.blog-card', '.stat-card', '.sustain-card', '.testimonial-card',
    '.faq-item', '.timeline-step', '.advantage-item', '.trust-badge', '.subcat-tag',
    '.about-content', '.contact-info-item', '.contact-form'
  ];
  document.querySelectorAll(revealSelectors.join(',')).forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });

  // Stagger grid children
  ['card-grid', 'blog-grid', 'stats-grid', 'sustainability-grid', 'testimonials-grid', 'advantages-grid'].forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        if (i < 6) child.setAttribute('data-delay', String(i + 1));
      });
    });
  });

  // About/contact two-column reveals
  document.querySelectorAll('.about-content').forEach(grid => {
    const cols = grid.children;
    if (cols[0]) cols[0].classList.add('reveal-left');
    if (cols[1]) cols[1].classList.add('reveal-right');
  });
  document.querySelectorAll('.contact-grid').forEach(grid => {
    const cols = grid.children;
    if (cols[0]) cols[0].classList.add('reveal-left');
    if (cols[1]) cols[1].classList.add('reveal-right');
  });

  // Observe and reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

});
