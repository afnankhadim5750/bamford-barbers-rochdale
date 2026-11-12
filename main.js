/* Bamford Barbers — vanilla JS: mobile menu, scroll-spy, service scroller,
   FAQ accordion, lightbox gallery, today highlight, reveal on scroll. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile menu (instant open/close — no transition) ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-mobile-menu]");
  var toggleIcon = toggle ? toggle.querySelector(".bi") : null;

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (toggleIcon) {
      toggleIcon.classList.toggle("bi-list", !open);
      toggleIcon.classList.toggle("bi-x", open);
    }
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll-spy ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
  var spySections = spyLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && spySections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        spyLinks.forEach(function (link) {
          var active = link.getAttribute("href") === id;
          link.classList.toggle("active", active);
          if (active) link.removeAttribute("aria-current");
          else link.removeAttribute("aria-current");
          if (active) link.setAttribute("aria-current", "true");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spySections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Service scroller arrows ---------- */
  var scroller = document.getElementById("service-scroller");
  var prevBtn = document.getElementById("scroll-prev");
  var nextBtn = document.getElementById("scroll-next");
  if (scroller && prevBtn && nextBtn) {
    var step = function () {
      var card = scroller.querySelector(".service-card");
      return card ? card.getBoundingClientRect().width + 20 : 340;
    };
    prevBtn.addEventListener("click", function () {
      scroller.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      scroller.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = "";
        }
      });
      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : "";
    });
  });

  /* ---------- Lightbox gallery ---------- */
  var grid = document.getElementById("gallery-grid");
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCaption = document.getElementById("lb-caption");
  var lbClose = document.getElementById("lb-close");
  var lbPrev = document.getElementById("lb-prev");
  var lbNext = document.getElementById("lb-next");
  var items = grid ? Array.prototype.slice.call(grid.querySelectorAll("button")) : [];
  var current = 0;
  var lastFocus = null;

  function show(index) {
    current = (index + items.length) % items.length;
    var btn = items[current];
    var img = btn.querySelector("img");
    lbImg.src = btn.getAttribute("data-full");
    lbImg.alt = img ? img.alt : "";
    lbCaption.textContent = btn.getAttribute("data-caption") || "";
  }
  function openLb(index) {
    lastFocus = document.activeElement;
    show(index);
    lightbox.hidden = false;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLb() {
    lightbox.classList.remove("open");
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (grid && lightbox) {
    items.forEach(function (btn, i) {
      btn.addEventListener("click", function () { openLb(i); });
    });
    lbClose.addEventListener("click", closeLb);
    lbPrev.addEventListener("click", function () { show(current - 1); });
    lbNext.addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Today highlight in hours table ---------- */
  var today = new Date().getDay(); // 0 = Sunday
  var row = document.querySelector('#hours-table tr[data-day="' + today + '"]');
  if (row) {
    row.classList.add("today");
    if (row.cells[1] && row.cells[1].textContent.trim() === "Closed") row.classList.add("closed");
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
})();
