/* ===================================================================
   Zack Ziernicki — personal site
   All interactivity lives here. Each feature is a small, self-contained
   block so it's easy to read and easy to remove.
   =================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------------------------------------------
     Theme toggle — remembers your choice, falls back to system setting
     ----------------------------------------------------------------- */
  (function theme() {
    const root = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {}

    if (saved) {
      root.setAttribute("data-theme", saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.setAttribute("data-theme", "dark");
    }

    toggle.addEventListener("click", function () {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  })();

  /* -----------------------------------------------------------------
     Mobile nav — accessible hamburger menu
     ----------------------------------------------------------------- */
  (function mobileNav() {
    const btn = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!btn || !links) return;

    function close() {
      links.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });

    // close the menu after a link is tapped
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });

    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();

  /* -----------------------------------------------------------------
     Reveal sections on scroll
     ----------------------------------------------------------------- */
  (function reveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  })();

  /* -----------------------------------------------------------------
     Animated stat counters — count up when scrolled into view
     Reads the target from data-target; supports a suffix like "+".
     ----------------------------------------------------------------- */
  (function counters() {
    const nums = document.querySelectorAll("[data-target]");
    if (!nums.length) return;

    function run(el) {
      const target = parseFloat(el.getAttribute("data-target"));
      const suffix = el.getAttribute("data-suffix") || "";
      if (isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }

      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(run);
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach(function (el) {
      io.observe(el);
    });
  })();

  /* -----------------------------------------------------------------
     Certification filter — show/hide cards by category
     ----------------------------------------------------------------- */
  (function certFilter() {
    const bar = document.getElementById("certFilter");
    const grid = document.getElementById("certGrid");
    if (!bar || !grid) return;

    const cards = Array.from(grid.querySelectorAll(".cert"));
    const buttons = Array.from(bar.querySelectorAll(".filter-btn"));

    bar.addEventListener("click", function (e) {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      const filter = btn.getAttribute("data-filter");
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });

      cards.forEach(function (card) {
        const cats = (card.getAttribute("data-cat") || "").split(/\s+/);
        const show = filter === "all" || cats.indexOf(filter) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  })();

  /* -----------------------------------------------------------------
     Gallery lightbox — click to enlarge, keyboard navigable
     (Esc to close, ← / → to move between photos)
     ----------------------------------------------------------------- */
  (function lightbox() {
    const gallery = document.getElementById("galleryGrid");
    const box = document.getElementById("lightbox");
    if (!gallery || !box) return;

    const imgEl = box.querySelector(".lightbox-img");
    const capEl = box.querySelector(".lightbox-cap");
    const btnClose = box.querySelector(".lb-close");
    const btnPrev = box.querySelector(".lb-prev");
    const btnNext = box.querySelector(".lb-next");

    const shots = Array.from(gallery.querySelectorAll(".shot"));
    let index = 0;
    let lastFocused = null;

    function show(i) {
      index = (i + shots.length) % shots.length;
      const img = shots[index].querySelector("img");
      const cap = shots[index].querySelector("figcaption");
      imgEl.src = img.getAttribute("data-full") || img.src;
      imgEl.alt = img.alt || "";
      capEl.textContent = cap ? cap.textContent : "";
    }

    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      btnClose.focus();
    }

    function close() {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    shots.forEach(function (shot, i) {
      shot.addEventListener("click", function () {
        open(i);
      });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () {
      show(index - 1);
    });
    btnNext.addEventListener("click", function () {
      show(index + 1);
    });
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  })();

  /* -----------------------------------------------------------------
     Case-study doc modal — embeds a PDF in an on-page viewer
     ----------------------------------------------------------------- */
  (function docModal() {
    const modal = document.getElementById("docModal");
    if (!modal) return;

    const frame = document.getElementById("docModalFrame");
    const title = document.getElementById("docModalTitle");
    const openLink = document.getElementById("docModalOpen");
    const closeBtn = document.getElementById("docModalClose");
    const triggers = Array.from(document.querySelectorAll(".doc-trigger"));
    let lastFocused = null;

    function open(doc, label) {
      lastFocused = document.activeElement;
      frame.src = doc;
      openLink.href = doc;
      title.textContent = label || "Case study";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      frame.src = ""; // stop loading / free the embed
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(btn.getAttribute("data-doc"), btn.getAttribute("data-title"));
      });
    });

    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
  })();

  /* -----------------------------------------------------------------
     Footer year
     ----------------------------------------------------------------- */
  (function year() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  })();
})();
