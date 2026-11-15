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

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
