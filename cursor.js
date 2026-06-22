// Shared custom cursor for the inner pages (about, cv, showreel, hi, demos, notebook).
// index.html keeps its own inline copy (it's self-contained and ties the cursor to
// the wordmark glyphs); this is the same dot/ring, generalised to grow over any link.
//
// Self-injecting: a page only needs <script src="cursor.js"> at the END of its <head>
// (after its own styles, so the injected `cursor: none` wins). It creates the #dot
// element + styles and replaces the OS cursor with a cream/ink dot that swells to a
// ring over links. Pointer-only by construction: it just listens for `mousemove`, so
// touch devices never light it up and keep native scroll/taps (no media query needed —
// hover/pointer queries silently fail in some browsers anyway). Over a cross-origin
// iframe (showreel/hi) the browser stops sending moves, so the dot fades there.
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
    ":root { --dot: #000000; }",
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
