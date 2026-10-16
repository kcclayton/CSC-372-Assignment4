# Assignment 4 (Fetch)
## TVmaze Show Gallery
Build a searchable TV show gallery with HTML, CSS, and JavaScript. Use the Fetch API to search TVmaze for shows and display matching results. You will practice making a request, working with JSON, making a second request for related data, and updating a page from user input.

### Objectives
- Use `fetch()` to request and process JSON data.
- Use a second fetch request to retrieve cast information for each show.
- Update the page when a visitor submits a search.
- Display results in a responsive gallery built with Flexbox.
- Handle missing data, empty results, and request errors.

### What to build
Create a search field where a visitor can enter a show title or keyword. Display up to 10 matching shows as cards in a flex container. Each card should include:

- The show name
- A short summary, with any HTML markup removed
- The premiere date, when available
- The date and time the show record was last updated
- Genres and average rating, when available
- A short list of main cast members, loaded with an additional fetch request
- A link to the show page on TVmaze

You may choose the page’s visual style. You may also include the show poster when one is available; provide useful alternative text for each poster. Some show data may be missing, so display a clear fallback such as “Not available” instead of null, undefined, or a broken image.

### API resources
TVmaze provides a free public API that returns JSON. Its public endpoints support browser requests and do not require an API key. Read the (official TVmaze API documentation)[https://www.tvmaze.com/api] before you begin.

| TVmaze endpoints used in this assignment                               |
|------------------------------------------------------------------------|
| Purpose                | Endpoint pattern                              |
| Search for shows       | `https://api.tvmaze.com/search/shows?q=QUERY` |
| Get a show’s main cast | `https://api.tvmaze.com/shows/SHOW_ID/cast`   |

Replace `QUERY` with the visitor’s search text and `SHOW_ID` with the ID of a matching show. Encode user-entered text for use in a URL. The search endpoint returns an array of matches, with each show’s data under its `show` property. The cast endpoint returns people and their characters. Use each show’s ID to make the second request and display the cast names on that show’s card.

### Required behavior checklist
- When the page first loads, search for a default show or keyword of your choice and display the results.
- When the visitor submits a new search, replace the current gallery with results for that search.
- Display no more than 10 matching shows. TVmaze search results are ranked by relevance, not by most recent update.
- Handle an empty search, a search with no matches, and a failed request. Show a useful message instead of leaving a blank or stale gallery.
- Use a flex container so gallery cards wrap at different viewport widths.
- Include a visible attribution link to TVmaze. Its public API is licensed under CC BY-SA and requires source credit; review the (TVmaze licensing terms)[https://www.tvmaze.com/api#licensing].

### Implementation notes
- Use `fetch()` and check the response status before calling `json()`. Handle network and HTTP errors.
- A show summary may contain HTML. Convert it to readable text before inserting it into the page. Avoid inserting API-provided text with `innerHTML`.
    - use `createElement()`.
- Some shows have no cast entries, summary, rating, date, or poster. Make sure the card still renders correctly when optional data is missing.
- The API may return HTTP 429 when its rate limit is exceeded. Avoid unnecessary repeat requests and show an appropriate message if a request is limited.

### Reference examples
(TVmaze show search example)[https://api.tvmaze.com/search/shows?q=girls].
(TVmaze show cast example)[https://api.tvmaze.com/shows/1/cast].