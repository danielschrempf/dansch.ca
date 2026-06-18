// Entry/exit slide for the inner document pages (about, cv). Linked from the <head>
// so the `js` class lands before first paint — that lets styles.css start the content
// hidden without a flash, and keeps it visible if this script never runs.
//
// Entry: the header paints on the line its label holds on the index wordmark rule
// (styles.css .persist-*), then `.settled` slides it to the top and fades the content
// in behind it. Exit: BACK removes `.settled` so the header slides back to that index
// line (content fades out), then we navigate — handing the line back to the wordmark.
(function () {
  document.documentElement.classList.add("js");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    // double rAF: let the start position paint before the transition kicks in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { body.classList.add("settled"); });
    });

    // How long to hold before navigating, in ms — match it to the exit animation.
    // Default 700 (≈ the slide); a page with little/no slide sets a shorter
    // `data-exit` on its <body> (about uses 200, since it only fades). Reduced
    // motion swaps the slide for a .5s fade, so it holds 500 to let that play.
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
