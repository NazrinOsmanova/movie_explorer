const apiKey = '403de3afda6bf5657358be8ab81e3ba2';
const BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ERROR_POSTER = '../img/error_poster.PNG';

let page = 1;
let isLoading = false;

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const items = document.querySelector(".items");
const searchInput = document.querySelector("header input");
const genreSelect = document.getElementById("genreSelect");
const sortSelect = document.getElementById("sortSelect");

function getPosterUrl(posterPath) {
    return posterPath ? `${POSTER_BASE_URL}${posterPath}` : ERROR_POSTER;
}

function truncateTitle(title, maxLength = 20) {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
}

function createMovieElement(movie, showFavorites = true, showRating = false) {
    const newDiv = document.createElement('div');
    newDiv.classList.add("item");
    newDiv.setAttribute("data-id", movie.id);

    const posterUrl = getPosterUrl(movie.poster_path);
    const title = truncateTitle(movie.title);
    const year = movie.release_date ? movie.release_date.split("-")[0] : 'N/A';

    newDiv.innerHTML = `
        <div>
            <img src="${posterUrl}" alt="${title}" loading="lazy">
        </div>
        <div>
            <h2>${title}</h2>
            ${showRating ? `<p>⭐ ${movie.vote_average}</p>` : ''}
            ${showFavorites ? `
                <button class="addToFav">Add to Favorites
                    <span>❤︎</span>
                </button>
                <button 
                    class="myBtn" 
                    data-title="${movie.title}" 
                    data-poster="${posterUrl}"
                    data-overview="${movie.overview || 'Məlumat yoxdur'}"
                    data-year="${year}"
                    data-vote="${movie.vote_average}">
                    View Details
                </button>
            ` : ''}
        </div>
    `;
    return newDiv;
}

function showError(message) {
    items.innerHTML = `<p class="error">${message}</p>`;
}

async function fetchMovies(pageNumber, append = true) {
    if (isLoading) return;

    isLoading = true;
    const url = `${BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const movies = data.results;

        if (!append) {
            items.innerHTML = "";
        }

        const fragment = document.createDocumentFragment();
        movies.forEach(movie => {
            fragment.appendChild(createMovieElement(movie));
        });
        items.appendChild(fragment);

        markFavoritesClicked();

    } catch (error) {
        console.error("Error fetching data:", error);
        showError("Filmlər yüklənərkən xəta baş verdi");
    } finally {
        isLoading = false;
    }
}

async function fetchGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const fragment = document.createDocumentFragment();
        data.genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            fragment.appendChild(option);
        });
        genreSelect.appendChild(fragment);

    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

async function fetchMoviesByGenre(genreId) {
    const url = `${BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${genreId}&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        items.innerHTML = "";
        const fragment = document.createDocumentFragment();
        data.results.forEach(movie => {
            fragment.appendChild(createMovieElement(movie, false));
        });
        items.appendChild(fragment);

    } catch (error) {
        console.error("Error fetching by genre:", error);
        showError("Janr üzrə filmlər yüklənərkən xəta baş verdi");
    }
}

async function fetchMoviesSorted(order = "desc") {
    const url = `${BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=vote_average.${order}&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        items.innerHTML = "";
        const fragment = document.createDocumentFragment();
        data.results.forEach(movie => {
            fragment.appendChild(createMovieElement(movie, false, true));
        });
        items.appendChild(fragment);

    } catch (error) {
        console.error("Error fetching sorted movies:", error);
        showError("Sıralanmış filmlər yüklənərkən xəta baş verdi");
    }
}

async function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        items.innerHTML = "";
        const movies = data.results;

        if (movies.length === 0) {
            items.innerHTML = "<p>Heç bir nəticə tapılmadı</p>";
            return;
        }

        const fragment = document.createDocumentFragment();
        movies.forEach(movie => {
            fragment.appendChild(createMovieElement(movie));
        });
        items.appendChild(fragment);

    } catch (error) {
        console.error("Error fetching search results:", error);
        showError("Axtarış zamanı xəta baş verdi");
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addToFavorites(movie) {
    const favorites = getFavorites();

    if (!favorites.some(fav => fav.id === movie.id)) {
        favorites.push(movie);
        saveFavorites(favorites);
        console.log("Favoritlərə əlavə olundu:", movie.title);
    } else {
        console.log("Artıq favoritlərdə var:", movie.title);
    }
}

function markFavoritesClicked() {
    const favorites = getFavorites();

    favorites.forEach(fav => {
        const itemDiv = document.querySelector(`.item[data-id="${fav.id}"]`);
        if (itemDiv) {
            const btnSpan = itemDiv.querySelector("button.addToFav span");
            if (btnSpan) {
                btnSpan.classList.add("clicked");
            }
        }
    });
}

function openModal(btn) {
    const { title, poster, overview, vote, year } = btn.dataset;

    modal.querySelector("h3").textContent = title;
    modal.querySelector("img").src = poster;
    modal.querySelector("img").alt = title;
    modal.querySelector("p:nth-child(1)").textContent = overview;
    modal.querySelector("p:nth-child(2) span").textContent = Number(vote).toFixed(2);
    modal.querySelector("p:nth-child(3) span").textContent = year;

    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

span.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeModal();
    }
});

searchInput.addEventListener("input", function (e) {
    const query = e.target.value.trim();
    if (query.length > 0) {
        searchMovies(query);
    } else {
        items.innerHTML = "";
        page = 1;
        fetchMovies(page, false);
    }
});

sortSelect.addEventListener("change", function () {
    if (this.value) {
        fetchMoviesSorted(this.value);
    }
});

genreSelect.addEventListener("change", function () {
    const genreId = this.value;
    if (genreId) {
        fetchMoviesByGenre(genreId);
    }
});

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    if (scrollTop + windowHeight >= fullHeight - 100 && !isLoading) {
        page++;
        fetchMovies(page);
    }
});

items.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.classList.contains("myBtn")) {
        openModal(btn);
    }

    if (btn.classList.contains("addToFav")) {
        const span = btn.querySelector("span");
        if (span) span.classList.add("clicked");

        const itemDiv = btn.closest(".item");
        const movie = {
            id: itemDiv.dataset.id,
            title: itemDiv.querySelector("h2").textContent,
            poster: itemDiv.querySelector("img").src,
        };

        addToFavorites(movie);
    }
});

fetchMovies(page, false);
fetchGenres();