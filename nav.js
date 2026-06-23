// Inner-page transition driver (about, cv, notebook): nav prints on, then .sheet
// blocks pop in staggered; BACK reverses both, then navigates.
(function () {
  document.documentElement.classList.add("js");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".topnav");
    var blocks = [].slice.call(document.querySelectorAll(".sheet > *"));

    // toggle .shown across blocks, stagger spread over budget ms
    function pop(show, budget) {
      var n = blocks.length;
      var step = reduce || n < 2 ? 0 : Math.min(80, budget / (n - 1));
      blocks.forEach(function (b, i) {
        b.style.transitionDelay = (show ? i : n - 1 - i) * step + "ms";
        b.classList.toggle("shown", show);
      });
    }

    if (nav) Print.in(nav, function () { pop(true, 600); }); else pop(true, 600);

    var back = nav && nav.querySelector("a");
    if (back) back.addEventListener("click", function (e) {
      var href = back.getAttribute("href");
      if (!href) return;
      e.preventDefault();
      pop(false, 200);
      Print.out(nav, function () { location.href = href; });
    });
  });
})();
