/* ============================================================
   Chinmayi Ghosh — Portfolio interactions
   - Smooth morphing custom cursor (plane / pastry / wine)
   - Scroll reveals, nav state, ambient theme switching
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Cursor icons (elegant line-art SVG) ---------- */
  const ICONS = {
    plane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L11 19v-5.5z"/></svg>`,
    pastry: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14c0-2 1.6-3 3-3 .6-1.4 2-2.3 3.5-2.3.4-1.1 1.4-1.7 2.5-1.7 1.6 0 3 1.3 3 3 1.4.2 2.5 1.4 2.5 2.9 0 .4-.1.8-.2 1.1"/><path d="M3 14h18l-1.2 5.2a2 2 0 0 1-2 1.6H6.2a2 2 0 0 1-2-1.6L3 14z"/><path d="M8 14v2M12 14v2.5M16 14v2"/></svg>`,
    wine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-.7 6a4.3 4.3 0 0 1-8.6 0L7 3z"/><path d="M8 7h8"/><path d="M12 13.3V19"/><path d="M8.5 21h7"/></svg>`,
  };

  const cursor = document.getElementById("cursor");
  const cursorIcon = document.getElementById("cursorIcon");
  const fineCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Smooth cursor follow ---------- */
  if (cursor && fineCursor) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    const render = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    document.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));
    document.addEventListener("mouseenter", () => (cursor.style.opacity = "1"));

    /* Link hover state */
    document.querySelectorAll("a, button, [data-link]").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-link"));
    });

    /* Themed icon zones (plane / pastry / wine) */
    document.querySelectorAll("[data-cursor]").forEach((zone) => {
      const kind = zone.getAttribute("data-cursor");
      zone.addEventListener("mouseenter", () => {
        cursorIcon.innerHTML = ICONS[kind] || "";
        cursor.classList.add("is-icon");
      });
      zone.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-icon");
      });
    });
  }

  /* ---------- Ambient theme switching on the body ---------- */
  const themeZones = document.querySelectorAll("[data-theme]");
  if (themeZones.length) {
    const themeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.body.setAttribute("data-theme", entry.target.getAttribute("data-theme"));
          }
        });
      },
      { threshold: 0.55 }
    );
    themeZones.forEach((z) => themeObserver.observe(z));

    /* Clear theme when journey section is well out of view */
    const journey = document.getElementById("journey");
    if (journey) {
      const clearObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) document.body.removeAttribute("data-theme");
          });
        },
        { threshold: 0 }
      );
      clearObserver.observe(journey);
    }
  }

  /* ---------- Scroll reveals ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* Traits need .is-visible on the trait itself to fill bars */
  const traitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          traitObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".trait").forEach((el) => traitObserver.observe(el));

  /* ---------- Nav sticky state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("is-done"), 1600);
  });
})();
