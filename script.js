const DEFAULT_SEARCH = "Friends";
const MAX_DISPLAYED_RESULTS = 10;
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#gallery-search");
const searchStatus = document.querySelector(".search-status");
const gallery = document.querySelector(".gallery");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    displaySearchError("Enter a show name before searching.");
    searchInput.focus();
    return;
  }

  searchShows(searchTerm);
});

async function searchShows(searchTerm) {
  searchStatus.classList.remove("search-status--error");
  searchStatus.textContent = `Searching for "${searchTerm}"...`;
  gallery.replaceChildren();

  try {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`,
    );

    if (response.status === 429) {
      console.warn("TVmaze rate limit reached.");
      displaySearchError(
        "Too many searches right now. Please wait a moment and try again.",
      );
      return;
    }

    if (!response.ok) {
      throw new Error(`TVmaze search failed with status ${response.status}.`);
    }

    const results = await response.json();
    console.log("TVmaze search response:", results);
    const displayedResults = results.slice(0, MAX_DISPLAYED_RESULTS);
    displayedResults.forEach(({ show }) => {
      const { item, cast } = buildShowCard(show);
      gallery.append(item);
      loadShowCast(show, cast);
    });

    searchStatus.textContent = displayedResults.length
      ? `Showing ${displayedResults.length}${results.length > displayedResults.length ? ` of ${results.length}` : ""} shows for "${searchTerm}".`
      : `No shows found for "${searchTerm}".`;
  } catch (error) {
    console.error(error);
    displaySearchError("Unable to load shows. Please try again.");
  }
}

function buildShowCard(show) {
  const item = createElement("li");
  const card = createElement("article", { className: "show-card" });

  card.append(buildShowImage(show));
  card.append(buildShowTitle(show));
  card.append(buildShowSummary(show));
  card.append(buildShowGenres(show));
  card.append(buildShowRating(show));
  card.append(buildShowDates(show));
  const cast = buildShowCast();
  card.append(cast.section);

  const link = buildShowLink(show);
  if (link) {
    card.append(link);
  }

  item.append(card);
  return { item, cast: cast.list };
}

function buildShowImage(show) {
  const imageUrl = show.image?.medium;
  const hasPoster = Boolean(imageUrl);
  return createElement(hasPoster ? "img" : "div", {
    className: hasPoster
      ? "show-card__image"
      : "show-card__image show-card__image--placeholder",
    textContent: hasPoster ? undefined : "Poster unavailable",
    attributes: hasPoster
      ? {
          src: imageUrl,
          alt: `${show.name || "Show"} poster`,
          loading: "lazy",
        }
      : { role: "img", "aria-label": "Poster unavailable" },
  });
}

function buildShowTitle(show) {
  return createElement("h3", {
    className: "show-card__title",
    textContent: show.name || "Untitled show",
  });
}

function buildShowSummary(show) {
  const summaryText = show.summary
    ? new DOMParser().parseFromString(show.summary, "text/html").body.textContent.trim()
    : "";
  return createElement("p", {
    className: "show-card__summary",
    textContent: summaryText || "No summary available.",
  });
}

function buildShowGenres(show) {
  return buildShowDetail(
    "Genres",
    show.genres?.length ? show.genres.join(", ") : "Not available",
  );
}

function buildShowRating(show) {
  return buildShowDetail(
    "Rating",
    show.rating?.average == null ? "Not rated" : `${show.rating.average}/10`,
  );
}

function buildShowDates(show) {
  const dates = [show.premiered, show.ended].filter(Boolean).join(" – ");
  return buildShowDetail("Dates", dates || "Not available");
}

function buildShowDetail(label, value) {
  const detail = createElement("p", { className: "show-card__detail" });
  const heading = createElement("strong", { textContent: `${label}: ` });
  detail.append(heading, document.createTextNode(value));
  return detail;
}

function buildShowCast() {
  const section = createElement("section", { className: "show-card__cast" });
  const heading = createElement("h4", { textContent: "Cast" });
  const list = createElement("ul", { className: "show-card__cast-list" });
  const placeholder = createElement("li", { textContent: "Loading cast..." });
  list.append(placeholder);
  section.append(heading, list);

  return { section, list };
}

async function loadShowCast(show, castList) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${show.id}/cast`);
    if (!response.ok) {
      throw new Error(`TVmaze cast request failed with status ${response.status}.`);
    }

    const cast = await response.json();
    castList.replaceChildren();
    if (!cast.length) {
      appendCastPlaceholder(castList, "Cast information unavailable.");
      return;
    }

    cast.slice(0, 5).forEach(({ person, character }) => {
      const name = character?.name
        ? `${person.name} as ${character.name}`
        : person.name;
      castList.append(createElement("li", { textContent: name }));
    });
  } catch (error) {
    console.error(`Unable to load cast for "${show.name}".`, error);
    appendCastPlaceholder(castList, "Cast information unavailable.");
  }
}

function appendCastPlaceholder(castList, message) {
  castList.replaceChildren(createElement("li", { textContent: message }));
}

function buildShowLink(show) {
  if (!show.url) {
    return null;
  }

  return createElement("a", {
    className: "show-card__link",
    textContent: "View on TVmaze",
    attributes: { href: show.url },
  });
}

function createElement(tagName, { className, textContent, attributes = {} } = {}) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  return element;
}

function displaySearchError(message) {
  searchStatus.textContent = message;
  searchStatus.classList.add("search-status--error");
}

searchInput.value = DEFAULT_SEARCH;
searchShows(DEFAULT_SEARCH);