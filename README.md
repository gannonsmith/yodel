# Yodel

Yodel is a front-end prototype of a Cincinnati-flavored satirical newspaper. It borrows the visual language of a printed paper—yellow newsprint, strong headlines, rules, and compact departments—while making its fictional nature explicit on every page. Stories are invented, not news reports; the prototype uses AI-assisted satire as its editorial concept, not as a live generation service.

## Run locally

Open `index.html` in a browser, or serve this directory with any static file server (for example, `python3 -m http.server 8000` and visit `http://localhost:8000`). There is no install, build step, remote font, external image, API, or database. The links and local scripts also work from `file://` in modern browsers.

- `index.html` is the front page. “Next headline” rotates through three featured stories.
- `archive.html` searches the full local article collection and filters by department. The selected department and search term are reflected in the `category` and `q` URL query parameters (for example, `archive.html?category=Transit&q=streetcar`). These values are restored on load, and changes update the current URL with `history.replaceState` without adding history entries. URL syncing is skipped when opened directly as a `file://` URL; query parameters can still initialize the page.
- `article.html?id=go-tower-chili` renders a story from its ID. Unknown IDs show a not-found message.

## Content model

`articles.js` holds the sample stories in `window.YODEL_ARTICLES`. Each entry uses:

- `id`: unique, stable URL identifier used by `article.html?id=...`.
- `category`, `title`, `deck`, `author`: the department, headline, short summary, and fictional byline.
- `date`: the story's publication date in `YYYY-MM-DD` format. Article dates are the source of truth; the edition date shown in the header and the page-level `date` metadata are derived from the newest valid story date, never the visitor's clock.
- `minutes`, `location`, `quote`: estimated reading time, imaginary dateline, and optional pull quote.
- `paragraphs`: an array of plain-text story paragraphs.

`app.js` renders the home, archive, and article views from that same data; it escapes story text before inserting it into HTML and provides a fallback if an article or the local story data is incomplete. To add a story, add one entry to `articles.js` using an existing category (or add that category to the archive filter and department links), and give it a unique ID. Keep the array in newest-first publication order: the front page uses it for featured/latest stories and the archive's default order.

## Editorial approach

All stories, quotes, and events are fictional. Before adding a story, check that its premise is clearly satirical, does not assert damaging facts about real people, and can be read without mistaking it for reporting. Preserve the site-wide fiction banner and the article-level editor's note. See [EDITORIAL_WORKFLOW.md](EDITORIAL_WORKFLOW.md) for a proposed human approval process if Yodel later generates drafts automatically.

**Deployment is intentionally not configured yet.** This repository has no hosting, DNS, CI, GitHub Actions, API, authentication, or secrets setup.
