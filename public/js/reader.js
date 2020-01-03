var $submitSearch = $("#submitbtn");
//functions on click events 
var readerFormSubmit = function (event) {
    event.preventDefault();
    alert("working");
    // console.log(event);
    var bookSearch = $("#search-text").val();
    console.log(bookSearch);
    // Then run a request with axios to the OMDB API with the movie specifie

};


$submitSearch.on("click", readerFormSubmit);