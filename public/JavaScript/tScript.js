var mybutton = document.getElementById("myBtn");
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
const API_URL = 'https://api.themoviedb.org/3/trending/all/day?api_key=137bc42109a9931aa754bc9cfe372f53&language=en-US'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/multi?api_key=137bc42109a9931aa754bc9cfe372f53&language=en-US&query="'

const main = document.getElementById('trendingMain')
const form = document.getElementById('form')
const search = document.getElementById('search')

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastURL = '';
var totalPages = 100;

// Get initial trendings
getTrending(API_URL)

async function getTrending(url) {
    lastURL = url;
    const res = await fetch(url)
    const data = await res.json()
    if (data.results.length != 0) {
        showTrending(data.results)
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
function showTrending(trendings) {
    main.innerHTML = ''

    trendings.forEach((trending) => {
        const { name, title, poster_path, vote_average, overview } = trending

        const trendingEl = document.createElement('div')
        trendingEl.classList.add('trending')

        trendingEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${trendingTitle(title, name)}">
            <div class="trending-info">
          <h3>${trendingTitle(title, name)}<br>
          <span class="type">${classification(title, name)}</span></h3 >
    <span class="${getClassByRate(vote_average)} vote">${vote_average}</span>
            </div >
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>
        `
        main.appendChild(trendingEl)
    })
}
function classification(title, name) {
    if (title === undefined) {
        return "Series"
    }
    else {
        return "Movie"
    }
}
function trendingTitle(title, name) {
    if (title === undefined) {
        return name
    }
    else {
        return title
    }
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
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    if (searchTerm && searchTerm !== '') {
        getTrending(SEARCH_API + searchTerm)
        search.value = ''
        document.getElementById("heading").innerHTML = `<br><br>Search result for the  <span class="search-result">${searchTerm}</span>`;
        document.getElementById('section').scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.reload()
    }
})
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
        getTrending(url)
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getTrending(url);
    }
    document.getElementById('heading').scrollIntoView({ behavior: 'smooth' });
}
