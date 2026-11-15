document.querySelectorAll('[data-acc]').forEach(function (b) {
  b.addEventListener('click', function () {
    var a = b.getAttribute('data-acc');
    if (a) document.documentElement.setAttribute('data-accent', a); else document.documentElement.removeAttribute('data-accent');
    document.querySelectorAll('[data-acc]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
  });
});
