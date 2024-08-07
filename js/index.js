const apiurl = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&year=2024&api_key=b5267f139048a97aef935f88cd81dcc5";
const posterPath = "https://image.tmdb.org/t/p/w1280";
const searchApi = "https://api.themoviedb.org/3/search/movie?query=";
const grid = document.querySelector(".grid");

let itemId = null;
function cardButtonId(cardId){
    itemId = cardId;
    localStorage.setItem('itemId', itemId);
}

const searchInput = document.querySelector("#search");
searchInput.addEventListener("keyup", async function(event){
    const searchValue = event.target.value;
    (searchValue != "") ? await getMovies(searchApi+searchValue+"&api_key=b5267f139048a97aef935f88cd81dcc5") : 
                          await getMovies(apiurl) 
});

const getMovies = async (apis) => {
    try {
        const response = await fetch(apis);
        const data = await response.json();
        console.log(data);
        displayMovies(data.results);
    }catch (error){
        console.error("Error fetching movies:", error);
    }
}


const displayMovies = (movieItems) => {
    grid.innerHTML = "";
    const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedIds')) || [];
    movieItems.forEach(item => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        const isBookmarked = bookmarkedIds.includes(item.id);
        gridItem.innerHTML = `<img src="${posterPath + item.poster_path}" alt="">
        <span class="material-icons-outlined bookmark ${isBookmarked ? 'bookmarked' : ''}" data-id="${item.id}">${isBookmarked ? 'bookmark_added' : 'bookmark_add'}</span>
        <div class="overlay">
            <div class="title-rating flex">
                <h2 title="${item.title}">${item.title}</h2>
                <p>${item.vote_average.toFixed(1)}</p>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                <p>${item.overview}</p>
            </div>
        </div>
        <a href="movie.html" class="card-btn" data-id="${item.id}"></a>`;
        grid.appendChild(gridItem);
        const bookmark = gridItem.querySelector('.bookmark');
        bookmark.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card button click event from firing
            toggleBookmark(item.id); // Toggle bookmarked state
            displayMovies(movieItems); // Re-render movie cards
        });
        bookmark.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card button click event from firing
            const cardDetails = {
                id: item.id,
                title: item.title,
                voteAverage: item.vote_average,
                overview: item.overview,
                posterPath: item.poster_path
                // Add more properties as needed
            };
            storeCardDetails(cardDetails);
        });
    });

    // Attach event listeners to dynamically created elements
    const cardButtons = document.querySelectorAll('.card-btn');
    cardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = button.dataset.id;
            cardButtonId(itemId);
        });
    });
}

const storeCardDetails = (cardDetails) => {
    // Retrieve existing card details array from local storage or create a new one
    let cardDetailsArray = JSON.parse(localStorage.getItem('cardDetails')) || [];
    
    // Check if the card is already stored in the array
    const index = cardDetailsArray.findIndex(card => card.id === cardDetails.id);
    
    if (index === -1) {
        // Card is not already stored, so add it to the array
        cardDetailsArray.push(cardDetails);
        //document.querySelectorAll(".bookmark")[index].innerText = "bookmark_added";
    } else {
        // Card is already stored, so remove it from the array
        cardDetailsArray.splice(index, 1);
        //document.querySelectorAll(".bookmark")[index].innerText = "bookmark_add";
    }
    // Save updated card details array back to local storage
    localStorage.setItem('cardDetails', JSON.stringify(cardDetailsArray));
}
let sidebar = document.querySelector(".sidebar");
      let closeBtn = document.querySelector(".btn");
      closeBtn.addEventListener("click", ()=>{
        sidebar.classList.toggle("open");
        menuBtnChange();//calling the function(optional)
      });
      let hamBtn = document.querySelector(".hambtn");
      hamBtn.addEventListener("click", ()=>{
        hamBtn.classList.toggle("active");
        sidebar.classList.toggle("open");
        menuBtnChange();
      });
      function menuBtnChange() {
        if(sidebar.classList.contains("open")){
          closeBtn.innerText="close";//replacing the iocns class
          document.querySelector(".grid-container").classList.add("active");
        }else {
            closeBtn.innerText="menu";//replacing the iocns class
            document.querySelector(".grid-container").classList.remove("active");
        }
       }
       
const toggleBookmark = (movieId) => {
    let bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedIds')) || [];
    
    const index = bookmarkedIds.indexOf(movieId);
    if (index === -1) {
        // Movie ID not found in the bookmarked IDs list, so add it
        bookmarkedIds.push(movieId);
    } else {
        // Movie ID found in the bookmarked IDs list, so remove it
        bookmarkedIds.splice(index, 1);
    }
    localStorage.setItem('bookmarkedIds', JSON.stringify(bookmarkedIds));
}
getMovies(apiurl);

export { itemId, cardButtonId };
