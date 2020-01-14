$(document).ready(function () {

    // Global Variables when DOM loads
    var displayedId = [];



    var $submitSearch = $("#submitbtn");
    //functions on click events 
    var readerFormSubmit = function (event) {
        event.preventDefault();


        // alert("working");
        // console.log(event);
        var bookSearch = $("#search-text").val().trim();
        console.log(bookSearch);
        //$("#book-list").clear();
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
        for (i = 0; i < 1; i++) {
            j = i + 1;
            var bookName = NYTData.items[i].volumeInfo.title;
            var author = NYTData.items[i].volumeInfo.authors[0];
            var description = NYTData.items[i].volumeInfo.description;
            var pageCount = NYTData.items[i].volumeInfo.pageCount;
            var avgRating = NYTData.items[i].volumeInfo.averageRating;
            var ratingsCount = NYTData.items[i].volumeInfo.ratingsCount;
            var language = NYTData.items[i].volumeInfo.language;
            var catergory = NYTData.items[i].volumeInfo.categories[0];
            var image = NYTData.items[i].volumeInfo.imageLinks.smallThumbnail;
            var bookImage = $("<img>").attr("src", NYTData.items[i].volumeInfo.imageLinks[0]);


            bookDeets.append("<h4>" + "Result# " + j + "<h4>");
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
            bookDeets.append(
                "<img src='" + image + "'alt=result image>"
            );




            console.log(bookName);
            console.log(avgRating);
            console.log(author);
            console.log(pageCount);
            console.log(language);
            console.log(catergory);
        }
    }
    var posts;
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
    }

    $submitSearch.on("click", readerFormSubmit);

    // This creates the Quill editor with the custom modules specified
    $(".masterpieceButton").on("click", function () {
        var id = $(this).attr("data-id");
        displayedId.push(id);
        // $(".infoBubble").popover("hide");
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
    })
    //Using the focus trigger to dismiss popovers on the user’s next click of a different element than the toggle element.
    $(".infoBubble").popover({
        trigger: 'focus'
    })
});