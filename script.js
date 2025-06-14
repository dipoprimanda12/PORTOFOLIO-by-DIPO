document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const main = document.getElementById("app");
  const enterBtn = document.getElementById("enter-btn");
  const bgMusic = document.getElementById("bg-music");
  const clickSound = document.getElementById("click-sound"); // Tambahan
  const navLinks = document.querySelectorAll(".nav-link");
  const content = document.getElementById("page-content");

  // Fungsi putar suara klik
  function playClickSound() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch((err) => console.log("Suara klik error:", err));
    }
  }

  // Saat tombol ENTER diklik
  enterBtn.addEventListener("click", () => {
    playClickSound();
    intro.classList.add("fade-out");

    bgMusic.muted = false;
    bgMusic.play().catch((err) => {
      console.log("Gagal memutar musik:", err);
    });

    setTimeout(() => {
      intro.style.display = "none";
      main.classList.remove("hidden");
      loadPage("home");
    }, 1000);
  });

  // Navigasi antar halaman
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      playClickSound(); // Tambahan
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const page = link.dataset.page;
      loadPage(page);
    });
  });

  // Fungsi memuat halaman
  function loadPage(page) {
    content.classList.add("fade-out");

    setTimeout(() => {
      fetch(`pages/${page}.html`)
        .then((res) => res.text())
        .then((data) => {
          content.innerHTML = data;
          content.classList.remove("fade-out");
          content.classList.add("fade-in");

          // Jalankan ulang observer untuk elemen .fade-in-item baru
          observeFadeInItems();

          setTimeout(() => {
            content.classList.remove("fade-in");
          }, 500);
        })
        .catch(() => {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
          content.classList.remove("fade-out");
        });
    }, 300);
  }

  // Fungsi untuk observer fade-in item
  function observeFadeInItems() {
    const items = document.querySelectorAll(".fade-in-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));
  }

  // Jalankan pertama kali
  observeFadeInItems();
});
// animasi background//
const canvas = document.getElementById("nebula-bg");
const ctx = canvas.getContext("2d");
let w, h;
let particles = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function createParticles() {
  particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    opacity: Math.random(),
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0ff";

  particles.forEach((p) => {
    ctx.beginPath();
    ctx.globalAlpha = p.opacity;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
    }
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();
