const watchlistCardList = JSON.parse(localStorage.getItem('cardDetails'));
const posterPath = "https://image.tmdb.org/t/p/w1280";
const grid = document.querySelector(".grid");
let itemId = null;

function sendButtonId(buttonId) {
    itemId = buttonId;
    localStorage.setItem('itemId', itemId)
}

const displayWatchlistCards = (watchlistCardList) => {
    grid.innerHTML = "";
    watchlistCardList.forEach(watchlistCard => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridItem.innerHTML = `<img src="${posterPath + watchlistCard.posterPath}" alt="">
        <span class="material-icons-outlined bookmark">bookmark_added</span>
        <div class="overlay">
            <div class="title-rating flex">
                <h2 title="${watchlistCard.title}">${watchlistCard.title}</h2>
                <p>${watchlistCard.voteAverage.toFixed(1)}</p>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                <p>${watchlistCard.overview}</p>
            </div>
        </div>
        <a href="movie.html" class="card-btn" data-id="${watchlistCard.id}"></a>`;
        grid.appendChild(gridItem);
        const bookmark = gridItem.querySelector('.bookmark');
        bookmark.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card button click event from firing
            toggleBookmark(watchlistCard.id); // Toggle bookmarked state
        });
        bookmark.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card button click event from firing
            storeCardDetails(watchlistCard);
        });
    });
    const watchlistCardButtons = document.querySelectorAll(".card-btn");
        watchlistCardButtons.forEach((button)=>{
            button.addEventListener("click", function(){
            const buttonId = button.dataset.id;
            sendButtonId(buttonId);
        });
    });
}

const storeCardDetails = (cardDetails) => {
    // Retrieve existing card details array from local storage or create a new one
    let cardDetailsArray = JSON.parse(localStorage.getItem('cardDetails'));
    
    // Check if the card is already stored in the array
    const index = cardDetailsArray.findIndex(card => card.id === cardDetails.id);
        cardDetailsArray.splice(index, 1);
    // Save updated card details array back to local storage
    localStorage.setItem('cardDetails', JSON.stringify(cardDetailsArray));
    //setTimeout(function(){
        location.reload();
    //}, 1000);
}
const toggleBookmark = (movieId) => {
    let bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedIds'));
    
    const index = bookmarkedIds.indexOf(movieId);
    //if (index === -1) {
        // Movie ID not found in the bookmarked IDs list, so add it
       // bookmarkedIds.push(movieId);
    //} else {
        // Movie ID found in the bookmarked IDs list, so remove it
        bookmarkedIds.splice(index, 1);
    //}
    localStorage.setItem('bookmarkedIds', JSON.stringify(bookmarkedIds));
}

displayWatchlistCards(watchlistCardList);
export { itemId, sendButtonId };
