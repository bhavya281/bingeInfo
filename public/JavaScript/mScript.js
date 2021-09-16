const API_URL_MOVIES = 'https://api.themoviedb.org/3/discover/movie?api_key=137bc42109a9931aa754bc9cfe372f53&language=en-US'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'

const main = document.getElementById('movieMain')
const tagsEl = document.getElementById('tags')
const option = document.getElementById('option')

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastURL = '';
var totalPages = 100;

const genres = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
]
var selectedGenre = []
setGenres();
function setGenres() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id)
            }
            else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL_MOVIES + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            highlightSelection()
        })
        tagsEl.append(t);
    })
}
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    clearBtn();
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
}
function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight');
    } else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = "clear";
        clear.innerText = "Clear x";
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenres();
            option.value = "popularity.desc"
            getMovies(API_URL_MOVIES);
        })
        tagsEl.append(clear);
    }
}
// Get initial movies
getMovies(API_URL_MOVIES)
async function getMovies(url) {
    lastURL = url;
    const res = await fetch(url)
    const data = await res.json()
    if (data.results.length != 0) {
        showMovies(data.results)
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;
        if (currentPage <= 1) {
            prev.classList.add('disabled');
            next.classList.remove('disabled');
        } else if (currentPage >= totalPages) {
            prev.classList.remove('disabled');
            next.classList.add('disabled');
        } else {
            prev.classList.remove('disabled');
            next.classList.remove('disabled');
        }

    } else {
        main.innerHTML = `<h1 class="no-result">No Result Found</h1>`
    }
}
function showMovies(movies) {
    main.innerHTML = ''
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
        `
        main.appendChild(movieEl)
    })
}
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}
prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})
next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
})
function pageCall(page) {
    let urlSplit = lastURL.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'page') {
        let url = lastURL + "&page=" + page;
        getMovies(url)
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
    document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
}
option.addEventListener('change', setSort)
function setSort() {
    let urlSplit = lastURL.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'sort_by') {
        let url = lastURL + "&sort_by=" + option.value;
        getMovies(url)
    } else {
        key[1] = option.value;
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
}
