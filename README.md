# clair-apps

Telegram Mini App pages of Clair, a personal Telegram assistant. Published on GitHub Pages
at https://theweaklessone.github.io/clair-apps/.

- This repository holds code only: HTML, JS, CSS. No names, dates or ids.
- A page gets its data only from the link's fragment (`#c1.<base64url JSON>`). Browsers never
  send the fragment to a server, so the data does not reach GitHub.
- The pages make no network requests: the Content-Security-Policy has `connect-src 'none'`, and
  the only external script is Telegram's `telegram-web-app.js`. No analytics.
- The source lives in the Clair repository (`plugins/clair-telegram/miniapps/`); this repository is
  a copy published by `ops/miniapps-publish.sh`. Do not edit it here.

Pages:

- `birthday-month.html`: the birthday calendar for a month, data `{"m":"YYYY-MM","d":[[day,"Name"],…]}`.
