const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#gallery-search");
const searchStatus = document.querySelector(".search-status");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();
  searchStatus.textContent = `Search submitted for "${searchTerm}".`;
});