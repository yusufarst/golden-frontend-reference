/* Golden Frontend Reference v1 - consumer demo behaviour (generic data; uses only Golden Layer A components:
   MCList + MCPager (numbered, paginated list), MCUI.pill (status), MCStepper (workflow navigator), MCChecks
   (validation summary), MCBizDate (date rule), MCDialog (confirmation), MCResult (success result)). */
(function () {
  'use strict';
  var UI = window.MCUI, esc = UI.esc, doc = document;
  function q(s) { return doc.querySelector(s); }

  /* generic sample data (replace with your own) */
  var NAMES = ['Ayu', 'Bima', 'Citra', 'Dodi', 'Eka', 'Fajar', 'Gita', 'Hadi', 'Intan', 'Joko', 'Kirana', 'Lukman'];
  var STATES = [['Baru', 'info'], ['Diproses', 'pending'], ['Dikirim', 'neutral'], ['Selesai', 'success'], ['Perlu dicek', 'attention']];
  var orders = [];
  for (var i = 0; i < 23; i++) {
    var st = STATES[i % STATES.length];
    orders.push({ id: 'o-' + (i + 1), code: 'PSN-' + String(1040 - i), customer: NAMES[i % NAMES.length] + ' ' + (i < 12 ? 'Pratama' : 'Lestari'), total: 85000 + i * 12500, state: st[0], tone: st[1] });
  }
  function rp(n) { return 'Rp' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function pill(o) { return UI.pill(o.state, o.tone, { variant: 'text' }); }

  /* workflow navigator (stage ids and labels belong to the project, never to the component) */
  var stage = 'data';
  function renderFlow() {
    q('[data-mount="flow"]').innerHTML = window.MCStepper.html([
      { id: 'data', label: 'Isi data', state: stage === 'data' ? 'current' : 'complete' },
      { id: 'periksa', label: 'Periksa', state: stage === 'periksa' ? 'current' : stage === 'data' ? 'upcoming' : 'complete' },
      { id: 'selesai', label: 'Selesai', state: stage === 'selesai' ? 'current' : 'upcoming', locked: true }
    ], { label: 'Tahap pelanggan baru', attr: 'data-demo-stage' });
    window.MCStepper.bind(q('[data-mount="flow"]'), function (id) { if (id !== 'selesai') { stage = id; renderFlow(); } });
  }
  renderFlow();

  /* numbered, paginated list */
  window.MCList.mount(q('[data-mount="list"]'), {
    caption: 'Daftar pesanan', rows: orders, number: true, paging: { size: 10, noun: 'pesanan' },
    columns: [
      { label: 'Pesanan', render: function (o) { return UI.cell(o.code, o.customer); } },
      { label: 'Total', cls: 'is-num', render: function (o) { return esc(rp(o.total)); } },
      { label: 'Status', cls: 'is-shrink', render: pill }
    ],
    phone: { title: function (o) { return o.code; }, meta: function (o) { return '<span>' + esc(o.customer) + '</span>'; }, end: function (o) { return '<span class="pt-row__value">' + esc(rp(o.total)) + '</span>' + pill(o); } }
  });

  /* form: validation summary + field errors + the date rule; confirmation; result */
  var form = q('[data-demo-form]'), date = q('[data-demo-date]');
  if (window.MCBizDate) window.MCBizDate.watch(date, q('#demo-date-note'), { label: 'Tanggal daftar', effect: 'Pelanggan dicatat terdaftar pada tanggal ini.' });
  function checks() {
    var out = [], name = q('#demo-name').value.trim(), email = q('#demo-email').value.trim();
    if (!name) out.push({ id: 'name', severity: 'BLOCKING', field: 'name', text: 'Isi nama pelanggan.' });
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) out.push({ id: 'email', severity: 'BLOCKING', field: 'email', text: 'Format email belum benar, contoh: nama@domain.com.' });
    var de = window.MCBizDate ? window.MCBizDate.error(date.value, 'Tanggal daftar') : '';
    if (de) out.push({ id: 'date', severity: 'BLOCKING', field: 'date', text: de });
    return out;
  }
  function showErrors(list) {
    ['name', 'email', 'date'].forEach(function (f) { var el = form.elements[f]; if (list.some(function (k) { return k.field === f; })) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); });
    q('[data-mount="checks"]').innerHTML = list.length ? window.MCChecks.html(list, { hideOk: true }) : '';
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var list = checks();
    showErrors(list);
    stage = list.length ? 'data' : 'periksa'; renderFlow();
    if (list.length) { form.elements[list[0].field].focus(); return; }
    var name = q('#demo-name').value.trim();
    window.MCDialog.confirm({ title: 'Simpan pelanggan ' + name + '?', message: 'Data pelanggan baru akan disimpan.', confirm: 'Simpan', cancel: 'Kembali' }).then(function (ok) {
      if (!ok) { stage = 'data'; renderFlow(); return; }
      stage = 'selesai'; renderFlow();
      var res = window.MCResult.mount(q('[data-mount="result"]'), { title: 'Pelanggan ' + name + ' tersimpan.', tone: 'success',
        next: { label: 'Tambah pelanggan lain', action: 'demo-again', variant: 'outline', why: 'Formulir dikosongkan untuk pelanggan berikutnya.' } });
      form.hidden = true;
      if (res) res.focus();
    });
  });
  form.addEventListener('reset', function () { setTimeout(function () { showErrors([]); }, 0); });
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-action="demo-again"]')) return;
    form.reset(); form.hidden = false; q('[data-mount="result"]').hidden = true; stage = 'data'; renderFlow(); q('#demo-name').focus();
  });
})();
