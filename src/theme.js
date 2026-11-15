/* nimbleUI theme helper (no deps, CSP-safe: load as an external script, no inline code).
   Sets <html data-theme="light|dark">, remembers the choice, and wires every [data-theme-toggle] button.
   Accent: <html data-accent="rose|indigo"> (omit for emerald). */
(function () {
  var root = document.documentElement, KEY = 'nimble-theme';
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(t) { root.setAttribute('data-theme', t); }
  var t = stored() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  apply(t);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!b) return;
    var n = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(n);
    try { localStorage.setItem(KEY, n); } catch (e2) {}
  });
})();
