/* Manas Nebhwani — WordPress Resume JavaScript */
(function () {
  "use strict";

  const root = document.getElementById("manasResume");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => root.querySelectorAll(selector);

  /* Mobile navigation */
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* 3D profile-card tilt */
  const tiltArea = $("#tiltArea");
  const profileCard = $("#profileCard");
  if (tiltArea && profileCard) {
    tiltArea.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 900) return;
      const r = tiltArea.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      profileCard.style.transform =
        `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`;
    });
    tiltArea.addEventListener("mouseleave", () => {
      profileCard.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  /* Scroll reveal */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(el => observer.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("show"));
  }

  /* Active navigation */
  const sections = [...root.querySelectorAll("main section[id]")];
  const anchors = [...root.querySelectorAll(".nav-links a")];
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 180) current = section.id;
    });
    anchors.forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current)
    );
  }, { passive: true });

  /* Back to top */
  const topBtn = $("#topBtn");
  if (topBtn) {
    window.addEventListener("scroll", () => {
      topBtn.style.display = window.scrollY > 500 ? "grid" : "none";
    }, { passive: true });
    topBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* Profile photo replacement */
  const photoInput = $("#photoInput");
  const profilePhoto = $("#profilePhoto");
  const photoPlaceholder = $("#photoPlaceholder");
  if (photoInput && profilePhoto) {
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = event => {
        profilePhoto.src = event.target.result;
        profilePhoto.hidden = false;
        if (photoPlaceholder) photoPlaceholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    });
  }

  /* Contact demo form */
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#name")?.value.trim() || "there";
      alert(`Thanks ${name}! This demo form is ready to connect to your WordPress form/email backend.`);
      form.reset();
    });
  }

  /* Download resume as text */
  const downloadBtn = $("#downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const resumeText = `MANAS NEBHWANI
BCA 1st Year | Cybersecurity | Developer

LOCATION
Bhilwara, Rajasthan, India

PROFILE
BCA first-year student interested in cybersecurity, AI, app development,
web development, databases and Linux.

EDUCATION
BCA — Sangam University, Bhilwara (2026–Present)
Class 12 — CBSE (2025–2026)

SKILLS
Python, HTML, CSS, JavaScript, Java, C/C++, MySQL, Linux,
Cybersecurity Fundamentals, Flutter/Dart, Android Development

PROJECTS
QR Payment / Generator App
3D Tools App
Train Database System
Cybersecurity Lab
AI NPC Game Concept
Future Secure OS

EMAIL
manasnebhwani2@gmail.com

PHONE
+91 75681 81295

LINKEDIN
https://www.linkedin.com/in/manas-nebhwani-5aa926272

GITHUB
https://github.com/Hackerkings6688
`;
      const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Manas_Nebhwani_Resume.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  /* Animated canvas particles */
  const canvas = $("#particles");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const mouse = { x: null, y: null };

    function resize() {
      canvas.width = root.clientWidth || window.innerWidth;
      canvas.height = root.clientHeight || window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(115, Math.max(55, Math.floor((canvas.width || window.innerWidth) / 11)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.7 + 0.4
      }));
    }

    resize();
    createParticles();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    root.addEventListener("mousemove", e => {
      const r = root.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    root.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,234,255,.7)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,234,255,${(1 - d / 115) * .16})`;
            ctx.stroke();
          }
        }
      }

      if (mouse.x !== null) {
        for (const p of particles) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(155,77,255,${(1 - d / 130) * .25})`;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    animate();
  }

  const year = root.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
