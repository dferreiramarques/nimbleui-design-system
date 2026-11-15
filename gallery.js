(function () {
  var root = document.documentElement;
  document.querySelectorAll('[data-acc]').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-acc');
      if (a) root.setAttribute('data-accent', a); else root.removeAttribute('data-accent');
      document.querySelectorAll('[data-acc]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  var dens = document.getElementById('density');
  dens.addEventListener('click', function () {
    var on = root.getAttribute('data-density') !== 'compact';
    if (on) root.setAttribute('data-density', 'compact'); else root.removeAttribute('data-density');
    dens.setAttribute('aria-pressed', String(on));
  });
  var log = document.getElementById('log');
  function say(t) { log.textContent = t; }
  document.addEventListener('nimble:sort', function (e) {
    var d = e.detail;
    say('sort: "' + (d.item.textContent || '').trim().slice(0, 24) + '" ' + d.oldIndex + ' → ' + d.newIndex + (d.from !== d.to ? ' (other list)' : ''));
    document.querySelectorAll('.col').forEach(function (c) {
      var n = c.querySelectorAll('[data-sortable-item]').length, k = c.querySelector('.col__count');
      if (k) k.textContent = n;
    });
  });
  document.addEventListener('nimble:edit', function (e) { say('edit: "' + e.detail.oldValue + '" → "' + e.detail.value + '"'); });
  document.addEventListener('nimble:menuselect', function (e) { say('menu: ' + e.detail.value); });
  document.addEventListener('nimble:dialogclose', function (e) { if (e.target.id === 'dlg-edit') say('dialog closed: ' + (e.detail.result || 'dismissed')); });
  document.getElementById('show-toast').addEventListener('click', function () { NimbleUI.toast('Saved to Drive'); });
  document.getElementById('ask-del').addEventListener('click', function () {
    NimbleUI.confirm({ title: 'Delete roadmap?', message: 'This also removes its public copy.', confirmLabel: 'Delete', danger: true })
      .then(function (ok) { say('confirm: ' + ok); if (ok) NimbleUI.toast('Deleted', { tone: 'warn' }); });
  });
})();
