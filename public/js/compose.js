// Logic for compose.js path
$(document).ready(function () {

    // This var array creates the custom Quill toolbar options
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],      // bold, italic, underline, strike buttons
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // ordered list & bullet list button
        [{ 'script': 'sub' }, { 'script': 'super' }],   // superscript/subscript buttons
        [{ 'indent': '-1' }, { 'indent': '+1' }],       // outdent/indent buttons
        [{ 'direction': 'rtl' }],                       // text direction button
        [{ 'color': [] }, { 'background': [] }],        // dropdown with defaults from theme
        [{ 'font': [] }],                               // Font type button
        [{ 'align': [] }],                              // Align Button
        ['clean'],                                      // remove formatting button
    ];

    // This constructor function is for the counter module to be created
    class Counter {
        constructor(quill, options) {
            this.quill = quill;
            this.options = options;
            this.container = document.querySelector(options.container);
            quill.on('text-change', this.update.bind(this));
            this.update();  // Account for initial contents
        }

        calculate() {
            let text = this.quill.getText().trim();
            if (text.length === 0) {
                $("#counterBadge").addClass("btn-danger");
            } else if (text.length > 0 && text.length <= 99) {
                $("#counterBadge").removeClass("btn-danger");
                $("#counterBadge").addClass("btn-warning");
            } else if (text.length >= 100) {
                $("#counterBadge").removeClass("btn-danger");
                $("#counterBadge").removeClass("btn-warning");
                $("#counterBadge").addClass("btn-success");
            }
            if (this.options.unit === 'word') {
                text = text.trim();
                // Splitting empty text returns a non-empty array
                return text.length > 0 ? text.split(/\s+/).length : 0;
            } else {
                return text.length;
            }
        }

        update() {
            var length = this.calculate();
            this.container.innerText = length
        }
    };

    // This line registers the new module created in the constructor function
    Quill.register('modules/counter', Counter);

    // This creates the Quill editor with the custom modules specified
    var quill = new Quill("#quillContainer", {
        scrollingContainer: ".card-body",
        placeholder: "Compose your masterpiece...",
        theme: "snow",
        modules: {
            toolbar: toolbarOptions,
            counter: {
                container: "#quillCounter",
            }
        }
    });

    // This on click event handler is for the discard button on 
    // author tools, executes when user clicks yes on modal
    $("#yesDiscard").on("click", function (event) {
        event.preventDefault();
        // Title cleared
        $("#titleBox").val("");
        // Quill editor cleared using setText method from Quill doc
        quill.setText("");
        // Category cleared
        $("#categoryBox").val("");
        // Type cleared
        $("#typeBox").val("");
    });

    // This click event handler is for saving a draft to the database
    $("#draftButton").on("click", function (event) {
        event.preventDefault();
        // This line gets the string contents of the editor. Non-string contents are omitted.
        var quillCharacters = quill.getText().trim();
        var btnNoSuccess = "Unable to Save Draft!";
        var btnSuccess = "Succesfully Saved Draft!";
        var successBody = "Your rough draft was saved. You may now close to continue.";

        var story = {
            title: $("#titleBox").val(),
            // This gets the contents of the Quill editor in a Delta format --> https://quilljs.com/docs/delta/
            // Then we stringify for submission to the database as a string, JSON.parse() will make it back into json object
            storyText: JSON.stringify(quill.getContents()),
            category: $("#categoryBox").val(),
            storyType: $("#typeBox").val(),
            draft: true
        };

        if (story.title.length >= 1 && quillCharacters.length >= 100 && story.category.length > 1 && story.storyType.length > 1) {
            // When the form validation passes the AJAX POST-request will run
            $.post("/api/compose", story)
                // On success a modal pops up alerting of the success
                .then(function (data) {
                    console.log(data)
                    $("#successTitle").text(btnSuccess);
                    $("#successBody").text(successBody);
                    // location.reload();
                    $("#successful").modal();
                });
            // Empty the form after submission
            // Title cleared
            $("#titleBox").val("");
            // Quill editor cleared using setText method from Quill doc
            quill.setText("");
            // Category cleared
            $("#categoryBox").val("");
            // Type cleared
            $("#typeBox").val("");
            // If validation fails for any field, else block runs
        } else {
            $("#incompleteFields").empty();
            $("#notSuccessTitle").text(btnNoSuccess);
            var fieldHeading = $("<p></p>").text("Please Fix the Following:");
            var fieldList = $("<ol></ol>");
            if (story.title.length < 1) {
                let missingTitle = $("<li></li>").text("Missing Title.");
                fieldList.append(missingTitle);
            }
            if (quillCharacters.length < 100) {
                let missingCharacters = $("<li></li>").text(quillCharacters.length + " out of 100 minimum characters required.");
                fieldList.append(missingCharacters);
            }
            if (story.category.length < 1) {
                let missingCategory = $("<li></li>").text("Missing Category.");
                fieldList.append(missingCategory);
            }
            if (story.storyType.length < 1) {
                let missingType = $("<li></li>").text("Missing Type.");
                fieldList.append(missingType);
            }
            $("#incompleteFields").append(fieldHeading);
            $("#incompleteFields").append(fieldList);
            $("#notSuccessful").modal();
        };
    });

    // This click event handler is for posting a publish to the database
    $("#publishButton").on("click", function (event) {
        event.preventDefault();
        // This line gets the string contents of the editor. Non-string contents are omitted.
        var quillCharacters = quill.getText().trim();
        var btnNoSuccess = "Unable to Publish Your Masterpiece!";
        var btnSuccess = "Succesfully Published!";
        var successBody = "It's Better Read Then Dead. <i class='fas fa-fire'></i>";

        var story = {
            title: $("#titleBox").val(),
            // This gets the contents of the Quill editor in a Delta format --> https://quilljs.com/docs/delta/
            // Then we stringify for submission to the database as a string, JSON.parse() will make it back into json object
            storyText: JSON.stringify(quill.getContents()),
            category: $("#categoryBox").val(),
            storyType: $("#typeBox").val(),
            draft: false
        };

        if (story.title.length >= 1 && quillCharacters.length >= 100 && story.category.length > 1 && story.storyType.length > 1) {
            // When the form validation passes the AJAX POST-request will run
            $.post("/api/compose", story)
                // On success a modal pops up alerting of the success
                .then(function (data) {
                    console.log(data)
                    $("#successTitle").text(btnSuccess);
                    $("#successBody").html(successBody);
                    $("#successful").modal();
                });
            // Empty the form after submission
            // Title cleared
            $("#titleBox").val("");
            // Quill editor cleared using setText method from Quill doc
            quill.setText("");
            // Category cleared
            $("#categoryBox").val("");
            // Type cleared
            $("#typeBox").val("");
            // If validation fails for any field, else block runs
        } else {
            $("#incompleteFields").empty();
            $("#notSuccessTitle").text(btnNoSuccess);
            var fieldHeading = $("<p></p>").text("Please Fix the Following:");
            var fieldList = $("<ol></ol>");
            if (story.title.length < 1) {
                let missingTitle = $("<li></li>").text("Missing Title.");
                fieldList.append(missingTitle);
            }
            if (quillCharacters.length < 100) {
                let missingCharacters = $("<li></li>").text(quillCharacters.length + " out of 100 minimum characters required.");
                fieldList.append(missingCharacters);
            }
            if (story.category.length < 1) {
                let missingCategory = $("<li></li>").text("Missing Category.");
                fieldList.append(missingCategory);
            }
            if (story.storyType.length < 1) {
                let missingType = $("<li></li>").text("Missing Type.");
                fieldList.append(missingType);
            }
            $("#incompleteFields").append(fieldHeading);
            $("#incompleteFields").append(fieldList);
            $("#notSuccessful").modal();
        }
    });
});





