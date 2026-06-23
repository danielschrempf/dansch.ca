// Shared custom cursor for the inner pages: a dot that swells to a ring over links.
// Self-injecting (#dot + styles); link as the last <head> script. Mouse-only.
(function () {
  var style = document.createElement("style");
  style.textContent = [
    "body, a { cursor: none; }",
    "#dot { position: fixed; top: 0; left: 0; box-sizing: border-box;",
    "  width: 16px; height: 16px; border-radius: 50%;",
    "  background-color: var(--dot); border: 2px solid var(--dot);",
    "  pointer-events: none; z-index: 9999; opacity: 0;",
    "  transition: width .2s ease, height .2s ease, background-color .2s ease, opacity .25s ease; }",
    "#dot.over { width: 32px; height: 32px; background-color: transparent; }",
    ":root { --dot: #000; }",
    "@media (prefers-color-scheme: dark) { :root { --dot: #e6e6d4; } }"
  ].join("\n");
  document.head.appendChild(style);

  function init() {
    var dot = document.getElementById("dot");
    if (!dot) {
      dot = document.createElement("div");
      dot.id = "dot";
      document.body.appendChild(dot);
    }

    function place(x, y, target) {
      dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
      dot.style.opacity = "1";
      dot.classList.toggle("over", !!(target && target.closest("a, .g, .rl")));
    }

    document.addEventListener("mousemove", function (e) {
      place(e.clientX, e.clientY, e.target);
    });
    document.addEventListener("mouseleave", function () { dot.style.opacity = "0"; });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
