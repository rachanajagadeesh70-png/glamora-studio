/**
 * ==========================================================================
 * GLAMORA STUDIO - LUXURY GIRLS-ONLY BEAUTY SALON
 * Interactive Vanilla JavaScript Engine
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Toast Notification Helper
     -------------------------------------------------------------------------- */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;

    let icon = 'fa-sparkles';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* --------------------------------------------------------------------------
     2. Sticky Header & Active Navigation Highlighting
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for active link
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .drawer-book-btn');

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Keyboard trap / Escape key for drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLightbox();
      closeConfirmation();
      closeEstimator();
    }
  });

  /* --------------------------------------------------------------------------
     4. Smooth Scrolling for Internal Anchor Links
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#privacy' || targetId === '#terms') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. Scroll Reveal Animations & Number Counters
     -------------------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('.animate-fade, .animate-slide-up, .service-card, .offer-card, .expert-card');

  if ('IntersectionObserver' in window) {
    const appearanceObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => appearanceObserver.observe(el));
  } else {
    // Fallback if browser lacks IntersectionObserver
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  /* --------------------------------------------------------------------------
     6. Services Category Filter
     -------------------------------------------------------------------------- */
  const serviceFilterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      serviceFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     7. Auto-Fill Booking Form from Services and Offers
     -------------------------------------------------------------------------- */
  const serviceSelect = document.getElementById('serviceSelect');
  const bookServiceBtns = document.querySelectorAll('.book-service-btn');
  const bookPackageBtns = document.querySelectorAll('.book-package-btn');

  function selectAndScrollToBooking(serviceName) {
    if (serviceSelect && serviceName) {
      let optionFound = false;
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.includes(serviceName) || serviceName.includes(serviceSelect.options[i].value)) {
          serviceSelect.selectedIndex = i;
          optionFound = true;
          break;
        }
      }

      if (!optionFound) {
        // If exact match isn't in dropdown, set nearest match or value
        const newOpt = new Option(serviceName, serviceName, true, true);
        serviceSelect.add(newOpt);
      }

      // Highlight select field
      serviceSelect.parentElement.style.boxShadow = '0 0 0 4px rgba(197, 139, 149, 0.4)';
      setTimeout(() => {
        serviceSelect.parentElement.style.boxShadow = '';
      }, 1500);

      showToast(`Selected "${serviceName}" in booking form`, 'success');
    }

    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      const navHeight = header ? header.offsetHeight : 80;
      const targetPos = bookingSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  }

  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      selectAndScrollToBooking(serviceName);
    });
  });

  bookPackageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const packageName = btn.getAttribute('data-package');
      selectAndScrollToBooking(packageName);
    });
  });

  /* --------------------------------------------------------------------------
     8. Special Offers Countdown Timer
     -------------------------------------------------------------------------- */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // Set target countdown to 4 days from current load
  const countdownTarget = new Date();
  countdownTarget.setDate(countdownTarget.getDate() + 4);
  countdownTarget.setHours(countdownTarget.getHours() + 14);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownTarget.getTime() - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* --------------------------------------------------------------------------
     9. Copy Promo Code Functionality
     -------------------------------------------------------------------------- */
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const couponCode = document.getElementById('couponCode');
  const topPromoCode = document.getElementById('topPromoCode');

  function copyCode(codeStr) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeStr).then(() => {
        handleCopySuccess();
      }).catch(() => {
        fallbackCopy(codeStr);
      });
    } else {
      fallbackCopy(codeStr);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      handleCopySuccess();
    } catch (err) {
      showToast('Code copied to clipboard: ' + text, 'success');
    }
    document.body.removeChild(textArea);
  }

  function handleCopySuccess() {
    if (copyBtnText) copyBtnText.textContent = 'Copied!';
    showToast('Promo code GLAMORA20 copied! 20% off ready to apply.', 'success');
    setTimeout(() => {
      if (copyBtnText) copyBtnText.textContent = 'Copy Code';
    }, 2500);
  }

  if (copyCodeBtn && couponCode) {
    copyCodeBtn.addEventListener('click', () => {
      copyCode(couponCode.textContent.trim());
    });
  }

  if (topPromoCode) {
    topPromoCode.addEventListener('click', () => {
      copyCode(topPromoCode.textContent.trim());
    });
  }

  /* --------------------------------------------------------------------------
     10. Gallery Filtering & Lightbox Modal
     -------------------------------------------------------------------------- */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  let visibleGalleryItems = Array.from(galleryItems);

  // Gallery filter
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCat = btn.getAttribute('data-gallery-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterCat === 'all' || itemCat === filterCat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Update visible items array for lightbox
      visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    });
  });

  function openLightbox(index) {
    if (!visibleGalleryItems.length || !lightboxModal || !lightboxImg) return;
    currentGalleryIndex = index;
    const item = visibleGalleryItems[currentGalleryIndex];
    const src = item.getAttribute('data-src') || item.querySelector('img').src;
    const caption = item.getAttribute('data-caption') || item.querySelector('.gallery-title').textContent;

    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNextLightbox() {
    if (!visibleGalleryItems.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevLightbox() {
    if (!visibleGalleryItems.length) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = visibleGalleryItems.indexOf(item);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') showNextLightbox();
      if (e.key === 'ArrowLeft') showPrevLightbox();
    }
  });

  /* --------------------------------------------------------------------------
     11. Reviews Archive: Responsive Filters, Entrance Animation & Load More
     -------------------------------------------------------------------------- */
  const reviewsGrid = document.getElementById('reviewsGrid');
  const reviewCards = document.querySelectorAll('.review-grid-card');
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const loadMoreBtn = document.getElementById('loadMoreReviewsBtn');

  let activeReviewFilter = 'all';
  let isAllReviewsLoaded = false;

  // A. Scroll-triggered smooth entrance animation
  if ('IntersectionObserver' in window) {
    const reviewCardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08
    });

    reviewCards.forEach((card, index) => {
      card.style.animationDelay = `${(index % 3) * 0.08}s`;
      reviewCardObserver.observe(card);
    });
  } else {
    reviewCards.forEach(card => card.classList.add('animate-in'));
  }

  // B. Update filter pill counts dynamically
  function updateReviewFilterCounts() {
    const counts = { all: reviewCards.length, bridal: 0, skincare: 0, hair: 0, waxing: 0, nails: 0 };
    reviewCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (counts[cat] !== undefined) counts[cat]++;
    });

    filterBtns.forEach(btn => {
      const cat = btn.getAttribute('data-filter');
      const badge = btn.querySelector('.filter-count-badge');
      if (badge && counts[cat] !== undefined) {
        badge.textContent = counts[cat];
      }
    });
  }

  // C. Interactive Category Filtering (All Reviews, Bridal, Skin Care, Hair, Waxing, Nails)
  function applyReviewFilter(category) {
    activeReviewFilter = category;

    filterBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-filter') === category;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    reviewCards.forEach((card, index) => {
      const cardCategory = card.getAttribute('data-category');
      const matches = (category === 'all') || (cardCategory === category);

      if (!matches) {
        card.classList.add('filter-hidden');
      } else {
        card.classList.remove('filter-hidden');
        if (category !== 'all') {
          // In a specific category, show all matching cards including previously hidden ones
          card.classList.remove('review-hidden');
          setTimeout(() => card.classList.add('animate-in'), 50);
        } else {
          // If in 'all' view, only show cards 7 & 8 if load more was already clicked
          if (!isAllReviewsLoaded && (index >= 6)) {
            card.classList.add('review-hidden');
          } else {
            card.classList.remove('review-hidden');
            setTimeout(() => card.classList.add('animate-in'), 50);
          }
        }
      }
    });

    // Update Load More button display
    if (loadMoreBtn) {
      if (category !== 'all') {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'inline-flex';
        if (isAllReviewsLoaded) {
          loadMoreBtn.classList.add('all-loaded');
          loadMoreBtn.innerHTML = `
            <span class="btn-icon"><i class="fa-solid fa-circle-check"></i></span>
            <span class="btn-text">All 8 Reviews Displayed</span>
          `;
        } else {
          loadMoreBtn.classList.remove('all-loaded');
          loadMoreBtn.innerHTML = `
            <span class="btn-icon"><i class="fa-solid fa-plus"></i></span>
            <span class="btn-text">Load More Reviews</span>
            <span class="reviews-remaining-pill">(2 More)</span>
          `;
        }
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      applyReviewFilter(filter);
    });
  });

  // D. Load More Reviews Button Handler
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (isAllReviewsLoaded) return;

      // Temporary luxury loading state
      loadMoreBtn.innerHTML = `
        <span class="btn-icon"><i class="fa-solid fa-circle-notch fa-spin"></i></span>
        <span class="btn-text">Revealing More Stories...</span>
      `;

      setTimeout(() => {
        const hiddenCards = document.querySelectorAll('.review-grid-card.review-hidden');
        hiddenCards.forEach((card, idx) => {
          card.classList.remove('review-hidden');
          setTimeout(() => {
            card.classList.add('animate-in');
          }, idx * 120);
        });

        isAllReviewsLoaded = true;
        loadMoreBtn.classList.add('all-loaded');
        loadMoreBtn.innerHTML = `
          <span class="btn-icon"><i class="fa-solid fa-circle-check"></i></span>
          <span class="btn-text">All 8 Reviews Displayed</span>
        `;

        if (typeof showToast === 'function') {
          showToast('Loaded all 8 client reviews!', 'info', 2500);
        }
      }, 300);
    });
  }

  updateReviewFilterCounts();
  const estimatorModal = document.getElementById('estimatorModal');
  const openEstimatorBtn = document.getElementById('openEstimatorBtn');
  const closeEstimatorBtn = document.getElementById('closeEstimatorBtn');
  const calcCheckboxes = document.querySelectorAll('.calc-service-check');
  const calcTotalTime = document.getElementById('calcTotalTime');
  const calcTotalPrice = document.getElementById('calcTotalPrice');
  const applyEstimatorBtn = document.getElementById('applyEstimatorToBooking');

  function openEstimator() {
    if (!estimatorModal) return;
    estimatorModal.classList.add('active');
    estimatorModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeEstimator() {
    if (!estimatorModal) return;
    estimatorModal.classList.remove('active');
    estimatorModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  function updateEstimatorTotals() {
    let totalPrice = 0;
    let totalTime = 0;

    calcCheckboxes.forEach(cb => {
      if (cb.checked) {
        totalPrice += parseInt(cb.getAttribute('data-price'), 10) || 0;
        totalTime += parseInt(cb.getAttribute('data-time'), 10) || 0;
      }
    });

    if (calcTotalPrice) {
      calcTotalPrice.textContent = inrFormatter.format(totalPrice);
    }
    if (calcTotalTime) {
      if (totalTime >= 60) {
        const hrs = Math.floor(totalTime / 60);
        const mins = totalTime % 60;
        calcTotalTime.textContent = mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hours`;
      } else {
        calcTotalTime.textContent = `${totalTime} mins`;
      }
    }
  }

  if (openEstimatorBtn) openEstimatorBtn.addEventListener('click', openEstimator);
  if (closeEstimatorBtn) closeEstimatorBtn.addEventListener('click', closeEstimator);

  calcCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateEstimatorTotals);
  });

  if (estimatorModal) {
    estimatorModal.addEventListener('click', (e) => {
      if (e.target === estimatorModal) closeEstimator();
    });
  }

  if (applyEstimatorBtn) {
    applyEstimatorBtn.addEventListener('click', () => {
      const selectedNames = [];
      calcCheckboxes.forEach(cb => {
        if (cb.checked) selectedNames.push(cb.getAttribute('data-name'));
      });

      closeEstimator();

      if (selectedNames.length > 0) {
        // Auto-fill in special requests
        const clientNotes = document.getElementById('clientNotes');
        if (clientNotes) {
          clientNotes.value = `Estimated Package: ${selectedNames.join(', ')} (${calcTotalPrice.textContent}, ~${calcTotalTime.textContent})`;
        }
        selectAndScrollToBooking(selectedNames[0]);
        showToast('Services applied to your booking request!', 'success');
      } else {
        selectAndScrollToBooking('Royal Radiance Facial & Skincare');
      }
    });
  }

  /* --------------------------------------------------------------------------
     13. Appointment Booking Form Logic & Validation
     -------------------------------------------------------------------------- */
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentDate = document.getElementById('appointmentDate');
  const timeChips = document.querySelectorAll('.time-chip');
  const selectedTimeInput = document.getElementById('selectedTime');
  const clientNameInput = document.getElementById('clientName');
  const clientPhoneInput = document.getElementById('clientPhone');
  const clientEmailInput = document.getElementById('clientEmail');
  const specialistSelect = document.getElementById('specialistSelect');

  // Confirmation Modal Elements
  const confirmationModal = document.getElementById('confirmationModal');
  const closeConfirmModal = document.getElementById('closeConfirmModal');
  const confirmClientName = document.getElementById('confirmClientName');
  const confirmRef = document.getElementById('confirmRef');
  const confirmService = document.getElementById('confirmService');
  const confirmDateTime = document.getElementById('confirmDateTime');
  const confirmSpecialist = document.getElementById('confirmSpecialist');
  const confirmContact = document.getElementById('confirmContact');

  // Restrict date to today and future dates
  if (appointmentDate) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDate.setAttribute('min', today);
    // Set default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    appointmentDate.value = tomorrow.toISOString().split('T')[0];
  }

  // Time Slot Selection
  const selectedTimeHint = document.getElementById('selectedTimeHint');
  timeChips.forEach(chip => {
    chip.addEventListener('click', function () {
      timeChips.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      const timeVal = this.getAttribute('data-time');
      if (selectedTimeInput) {
        selectedTimeInput.value = timeVal;
        // Clear error if present
        const formGroup = selectedTimeInput.closest('.form-group');
        if (formGroup) formGroup.classList.remove('has-error');
      }
      if (selectedTimeHint) {
        selectedTimeHint.textContent = `${timeVal} selected`;
      }
    });
  });

  // Pre-select first time chip by default
  if (timeChips.length > 0 && selectedTimeInput) {
    timeChips[0].classList.add('selected');
    const initialTime = timeChips[0].getAttribute('data-time');
    selectedTimeInput.value = initialTime;
    if (selectedTimeHint) {
      selectedTimeHint.textContent = `${initialTime} selected`;
    }
  }

  // Validation Helpers
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Strip non-digits and check if at least 7 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7;
  }

  function setFieldError(field, isValid) {
    const group = field.closest('.form-group');
    if (!group) return;
    if (isValid) {
      group.classList.remove('has-error');
    } else {
      group.classList.add('has-error');
    }
  }

  // Clear errors dynamically on input
  if (clientNameInput) {
    clientNameInput.addEventListener('input', () => {
      if (clientNameInput.value.trim().length >= 2) setFieldError(clientNameInput, true);
    });
  }
  if (clientPhoneInput) {
    clientPhoneInput.addEventListener('input', () => {
      if (validatePhone(clientPhoneInput.value)) setFieldError(clientPhoneInput, true);
    });
  }
  if (clientEmailInput) {
    clientEmailInput.addEventListener('input', () => {
      if (validateEmail(clientEmailInput.value)) setFieldError(clientEmailInput, true);
    });
  }
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      if (serviceSelect.value) setFieldError(serviceSelect, true);
    });
  }
  if (appointmentDate) {
    appointmentDate.addEventListener('change', () => {
      if (appointmentDate.value) setFieldError(appointmentDate, true);
    });
  }

  // Form Submit Handler
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let formIsValid = true;

      // Validate Name
      const nameVal = clientNameInput ? clientNameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        setFieldError(clientNameInput, false);
        formIsValid = false;
      } else {
        setFieldError(clientNameInput, true);
      }

      // Validate Phone
      const phoneVal = clientPhoneInput ? clientPhoneInput.value.trim() : '';
      if (!phoneVal || !validatePhone(phoneVal)) {
        setFieldError(clientPhoneInput, false);
        formIsValid = false;
      } else {
        setFieldError(clientPhoneInput, true);
      }

      // Validate Email
      const emailVal = clientEmailInput ? clientEmailInput.value.trim() : '';
      if (!emailVal || !validateEmail(emailVal)) {
        setFieldError(clientEmailInput, false);
        formIsValid = false;
      } else {
        setFieldError(clientEmailInput, true);
      }

      // Validate Service
      const serviceVal = serviceSelect ? serviceSelect.value : '';
      if (!serviceVal) {
        setFieldError(serviceSelect, false);
        formIsValid = false;
      } else {
        setFieldError(serviceSelect, true);
      }

      // Validate Date
      const dateVal = appointmentDate ? appointmentDate.value : '';
      if (!dateVal) {
        setFieldError(appointmentDate, false);
        formIsValid = false;
      } else {
        setFieldError(appointmentDate, true);
      }

      // Validate Time
      const timeVal = selectedTimeInput ? selectedTimeInput.value : '';
      if (!timeVal) {
        const timeGroup = selectedTimeInput.closest('.form-group');
        if (timeGroup) timeGroup.classList.add('has-error');
        formIsValid = false;
      }

      if (!formIsValid) {
        showToast('Please complete all highlighted fields correctly.', 'error');
        return;
      }

      // Generate realistic booking reference
      const randomRef = '#GLAM-' + Math.floor(1000 + Math.random() * 9000);
      const specialistVal = specialistSelect ? specialistSelect.value : 'Any Available Specialist';

      // Format date for readable confirmation
      const dateObj = new Date(dateVal + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Populate confirmation modal
      if (confirmClientName) confirmClientName.textContent = nameVal;
      if (confirmRef) confirmRef.textContent = randomRef;
      if (confirmService) confirmService.textContent = serviceVal;
      if (confirmDateTime) confirmDateTime.textContent = `${formattedDate} at ${timeVal}`;
      if (confirmSpecialist) confirmSpecialist.textContent = specialistVal;
      if (confirmContact) confirmContact.textContent = `${phoneVal} • ${emailVal}`;

      // Open Confirmation Modal
      if (confirmationModal) {
        confirmationModal.classList.add('active');
        confirmationModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      showToast(`Appointment request registered for ${nameVal}!`, 'success');

      // Reset Form fields
      appointmentForm.reset();
      if (timeChips.length > 0 && selectedTimeInput) {
        timeChips.forEach(c => c.classList.remove('selected'));
        timeChips[0].classList.add('selected');
        const defaultTime = timeChips[0].getAttribute('data-time');
        selectedTimeInput.value = defaultTime;
        if (selectedTimeHint) {
          selectedTimeHint.textContent = `${defaultTime} selected`;
        }
      }
    });
  }

  function closeConfirmation() {
    if (!confirmationModal) return;
    confirmationModal.classList.remove('active');
    confirmationModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeConfirmModal) closeConfirmModal.addEventListener('click', closeConfirmation);
  if (confirmationModal) {
    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) closeConfirmation();
    });
  }

  /* --------------------------------------------------------------------------
     14. FAQ Accordion Logic
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------------------------------------------------------------
     15. Quick Reception Inquiry & Newsletter Form Handlers
     -------------------------------------------------------------------------- */
  const quickContactForm = document.getElementById('quickContactForm');
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inqName = document.getElementById('inquiryName')?.value.trim();
      const inqEmail = document.getElementById('inquiryEmail')?.value.trim();
      const inqMsg = document.getElementById('inquiryMessage')?.value.trim();

      if (!inqName || !inqEmail || !inqMsg) {
        showToast('Please fill in all contact fields.', 'error');
        return;
      }

      showToast(`Thank you, ${inqName}! Our salon concierge will respond shortly.`, 'success');
      quickContactForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail ? newsletterEmail.value.trim() : '';

      if (!validateEmail(email)) {
        if (newsletterMsg) {
          newsletterMsg.className = 'newsletter-msg error';
          newsletterMsg.textContent = 'Please provide a valid email address.';
        }
        return;
      }

      if (newsletterMsg) {
        newsletterMsg.className = 'newsletter-msg success';
        newsletterMsg.textContent = 'Welcome to The Queens Club! Check your inbox for secret privileges.';
      }
      showToast('Subscribed to Glamora Queens Club!', 'success');
      newsletterForm.reset();

      setTimeout(() => {
        if (newsletterMsg) newsletterMsg.textContent = '';
      }, 5000);
    });
  }

  /* --------------------------------------------------------------------------
     16. Back to Top Button
     -------------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     17. Dynamic Year in Footer
     -------------------------------------------------------------------------- */
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     18. Floating Buttons Footer Clearance (Vanilla JS Smooth Offset)
     -------------------------------------------------------------------------- */
  const siteFooter = document.querySelector('.site-footer');
  const floatingWhatsapp = document.querySelector('.floating-whatsapp');

  function adjustFloatingButtonsClearance() {
    if (!siteFooter) return;
    const footerRect = siteFooter.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (footerRect.top < windowHeight) {
      const overlap = windowHeight - footerRect.top;
      const bttBottom = Math.max(20, overlap + 14);
      const waBottom = Math.max(74, overlap + 64);
      if (backToTop) backToTop.style.bottom = `${bttBottom}px`;
      if (floatingWhatsapp) floatingWhatsapp.style.bottom = `${waBottom}px`;
    } else {
      if (backToTop) backToTop.style.bottom = '';
      if (floatingWhatsapp) floatingWhatsapp.style.bottom = '';
    }
  }

  window.addEventListener('scroll', adjustFloatingButtonsClearance, { passive: true });
  window.addEventListener('resize', adjustFloatingButtonsClearance);

  /* --------------------------------------------------------------------------
     19. Appointment Form Smooth Viewport Entrance & Field Focus Effects
     -------------------------------------------------------------------------- */
  const bookingFormPane = document.querySelector('.booking-form-pane');

  if (bookingFormPane) {
    if ('IntersectionObserver' in window) {
      const formObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Prevents restarting while scrolling
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
      formObserver.observe(bookingFormPane);
    } else {
      bookingFormPane.classList.add('is-visible');
    }

    // Subtle focus & blur effects on form groups
    const bookingInputs = bookingFormPane.querySelectorAll('input, select, textarea');
    bookingInputs.forEach(input => {
      input.addEventListener('focus', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.add('is-focused');
      });
      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('is-focused');
      });
    });
  }

  /* --------------------------------------------------------------------------
     20. About Us Section: Scroll Triggered Reveals & Subtle Mouse Parallax
     -------------------------------------------------------------------------- */
  const aboutSection = document.getElementById('about');
  const aboutVisualCol = document.getElementById('aboutVisualCol');
  const aboutImageCard = document.getElementById('aboutImageCard');
  const aboutExpBadge = document.getElementById('aboutExpBadge');

  if (aboutSection) {
    // Scroll reveal observer (triggers once)
    if ('IntersectionObserver' in window) {
      const aboutObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            aboutSection.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });
      aboutObserver.observe(aboutSection);
    } else {
      aboutSection.classList.add('is-visible');
    }

    // Subtle 3D mouse parallax on desktop visual column
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 992px) and (pointer: fine)').matches;

    if (!prefersReducedMotion && isDesktop && aboutVisualCol && aboutImageCard) {
      let isHovering = false;
      let rafId = null;
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      function updateParallax() {
        if (!isHovering) return;

        // Smooth dampening towards target coordinates (clamped to max ±8px)
        mouseX += (targetX - mouseX) * 0.12;
        mouseY += (targetY - mouseY) * 0.12;

        const tiltX = (mouseY * -0.3).toFixed(2);
        const tiltY = (mouseX * 0.3).toFixed(2);

        aboutImageCard.style.transform = `translate3d(${mouseX.toFixed(2)}px, ${mouseY.toFixed(2)}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        if (aboutExpBadge) {
          aboutExpBadge.style.transform = `translate3d(${(mouseX * 1.6).toFixed(2)}px, ${(mouseY * 1.6).toFixed(2)}px, 0)`;
        }

        rafId = requestAnimationFrame(updateParallax);
      }

      aboutVisualCol.addEventListener('mouseenter', () => {
        isHovering = true;
        aboutImageCard.style.transition = 'none';
        if (aboutExpBadge) aboutExpBadge.style.transition = 'none';
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateParallax);
      });

      aboutVisualCol.addEventListener('mousemove', (e) => {
        const rect = aboutVisualCol.getBoundingClientRect();
        // Normalized coordinate from center (-1 to 1)
        const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        // Limit movement to max ±8px for refined luxury feel
        targetX = Math.max(-8, Math.min(8, relX * 8));
        targetY = Math.max(-7, Math.min(7, relY * 7));
      });

      aboutVisualCol.addEventListener('mouseleave', () => {
        isHovering = false;
        cancelAnimationFrame(rafId);
        targetX = 0;
        targetY = 0;
        mouseX = 0;
        mouseY = 0;

        aboutImageCard.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        aboutImageCard.style.transform = 'translate3d(0, 0, 0)';

        if (aboutExpBadge) {
          aboutExpBadge.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
          aboutExpBadge.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     21. Feminine Face Logo Interactive Micro-Animations & Entrance
     -------------------------------------------------------------------------- */
  const headerBrandLogo = document.querySelector('.site-header .brand-logo');
  if (headerBrandLogo) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const logoMark = headerBrandLogo.querySelector('.logo-mark');
      const orbitRing = headerBrandLogo.querySelector('.logo-ring-orbit');
      const faceArt = headerBrandLogo.querySelector('.face-art-group');

      // Gentle entrance animation when the website loads
      requestAnimationFrame(() => {
        if (logoMark) logoMark.classList.add('is-entered');
      });

      // Smooth hover micro-animations on circular border and face illustration
      if (logoMark && orbitRing && faceArt) {
        headerBrandLogo.addEventListener('mouseenter', () => {
          orbitRing.style.transform = 'rotate(72deg)';
          faceArt.style.transform = 'scale(1.05)';
        });

        headerBrandLogo.addEventListener('mouseleave', () => {
          orbitRing.style.transform = 'rotate(0deg)';
          faceArt.style.transform = 'scale(1)';
        });
      }
    }
  }

  /* --------------------------------------------------------------------------
     22. Hero 3D Typography Entrance Animation Engine
     -------------------------------------------------------------------------- */
  function initHeroTypographyEntrance() {
    const heroTitle = document.getElementById('heroTitle');
    const heroBadge = document.getElementById('heroBadge');
    const heroDesc = document.getElementById('heroDescription');
    const heroActions = document.getElementById('heroActions');

    if (!heroTitle) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (heroBadge) heroBadge.classList.add('entered');
      if (heroDesc) heroDesc.classList.add('entered');
      if (heroActions) heroActions.classList.add('entered');
      return;
    }

    // Split each hero line into words and 3D character spans
    const lines = heroTitle.querySelectorAll('.hero-line');
    const baseStagger = 0.036; // seconds between adjacent characters
    const line1StartDelay = 0.26;
    const line2StartDelay = 0.72;

    lines.forEach((line, lineIndex) => {
      const originalText = line.textContent.trim();
      line.innerHTML = '';
      line.setAttribute('aria-hidden', 'true');

      const words = originalText.split(/\s+/);
      const lineStartDelay = lineIndex === 0 ? line1StartDelay : line2StartDelay;
      let lineCharCounter = 0;

      words.forEach((wordText, wordIdx) => {
        const wordContainer = document.createElement('span');
        wordContainer.className = 'hero-word';

        const chars = Array.from(wordText);
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'hero-char';
          charSpan.textContent = char;

          const charDelay = (lineStartDelay + lineCharCounter * baseStagger).toFixed(3);
          charSpan.style.setProperty('--char-delay', `${charDelay}s`);
          charSpan.style.setProperty('--char-index', lineCharCounter);

          wordContainer.appendChild(charSpan);
          lineCharCounter++;
        });

        line.appendChild(wordContainer);

        // Preserve spacing between words with an inline spacer
        if (wordIdx < words.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'hero-space';
          spaceSpan.innerHTML = '&nbsp;';
          line.appendChild(spaceSpan);
        }
      });
    });

    // Animate Badge
    setTimeout(() => {
      if (heroBadge) heroBadge.classList.add('entered');
    }, 80);

    // Trigger 3D letters entrance drop
    requestAnimationFrame(() => {
      const allChars = heroTitle.querySelectorAll('.hero-char');
      allChars.forEach((c) => c.classList.add('char-animating'));
    });

    // Animate description paragraph with subtle upward fade-in
    setTimeout(() => {
      if (heroDesc) heroDesc.classList.add('entered');
    }, 1300);

    // Animate CTA buttons with upward movement and scale effect
    setTimeout(() => {
      if (heroActions) heroActions.classList.add('entered');
    }, 1500);

    // Trigger soft rose-gold shimmer on "Our Passion" once entrance settles
    setTimeout(() => {
      const line2 = heroTitle.querySelector('.hero-line-2');
      if (line2) {
        line2.classList.add('shimmer-ready');
        line2.classList.add('shimmer-active');
      }
    }, 2050);
  }

  // Execute entrance animation once upon initial load
  initHeroTypographyEntrance();

});



