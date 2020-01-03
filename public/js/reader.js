



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
    // var queryURL = "https://api.nytimes.com/svc/books/v3/reviews.json?title=" + title + "&api-key=BwzMGxksC3PFgbaSEvPtOG3LtWYkf8Tk";

    var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title;


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

    console.log(NYTData.items);
    console.log("------------------------------------");
    var bookDeets = $("#book-list");
    for (i = 0; i < 5; i++) {
        j = i + 1;
        var bookName = NYTData.items[i].volumeInfo.title;
        var author = NYTData.items[i].volumeInfo.authors[0];
        var description = NYTData.items[i].volumeInfo.description;
        var pageCount = NYTData.items[i].volumeInfo.pageCount;
        var avgRating = NYTData.items[i].volumeInfo.averageRating;
        var ratingsCount = NYTData.items[i].volumeInfo.ratingsCount;
        var language = NYTData.items[i].volumeInfo.language;
        var catergory = NYTData.items[i].volumeInfo.categories[0];
        // var image = NYTData.items[i].volumeInfo.imageLinks.smallThumbnail;
        var bookImage = $("<img>").attr("src", NYTData.items[i].volumeInfo.imageLinks[0]);


        bookDeets.append("<h4>" + "Result# " + j + "<h4>");
        bookDeets.append(
            "<p id=bookTitle><span class='title'>Image</span> <br>" + bookImage +
            "</p>"
        );
        bookDeets.append(
            "<p id=bookTitle><span class='title'>Book Title</span> <br>" + bookName +
            "</p>"
        );
        bookDeets.append(
            "<p id=bookAuthor><span class='title'>Author</span> <br>" + author +
            "</p>"
        );
        bookDeets.append(
            "<p id=description><span class='title'>Description</span> <br>" + description +
            "</p>"
        );
        bookDeets.append(
            "<p id=pgCnt><span class='title'>Page Count</span> <br>" + pageCount +
            "</p>"
        );
        bookDeets.append(
            "<p id=Rating><span class='title'>Average Ratings</span> <br>" + avgRating +
            "</p>"
        );
        bookDeets.append(
            "<p id=lang><span class='title'>Language</span> <br>" + language +
            "</p>"
        );




        console.log(bookName);
        console.log(avgRating);
        console.log(author);
        console.log(pageCount);
        console.log(language);
        console.log(catergory);
        $("#book-list").append(bookName);
        $("#book-list").append(author);

    }
}

$submitSearch.on("click", readerFormSubmit);