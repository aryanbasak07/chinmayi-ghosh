/* ============================================================
   Chinmayi Ghosh — Portfolio interactions
   Cursor · Lenis smooth scroll · curtain · plating · flight path
   magnetic links · scroll-wine · after-hours easter egg · quiz
   ============================================================ */

(function () {
  "use strict";

  const fineCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Cursor icons (elegant line-art SVG) ---------- */
  const ICONS = {
    plane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L11 19v-5.5z"/></svg>`,
    pastry: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14c0-2 1.6-3 3-3 .6-1.4 2-2.3 3.5-2.3.4-1.1 1.4-1.7 2.5-1.7 1.6 0 3 1.3 3 3 1.4.2 2.5 1.4 2.5 2.9 0 .4-.1.8-.2 1.1"/><path d="M3 14h18l-1.2 5.2a2 2 0 0 1-2 1.6H6.2a2 2 0 0 1-2-1.6L3 14z"/><path d="M8 14v2M12 14v2.5M16 14v2"/></svg>`,
    wine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-.7 6a4.3 4.3 0 0 1-8.6 0L7 3z"/><path d="M8 7h8"/><path d="M12 13.3V19"/><path d="M8.5 21h7"/></svg>`,
  };

  const cursor = document.getElementById("cursor");
  const cursorIcon = document.getElementById("cursorIcon");

  /* ---------- Smooth custom cursor ---------- */
  if (cursor && fineCursor) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function render() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(render);
    })();
    document.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));
    document.addEventListener("mouseenter", () => (cursor.style.opacity = "1"));

    const bindLink = (el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-link"));
    };
    document.querySelectorAll("a, button, [data-link]").forEach(bindLink);
    window.__bindCursorLink = bindLink; // for dynamically added quiz buttons

    document.querySelectorAll("[data-cursor]").forEach((zone) => {
      const kind = zone.getAttribute("data-cursor");
      zone.addEventListener("mouseenter", () => { cursorIcon.innerHTML = ICONS[kind] || ""; cursor.classList.add("is-icon"); });
      zone.addEventListener("mouseleave", () => cursor.classList.remove("is-icon"));
    });
  }

  /* ---------- Magnetic elements ---------- */
  if (fineCursor && !reduceMotion) {
    const magnets = document.querySelectorAll(".magnetic");
    const bindMagnet = (el) => {
      const strength = 0.35;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    };
    magnets.forEach(bindMagnet);
    window.__bindMagnet = bindMagnet;
  }

  /* ---------- Scroll reveals ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const traitObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); traitObserver.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll(".trait").forEach((el) => traitObserver.observe(el));

  /* ---------- Plating animations (course plates) ---------- */
  // Measure each drawable path so the dash animation looks right
  document.querySelectorAll(".draw-art path").forEach((p) => {
    try { const len = p.getTotalLength(); p.style.setProperty("--len", len.toFixed(1)); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; } catch (_) {}
  });
  const plateObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-plated"); plateObserver.unobserve(e.target); } });
  }, { threshold: 0.45 });
  document.querySelectorAll(".course__item").forEach((el) => plateObserver.observe(el));

  /* ---------- Themed body tint over journey ---------- */
  const themeZones = document.querySelectorAll("[data-theme]");
  if (themeZones.length) {
    const themeObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) document.body.setAttribute("data-theme", e.target.getAttribute("data-theme")); });
    }, { threshold: 0.55 });
    themeZones.forEach((z) => themeObserver.observe(z));
    const journey = document.getElementById("journey");
    if (journey) {
      const clr = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (!e.isIntersecting) document.body.removeAttribute("data-theme"); });
      }, { threshold: 0 });
      clr.observe(journey);
    }
  }

  /* ---------- Flight path + scroll-wine (driven by scroll) ---------- */
  const flightDraw = document.getElementById("flightDraw");
  const revealRect = document.getElementById("flightRevealRect");
  const plane = document.getElementById("flightPlane");
  const courseWrap = document.querySelector(".course-wrap");
  const wineFill = document.querySelector(".scroll-wine__fill");
  let flightLen = 0;
  if (flightDraw) { try { flightLen = flightDraw.getTotalLength(); } catch (_) {} }

  function updateScroll() {
    // page scroll progress -> wine glass
    const max = document.documentElement.scrollHeight - innerHeight;
    const sp = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    if (wineFill) wineFill.style.height = (sp * 100).toFixed(1) + "%";

    // journey progress -> flight path reveal + travelling marker
    if (courseWrap && revealRect && flightLen) {
      const r = courseWrap.getBoundingClientRect();
      const total = r.height + innerHeight * 0.6;
      const passed = innerHeight * 0.8 - r.top;
      const p = Math.min(1, Math.max(0, passed / total));
      revealRect.setAttribute("height", (p * 1000).toFixed(1));
      const pt = flightDraw.getPointAtLength(p * flightLen);
      plane.setAttribute("cx", pt.x.toFixed(1));
      plane.setAttribute("cy", pt.y.toFixed(1));
      plane.classList.toggle("is-flying", p > 0.01 && p < 0.995);
    }
  }

  /* ---------- Nav sticky ---------- */
  const nav = document.getElementById("nav");
  function updateNav() { nav.classList.toggle("is-stuck", scrollY > 60); }

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on("scroll", () => { updateScroll(); updateNav(); });
  } else {
    addEventListener("scroll", () => { updateScroll(); updateNav(); }, { passive: true });
  }
  updateScroll(); updateNav();

  /* anchor links -> smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -10 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Curtain reveal ---------- */
  addEventListener("load", () => {
    const curtain = document.getElementById("curtain");
    if (!curtain) return;
    setTimeout(() => curtain.classList.add("is-open"), 1500);
    setTimeout(() => curtain.classList.add("is-gone"), 2900);
  });

  /* ---------- Toast helper ---------- */
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function toast(msg, ms = 3200) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), ms);
  }

  /* ---------- Easter egg: type "wine" OR Konami -> after-hours ---------- */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let typed = "", konami = [];
  function toggleAfterHours(viaKonami) {
    const on = document.body.classList.toggle("after-hours");
    const hint = document.getElementById("footerHint");
    if (on) {
      toast(viaKonami ? "↑↑↓↓ … the cellar is open. Welcome, after hours. 🍷" : "After hours — the candles are lit. 🕯️ (type “wine” to toggle)");
      if (hint) hint.textContent = "after hours — type “wine” to return to service";
    } else {
      toast("Back to service. ☀️");
      if (hint) hint.textContent = "psst — try typing “wine”";
    }
  }
  addEventListener("keydown", (e) => {
    const k = e.key;
    // word trigger
    if (/^[a-zA-Z]$/.test(k)) {
      typed = (typed + k.toLowerCase()).slice(-8);
      if (typed.endsWith("wine")) { toggleAfterHours(false); typed = ""; }
    }
    // konami
    konami.push(k); konami = konami.slice(-KONAMI.length);
    if (konami.length === KONAMI.length && konami.every((v, i) => v.toLowerCase() === KONAMI[i].toLowerCase())) {
      toggleAfterHours(true); konami = [];
    }
  });

  /* ============================================================
     QUIZ — "Which course are you?"
     ============================================================ */
  const QUESTIONS = [
    { q: "A dinner rush hits and everything is happening at once. You…",
      a: [
        { t: "Go quiet and calm, and run the floor like clockwork.", k: "plane" },
        { t: "Improvise a warm fix and keep everyone smiling.", k: "pastry" },
        { t: "Slow down and make sure every detail is still perfect.", k: "wine" },
      ] },
    { q: "Friends would secretly describe you as…",
      a: [
        { t: "Unshakeable — the steady one in a crisis.", k: "plane" },
        { t: "Warm and creative — the one who makes things lovely.", k: "pastry" },
        { t: "Refined and precise — the one with exquisite taste.", k: "wine" },
      ] },
    { q: "Your ideal evening looks like…",
      a: [
        { t: "Somewhere buzzing, lots of people, good energy.", k: "plane" },
        { t: "Baking something for the people you love.", k: "pastry" },
        { t: "A quiet glass and a long, good conversation.", k: "wine" },
      ] },
    { q: "Under real pressure, you tend to get…",
      a: [
        { t: "Calmer. Pressure is where you do your best work.", k: "plane" },
        { t: "Inventive. You find a kind, clever way through.", k: "pastry" },
        { t: "Meticulous. You sweat the details others miss.", k: "wine" },
      ] },
  ];

  const RESULTS = {
    pastry: {
      kicker: "You are the",
      title: "Amuse-Bouche",
      match: "matched to Chinmayi’s warmth & creativity",
      desc: "Warm, generous, and quietly inventive — you make experiences feel personal. It’s the same instinct that earned Chinmayi a commendation for teamwork in her very first season in France.",
      art: `<svg viewBox="0 0 200 120"><path d="M40,95 Q100,42 160,95 Q100,72 40,95 Z"/><path d="M62,86 L72,66"/><path d="M86,80 L94,58"/><path d="M114,80 L106,58"/><path d="M138,86 L128,66"/></svg>`,
    },
    plane: {
      kicker: "You are the",
      title: "Main Course",
      match: "matched to Chinmayi’s grace under pressure",
      desc: "Composed when it counts, you turn chaos into calm. It’s exactly the temperament Chinmayi brought to IndiGo’s boarding gates — caring for VIP and special-needs flyers when the clock was unforgiving.",
      art: `<svg viewBox="0 0 200 120"><path d="M30,98 Q70,86 92,58 Q108,36 170,30" stroke-dasharray="4 5"/><path d="M34,86 L170,30 L112,78 L108,108 L92,82 Z"/><path d="M170,30 L108,108"/></svg>`,
    },
    wine: {
      kicker: "You are the",
      title: "Digestif",
      match: "matched to Chinmayi’s refined precision",
      desc: "Discerning and detail-obsessed, you believe the finish makes the experience. It’s the precision Chinmayi brings to reservations for celebrated dining rooms — making every evening flawless before the guest arrives.",
      art: `<svg viewBox="0 0 200 120"><path d="M68,18 L132,18 C132,55 116,78 100,78 C84,78 68,55 68,18 Z"/><path d="M100,78 L100,108"/><path d="M82,110 L118,110"/></svg>`,
    },
  };

  const stage = document.getElementById("quizStage");
  if (stage) {
    let step = 0;
    const tally = { pastry: 0, plane: 0, wine: 0 };

    function bindDynamic(el) {
      if (window.__bindCursorLink) window.__bindCursorLink(el);
    }

    function renderQuestion() {
      const item = QUESTIONS[step];
      const bars = QUESTIONS.map((_, i) => `<span class="${i < step ? "is-done" : ""}"></span>`).join("");
      stage.innerHTML = `
        <div class="quiz__progress">${bars}</div>
        <p class="quiz__count">Question ${step + 1} of ${QUESTIONS.length}</p>
        <p class="quiz__q">${item.q}</p>
        <div class="quiz__options">
          ${item.a.map((o, i) => `<button class="quiz__opt" data-k="${o.k}" data-i="${i}">${o.t}</button>`).join("")}
        </div>`;
      stage.querySelectorAll(".quiz__opt").forEach((btn) => {
        bindDynamic(btn);
        btn.addEventListener("click", () => {
          tally[btn.dataset.k]++;
          step++;
          if (step < QUESTIONS.length) renderQuestion();
          else renderResult();
        });
      });
    }

    function renderResult() {
      // winner (ties resolved by question order: pastry/plane/wine priority by max)
      let best = "plane", bestN = -1;
      ["pastry", "plane", "wine"].forEach((k) => { if (tally[k] > bestN) { bestN = tally[k]; best = k; } });
      const r = RESULTS[best];
      stage.innerHTML = `
        <div class="quiz__result">
          <div class="quiz__result-art">${r.art}</div>
          <p class="quiz__result-kicker">${r.kicker}</p>
          <h3 class="quiz__result-title">${r.title}</h3>
          <p class="quiz__result-match">${r.match}</p>
          <p class="quiz__result-desc">${r.desc}</p>
          <button class="quiz__again magnetic">Taste again</button>
        </div>`;
      const again = stage.querySelector(".quiz__again");
      bindDynamic(again);
      if (window.__bindMagnet) window.__bindMagnet(again);
      again.addEventListener("click", () => { step = 0; tally.pastry = tally.plane = tally.wine = 0; renderQuestion(); });
    }

    renderQuestion();
  }
})();
