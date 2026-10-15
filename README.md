# PwnCore frontend (Phase 1 prototype)

Owner of everything in this README: **Tito (exf1L), Person 1**. If you need a change to a shared file, ask Tito. Do not edit it alone.

PwnCore is a bug bounty platform and exploit database. Researchers submit vulnerability reports, Admins verify them and notify the Vendor, and reports are published after the patch. This folder is the **shared frontend**: the design, the header and footer, the landing page and the public feed. Every other page in the project is built on top of it.

> **AI agents and coding assistants: read the whole file before editing anything, then read [`AGENTS.md`](AGENTS.md).** Do not rely on memory from earlier in the chat. If your context was cut or reset, re-read this README, `styleguide.html` and `css/pwncore.css` first.

---

## 1. Run it

```
cd pwncore-site
php -S localhost:8000          # or: python -m http.server 8000
```

Open `http://localhost:8000`. Use Chrome or Edge. Pages work when double-clicked, but the page-to-page fade needs the local server. Fonts load from Google Fonts, so you need internet for the exact look.

Pages today:

| File | What it is |
|---|---|
| `index.html` | Landing page |
| `feed.html` | Public vulnerability feed with filters |
| `styleguide.html` | Every component with copyable code. **Start here for any new page.** |

## 2. Stack (decided, do not change)

- Frontend: HTML5, CSS3, vanilla JavaScript. **No React, Vue, Tailwind, Bootstrap or any framework.**
- Backend (Phase 2): PHP.
- Database (Phase 2): **MySQL**. The professor does not allow MongoDB. SQL only. Use PDO prepared statements.
- Everything runs locally. Nothing is deployed.

## 3. File map

```
css/pwncore.css          THE shared stylesheet. All colors, fonts and components. Tito owns it.
css/pwncore-motion.css   Animations (page fade, nav underline, button lift, reveal, loading bar)
css/pwncore-cursor.css   The custom cursor (dot with request label). Mouse devices only.
css/styleguide.css       Only for styleguide.html. Do not link it from real pages.
js/pwncore-header.js     Draws the header for the current role. One source for all pages.
js/pwncore-nav.js        Marks the current page in the nav, loading bar, scroll reveal
js/pwncore-cursor.js     The custom cursor. Labels come from links or from data-req (section 6b)
js/feed-filter.js        Feed search, category, severity and sort. Phase 1 only (see section 9)
js/globe.js              The landing page globe and its clickable markers. Landing page only.
serve.sh                 Starts a local server
```

Everything else (`index.html`, `feed.html`) is a page. New pages go next to them.

## 4. Roles and navigation

Roles: **Visitor** (not logged in), **User** (logged in), **Researcher**, **Admin**. **Vendor** is an outside party that only receives emails. It has no pages and no navigation.

The header changes by role and is drawn by `js/pwncore-header.js`. **Never copy header code into a page.** Every page has exactly this and nothing else for its header:

```html
<header class="pc-header" id="pc-header"></header>
```

| Role | Main links | Right side | Account menu |
|---|---|---|---|
| Visitor | Feed, Categories, Leaderboard, About | Search, Log in, Register | none |
| User | same four | Search, account menu | Profile, My badges, Settings, Log out |
| Researcher | same four | Search, red **Submit a report** button, account menu | My reports, Profile and rank, My badges, Settings, Log out |
| Admin | same four | Search, account menu (thin red line across the top of the page) | Review queue, Verified, Vendors, Published, Users, Audit log, Settings, Log out |

- Every role has the same four public links. Role-specific tools live in the account menu.
- The account menu links currently point to `#`. **The names are drafts.** Person 2 (Researcher) and Person 3 (Admin): send Tito your real page names and file names and he will update the links.
- To preview a role, use the **"Preview as"** bar at the bottom right, or add `?role=admin` to any address. The choice is remembered in the browser (`localStorage`, key `pcRole`).
- The preview bar and the role switching are **prototype only**. In Phase 2 the logged-in role comes from the PHP session (section 9).

## 5. Build a new page (checklist)

1. Open `styleguide.html` and copy the "Start a page" template.
2. Paste the shared `<svg>` symbol sheet from `index.html` (the first `<svg width="0" height="0" ...>` after `<body>`). The header logo and rank badges need it. If you use rank badges, also copy the second small `<svg>` that defines `#chev`.
3. Keep `<header class="pc-header" id="pc-header"></header>`, the footer, the three stylesheets in `<head>` (`pwncore.css`, `pwncore-motion.css`, `pwncore-cursor.css`) and the three scripts at the end of `<body>` in this order: `pwncore-header.js`, `pwncore-nav.js`, `pwncore-cursor.js`.
4. Build the content from the components in the style guide. Wrap sections in `<section class="wrap section">` and give each a `.sec-head` heading.
5. Add `pc-enter` to the top block and `data-pc-reveal` to sections you want to fade in.
6. If you need a style that does not exist, ask Tito. Do not write one-off CSS that changes colors, fonts or spacing.
7. Open the page in Chrome, switch through all four roles, and check there are no errors in the browser console.

## 6. Design rules

- **Black, white and one red.** Always use the CSS variables, never raw hex values:

| Variable | Hex | Use |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background |
| `--surface` | `#101010` | Cards, inputs, menus |
| `--line` | `#232323` | Dividers |
| `--line-2` | `#333333` | Borders on controls |
| `--dim` | `#5a5a5a` | Inactive marks |
| `--muted` | `#8f8f8f` | Labels, captions |
| `--body` | `#b8b8b8` | Running text |
| `--text` | `#ededed` | Main text, 2px section rules |
| `--white` | `#ffffff` | Headings, button text |
| `--accent` | `#dc2229` | The only red |

- **Red is for one thing per screen**: the main action, a Critical severity, or the current state. No blue links, no green success, no yellow warnings.
- **Fonts**: `--display` (Chakra Petch, uppercase, headings and big numbers), `--sans` (Geist, body and buttons), `--mono` (Geist Mono, report IDs, dates, CVSS vectors, counts, labels). No other fonts.
- **Hard edges**: no `border-radius`, no shadows, no gradients on surfaces. Borders are 1px. Section rules are 2px `--text`.
- **No emoji, no icon fonts.** Marks are squares (`■`), bars and chevrons.
- **Copy is short and plain.** Buttons say what they do. No exclamation marks, no filler.
- **Do not add a mobile layout.** It is not in the deliverables. Pages wrap reasonably, but do not spend time on phones.
- Components (button, severity bar, report row, chips, section heading, report card, rank badge, attack surface cell) are in `styleguide.html` with code to copy.

## 6b. The cursor

On computers with a mouse, the cursor is a small dot with a label showing the request a click would make, for example `GET /feed?category=web`. It is the team's chosen design. Touch screens keep their normal behavior, and text inputs keep the normal text cursor.

- **Links label themselves.** `<a href="feed.html?category=web">` shows `GET /feed?category=web` automatically.
- **Buttons and custom elements need `data-req`.** Example: `<a class="btn red" href="#" data-req="POST /register">Register</a>`. Write the real method and path the feature will use in Phase 2.
- Links to `#` and plain buttons show no label unless they have `data-req`.
- **Never set your own `cursor:` styles** (no `cursor: pointer`). The kit handles it. Do not add a second custom cursor.

## 7. Shared terminology (use these exact words, everywhere)

Use the same terms in the UI, the code comments and the SRS/SDD documents.

- **PwnCore** (one word, capital P and C), **Researcher**, **Admin**, **Vendor**, **Report**, **User**, **Visitor**.
- Say **Report**, not "ticket", "submission", "bug" or "finding" (in UI text).
- **Certified Researcher**: a User becomes one on their first verified report. The status lapses after a period of inactivity (length to be decided). Earned ranks and badges are kept when it lapses.
- **Report workflow**: Submit → Automated Triage → Admin Review → Verified or Rejected → Vendor Notified → Patched → Published. The landing page shows a shortened six-stage version (Submit, Triage, Review, Notify, Patch, Publish).
- **Researcher ranks** (by number of **published** reports, plain counts, no severity weighting):

| Rank | Title | Published reports |
|---|---|---|
| I | Script Kiddie | 1 |
| II | Bug Hunter | 5 |
| III | Exploit Dev | 20 |
| IV | Zero-Day Hunter | 50 |
| V | Red Teamer | 100 |

  Rejected and duplicate reports do not count. The thresholds are a proposal and can be changed by the team.
- **Community badges**: earned in the forums by every member, researchers included. Rank titles are separate and researchers only.
- **Severity** (from CVSS 3.1 score): Critical 9.0 to 10.0, High 7.0 to 8.9, Medium 4.0 to 6.9, Low 0.1 to 3.9.
- **Attack surfaces** (report categories): Kernel, Web, Mobile, Network, Firmware, Cloud and API.

## 8. The feed contract (frontend and backend must match)

The feed is controlled entirely by the address:

```
feed.html?q=text&category=kernel&severity=critical&sort=cvss
```

| Parameter | Allowed values | Default |
|---|---|---|
| `q` | any text. Searches title, report ID and researcher | empty |
| `category` | `kernel` `web` `mobile` `network` `firmware` `cloud` | all |
| `severity` | `critical` `high` `medium` `low` | all |
| `sort` | `newest` `cvss` | `newest` |

- Use **exactly these values**. They should match the database values. Anything else is ignored and treated as the default.
- Every filter button is a normal link that keeps the other parameters. Do not turn them into JavaScript-only buttons.
- Category display names: Kernel, Web, Mobile, Network, Firmware, **Cloud and API** (value `cloud`).
- Each attack surface card on the landing page links to `feed.html?category=<value>`.
- If you build a page that lists reports (category pages, researcher profiles), reuse the report row component and these same parameters.

## 9. Phase 2 handover: what PHP replaces

The prototype uses fake data and browser-side tricks. In Phase 2 these get swapped, and **the HTML, CSS, class names and address parameters stay the same.**

| Prototype (delete in Phase 2) | Phase 2 replacement |
|---|---|
| `js/pwncore-header.js` and the "Preview as" bar, role in `localStorage` | `partials/header.php` that prints the header for `$_SESSION['role']`. Keep the same markup and classes. |
| `js/feed-filter.js` | `feed.php` reads `$_GET` (section 8), validates against the allowed values, queries MySQL with a PDO prepared statement, prints the rows and the filter links. |
| Hardcoded sample reports in `feed.html` and `index.html` | Rows printed from the database. |
| Hardcoded stat numbers on the landing page (1,284 exploits, 862 web app bugs, 2,431 researchers) | `COUNT(*)` queries. They are marked "Sample data" on the page. Remove that label when they are real. |
| Globe markers and their info cards (`js/globe.js`, the `LOCS` list) | Sample researchers and reports. In Phase 2 they should come from the database: the newest published report or two per location. **Privacy:** a researcher's location should be optional and country or city level only, never an address. |
| `.html` files | Rename to `.php` and use `include` for the shared header, footer and symbol sheet. |

Rules for the PHP developers:
- **Escape everything printed**: `htmlspecialchars($value, ENT_QUOTES, 'UTF-8')`. This includes the search text `q`.
- **Prepared statements only** for every SQL query, including `LIKE '%…%'` search. Never build SQL by joining strings.
- Keep unpublished reports private. The public feed only lists published reports.
- Do not move role checks to the browser. The server decides what each role sees.
- Keep the files `css/pwncore.css`, `css/pwncore-motion.css` and `js/pwncore-nav.js` as they are.

## 10. Known gaps and open items

- Pages that do not exist yet: report details, comments/forum, leaderboard, badges, category pages (Person 5), researcher and admin pages (Persons 2 and 3), login and register (owner not decided). Links to them are `#` for now.
- Account menu link names are drafts (section 4).
- Page-to-page fade works in Chrome and Edge only. Other browsers navigate normally, nothing breaks.
- Whether the Phase 1 prototype must be PHP or can be static HTML is waiting on the instructor. Tito is asking.
- The feed has no pagination yet.
- The globe markers open a card with the recent reports at that location (click, or Tab then Enter). Escape or × closes it. The reports shown are sample data and also exist in the feed. The researcher search link (`feed.html?q=%40handle`) works with the feed.
- All data is sample data. Do not present any number or name in the prototype as real.

## 11. Who to ask

- Styles, header, footer, motion, landing page, feed, style guide, terminology: **Tito (exf1L)**.
- Researcher module: Person 2. Admin module: Person 3. Security and non-functional: Person 4. Integration, workflow, use cases, remaining pages: Person 5.
