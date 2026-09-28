# Yodel

Yodel is a front-end prototype of a Cincinnati-flavored satirical newspaper. It borrows the visual language of a printed paper—yellow newsprint, strong headlines, rules, and compact departments—while making its fictional nature explicit on every page. Stories are invented, not news reports; the prototype uses AI-assisted satire as its editorial concept, not as a live generation service.

## Run locally

Open `index.html` in a browser, or serve this directory with any static file server (for example, `python3 -m http.server 8000` and visit `http://localhost:8000`). There is no install, build step, remote font, external image, API, or database. The links and local scripts also work from `file://` in modern browsers.

- `index.html` is the front page. “Next headline” rotates through three featured stories.
- `archive.html` searches the full local article collection and filters by department. Department links preselect a filter.
- `article.html?id=go-tower-chili` renders a story from its ID. Unknown IDs show a not-found message.

## Content model

`articles.js` holds the sample stories in `window.YODEL_ARTICLES`. Each entry has a stable URL `id`, `category`, `title`, `deck`, fictional `author`, ISO `date`, estimated reading `minutes`, imaginary `location`, pull `quote`, and an array of plain-text `paragraphs`. `app.js` renders the home, archive, and article views from that same data; it escapes story text before inserting it into HTML. To add a story, add one entry to `articles.js` using an existing category (or add that category to the archive filter and department links), and give it a unique ID. The newest entries appear first; keep the array in publication order.

## Editorial approach

All stories, quotes, and events are fictional. Before adding a story, check that its premise is clearly satirical, does not assert damaging facts about real people, and can be read without mistaking it for reporting. Preserve the site-wide fiction banner and the article-level editor's note. See [EDITORIAL_WORKFLOW.md](EDITORIAL_WORKFLOW.md) for a proposed human approval process if Yodel later generates drafts automatically.

**Deployment is intentionally not configured yet.** This repository has no hosting, DNS, CI, GitHub Actions, API, authentication, or secrets setup.
