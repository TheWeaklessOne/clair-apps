// Shared code of Clair's Mini App pages (backlog 96). Loaded first, before telegram-web-app.js,
// so it reads the fragment exactly as the link brought it.
//
// Our data lives only in the URL fragment: '#c1.' + base64url(UTF-8 JSON). The fragment never
// reaches GitHub. Telegram appends its launch parameters (tgWebAppData, tgWebAppVersion, ...) to an
// existing fragment after '?' or '&', so everything from the first '?' or '&' on is not ours.
(function (root) {
  'use strict';
  var PREFIX = 'c1.';

  function base64urlToBytes(text) {
    if (!/^[A-Za-z0-9_-]*$/.test(text)) return null;
    var b64 = text.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin;
    try { bin = atob(b64); } catch (e) { return null; }
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  /** The data from a location.hash, or null when the fragment is not ours or is broken. */
  function decodeFragment(hash) {
    if (typeof hash !== 'string') return null;
    var raw = hash.replace(/^#/, '').split(/[?&]/)[0];
    if (raw.indexOf(PREFIX) !== 0) return null;
    var bytes = base64urlToBytes(raw.slice(PREFIX.length));
    if (!bytes) return null;
    try {
      return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    } catch (e) {
      return null;
    }
  }

  /** Names of the parameters in a hash, never their values (tgWebAppData carries his id and a signature). */
  function hashKeys(hash) {
    if (typeof hash !== 'string') return [];
    var body = hash.replace(/^#/, '');
    var keys = [];
    var parts = body.split(/[?&]/);
    for (var i = 0; i < parts.length; i++) {
      var name = parts[i].split('=')[0];
      if (!name) continue;
      if (name.indexOf(PREFIX) === 0) name = PREFIX + '…';
      if (/^[A-Za-z0-9_.…-]{1,40}$/.test(name)) keys.push(name);
    }
    return keys;
  }

  var initialHash = '';
  try { initialHash = String(root.location && root.location.hash || ''); } catch (e) {}

  function webApp() {
    return root.Telegram && root.Telegram.WebApp ? root.Telegram.WebApp : null;
  }

  /** ready() and expand(); the --tg-theme-* colours are set by telegram-web-app.js itself. */
  function start() {
    var app = webApp();
    if (!app) return;
    try { app.ready(); } catch (e) {}
    try { app.expand(); } catch (e) {}
  }

  function close() {
    var app = webApp();
    if (app) {
      try { app.close(); return; } catch (e) {}
    }
    try { root.close(); } catch (e) {}
  }

  /** What the page says when the data did not arrive: platform, version, hash keys without values. */
  function diagnostics() {
    var app = webApp();
    return {
      platform: app ? String(app.platform || '?') : 'нет Telegram.WebApp',
      version: app ? String(app.version || '?') : '?',
      keys: hashKeys(initialHash),
    };
  }

  var api = {
    PREFIX: PREFIX,
    decodeFragment: decodeFragment,
    hashKeys: hashKeys,
    data: function () { return decodeFragment(initialHash); },
    start: start,
    close: close,
    diagnostics: diagnostics,
  };
  root.ClairApp = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
