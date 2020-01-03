



var $submitSearch = $("#submitbtn");
//functions on click events 
var readerFormSubmit = function (event) {
    event.preventDefault();
    // alert("working");
    // console.log(event);
    var bookSearch = $("#search-text").val().trim();
    console.log(bookSearch);
    readerSearch(bookSearch);

};

function readerSearch(bookSearch) {
    var title = bookSearch.replace(/\s/g, "");
    var queryURL = "https://api.nytimes.com/svc/books/v3/reviews.json?title=" + title + "&api-key=BwzMGxksC3PFgbaSEvPtOG3LtWYkf8Tk";
    console.log(queryURL);

    // axios.get(queryURL).then(
    //     function (response) {
    //         console.log("==BookReview Response==");
    //         var jsonData = response.data;
    //         console.log(response);
    //         console.log(jsonData);

    //     });



    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(ReaderPage);
}


function ReaderPage(NYTData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves

    // Log the NYTData to console, where it will show up as an object
    console.log(NYTData);
    console.log("------------------------------------");
}

$submitSearch.on("click", readerFormSubmit);