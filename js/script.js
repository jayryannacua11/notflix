const global = {
    currentPage: window.location.pathname,
    search: {
      term: '',
      type: '',
      page: 1,
      totalPages: 1,
      totalResults: 0
    },
    api: {
      apiKey: 'fa655dac15a0e0ac78a594ef5d945bcc',
      apiUrl: 'https://api.themoviedb.org/3/'
    }
}

const displayPopularMovies = async () => {
    const {results} = await fetchAPIData('movie/popular');

    results.forEach(movie => {
        const movieEl = document.createElement('div');
        const formattedDate = formatDate(movie.release_date);

        movieEl.classList.add('card');
        movieEl.innerHTML = 
        `        
          <a href="movie-details.html?id=${movie.id}">
            ${
                movie.poster_path ? 
                `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
                />`
                :
                `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${formattedDate}</small>
            </p>
          </div>
        `;

        document.querySelector('#popular-movies').appendChild(movieEl);
    });
} 

// Display tv shows
const displayPopularShows = async () => {
    const {results} = await fetchAPIData('tv/popular');

    results.forEach(show => {
        const showEl = document.createElement('div');
        const formattedDate = formatDate(show.first_air_date);

        showEl.classList.add('card');
        showEl.innerHTML = 
        `        
          <a href="tv-details.html?id=${show.id}">
            ${
                show.poster_path ? 
                `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />`
                :
                `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${formattedDate}</small>
            </p>
          </div>
        `;

        document.querySelector('#popular-shows').appendChild(showEl);
    });
} 

// Display Movie Details
const displayMovieDetails = async () => {
    const movieID = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieID}`);
    const formattedDate = formatDate(movie.release_date);

    // Overlay for background image
    displayImageOverlay('movie', movie.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
            <div class="details-top">
            <div>
                ${
                    movie.poster_path ? 
                    `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"
                    />`
                    :
                    `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.title}"
                    />`
                }
            </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${formattedDate}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => {
                return `<li>${genre.name}</li>`
              }).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${movie.budget !== 0 ? `$${formatMoney(movie.budget)}` : 'N/A'}</li>
            <li><span class="text-secondary">Revenue:</span> ${movie.revenue !== 0 ? `$${formatMoney(movie.revenue)}`: 'N/A'}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
        </div>`;

        document.querySelector('#movie-details').appendChild(div);
}

// Display Show Details
const displayShowDetails = async () => {
    const showID = window.location.search.split('=')[1];
    const show = await fetchAPIData(`tv/${showID}`);
    const formattedDate = formatDate(show.last_air_date);

    // Overlay for background image
    displayImageOverlay('tv', show.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
            <div class="details-top">
            <div>
                ${
                    show.poster_path ? 
                    `<img
                    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}"
                    />`
                    :
                    `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                    />`
                }
            </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${formattedDate}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => {
                return `<li>${genre.name}</li>`
              }).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episodes: </span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode to Air: </span> Season ${show.last_episode_to_air.season_number} - ${show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
        </div>`;

        document.querySelector('#show-details').appendChild(div);
}

const search = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let inputSearch = document.querySelector('#search-term');

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (!global.search.term){
    showAlert('Please enter a valid input', 'alert-error');
    return;

    // inputSearch.classList.add('input-error');
    // return;
  }

  const {results, total_pages, page, total_results} = await searchAPIData();

  global.search.page = page;
  global.search.totalPages = total_pages;
  global.search.totalResults = total_results;

  if (results.length === 0){
    showAlert('No reults found', 'alert-error');
    return;
  }

  displaySearchResult(results);
  inputSearch.value = '';
    
}

const displaySearchResult = (results) => {
  // Clear Previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = 
    `        
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${
            result.poster_path ? 
            `<img
            src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`
            :
            `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === 'movie' ? formatDate(result.release_date) : formatDate(result.first_air_date)}</small>
        </p>
      </div>
    `;

    document.querySelector('#search-results-heading').innerHTML = `<h2>${results.length} of ${global.search.totalResults} results for "${global.search.term}"</h2>`

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

// Create & Display Pagination for Search
const displayPagination = () => {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  
  document.querySelector('#pagination').appendChild(div);
  let prevBtn = document.querySelector('#prev');
  let nextBtn = document.querySelector('#next');

  // Disable prev button if on first page
  if (global.search.page === 1){
    // document.querySelector('#prev').disabled = true;
    prevBtn.disabled = true;
  }

  // Disable prev button if on first page
  if(global.search.page === global.search.totalPages){
    // document.querySelector('#next').disabled = true;
    nextBtn.disabled = true;
  }

  // Next Page
  nextBtn.addEventListener('click', async () => {
    global.search.page++;

    await new Promise(resolve => setTimeout(resolve, 500));

    const { results, total_pages } = await searchAPIData();
    displaySearchResult(results);

    scrollToTop();
  });

  // Previous Page
  prevBtn.addEventListener('click', async () => {
    global.search.page--;

    await new Promise(resolve => setTimeout(resolve, 500));

    const { results, total_pages } = await searchAPIData();
    displaySearchResult(results);

    scrollToTop();
  });

}

const scrollToTop = () => {
  const searchInput = document.querySelector('#search-term');
  if (searchInput) {
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Show Alert
const showAlert = (message, className) => {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);
  
  setTimeout(() => alertEl.remove(), 3000)
}

// Display Slider Movies
const displaySlider = async () => {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  })
}

const initSwiper = () => {
  const swiper = new Swiper('.swiper', {
    // on: {
    //   init: () => {
    //     equalizeSwiperImageHeights();
    //   }
    // },
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: false,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    },
  })
}

// async function equalizeSwiperImageHeights() {
//   const images = Array.from(document.querySelectorAll('.swiper img'));

//   // Reset all image heights
//   images.forEach(img => {
//       img.style.height = 'auto';
//   });

//   // Wait for all images to be loaded
//   await Promise.all(images.map(img => {
//       return new Promise(resolve => {
//           if (img.complete) {
//               resolve();
//           } else {
//               img.onload = resolve;
//               img.onerror = resolve;
//           }
//       });
//   }));

//   // Find the tallest image
//   let maxHeight = 0;
//   images.forEach(img => {
//       maxHeight = Math.max(maxHeight, img.offsetHeight);
//   });

//   // Set all image heights
//   images.forEach(img => {
//       img.style.height = `${maxHeight}px`;
//   });
// }

// Display Backdrop on details pages
const displayImageOverlay = (type, bgpath) => {
    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('bg-overlay');
    overlayDiv.style.backgroundImage = `url(https://images.tmdb.org/t/p/original/${bgpath})`;

    if (type === 'movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv);
    }

    if (type === 'tv'){
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

const formatDate = date => 
    new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const formatMoney = money => money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


// Fetch data from TMDBAPI
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    hideSpinner();

    return data = await response.json();
}

// Make Request to Search
async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner();

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

    const data = await response.json();
    
    hideSpinner();

    return data;
}

const showSpinner = () => {
    document.querySelector('.spinner').classList.add('show');
}

const hideSpinner = () => {
    document.querySelector('.spinner').classList.remove('show');
}

// Highlight active link
const activeNav = () => {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    });

}

// Init App
function init(){
    switch(global.currentPage) {
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            break;
        case '/shows':
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details':
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details':
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search':
        case '/search.html':
            search();
            break;
    }

    activeNav();
}

document.addEventListener('DOMContentLoaded', init);
// window.addEventListener('resize', () => {
//     clearTimeout(window.__equalizeTimer);
//     window.__equalizeTimer = setTimeout(equalizeSwiperImageHeights, 100);
// });