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


});





