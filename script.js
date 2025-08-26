// https://jsonfakery.com/movies/infinite-scroll
// https://jsonfakery.com/movies-list

// async function fetchPaginatedMovies() {
//     const url = 'https://jsonfakery.com/movies/paginated';
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data.data);  // Paginated response data
//     } catch (error) {
//         console.error('Error fetching paginated movies:', error.message);
//     }
// }

// fetchPaginatedMovies();


// https://www.omdbapi.com/?s=godfather&apikey=1ef7ec0e



// async function fetchPaginatedMovies2() {
//     const url = 'http://www.omdbapi.com/?i=tt3896198&apikey=1ef7ec0e';
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data.data);  // Paginated response data
//     } catch (error) {
//         console.error('Error fetching paginated movies:', error.message);
//     }
// }

// fetchPaginatedMovies2();
// http://www.omdbapi.com/?apikey=[1ef7ec0e]&

// fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1ef7ec0e`)
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => console.error(error));


// fetch(`http://www.omdbapi.com/?apikey=[1ef7ec0e]&`)
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => console.error(error));



// fetch('http://www.omdbapi.com/?i=tt3896198&apikey=1ef7ec0e')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data); // bütün gələn məlumatı konsola yazdırır
//   })
//   .catch(error => console.error('Xəta baş verdi:', error));



//   fetch('http://www.omdbapi.com/?s=batman&apikey=1ef7ec0e') // Burada "batman" əvəzinə hər hansı digər film adını da verə bilərsən
//   .then(response => response.json()) // JSON olaraq parse edirik
//   .then(data => {
//     if (data.Search) {
//       console.log(data.Search); // Bütün filmlərin siyahısını konsola yazdırırıq
//     } else {
//       console.log('Heç bir film tapılmadı');
//     }
//   })
//   .catch(error => console.error('Xəta baş verdi:', error));



//   I'm find some a good api for personal movie site. The url: https://developer.themoviedb.org/docs. 