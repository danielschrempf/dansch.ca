// Shared "print" transition: types a monospace element on/off, character by character.
// Print.in(target[, done]) / Print.out(target[, done]); target = element or array.
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = 1000;   // ms per pass

  var style = document.createElement("style");
  style.textContent = ".ch { opacity: 0; }";
  document.head.appendChild(style);

  // split each char into a .ch span (reusing existing .g units); cache the list
  function wrap(el) {
    if (el._units) return el._units;
    var out = [];
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var text = n.nodeValue, frag = document.createDocumentFragment();
          for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch === " " || ch === "\n" || ch === "\t") {
              frag.appendChild(document.createTextNode(ch));
            } else {
              var s = document.createElement("span");
              s.className = "ch";
              s.textContent = ch;
              frag.appendChild(s);
              out.push(s);
            }
          }
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          if (n.classList && n.classList.contains("g")) out.push(n);
          else walk(n);
        }
      });
    })(el);
    el._units = out;
    return out;
  }

  // drop the cached wrap so the next print re-splits
  function reset(el) { el._units = null; }

  function units(target) {
    var els = Array.isArray(target) ? target : [target];
    return els.reduce(function (acc, el) { return acc.concat(wrap(el)); }, []);
  }

  // flip units in reading order over DUR via one rAF clock
  function run(target, show, done) {
    var u = units(target), n = u.length;
    if (!n) { if (done) done(); return; }
    u.forEach(function (el) { el.style.opacity = show ? "0" : "1"; });
    if (reduce) {
      u.forEach(function (el) { el.style.opacity = show ? "1" : "0"; });
      if (done) done();
      return;
    }
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / DUR), done_count = Math.floor(p * n);
      for (var i = 0; i < done_count; i++) u[i].style.opacity = show ? "1" : "0";
      if (p < 1) requestAnimationFrame(frame);
      else {
        u.forEach(function (el) { el.style.opacity = show ? "1" : "0"; });
        if (done) done();
      }
    }
    requestAnimationFrame(frame);
  }

  window.Print = {
    wrap: wrap,
    reset: reset,
    in: function (target, done) { run(target, true, done); },
    out: function (target, done) { run(target, false, done); }
  };
})();
