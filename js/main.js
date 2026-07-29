/* ============================================
   BoxifyPack – Global JavaScript
   ============================================ */

/* ---------- Formspree Configuration ----------
   Replace YOUR_FORM_ID with your actual Formspree form ID.
   Create one at https://formspree.io — each form gets a unique ID
   (e.g. https://formspree.io/f/abcdwxyz). You can use the same form
   for both the contact page and the quick-quote popup, or set
   different endpoints below. */
const FORMSPREE_CONTACT = 'https://formspree.io/f/mwvgyeje';
const FORMSPREE_POPUP   = 'https://formspree.io/f/mwvgyeje';

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

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const heading = item.querySelector('h4');
    if (heading) {
      heading.setAttribute('role', 'button');
      heading.setAttribute('tabindex', '0');
      heading.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');

      const toggleFaqItem = () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => {
          i.classList.remove('open');
          const otherHeading = i.querySelector('h4');
          if (otherHeading) otherHeading.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          heading.setAttribute('aria-expanded', 'true');
        }
      };

      heading.addEventListener('click', toggleFaqItem);
      heading.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFaqItem();
        }
      });
    }
  });

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

    if (params.get('intent') === 'review') {
      const messageField = contactForm.querySelector('#message');
      const fileField = contactForm.querySelector('#design-file');
      const promiseBox = document.createElement('div');
      promiseBox.className = 'form-promise form-promise-review';
      promiseBox.innerHTML = '<h3><i class="fa-solid fa-file-arrow-up"></i> Upload Your Artwork or Dieline</h3><p>Attach your AI, PDF, or ZIP file and tell us what you want reviewed. We will reply with structural or pricing feedback within 24 hours on business days.</p>';
      contactForm.insertAdjacentElement('beforebegin', promiseBox);
      if (messageField && !messageField.value) {
        messageField.value = 'Please review our dieline / artwork and advise on structure, print feasibility, and quotation.';
      }
      if (fileField) fileField.focus();
    }

    // Intercept form submission
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      }
      // Clear previous error message
      const prevError = contactForm.querySelector('.form-error-msg');
      if (prevError) prevError.remove();

      try {
        const formData = new FormData(contactForm);
        // Formspree accepts the raw FormData (incl. file uploads)
        const response = await fetch(FORMSPREE_CONTACT, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        // Build a readable summary from the form data
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
              <p class="form-success-note">We'll reply within 24 hours on business days.</p>
              <button class="btn btn-primary" type="button" id="formSuccessCloseBtn">Close</button>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', summaryHTML);
        contactForm.reset();
      } catch (err) {
        const errMsg = document.createElement('p');
        errMsg.className = 'form-error-msg';
        errMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Sorry, something went wrong. Please try again, or email us directly at <a href="mailto:sales@boxifypack.com">sales@boxifypack.com</a>.';
        contactForm.appendChild(errMsg);
        errMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ---------- Homepage Hero Video ---------- */
  const heroVideo = document.querySelector('.brand-hero-bg');
  if (heroVideo) {
    const heroSource = heroVideo.querySelector('source[data-src]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const allowHeroVideo = window.innerWidth > 768 && !prefersReducedMotion && !saveData;

    const loadHeroVideo = () => {
      if (!heroSource || heroVideo.dataset.loaded === 'true') return;
      heroSource.src = heroSource.dataset.src;
      heroVideo.dataset.loaded = 'true';
      heroVideo.load();
      const playPromise = heroVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    if (allowHeroVideo) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries.some(entry => entry.isIntersecting)) {
            loadHeroVideo();
            observer.disconnect();
          }
        }, { rootMargin: '200px 0px' });
        observer.observe(heroVideo);
      } else {
        loadHeroVideo();
      }
    } else {
      heroVideo.removeAttribute('autoplay');
      heroVideo.removeAttribute('loop');
    }
  }

  /* ---------- Quick Quote Popup (Auto-inject on all pages) ---------- */
  if (!document.getElementById('quotePopupOverlay')) {
    const popupHTML = `
      <div class="quote-popup-overlay" id="quotePopupOverlay" role="presentation">
        <div class="quote-popup" id="quotePopup" role="dialog" aria-modal="true" aria-labelledby="quotePopupTitle" aria-describedby="quotePopupSubtitle" tabindex="-1">
          <button class="quote-popup-close" id="closeQuotePopup" aria-label="Close">&times;</button>
          <div id="quotePopupContent"></div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }

  const popupOverlay = document.getElementById('quotePopupOverlay');
  const popupDialog = document.getElementById('quotePopup');
  const popupContent = document.getElementById('quotePopupContent');
  const closePopupBtn = document.getElementById('closeQuotePopup');

  const popupConfigs = {
    quote: {
      intent: 'quote',
      title: 'Get a Detailed Quote in 24 Hours',
      subtitle: 'Tell us your box style, quantity, and delivery target. We will reply with pricing, lead time, and next steps.',
      messageLabel: 'Project Brief',
      messagePlaceholder: 'Share your box style, size, artwork status, finish, and target delivery date...',
      note: 'Need to upload a dieline or artwork? Use the full contact form so you can attach files.',
      submitLabel: 'Request My Quote',
      sampleDefault: false,
      quantityRequired: true
    },
    sample: {
      intent: 'sample',
      title: 'Request a Free Sample Box',
      subtitle: 'We will recommend the closest sample format and confirm sample availability, shipping timing, and the best next step for your project.',
      messageLabel: 'What Would You Like to Review?',
      messagePlaceholder: 'Tell us which box style, material, finish, or market you want to evaluate with the sample...',
      note: 'We usually confirm sample options within 24 hours and ship standard samples in 5-7 working days.',
      submitLabel: 'Request My Sample',
      sampleDefault: true,
      quantityRequired: false
    },
    expert: {
      intent: 'expert',
      title: 'Talk to a Packaging Expert',
      subtitle: 'Share your challenge and we will point you to the right box structure, material, certification path, or next production step.',
      messageLabel: 'What Do You Need Help With?',
      messagePlaceholder: 'Describe your product, compliance needs, packaging pain points, or launch timeline...',
      note: 'If you already have artwork or a dieline, use the full contact form and attach your files for a faster review.',
      submitLabel: 'Talk to an Expert',
      sampleDefault: false,
      quantityRequired: false
    }
  };

  let lastPopupTrigger = null;

  function getPopupConfig(opts = {}) {
    const scenario = opts.scenario && popupConfigs[opts.scenario] ? opts.scenario : (opts.sample ? 'sample' : 'quote');
    return popupConfigs[scenario];
  }

  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => el.offsetParent !== null);
  }

  function renderPopupForm(opts = {}) {
    const config = getPopupConfig(opts);
    const productType = opts.type || '';
    const sampleChecked = opts.sample || config.sampleDefault;
    const quantityFieldClass = config.quantityRequired ? '' : ' quote-popup-field-optional';
    const quantityHelp = config.quantityRequired ? 'Estimated Quantity *' : 'Estimated Quantity (optional)';
    const contactHref = new URL(pagePath.includes('/products/') || pagePath.includes('/blog/') ? '../contact.html' : 'contact.html', window.location.href);
    const reviewHref = `${contactHref.pathname}?intent=review${productType ? `&type=${productType}` : ''}`;

    return `
      <div class="quote-popup-copy">
        <span class="quote-popup-badge">${config.intent === 'quote' ? 'Quotation' : config.intent === 'sample' ? 'Sample Request' : 'Expert Support'}</span>
        <h2 id="quotePopupTitle">${config.title}</h2>
        <p id="quotePopupSubtitle">${config.subtitle}</p>
      </div>
      <form id="quickQuoteForm" class="quote-popup-form">
        <input type="hidden" name="intent" value="${config.intent}">
        <input type="hidden" name="entry_point" value="${opts.source || config.intent}">
        <div class="quote-popup-row">
          <div>
            <label for="popup-name">Your Name *</label>
            <input id="popup-name" type="text" name="name" placeholder="Your Name *" required>
          </div>
          <div>
            <label for="popup-email">Email *</label>
            <input id="popup-email" type="email" name="email" placeholder="Email *" required>
          </div>
        </div>
        <div class="quote-popup-row">
          <div>
            <label for="popup-company">Company Name</label>
            <input id="popup-company" type="text" name="company" placeholder="Company Name">
          </div>
          <div>
            <label for="popup-product-type">Product Type</label>
            <select id="popup-product-type" name="product_type">
              <option value="">Select Product Type</option>
              <option value="food" ${productType === 'food' ? 'selected' : ''}>Food &amp; Confectionery</option>
              <option value="health-beauty" ${productType === 'health-beauty' ? 'selected' : ''}>Health &amp; Beauty</option>
              <option value="pharma" ${productType === 'pharma' ? 'selected' : ''}>Pharma &amp; Supplements</option>
              <option value="gift" ${productType === 'gift' ? 'selected' : ''}>Gift Box</option>
            </select>
          </div>
        </div>
        <div class="quote-popup-row quote-popup-row-single${quantityFieldClass}">
          <div>
            <label for="popup-quantity">${quantityHelp}</label>
            <input id="popup-quantity" type="text" name="quantity" placeholder="e.g. 10,000 pcs"${config.quantityRequired ? ' required' : ''}>
          </div>
        </div>
        <div>
          <label for="popup-message">${config.messageLabel}</label>
          <textarea id="popup-message" name="message" placeholder="${config.messagePlaceholder}" rows="4"></textarea>
        </div>
        <label class="quote-popup-check">
          <input type="checkbox" name="request_sample" value="yes" ${sampleChecked ? 'checked' : ''}>
          I'd like to request a physical sample
        </label>
        <div class="quote-popup-actions">
          <button type="submit" class="btn btn-primary">${config.submitLabel}</button>
          <a class="quote-popup-alt-link" href="${reviewHref}">Need to upload artwork or a dieline?</a>
        </div>
        <p class="quote-popup-note">${config.note}</p>
      </form>
    `;
  }

  function renderPopupSuccess(data = {}) {
    const titles = {
      quote: 'Quote Request Sent',
      sample: 'Sample Request Sent',
      expert: 'Expert Consultation Requested'
    };
    const subtitles = {
      quote: `Thanks, ${data.name || 'there'}. We'll review your requirements and reply with pricing and lead time within 24 hours.`,
      sample: `Thanks, ${data.name || 'there'}. We'll confirm the best sample option and next shipping step within 24 hours.`,
      expert: `Thanks, ${data.name || 'there'}. A packaging specialist will review your questions and get back to you within 24 hours.`
    };
    const productLabels = {
      food: 'Food & Confectionery',
      'health-beauty': 'Health & Beauty',
      pharma: 'Pharma & Supplements',
      gift: 'Gift Box'
    };

    return `
      <div class="quote-popup-success">
        <div class="quote-popup-success-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h3>${titles[data.intent] || 'Inquiry Submitted'}</h3>
        <p class="quote-popup-success-sub">${subtitles[data.intent] || 'We will get back to you soon.'}</p>
        <table class="form-summary-table">
          <tr><th>Name</th><td>${data.name || '—'}</td></tr>
          <tr><th>Email</th><td>${data.email || '—'}</td></tr>
          <tr><th>Company</th><td>${data.company || '—'}</td></tr>
          <tr><th>Product Type</th><td>${productLabels[data.product_type] || 'Not specified'}</td></tr>
          <tr><th>Quantity</th><td>${data.quantity || '—'}</td></tr>
          <tr><th>Sample Requested</th><td>${data.request_sample ? 'Yes' : 'No'}</td></tr>
        </table>
        <button type="button" class="btn btn-primary" id="popupSuccessCloseBtn">Close</button>
      </div>
    `;
  }

  function closePopup() {
    if (!popupOverlay) return;
    popupOverlay.classList.remove('open');
    popupOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastPopupTrigger && typeof lastPopupTrigger.focus === 'function') {
      lastPopupTrigger.focus();
    }
  }

  window.openPopup = function(opts) {
    if (typeof opts === 'string') opts = { type: opts };
    const normalizedOpts = opts || {};
    if (!popupOverlay || !popupDialog || !popupContent) return;

    popupContent.innerHTML = renderPopupForm(normalizedOpts);
    popupOverlay.classList.add('open');
    popupOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const firstField = popupDialog.querySelector('input, select, textarea, button');
    (firstField || popupDialog).focus();
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;

    const popupTrigger = e.target.closest('[data-popup-scenario], a[href*="contact.html?"]');
    if (!popupTrigger) return;

    if (popupTrigger.id === 'popupSuccessCloseBtn') {
      closePopup();
      return;
    }

    const href = popupTrigger.getAttribute('href') || '';
    const scenarioFromData = popupTrigger.getAttribute('data-popup-scenario');
    const shouldInterceptHref = href.includes('contact.html?') && /[?&](quote|sample|type)=/.test(href);
    const shouldInterceptData = !!scenarioFromData;

    if (!shouldInterceptHref && !shouldInterceptData) return;

    e.preventDefault();
    lastPopupTrigger = popupTrigger;

    const url = href ? new URL(href, window.location.href) : null;
    const params = url ? url.searchParams : new URLSearchParams();
    openPopup({
      scenario: scenarioFromData || (params.get('sample') === 'true' ? 'sample' : 'quote'),
      type: params.get('type') || popupTrigger.getAttribute('data-popup-type') || '',
      sample: params.get('sample') === 'true',
      source: popupTrigger.getAttribute('data-popup-source') || popupTrigger.textContent.trim()
    });
  });

  if (closePopupBtn && popupOverlay) {
    closePopupBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) closePopup();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!popupOverlay || !popupOverlay.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closePopup();
      return;
    }

    if (e.key === 'Tab' && popupDialog) {
      const focusable = getFocusableElements(popupDialog);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  if (popupOverlay) {
    popupOverlay.addEventListener('submit', async (e) => {
      const form = e.target.closest('#quickQuoteForm');
      if (!form) return;

      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(FORMSPREE_POPUP, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = {};
        formData.forEach((val, key) => { data[key] = val; });
        popupContent.innerHTML = renderPopupSuccess(data);
        const closeBtn = document.getElementById('popupSuccessCloseBtn');
        if (closeBtn) closeBtn.focus();
      } catch (err) {
        const existingErr = form.querySelector('.form-error-msg');
        if (existingErr) existingErr.remove();
        const errMsg = document.createElement('p');
        errMsg.className = 'form-error-msg';
        errMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Submission failed. Please try again or email <a href="mailto:sales@boxifypack.com">sales@boxifypack.com</a>.';
        form.appendChild(errMsg);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });

    popupOverlay.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('#popupSuccessCloseBtn');
      if (closeBtn) closePopup();
    });
  }

  document.addEventListener('click', (e) => {
    const successCloseBtn = e.target.closest('#formSuccessCloseBtn');
    if (!successCloseBtn) return;

    const successOverlay = document.getElementById('formSuccessOverlay');
    if (successOverlay) successOverlay.remove();
  });

  /* ---------- Page Fade-in ---------- */
  // Mark JS as enabled so reveal animations can hide elements (CSS fallback:
  // if JS fails to load, <html> never gets this class and content stays visible)
  document.documentElement.classList.add('js-enabled');
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
