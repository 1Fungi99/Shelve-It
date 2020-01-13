// Logic for compose.js path
$(document).ready(function () {
  //================================MAIN EXECUTIONS=====================================//

  // Global Variables when DOM loads, used for flagging deletions & edits of masterpieces
  var url = window.location.search;
  var executeDelete = false;
  var updatingStory = false;
  var editId = [];

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
        $("#counterBadge").addClass("badge-danger");
      } else if (text.length > 0 && text.length <= 99) {
        $("#counterBadge").removeClass("badge-danger");
        $("#counterBadge").addClass("badge-warning");
      } else if (text.length >= 100) {
        $("#counterBadge").removeClass("badge-danger");
        $("#counterBadge").removeClass("badge-warning");
        $("#counterBadge").addClass("badge-success");
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
    discardAll();
  });

  // This click event handler is for saving a draft to the database
  $("#draftButton").on("click", function (event) {
    event.preventDefault();
    if (!updatingStory) {
      newDraftSubmission();
    } else if (updatingStory) {
      updateDraft();
    }
  });

  // This click event handler is for posting a publish to the database
  $("#publishButton").on("click", function (event) {
    event.preventDefault();
    if (!updatingStory) {
      newPublishSubmission();
    } else if (updatingStory) {
      console.log("Successfully Published!");
      updateStory();
    }
  });

  // This code block will ensure the author page is reloaded after the user saves a draft or publishes
  $("#successful").on("hidden.bs.modal", function (event) {
    event.preventDefault();
    // Location reload will ensure the user sees their submissions on the compose path
    location.reload();
  });

  // This click event handler is for deleting a draft or published work from the database
  $(".deleteButton").on("click", function (event) {
    event.stopPropagation();
    $("#deleteModal").modal();
    var id = $(this).data("id");
    $(".yesDelete").on("click", function (event) {
      executeDelete = true;
      if (executeDelete) {

        $.ajax("/api/compose/" + id, {
          type: "DELETE"
        }).then(function () {
          executeDelete = false;
          // Location reload to display the change
          location.reload();
        }
        );
      }
    });
  });

  // This click event handler is for updating a draft or published work from the database
  $(".editButton").on("click", function (event) {
    event.stopPropagation();
    $("#updateModal").modal();
    var id = $(this).data("id");
    console.log(id);
    editId.push(id);
    console.log(editId[0]);
    $(".yesUpdate").on("click", function (event) {

      $.get("/api/compose/" + id, function (data) {
        if (data) {
          $("#titleBox").val(data.title);
          quill.setContents(JSON.parse(data.storyText));
          $("#categoryBox").val(data.category);
          $("#typeBox").val(data.storyType);
          updatingStory = true;
        }
      });

    });
  });

  //================================MAIN EXECUTIONS END=====================================//

  //=================================HELPER FUNCTIONS=======================================//

  // This function will execute if the story being updated is saved as a draft
  function updateDraft() {
    // This line gets the string contents of the editor. Non-string contents are omitted.
    var quillCharacters = quill.getText().trim();
    var btnNoSuccess = "Unable to Save Edited Draft!";
    var btnSuccess = "Succesfully saved your masterpiece as a Draft!";
    var successBody = "Your changes were saved. You may now close to continue.";

    var story = {
      id: editId[0],
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
      $.ajax({
        type: "PUT",
        url: "/api/compose",
        data: story
      })
        .then(function (data) {
          console.log(data)
          editId = [];
          $("#successTitle").text(btnSuccess);
          $("#successBody").text(successBody);
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
  };

  // This function will execute if the story being updated is published
  function updateStory() {
    // This line gets the string contents of the editor. Non-string contents are omitted.
    var quillCharacters = quill.getText().trim();
    var btnNoSuccess = "Unable to Publish Your Updated Masterpiece!";
    var btnSuccess = "Succesfully Published Your Updated Masterpiece!";
    var successBody = "Your masterpiece was published along with the updates. You may now close to continue.";

    var story = {
      id: editId[0],
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
      $.ajax({
        type: "PUT",
        url: "/api/compose",
        data: story
      })
        .then(function (data) {
          console.log(data)
          editId = [];
          $("#successTitle").text(btnSuccess);
          $("#successBody").text(successBody);
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
  };

  function newDraftSubmission() {
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
  };

  function newPublishSubmission() {
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
    };
  };

  function discardAll() {
    // Title cleared
    $("#titleBox").val("");
    // Quill editor cleared using setText method from Quill doc
    quill.setText("");
    // Category cleared
    $("#categoryBox").val("");
    // Type cleared
    $("#typeBox").val("");
  };


});

