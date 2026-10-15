# Instructions for AI coding agents working on PwnCore

Read `README.md` fully first. It is the source of truth. If your context was reset or truncated, re-read `README.md`, `styleguide.html` and `css/pwncore.css` before you edit anything. Do not rely on what you remember from earlier in the conversation.

## What this project is

PwnCore: a school team project (bug bounty platform + exploit database). Stack: HTML5, CSS3, vanilla JS, PHP, MySQL. Runs locally. Phase 1 is documents plus a prototype. Phase 2 is the working PHP/MySQL system.

## Hard rules

1. **Do not edit shared files** unless the user says it is allowed: `css/pwncore.css`, `css/pwncore-motion.css`, `css/pwncore-cursor.css`, `js/pwncore-header.js`, `js/pwncore-nav.js`, `js/pwncore-cursor.js`, `js/globe.js`, `styleguide.html`, `index.html`, `feed.html`. If you need a new style or change, tell the user to ask Tito. Never "fix" these on your own.
2. **Never paste header code into a page.** Use `<header class="pc-header" id="pc-header"></header>` and the three scripts (`pwncore-header.js`, `pwncore-nav.js`, `pwncore-cursor.js`). Same for the footer markup and the SVG symbol sheet: copy them from `styleguide.html` / `index.html` exactly.
3. **Reuse the components** in `styleguide.html` (buttons, severity bars, report rows, chips, cards, rank badges, section headings). Copy their markup and class names. Do not invent alternatives.
4. **Colors and fonts come from CSS variables** (`var(--accent)`, `var(--muted)`, `var(--mono)`, and so on). Never write a raw hex color or a new font. Only one red exists: `--accent`. No blue, green or yellow.
5. **Hard edges.** No `border-radius`, no `box-shadow`, no gradients on surfaces. No emoji, no icon libraries.
6. **No frameworks or libraries.** No React, Vue, jQuery, Tailwind, Bootstrap, or CDN scripts. Plain HTML, CSS and JS.
7. **Database is MySQL (SQL). Never MongoDB or any NoSQL store.** Use PDO prepared statements for all queries, including search `LIKE`. Escape all printed output with `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`.
8. **Keep the feed contract exactly**: parameters `q`, `category`, `severity`, `sort` with the values listed in `README.md` section 8. Category values: `kernel`, `web`, `mobile`, `network`, `firmware`, `cloud`. Do not rename them.
9. **Use the exact terminology**: PwnCore, Researcher, Admin, Vendor, Report, User, Visitor. Ranks: Script Kiddie, Bug Hunter, Exploit Dev, Zero-Day Hunter, Red Teamer. Do not rename or add ranks. Do not call a Report a "ticket" or "submission" in the UI.
10. **Do not add a mobile layout, dark/light toggle, or extra features** that were not asked for.
11. **Do not invent data.** Sample data must stay clearly sample. Never present made-up numbers or names as real.
12. **Role logic belongs on the server** in Phase 2. Do not rely on `localStorage` or the "Preview as" bar for access control. They are prototype-only and get deleted.
13. **Cursor:** never set your own `cursor:` styles and never add another custom cursor. Links label themselves. Give buttons and custom elements a `data-req="METHOD /path"` (see `README.md` section 6b). Load `css/pwncore-cursor.css` and `js/pwncore-cursor.js` on every page.
14. **Short, plain UI copy.** Buttons say what they do. No exclamation marks.

## Before you say a task is finished

- The page loads with no errors in the browser console.
- You switched through all four roles (Visitor, User, Researcher, Admin) and the header is correct.
- No new colors, fonts, rounded corners or shadows were introduced.
- Shared files are unchanged (`git diff` shows nothing in them). If you had to change one, say so clearly and why.
- Feed links and parameters still match the contract.
- Nothing in the prototype claims sample data is real.

## If something is unclear

Ask the user. Do not guess names, values or page structure. Open questions are listed in `README.md` section 10. Do not silently decide them.
