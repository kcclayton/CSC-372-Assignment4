# TVmaze Gallery

A responsive TV show search gallery built with HTML, CSS, and vanilla JavaScript. It uses the [TVmaze API](https://www.tvmaze.com/api) to find shows and present their details.

## Features

- Searches TVmaze and displays up to 10 relevant results.
- Builds a card for each show with its poster, summary, genres, rating, premiere and end dates, last-updated date, and TVmaze link.
- Loads up to five main cast members per show, showing a placeholder while cast data loads or when it is unavailable.
- Handles missing poster images, failed requests, and API rate limiting.
- Uses a responsive grid layout and supports keyboard-visible focus states.

## Run locally

No package installation or build step is required. Open `index.html` in a browser, or serve the project directory with a local static web server. An internet connection is required to retrieve show and cast data from TVmaze.

## Project files

- `index.html` — page structure and search form.
- `style.css` — responsive gallery and card styling.
- `script.js` — TVmaze search, result cards, and cast loading.

Show data is provided by TVmaze. See the attribution link in the page footer.
