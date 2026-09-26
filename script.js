(() => {
  'use strict';

  const root = document.getElementById('manasResume');
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  // Mobile navigation
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('#navLinks a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
    }));
  }

  // Current year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Profile photo upload
  const photoInput = $('#photoInput');
  const profilePhoto = $('#profilePhoto');
  const placeholder = $('#photoPlaceholder');
  const photoUpload = $('.photo-upload');
  if (photoInput && profilePhoto) {
    photoInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        profilePhoto.src = reader.result;
        profilePhoto.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  }
  // Keep the photo button accessible without forcing uploads.
  if (photoUpload && photoInput) photoUpload.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); photoInput.click(); }
  });

  // Reveal-on-scroll
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('show'));
  }


  // Contact form — opens the visitor's default email client with fields pre-filled.
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const recipient = (contactForm.dataset.recipient || '').trim();
      const name = (contactForm.querySelector('[name="name"]')?.value || '').trim();
      const email = (contactForm.querySelector('[name="email"]')?.value || '').trim();
      const message = (contactForm.querySelector('[name="message"]')?.value || '').trim();
      const button = contactForm.querySelector('button[type="submit"]');

      if (!recipient) return;

      const subject = `Website Contact from ${name || 'Visitor'}`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`;

      const mailto =
        `mailto:${encodeURIComponent(recipient)}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      if (button) {
        button.textContent = 'Opening Email…';
        button.disabled = true;
      }

      // Give the browser a moment to process the UI update before opening the mail client.
      setTimeout(() => {
        window.location.href = mailto;
        setTimeout(() => {
          if (button) {
            button.textContent = 'Transmit Message →';
            button.disabled = false;
          }
        }, 1200);
      }, 50);
    });
  }

  // Back-to-top button
  const topBtn = $('#topBtn');
  if (topBtn) {
    const updateTopButton = () => {
      topBtn.classList.toggle('show', window.scrollY > 500);
    };
    window.addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Resume download: prints the page as a PDF through the browser print dialog.
  const downloadBtn = $('#downloadBtn');
  if (downloadBtn) downloadBtn.addEventListener('click', () => window.print());

  // Subtle 3D tilt only on pointer devices; disabled for touch/reduced motion.
  const tiltArea = $('#tiltArea');
  const profileCard = $('#profileCard');
  const canTilt = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (tiltArea && profileCard && canTilt && !reduceMotion) {
    tiltArea.addEventListener('pointermove', event => {
      const rect = profileCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      profileCard.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
    });
    tiltArea.addEventListener('pointerleave', () => {
      profileCard.style.transform = '';
    });
  }

  // Lightweight background particles.
  const canvas = $('#particles');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (canvas && ctx && !reduceMotion) {
    let particles = [];
    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.max(25, Math.floor(width / 20)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.35,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        a: Math.random() * 0.45 + 0.15
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,234,255,${p.a})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    draw();
  }
})();




/* =========================================================
   MANAS FUTURISTIC BLUE FACE-SCAN LOADER — 10 SECONDS
   ========================================================= */
(() => {
  const loader = document.getElementById('mn-future-loader');
  if (!loader) return;

  const status = document.getElementById('mnflStatus');
  const nameEl = document.getElementById('mnflName');
  const particles = document.getElementById('mnflParticles');

  document.body.style.overflow = 'hidden';

  // Floating neon particles
  for (let i = 0; i < 65; i++) {
    const p = document.createElement('span');
    p.className = 'mnfl-particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${5 + Math.random() * 10}s`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    const size = 1 + Math.random() * 2.5;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    particles.appendChild(p);
  }

  const messages = [
    [0, 'INITIALIZING SYSTEM...'],
    [1800, 'SCANNING FACE...'],
    [3600, 'ANALYZING BIOMETRIC DATA...'],
    [5200, 'IDENTITY VERIFIED ✓']
  ];

  messages.forEach(([time, message]) => {
    setTimeout(() => {
      status.textContent = message;
    }, time);
  });

  // Type the name near the end of the intro.
  const name = 'MANAS NEBHWANI';
  let i = 0;
  setTimeout(() => {
    const typing = setInterval(() => {
      nameEl.textContent = name.slice(0, ++i);
      if (i >= name.length) clearInterval(typing);
    }, 120);
  }, 6500);

  // EXACTLY 10 SECONDS
  setTimeout(() => {
    loader.classList.add('mnfl-hide');
    document.body.style.overflow = '';
    setTimeout(() => loader.remove(), 1100);
  }, 10000);
})();
