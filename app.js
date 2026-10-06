(function () {
  "use strict";

  const articles = Array.isArray(window.YODEL_ARTICLES)
    ? window.YODEL_ARTICLES.filter((article) => article && typeof article === "object" && typeof article.id === "string")
    : [];
  const page = document.body.dataset.page;
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const articleURL = (article) => `article.html?id=${encodeURIComponent(article.id)}`;
  const departmentClass = (category) => ({
    "Food & Drink": "food",
    Transit: "transit",
    Workplace: "workplace",
    "Civic Life": "civic"
  })[category] || "general";
  const supportedVisualMotifs = new Set(["terminal", "scorecard", "stadium", "trade", "traffic", "ledger", "hill", "chili", "streetcar", "coffee", "barrel", "river"]);
  const visualMark = (article) => {
    const motif = typeof article.visualMotif === "string" && supportedVisualMotifs.has(article.visualMotif)
      ? article.visualMotif
      : departmentClass(article.category);
    return `<i class="department-mark department-mark--${motif}" aria-hidden="true"></i>`;
  };
  const isISODate = (date) => {
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T12:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date;
  };
  const formatDate = (date) => isISODate(date) ? new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC"
  }).format(new Date(`${date}T12:00:00Z`)) : "Date unavailable";
  const newestArticle = articles.reduce((newest, article) =>
    isISODate(article.date) && (!newest || article.date > newest.date) ? article : newest, null);

  document.querySelectorAll(".edition-date").forEach((element) => {
    element.textContent = newestArticle ? formatDate(newestArticle.date).toUpperCase() : "EDITION DATE UNAVAILABLE";
  });
  document.querySelectorAll('meta[name="date"]').forEach((element) => {
    element.content = newestArticle ? newestArticle.date : "";
  });

  function storyCard(article, index) {
    return `<article class="story-card">
      <div class="story-card__top"><span>${String(index + 1).padStart(2, "0")} / THE DISPATCH</span><span aria-hidden="true">✳</span></div>
      <p class="story-category">${visualMark(article)}${escapeHTML(article.category || "Uncategorized")}</p>
      <h3><a href="${articleURL(article)}">${escapeHTML(article.title || "Untitled story")}</a></h3>
      <p class="story-deck">${escapeHTML(article.deck || "")}</p>
      <div class="story-card__foot"><span>${escapeHTML(formatDate(article.date))}</span><a href="${articleURL(article)}" aria-label="Read ${escapeHTML(article.title || "Untitled story")}">READ <span aria-hidden="true">↗</span></a></div>
    </article>`;
  }

  if (page === "home") {
    const featured = articles.slice(0, 3);
    let current = 0;
    const nextButton = document.getElementById("next-feature");
    function showFeature() {
      const article = featured[current];
      if (!article) {
        document.getElementById("feature-copy").innerHTML = `<p class="lead-overline">YODEL · CINCINNATI</p><h1 id="lead-heading">No stories are available in this edition.</h1><p class="lead-deck">The local story file is empty or unavailable.</p>`;
        document.getElementById("feature-counter").textContent = "00 / 00";
        document.getElementById("feature-link").hidden = true;
        nextButton.disabled = true;
        document.getElementById("feature-meta").textContent = "";
        return;
      }
      document.getElementById("feature-counter").textContent = `${String(current + 1).padStart(2, "0")} / ${String(featured.length).padStart(2, "0")}`;
      document.getElementById("feature-copy").innerHTML = `<p class="lead-overline">${escapeHTML(String(article.category || "UNCATEGORIZED").toUpperCase())} · CINCINNATI</p><h1 id="lead-heading">${escapeHTML(article.title || "Untitled story")}</h1><p class="lead-deck">${escapeHTML(article.deck || "")}</p>`;
      document.getElementById("feature-link").href = articleURL(article);
      document.getElementById("feature-link").hidden = false;
      document.getElementById("feature-meta").textContent = `BY ${String(article.author || "YODEL").toUpperCase()} · ${Number.isFinite(article.minutes) ? article.minutes : 1} MIN READ`;
    }
    nextButton.addEventListener("click", () => {
      if (!featured.length) return;
      current = (current + 1) % featured.length;
      showFeature();
    });
    showFeature();
    document.getElementById("latest-stories").innerHTML = articles.length
      ? articles.slice(1, 5).map(storyCard).join("")
      : `<p class="empty-results">No stories are available in this edition.</p>`;
  }

  if (page === "archive") {
    const search = document.getElementById("story-search");
    const filter = document.getElementById("category-filter");
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category");
    if (requestedCategory && [...filter.options].some((option) => option.value === requestedCategory)) {
      filter.value = requestedCategory;
    }
    search.value = params.get("q") || "";
    const clearButton = document.getElementById("clear-filters");
    clearButton.addEventListener("click", () => {
      search.value = "";
      filter.value = "";
      search.focus();
      renderArchive();
    });
    function syncURL() {
      if (window.location.protocol === "file:") return;
      const url = new URL(window.location.href);
      if (filter.value) url.searchParams.set("category", filter.value);
      else url.searchParams.delete("category");
      if (search.value.trim()) url.searchParams.set("q", search.value.trim());
      else url.searchParams.delete("q");
      window.history.replaceState(window.history.state, "", url);
    }
    function renderArchive() {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = articles.filter((article) =>
        (!filter.value || article.category === filter.value) &&
        (!query || [article.title, article.deck, article.category, ...(Array.isArray(article.paragraphs) ? article.paragraphs : [])]
          .filter((text) => typeof text === "string")
          .some((text) => text.toLocaleLowerCase().includes(query)))
      );
      document.getElementById("archive-stories").innerHTML = matches.map((article, index) =>
        `<article class="archive-item"><span class="archive-item__number">${String(index + 1).padStart(2, "0")}</span><div><p class="story-category">${visualMark(article)}${escapeHTML(article.category || "Uncategorized")} <span>· ${escapeHTML(formatDate(article.date))}</span></p><h3><a href="${articleURL(article)}">${escapeHTML(article.title || "Untitled story")}</a></h3><p>${escapeHTML(article.deck || "")}</p></div><a class="archive-item__arrow" href="${articleURL(article)}" aria-label="Read ${escapeHTML(article.title || "Untitled story")}">↗</a></article>`
      ).join("");
      document.getElementById("result-count").textContent = `${matches.length} ${matches.length === 1 ? "story" : "stories"} found`;
      document.getElementById("empty-detail").textContent = query
        ? `No stories match “${search.value.trim()}”${filter.value ? ` in ${filter.value}` : ""}.`
        : filter.value
          ? `No stories match the ${filter.value} department.`
          : "No stories are available in this edition.";
      document.getElementById("empty-results").hidden = matches.length !== 0;
      syncURL();
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
      document.querySelector('meta[name="description"]').content = "This story is unavailable. Browse Yodel's dispatches.";
      container.innerHTML = `<div class="not-found"><span class="small-label">404 / LOST IN THE PRINT ROOM</span><h1>That story isn't in this edition.</h1><p>The link may be out of date, or the story may be entirely too fictional.</p><a class="button button--dark" href="archive.html">Browse all stories <span aria-hidden="true">↗</span></a></div>`;
    } else {
      const title = article.title || "Untitled story";
      const deck = article.deck || "This story's summary is unavailable.";
      document.title = `${title} — Yodel`;
      document.querySelector('meta[name="description"]').content = `${deck} A Yodel dispatch.`;
      const related = [
        ...articles.filter((item) => item.id !== article.id && item.category === article.category),
        ...articles.filter((item) => item.id !== article.id && item.category !== article.category)
      ].slice(0, 2);
      const paragraphs = Array.isArray(article.paragraphs) ? article.paragraphs.filter((paragraph) => typeof paragraph === "string") : [];
      container.innerHTML = `<article class="article-layout">
        <header class="article-header"><p class="story-category">${visualMark(article)}${escapeHTML(article.category || "Uncategorized")} <span> / YODEL DISPATCH</span></p><h1>${escapeHTML(title)}</h1><p class="article-deck">${escapeHTML(deck)}</p><div class="article-byline"><span>BY <strong>${escapeHTML((article.author || "Yodel").toUpperCase())}</strong></span><span>${escapeHTML(formatDate(article.date))}</span><span>${Number.isFinite(article.minutes) ? article.minutes : 1} MIN READ</span><span class="article-credit">AI-GENERATED · HUMAN APPROVED</span></div></header>
        <div class="article-body"><div class="article-column"><div class="article-location"><span>DATELINE</span> ${escapeHTML(article.location || "LOCATION UNAVAILABLE")}</div>
          ${paragraphs.length ? paragraphs.map((paragraph, index) => `<p${index === 0 ? ' class="first-paragraph"' : ""}>${escapeHTML(paragraph).replace(/\n/g, "<br>")}</p>${index === 1 && article.quote ? `<blockquote><span aria-hidden="true">“</span>${escapeHTML(article.quote)}<span aria-hidden="true">”</span></blockquote>` : ""}`).join("") : `<p>The story text is unavailable.</p>`}
          <div class="article-endmark" aria-hidden="true">✳</div>
        </div><aside class="article-aside"><div class="aside-stamp">Y<span>.</span></div><p class="small-label">FROM THE YODEL DESK</p><p>A real city. An imaginary story. Read with a grain of salt, preferably beside some crackers.</p><a href="archive.html?category=${encodeURIComponent(article.category || "")}">More in ${escapeHTML(article.category || "all departments")} <span aria-hidden="true">↗</span></a></aside></div>
      </article><section class="related-section" aria-labelledby="related-heading"><div class="section-heading"><div><span class="small-label">KEEP TURNING THE PAGE</span><h2 id="related-heading">Elsewhere in Yodel<span class="heading-period">.</span></h2></div><a class="underlined-link" href="archive.html">All stories <span aria-hidden="true">↗</span></a></div><div class="story-grid story-grid--two">${related.map(storyCard).join("")}</div></section>`;
    }
  }
})();
