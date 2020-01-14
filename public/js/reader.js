$(document).ready(function () {

    // Global Variables when DOM loads
    var displayedId = [];
    var posts;
    var numStars = "";
    // Grabing Id with Jquery and placing inside variable for later use
    var bookDeets = $("#book-list");
    // Object created for star rating
    var stars = {
        half: "<i class='fas fa-star-half'></i>",
        one: "<i class='fas fa-star'></i>",
        oneHalf: "<i class='fas fa-star'></i> <i class='fas fa-star-half'></i>",
        two: "<i class='fas fa-star'></i> <i class='fas fa-star'></i>",
        twoHalf: "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star-half'></i>",
        three: "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i>",
        threeHalf: "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star-half'></i>",
        four: "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i>",
        fourHalf: "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star-half'></i>",
        five: "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i>",
        noRatings: "<i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i>"
    };


    // Placing jQuery button inside variable
    var $submitSearch = $("#submitbtn");

    // Functions on click events 
    var readerFormSubmit = function (event) {
        event.preventDefault();

        //Clearing out the result div
        bookDeets.empty();

        // Take value and trim from search box
        var bookSearch = $("#search-text").val().trim().toLowerCase();
        // If user submits search and it field is empty, GET will default to Farenheit 451
        if (bookSearch === "") {
            bookSearch = "fahrenheit451";
            readerSearch(bookSearch);
            $("#search-text").val("");
        } else {
            readerSearch(bookSearch);
            $("#search-text").val("");
        };

    };

    function readerSearch(bookSearch) {
        // Regex to remove empty spaces from search
        var title = bookSearch.replace(/\s/g, "");
        // Google API book search
        var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + title;

        // GET request for google api
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(ReaderPage);
    };

    function ReaderPage(NYTData) {

        // JSON object results placed in variables
        var bookName = NYTData.items[0].volumeInfo.title; // Booktitle
        var author = NYTData.items[0].volumeInfo.authors[0]; // Author Name
        var description = NYTData.items[0].volumeInfo.description; // Description
        var pageCount = NYTData.items[0].volumeInfo.pageCount; // Page Count
        var avgRating = NYTData.items[0].volumeInfo.averageRating; // Average Rating
        var category = NYTData.items[0].volumeInfo.categories[0]; // Category
        var image = NYTData.items[0].volumeInfo.imageLinks.thumbnail; // Thumbnail Image

        // This if statement will check the avgRating and attach the right number of stars to display
        if (avgRating > .1 && avgRating <= .5) {
            numStars = stars.half;
        }
        else if (avgRating > .5 && avgRating <= 1) {
            numStars = stars.one;
        }
        else if (avgRating > 1 && avgRating <= 1.5) {
            numStars = stars.oneHalf;
        }
        else if (avgRating > 1.5 && avgRating <= 2) {
            numStars = stars.two;
        }
        else if (avgRating > 2 && avgRating <= 2.5) {
            numStars = stars.twoHalf;
        }
        else if (avgRating > 2.5 && avgRating <= 3) {
            numStars = stars.three;
        }
        else if (avgRating > 3 && avgRating <= 3.5) {
            numStars = stars.threeHalf;
        }
        else if (avgRating > 3.5 && avgRating <= 4) {
            numStars = stars.four;
        }
        else if (avgRating > 4 && avgRating <= 4.5) {
            numStars = stars.fourHalf;
        }
        else if (avgRating > 4.5 && avgRating <= 5) {
            numStars = stars.five;
        }
        else {
            numStars = stars.noRatings;
        };

        // These lines are for displaying the card title
        var bookHeader = $("<div></div>");
        bookHeader.addClass("card-header");
        bookHeader.attr("id", "btHeader"); // id for custom css
        bookHeader.append(bookName);
        bookDeets.append(bookHeader);

        // These lines are for displaying the author of book
        var authorName = $("<footer></footer");
        authorName.addClass("blockquote-footer");
        authorName.attr("id", "anName"); // id for custom css
        authorName.append(author);
        bookHeader.append(authorName);


        // These next seven lines are for displaying the book thumbnail
        var bookContainer = $("<div></div>");
        var bookThumbnail = $("<img>");
        bookContainer.addClass("card-body");
        bookThumbnail.addClass("img-thumbnail");
        bookThumbnail.attr("id", "imgThumb"); // id for custom css
        bookThumbnail.attr("src", image);
        bookContainer.append(bookThumbnail);
        bookDeets.append(bookContainer);

        // These next lines are for displaying the Average Ratings
        var ratingsContainer = $("<div></div>");
        ratingsContainer.attr("id", "ratingStars"); //id for custom css
        console.log(avgRating);
        ratingsContainer.html(numStars);
        bookContainer.append(ratingsContainer);

        // These next lines are for displaying the book description
        var descriptionContainer = $("<p></p>");
        descriptionContainer.attr("id", "bookDesc"); // id for custom css
        descriptionContainer.append(description);
        bookDeets.append(descriptionContainer);

        // These next lines are for displaying the page count
        var countContainer = $("<p></p>");
        countContainer.addClass("text-muted");
        countContainer.attr("id", "pgCount"); // id for custom css
        countContainer.html("<i class='fas fa-scroll'></i> " + pageCount + " Total Pages");
        bookDeets.append(countContainer);
    };

    function getPosts(category) {
        var categoryString = category || "";
        if (categoryString) {
            categoryString = "/category/" + categoryString;
        }
        $.get("/api/story" + categoryString, function (data) {
            console.log("Posts", data);
            posts = data;
            if (!posts || !posts.length) {
                displayEmpty();
            }
            else {
                initializeRows();
            }
        });
    };

    $submitSearch.on("click", readerFormSubmit);

    // This creates the Quill editor with the custom modules specified
    $(".masterpieceButton").on("click", function () {
        // Getting the id from button
        var id = $(this).attr("data-id");
        displayedId.push(id);
        $.get("/api/compose/" + displayedId[0], function (data) {
            if (data) {
                // If data exists make a new quill container, set the scrolling container, theme, readOnly, and no tools in toolbar
                var quill = new Quill(".quillReader" + displayedId[0], {
                    scrollingContainer: ".quillScroller" + displayedId[0],
                    theme: "snow",
                    readOnly: true,
                    modules: {
                        toolbar: false,
                    }
                });

                // Quill editor cleared using setText method from Quill doc
                quill.setText("");
                // Quill editor filled with storyText data from this id
                quill.setContents(JSON.parse(data.storyText));
                displayedId = [];
            }
        });
    });

    //Enabling Bootstrap popovers
    $(function () {
        $('[data-toggle="popover"]').popover()
    });

});
