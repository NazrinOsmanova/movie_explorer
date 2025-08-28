const items = document.querySelector(".items");

function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    items.innerHTML = "";

    if (favorites.length === 0) {
        items.innerHTML = "<p>No favorites yet...</p>";
        return;
    }

    favorites.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.setAttribute("data-id", movie.id);
        div.innerHTML = `
      <div>
        <img src="${movie.poster}" alt="${movie.title}">
      </div>
      <div>
        <h2>${movie.title}</h2>
        
        <button class="removeFav">Remove ❌</button>
      </div>
    `;
        items.appendChild(div);
    });
}

items.addEventListener("click", function (e) {
    if (e.target.classList.contains("removeFav")) {

        const movieId = e.target.closest(".item").dataset.id;
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites = favorites.filter(fav => fav.id != movieId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
    }
});

loadFavorites();

let modal = document.getElementById("myModal");

let span = document.getElementsByClassName("close")[0];

span.addEventListener("click", function () {
    modal.style.display = "none";
})

window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
})

items.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.classList.contains("myBtn")) {
        const title = btn.dataset.title;
        const poster = btn.dataset.poster;
        const overview = btn.dataset.overview;
        const year = btn.dataset.year;

        document.querySelector("#myModal h3").textContent = title;
        document.querySelector("#myModal img").src = poster;
        document.querySelector("#myModal img").alt = title;
        document.querySelector("#myModal p:nth-child(1)").textContent = overview;
        document.querySelector("#myModal p:nth-child(3) span").textContent = year;

        modal.style.display = "block";
    }
});

// localStorage.clear();