(function () {
  "use strict";

  const articles = window.YODEL_ARTICLES;
  const page = document.body.dataset.page;
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const articleURL = (article) => `article.html?id=${encodeURIComponent(article.id)}`;
  const formatDate = (date) => new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC"
  }).format(new Date(`${date}T12:00:00Z`));

  document.querySelectorAll(".edition-date").forEach((element) => {
    element.textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    }).format(new Date()).toUpperCase();
  });

  function storyCard(article, index) {
    return `<article class="story-card">
      <div class="story-card__top"><span>${String(index + 1).padStart(2, "0")} / THE DISPATCH</span><span aria-hidden="true">✳</span></div>
      <p class="story-category">${escapeHTML(article.category)}</p>
      <h3><a href="${articleURL(article)}">${escapeHTML(article.title)}</a></h3>
      <p class="story-deck">${escapeHTML(article.deck)}</p>
      <div class="story-card__foot"><span>${escapeHTML(formatDate(article.date))}</span><a href="${articleURL(article)}" aria-label="Read ${escapeHTML(article.title)}">READ <span aria-hidden="true">↗</span></a></div>
    </article>`;
  }

  if (page === "home") {
    const featured = articles.slice(0, 3);
    let current = 0;
    const nextButton = document.getElementById("next-feature");
    const heading = document.getElementById("lead-heading");
    function showFeature() {
      const article = featured[current];
      document.getElementById("feature-counter").textContent = `${String(current + 1).padStart(2, "0")} / ${String(featured.length).padStart(2, "0")}`;
      document.getElementById("feature-category").textContent = `${article.category.toUpperCase()} · CINCINNATI`;
      heading.textContent = article.title;
      document.getElementById("feature-deck").textContent = article.deck;
      document.getElementById("feature-link").href = articleURL(article);
      document.getElementById("feature-meta").textContent = `BY ${article.author.toUpperCase()} · ${article.minutes} MIN READ`;
      nextButton.setAttribute("aria-label", `Next headline; currently showing ${article.title}`);
    }
    nextButton.addEventListener("click", () => {
      current = (current + 1) % featured.length;
      showFeature();
    });
    showFeature();
    document.getElementById("latest-stories").innerHTML = articles.slice(1, 5).map(storyCard).join("");
  }

  if (page === "archive") {
    const search = document.getElementById("story-search");
    const filter = document.getElementById("category-filter");
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory && [...filter.options].some((option) => option.value === requestedCategory)) {
      filter.value = requestedCategory;
    }
    function renderArchive() {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = articles.filter((article) =>
        (!filter.value || article.category === filter.value) &&
        (!query || [article.title, article.deck, article.category, ...article.paragraphs]
          .some((text) => text.toLocaleLowerCase().includes(query)))
      );
      document.getElementById("archive-stories").innerHTML = matches.map((article, index) =>
        `<article class="archive-item"><span class="archive-item__number">${String(index + 1).padStart(2, "0")}</span><div><p class="story-category">${escapeHTML(article.category)} <span>· ${escapeHTML(formatDate(article.date))}</span></p><h3><a href="${articleURL(article)}">${escapeHTML(article.title)}</a></h3><p>${escapeHTML(article.deck)}</p></div><a class="archive-item__arrow" href="${articleURL(article)}" aria-label="Read ${escapeHTML(article.title)}">↗</a></article>`
      ).join("");
      document.getElementById("result-count").textContent = `${matches.length} ${matches.length === 1 ? "story" : "stories"} found`;
      document.getElementById("empty-results").hidden = matches.length !== 0;
    }
    search.addEventListener("input", renderArchive);
    filter.addEventListener("change", renderArchive);
    renderArchive();
  }

  if (page === "article") {
    const container = document.getElementById("article-content");
    const id = new URLSearchParams(window.location.search).get("id");
    const article = articles.find((item) => item.id === id);
    if (!article) {
      document.title = "Story not found — Yodel";
      container.innerHTML = `<div class="not-found"><span class="small-label">404 / LOST IN THE PRINT ROOM</span><h1>That story isn't in this edition.</h1><p>The link may be out of date, or the story may be entirely too fictional.</p><a class="button button--dark" href="archive.html">Browse all stories <span aria-hidden="true">↗</span></a></div>`;
    } else {
      document.title = `${article.title} — Yodel`;
      document.querySelector('meta[name="description"]').content = `${article.deck} Fictional satire from Yodel.`;
      const related = articles.filter((item) => item.id !== article.id).slice(0, 2);
      container.innerHTML = `<article class="article-layout">
        <header class="article-header"><p class="story-category">${escapeHTML(article.category)} <span> / FICTIONAL DISPATCH</span></p><h1>${escapeHTML(article.title)}</h1><p class="article-deck">${escapeHTML(article.deck)}</p><div class="article-byline"><span>BY <strong>${escapeHTML(article.author.toUpperCase())}</strong></span><span>${escapeHTML(formatDate(article.date))}</span><span>${article.minutes} MIN READ</span></div></header>
        <div class="article-body"><div class="article-column"><div class="article-location"><span>DATELINE</span> ${escapeHTML(article.location)}</div>
          ${article.paragraphs.map((paragraph, index) => `<p${index === 0 ? ' class="first-paragraph"' : ""}>${escapeHTML(paragraph)}</p>${index === 1 ? `<blockquote><span aria-hidden="true">“</span>${escapeHTML(article.quote)}<span aria-hidden="true">”</span></blockquote>` : ""}`).join("")}
          <div class="article-endmark" aria-hidden="true">✳</div><p class="article-disclaimer"><strong>Editor's note:</strong> This is an invented satirical story, not a factual report. The events and quotes above did not happen.</p>
        </div><aside class="article-aside"><div class="aside-stamp">Y<span>.</span></div><p class="small-label">FROM THE YODEL DESK</p><p>A real city. An imaginary story. Read with a grain of salt, preferably beside some crackers.</p><a href="archive.html?category=${encodeURIComponent(article.category)}">More in ${escapeHTML(article.category)} <span aria-hidden="true">↗</span></a></aside></div>
      </article><section class="related-section" aria-labelledby="related-heading"><div class="section-heading"><div><span class="small-label">KEEP TURNING THE PAGE</span><h2 id="related-heading">Elsewhere in Yodel<span class="heading-period">.</span></h2></div><a class="underlined-link" href="archive.html">All stories <span aria-hidden="true">↗</span></a></div><div class="story-grid story-grid--two">${related.map(storyCard).join("")}</div></section>`;
    }
  }
})();
