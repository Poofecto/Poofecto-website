// PooFecto! — small, dependency-free behaviours.
(function () {
  // Per-visit rates (LOCKED in the Brand Bible). Edit here if prices change.
  var RATES = { 1: 20, 2: 25, 3: 28, 4: 32 };

  function money(n) { return "$" + n.toLocaleString("en-US"); }

  function updateCalc() {
    var dogs = document.querySelector('input[name="dogs"]:checked');
    var visits = document.querySelector('input[name="visits"]:checked');
    if (!dogs || !visits) return;
    var rate = RATES[dogs.value];
    var v = parseInt(visits.value, 10);
    document.getElementById("calc-rate").textContent = money(rate);
    document.getElementById("calc-visits").textContent = v;
    document.getElementById("calc-total").textContent = money(rate * v);
  }

  document.querySelectorAll('input[name="dogs"], input[name="visits"]').forEach(function (el) {
    el.addEventListener("change", updateCalc);
  });
  updateCalc();

  // Carry the calculator's dog count into the quote form.
  var dogSelect = document.getElementById("dogcount");
  document.querySelectorAll('input[name="dogs"]').forEach(function (el) {
    el.addEventListener("change", function () { if (dogSelect) dogSelect.value = el.value; });
  });

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }


  // Hero carousel content comes from Pages CMS: content/carousel.json.
  // Existing HTML images remain available if the JSON cannot load.
  var car = document.querySelector(".carousel");
  if (car) {
    var frame = car.querySelector(".carousel-frame");
    var idxEl = car.querySelector('[data-car="index"]');
    var countEl = car.querySelector(".car-count");
    var pauseBtn = car.querySelector('[data-car="pause"]');
    var story = car.querySelector(".carousel-story");
    var categoryEl = car.querySelector(".carousel-category");
    var titleEl = car.querySelector(".carousel-title");
    var descEl = car.querySelector(".carousel-description");
    var linkEl = car.querySelector(".carousel-link");
    var slides = Array.prototype.slice.call(frame.querySelectorAll("img"));
    var entries = slides.map(function (img) { return { image: img.getAttribute("src"), alt: img.alt }; });
    var i = 0, timer = null;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var userPaused = reduced, hoverPaused = false;
    var safeUrl = function (value) {
      if (typeof value !== "string") return "";
      var v = value.trim();
      // Only allow ordinary web links, in-page anchors and mail links.
      return /^(https?:\/\/|#[a-z0-9_-]+$|mailto:)/i.test(v) ? v : "";
    };

    function renderStory() {
      var item = entries[i] || {};
      var category = String(item.category || "").trim();
      var title = String(item.title || "").trim();
      var desc = String(item.description || "").trim();
      var link = safeUrl(item.link);
      var text = String(item.link_text || "Learn more").trim();
      categoryEl.textContent = category;
      titleEl.textContent = title;
      descEl.textContent = desc;
      categoryEl.hidden = !category;
      titleEl.hidden = !title;
      descEl.hidden = !desc;
      linkEl.hidden = !link;
      if (link) {
        linkEl.textContent = text;
        linkEl.href = link;
        if (/^https?:/i.test(link)) {
          linkEl.target = "_blank";
          linkEl.rel = "noopener noreferrer";
        } else {
          linkEl.removeAttribute("target");
          linkEl.removeAttribute("rel");
        }
      } else {
        linkEl.removeAttribute("href");
      }
      story.hidden = !(category || title || desc || link);
    }

    function show(n) {
      if (!slides.length) return;
      slides[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
      idxEl.textContent = String(i + 1);
      countEl.lastChild.textContent = " / " + slides.length;
      var next = slides[(i + 1) % slides.length];
      if (next.loading === "lazy") next.loading = "eager";
      renderStory();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (!userPaused && !hoverPaused && !document.hidden && slides.length > 1) {
        timer = setInterval(function () { show(i + 1); }, 5000);
      }
    }
    function setPauseLabel() {
      pauseBtn.innerHTML = userPaused ? "&#9654;" : "&#10074;&#10074;";
      pauseBtn.setAttribute("aria-label", userPaused ? "Play slides" : "Pause slides");
    }
    car.querySelector('[data-car="prev"]').addEventListener("click", function () { show(i - 1); start(); });
    car.querySelector('[data-car="next"]').addEventListener("click", function () { show(i + 1); start(); });
    pauseBtn.addEventListener("click", function () { userPaused = !userPaused; setPauseLabel(); start(); });
    car.addEventListener("mouseenter", function () { hoverPaused = true; stop(); });
    car.addEventListener("mouseleave", function () { hoverPaused = false; start(); });
    car.addEventListener("focusin", function () { hoverPaused = true; stop(); });
    car.addEventListener("focusout", function () { hoverPaused = false; start(); });
    document.addEventListener("visibilitychange", start);
    car.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") { show(i - 1); start(); }
      if (e.key === "ArrowRight") { show(i + 1); start(); }
    });
    setPauseLabel();
    show(0);
    start();

    if (window.fetch) {
      fetch("content/carousel.json", { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw new Error("Carousel unavailable"); return r.json(); })
        .then(function (data) {
          if (!data || !Array.isArray(data.slides)) return;
          var visible = data.slides.filter(function (x) {
            return x && x.visible !== false && typeof x.image === "string" && x.image.trim();
          });
          if (!visible.length) return; // Keep original images if all entries are hidden.
          var fragment = document.createDocumentFragment();
          var nextSlides = [];
          visible.forEach(function (item, pos) {
            var img = document.createElement("img");
            img.src = item.image;
            img.alt = String(item.alt || item.title || "PooFecto! update");
            img.loading = pos === 0 ? "eager" : "lazy";
            img.decoding = "async";
            if (pos === 0) img.className = "is-active";
            fragment.appendChild(img);
            nextSlides.push(img);
          });
          stop();
          frame.replaceChildren(fragment);
          slides = nextSlides;
          entries = visible;
          i = 0;
          show(0);
          start();
        })
        .catch(function () { /* Keep original pictures on network error. */ });
    }
  }

  // Paw-sitivity: posts come from content/pawsitivity.json, which the
  // content manager (/admin/) edits. Newest first, filter by category.
  var grid = document.querySelector(".paw-grid");
  if (grid && window.fetch) {
    var filters = document.querySelector(".paw-filters");
    var moreBtn = document.querySelector(".paw-more");
    var CATS = ["Birthday Club", "Dog Tips & Tricks", "Training & Breed Facts", "Community & Adoption", "Announcements"];
    var PAGE = 6, shown = PAGE, active = "All", posts = [];

    function esc(t) { var d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; }
    function fmt(d) {
      if (!d) return "";
      var p = String(d).slice(0, 10).split("-");
      var dt = new Date(+p[0], +p[1] - 1, +p[2]);
      return isNaN(dt) ? "" : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    function safeLink(u) { return /^(https?:\/\/|#|mailto:)/i.test(u || "") ? u : ""; }

    function render() {
      var list = posts.filter(function (p) { return active === "All" || p.category === active; });
      grid.innerHTML = list.slice(0, shown).map(function (p) {
        var link = safeLink(p.link);
        var ext = link && /^https?:/i.test(link);
        return '<article class="paw-card">' +
          (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : "") +
          '<div class="paw-body"><div class="paw-meta"><span class="paw-tag">' + esc(p.category) + '</span><span>' + fmt(p.date) + '</span></div>' +
          '<h3>' + esc(p.title) + '</h3>' +
          (p.event_date ? '<p class="paw-event">Event date: ' + fmt(p.event_date) + '</p>' : "") +
          '<p>' + esc(p.summary) + '</p>' +
          (link ? '<a class="paw-link" href="' + esc(link) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + '>' + esc(p.link_text || "Learn more") + ' &rarr;</a>' : "") +
          '</div></article>';
      }).join("") || '<p class="fine">No posts in this category yet. Check back soon!</p>';
      moreBtn.hidden = list.length <= shown;
    }

    fetch("content/pawsitivity.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        posts = (data.posts || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
        var used = CATS.filter(function (c) { return posts.some(function (p) { return p.category === c; }); });
        if (used.length > 1) {
          filters.innerHTML = ["All"].concat(used).map(function (c) {
            return '<button type="button" class="paw-chip" aria-pressed="' + (c === "All") + '">' + esc(c) + '</button>';
          }).join("");
          filters.hidden = false;
          filters.addEventListener("click", function (e) {
            var b = e.target.closest(".paw-chip"); if (!b) return;
            active = b.textContent; shown = PAGE;
            filters.querySelectorAll(".paw-chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
            render();
          });
        }
        moreBtn.addEventListener("click", function () { shown += PAGE; render(); });
        render();
      })
      .catch(function () {
        grid.innerHTML = '<p>See our latest posts on <a href="https://www.facebook.com/PooFecto" target="_blank" rel="noopener">Facebook</a>.</p>';
      });
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
