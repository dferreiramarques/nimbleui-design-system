/* nimbleUI theme helper (no deps, CSP-safe: load as an external script in <head>, no inline code).
   Preference = auto | light | dark, stored in localStorage('nimble-theme'; absent = auto).
   Sets <html data-theme="light|dark"> (resolved) and data-theme-pref (the preference).
   Buttons: [data-theme-toggle] flips the resolved theme (explicit); [data-theme-set="auto|light|dark"] sets it
   and gets aria-pressed. Accent: <html data-accent="rose|indigo"> (omit for emerald). */
(function () {
  var root = document.documentElement, KEY = 'nimble-theme';
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : { matches: false };
  function pref() { try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } }
  function resolve(p) { return p === 'auto' ? (mq.matches ? 'dark' : 'light') : p; }
  function apply() {
    var p = pref();
    root.setAttribute('data-theme', resolve(p));
    root.setAttribute('data-theme-pref', p);
    var bs = document.querySelectorAll('[data-theme-set]');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', String(bs[i].getAttribute('data-theme-set') === p));
  }
  function set(p) {
    try { if (p === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, p); } catch (e) {}
    apply();
  }
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply); else if (mq.addListener) mq.addListener(apply);
  document.addEventListener('DOMContentLoaded', apply);
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-theme-toggle],[data-theme-set]');
    if (!t) return;
    if (t.hasAttribute('data-theme-toggle')) set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    else set(t.getAttribute('data-theme-set'));
  });
  window.NimbleTheme = { get: pref, set: set };
})();
