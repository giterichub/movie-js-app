const itemId = localStorage.getItem('itemId');
// You can use itemId here or perform any other logic based on its value
const apiurl = "https://api.themoviedb.org/3/movie/"+itemId+"/credits?language=en-US&api_key=b5267f139048a97aef935f88cd81dcc5";
const detailUrl = "https://api.themoviedb.org/3/movie/"+itemId+"?language=en-US&api_key=b5267f139048a97aef935f88cd81dcc5";
const similarUrl = "https://api.themoviedb.org/3/movie/"+itemId+"/similar?language=en-US&page=1&api_key=b5267f139048a97aef935f88cd81dcc5";
const posterPath = "https://image.tmdb.org/t/p/w1280";
const allContent = document.querySelector(".all-content");
const sliderContainer = document.querySelector(".slider-container");
const slider = document.querySelector(".slider");

const getCastDetail = async (apis) => {
    try {
        const response = await fetch(apis);
        const data = await response.json();
        const castInfo = data;
        return castInfo;
    } catch (error) {
        console.error("Error fetching cast details:", error);
        return []; // Return an empty array in case of error
    }
}

const getMovieDetail = async (apis) => {
    try {
        const response = await fetch(apis);
        const datac = await response.json();
        console.log(datac);
        return datac;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return {}; // Return an empty object in case of error
    }
}
const getSimilarMovies = async (apis) => {
    try {
        const response = await fetch(apis);
        const similarMovies = await response.json();
        displaySimilarMovies(similarMovies.results)
        return similarMovies;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return {}; // Return an empty object in case of error
    }
}

function castTenLimit(castData){
    let castNamesArray = [];
    for (let index = 0; index < Math.min(castData.length, 10); index++) {
        castNamesArray.push(castData[index].name); 
    }
    return castNamesArray.join(", ");
}


function genreDisplay(genreData){
    let genreArray = [];
    genreData.forEach(genreItem => {
        genreArray.push(genreItem.name);
    });
     return genreArray.join(", ");
}

function castDirector(crewList) {
    const directors = crewList.filter(({ job }) => job === "Director");
  
    const directorList = [];
    for (const { name } of directors) directorList.push(name);
    return directorList.join(", ");
  };

  
(async () => {
    try {
        const castInfo = await getCastDetail(apiurl);
        const datac = await getMovieDetail(detailUrl);
        // Now you can use castInfo and datac to populate your HTML content
        const showMovieDetails = document.createElement("div");
        showMovieDetails.classList.add("movie-details");
        showMovieDetails.innerHTML = `<div class="background-overlay" style="background-image: url('${'https://image.tmdb.org/t/p/w1280'+datac.backdrop_path}');"></div>
        <img src="${'https://image.tmdb.org/t/p/w342'+datac.poster_path}" alt="">
        <div class="movie-content">
            <h1>${datac.original_title}</h1>
            <div class="movie-info mblk-end">
                <div class="ratings">
                    <img src="star.png" alt="">
                    <span class="text-greyed">${datac.vote_average.toFixed(1)}</span>
                </div>
                <div class="separator"></div>
                <p class="text-greyed runtime">${datac.runtime+'m'}</p>
                <div class="separator"></div>
                <p class="text-greyed release-year">${datac.release_date.slice(0,4)}</p>
                <p class="text-prominent badge">PG</p>
            </div>
            <p class="movie-genre text-greyed mblk-end">${genreDisplay(datac.genres)}</p>
            <p class="movie-plot text-prominent mblk-end">${datac.overview}</p>
            <div class="cast-container">
                <div class="cast mblk-end">
                    <p class="text-greyed cast-width">Starring</p>
                    <p class="text-prominent cast-list">${castTenLimit(castInfo.cast)}</p>
                </div>
                <div class="cast mblk-end">
                    <p class="text-greyed cast-width">Directed By</p>
                    <p class="text-prominent crew-list">${castDirector(castInfo.crew)}</p>
                </div>
            </div>
        </div>`;
        allContent.appendChild(showMovieDetails);
        getSimilarMovies(similarUrl);
       
    } catch (error) {
        console.error("Error:", error);
    }
})();
const updateMovieDetails = (movieDetailData, castAndCrewData) => {
    const showMovieDetails = document.querySelector(".movie-details");
    const backgroundImage = document.querySelector(".background-overlay");
    const posterImage = document.querySelector(".movie-details img");
    const movieTitle = document.querySelector(".movie-content h1");
    const ratingScore = document.querySelector(".ratings span");
    const runtime = document.querySelector(".runtime");
    const releaseYear = document.querySelector(".release-year");
    const genre = document.querySelector(".movie-genre");
    const plot = document.querySelector(".movie-plot");
    const cast = document.querySelector(".cast-list");
    const crew = document.querySelector(".crew-list");

    // showMovieDetails.innerHTML = "";
    
    backgroundImage.style.backgroundImage= `url("https://image.tmdb.org/t/p/w1280${movieDetailData.backdrop_path}")`;
    posterImage.src = "https://image.tmdb.org/t/p/w342"+movieDetailData.poster_path;
    movieTitle.innerText = movieDetailData.original_title;
    ratingScore.innerText = movieDetailData.vote_average.toFixed(1);
    runtime.innerText = movieDetailData.runtime+'m';
    releaseYear.innerText = movieDetailData.release_date.slice(0,4);
    genre.innerText = genreDisplay(movieDetailData.genres);
    plot.innerText = movieDetailData.overview;
    cast.innerText = castTenLimit(castAndCrewData.cast);
    crew.innerText = castDirector(castAndCrewData.crew);
}

const displaySimilarMovies = (similarMovieItems) => {
    slider.innerHTML = "";
    similarMovieItems.forEach(similarItem => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridItem.classList.add("similar-item-width");
        gridItem.innerHTML = `<img src="${posterPath + similarItem.poster_path}" alt="">
        <div class="overlay">
            <div class="title-rating flex">
                <h2 title="${similarItem.title}">${similarItem.title}</h2>
                <p>${similarItem.vote_average.toFixed(1)}</p>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                <p class="trial">${similarItem.overview}</p>
            </div>
        </div>
        <a href="movie.html" class="card-btn" data-id="${similarItem.id}"></a>`;
        slider.appendChild(gridItem);
        sliderContainer.appendChild(slider);

        gridItem.querySelector('.card-btn').addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            const clickedMovieId = similarItem.id;
            localStorage.setItem('itemId', clickedMovieId);
            
            // Fetch details of the clicked movie
            const clickedMovieDetailUrl = `https://api.themoviedb.org/3/movie/${clickedMovieId}?language=en-US&api_key=b5267f139048a97aef935f88cd81dcc5`;
            const clickedMovieSimilarUrl = `https://api.themoviedb.org/3/movie/${clickedMovieId}/similar?language=en-US&page=1&api_key=b5267f139048a97aef935f88cd81dcc5`;
            const castandcrewUrl = "https://api.themoviedb.org/3/movie/"+clickedMovieId+"/credits?language=en-US&api_key=b5267f139048a97aef935f88cd81dcc5";

            try {
                const clickedMovieDetailResponse = await fetch(clickedMovieDetailUrl);
                const clickedMovieDetailData = await clickedMovieDetailResponse.json();
                
                const clickedMovieSimilarResponse = await fetch(clickedMovieSimilarUrl);
                const clickedMovieSimilarData = await clickedMovieSimilarResponse.json();

                const castandcrewResponse = await fetch(castandcrewUrl);
                const castandcrewData = await castandcrewResponse.json();
                
                // Update HTML content with the details of the clicked movie and its similar movies
                updateMovieDetails(clickedMovieDetailData, castandcrewData);
                displaySimilarMovies(clickedMovieSimilarData.results);
                
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        });
    });
}
window.addEventListener('DOMContentLoaded', async () => {
    // Check if there is a stored movie ID
    const storedItemId = localStorage.getItem('itemId');
    if (storedItemId) {
        // Fetch details and similar movies for the stored movie ID
        const detailUrl = `https://api.themoviedb.org/3/movie/${storedItemId}?language=en-US&api_key=b5267f139048a97aef935f88cd81dcc5`;
        const similarUrl = `https://api.themoviedb.org/3/movie/${storedItemId}/similar?language=en-US&page=1&api_key=b5267f139048a97aef935f88cd81dcc5`;
        const castandcrewUrl = `https://api.themoviedb.org/3/movie/${storedItemId}/credits?language=en-US&api_key=b5267f139048a97aef935f88cd81dcc5`;

        try {
            const detailResponse = await fetch(detailUrl);
            const detailData = await detailResponse.json();
            
            const similarResponse = await fetch(similarUrl);
            const similarData = await similarResponse.json();
            
            const castandcrewResponse = await fetch(castandcrewUrl);
            const castandcrewData = await castandcrewResponse.json();

            // Update HTML content with the details of the stored movie and its similar movies
            updateMovieDetails(detailData, castandcrewData);
            displaySimilarMovies(similarData.results);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }
});
// Select the button and add an event listener to it
document.querySelector(".next").addEventListener("click", function(){
    const currentScrollPosition = document.querySelector(".slider-container").scrollLeft;
    const newScrollPosition = currentScrollPosition + 800;
    sliderContainer.scrollTo({ left: newScrollPosition, behavior: "smooth" });
});

document.querySelector(".prev").addEventListener("click", function(){
    const currentScrollPosition = document.querySelector(".slider-container").scrollLeft;
    const newScrollPosition = currentScrollPosition - 800;
    sliderContainer.scrollTo({ left: newScrollPosition, behavior: "smooth" });
});
