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
      gallery.append(buildShowCard(show));
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
  const item = document.createElement("li");
  const card = document.createElement("article");
  const title = document.createElement("h3");

  title.textContent = show.name;
  card.append(title);

  if (show.image?.medium) {
    const image = document.createElement("img");
    image.src = show.image.medium;
    image.alt = `${show.name} poster`;
    image.loading = "lazy";
    card.prepend(image);
  }

  if (show.premiered) {
    const premiered = document.createElement("p");
    premiered.textContent = `Premiered ${show.premiered}`;
    card.append(premiered);
  }

  item.append(card);
  return item;
}

function displaySearchError(message) {
  searchStatus.textContent = message;
  searchStatus.classList.add("search-status--error");
}

searchInput.value = DEFAULT_SEARCH;
searchShows(DEFAULT_SEARCH);