// The birthday calendar for a month (backlog 96): the same view as widgets/birthday-month.html,
// data {m:"YYYY-MM", d:[[day,"Name"],…]} from the link's fragment (ClairApp.data()).
// Names are data: only textContent, never markup.
(function () {
  'use strict';
  var C = window.ClairApp;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = String(text);
    return e;
  }

  function showMissing(info) {
    var d = C.diagnostics();
    info.appendChild(el('div', 'e', 'Данные из ссылки не дошли.'));
    info.appendChild(el('div', 'e s', 'platform: ' + d.platform + ', version: ' + d.version));
    info.appendChild(el('div', 'e s', 'hash: ' + (d.keys.length ? d.keys.join(', ') : '(пусто)')));
  }

  function render() {
    var data = C.data();
    var g = document.getElementById('g'), info = document.getElementById('i');
    while (g.firstChild) g.removeChild(g.firstChild);
    while (info.firstChild) info.removeChild(info.firstChild);
    var valid = data && typeof data === 'object' && /^\d{4}-\d{2}$/.test(data.m);
    var now = new Date();
    var m = valid ? data.m : now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2);
    var y = Number(m.slice(0, 4)), mo = Number(m.slice(5, 7)) - 1;
    var first = new Date(y, mo, 1), days = new Date(y, mo + 1, 0).getDate();
    var title = first.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    document.getElementById('m').textContent = 'Дни рождения · ' + title;
    var byDay = {};
    var list = valid && Array.isArray(data.d) ? data.d : [];
    for (var k = 0; k < list.length; k++) {
      var day = Number(list[k] && list[k][0]);
      if (day >= 1 && day <= days) (byDay[day] = byDay[day] || []).push(String(list[k][1] || ''));
    }
    ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].forEach(function (h) { g.appendChild(el('div', 'h', h)); });
    for (var s = (first.getDay() + 6) % 7; s > 0; s--) g.appendChild(el('div'));
    var today = now.getFullYear() === y && now.getMonth() === mo ? now.getDate() : 0;
    for (var d = 1; d <= days; d++) {
      var names = byDay[d];
      var b = el('button', 'd' + (names ? ' b' : '') + (d === today ? ' t' : ''), d);
      b.type = 'button';
      if (names) b.addEventListener('click', (function (dd, nn) {
        return function () {
          while (info.firstChild) info.removeChild(info.firstChild);
          info.appendChild(el('span', null, dd + ': ' + nn.join(', ')));
        };
      })(d, names));
      g.appendChild(b);
    }
    if (!valid) showMissing(info);
    else if (!list.length) info.appendChild(el('span', 'e', 'В этом месяце дней рождения нет'));
    else info.appendChild(el('span', 'e', 'Нажми на выделенный день'));
  }

  document.getElementById('close').addEventListener('click', function () { C.close(); });
  render();
  C.start();
})();
