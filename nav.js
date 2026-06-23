(function () {
  document.documentElement.classList.add("js");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { body.classList.add("settled"); });
    });

    var exitMs = reduce ? 500 : (parseInt(body.dataset.exit, 10) || 700);

    var back = document.querySelector(".topnav a");
    if (back) back.addEventListener("click", function (e) {
      var href = back.getAttribute("href");
      if (!href) return;
      e.preventDefault();
      body.classList.remove("settled");           // slide the header back down
      setTimeout(function () { location.href = href; }, exitMs);
    });
  });
})();
