// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);


//code for fire animation////

(function () {
  var canvasBody = document.getElementById("canvas"),
    canvas = canvasBody.getContext("2d"),

    w = canvasBody.width = window.innerWidth,
    h = canvasBody.height = window.innerHeight,

    tick = 0,
    opts = {
      canvas: {
        backgroundColor: "#100505",
        fireAmount: w / 35
      },
      fire: {
        height: h / 3,
        sparksAmount: 10,
        speed: 70,
        addedSpeed: 20,
        defaultWidth: 40,

        minWidthIncrement: 40,
        addedWidthIncrement: 20,

        minSparkHeightIncrement: 40,
        addedSparkHeightIncrement: 20
      },
      spark: {
        color: "hsla(hue,100%,40%,alpha)",
        startSize: 50,
        hueChange: 35
      }
    },
    fires = [],
    Fire = function (obj) {
      this.sparks = [];
      this.x = obj.x;
      this.y = obj.y;
      this.height = h - obj.y;
      this.init = function () {
        this.sparksAmount = Math.floor(obj.sparksAmount);
        this.sizeDecrement = this.height / opts.spark.startSize / 100;

        for (var i = 0; i < this.sparksAmount; i++) {
          this.sparks.push(new Spark({
            x: 0, //relative to the fire
            y: 20, //relative to the fire
            sizeDecrement: this.sizeDecrement,
            xIncrement: opts.fire.minWidthIncrement + Math.random() * opts.fire.addedWidthIncrement,
            yIncrement: h * 3 / opts.fire.minSparkHeightIncrement + Math.random() * opts.fire.addedSparkHeightIncrement,
            delay: 10 * i
          }));
        }
      };
      this.update = function () {
        this.sparks.map(function (Spark) {
          Spark.update();
        });
      };
      this.render = function () {
        var coords = [this.x, this.y + this.height]
        this.sparks.map(function (Spark) {
          Spark.render(coords[0], coords[1]);
        });
      };

      this.init(obj);
    },
    Spark = function (obj) {
      this.x = obj.x;
      this.y = obj.y;
      this.delay = obj.delay;
      this.direction = Math.random() < 0.5 ? 1 : -1
      this.xIncrement = obj.xIncrement;
      this.yIncrement = obj.yIncrement;
      this.sizeDecrement = obj.sizeDecrement;
      this.size = opts.spark.startSize;
      this.phaseTime = opts.fire.speed + Math.random() * opts.fire.addedSpeed;
      this.hueFactor = opts.spark.hueChange / this.phaseTime;
      this.alphaFactor = 1 / this.phaseTime;
      this.time = obj.delay;
      this.pathPoints = [];
      this.color = opts.spark.color;
      this.equation = function () { };

      this.update = function () {
        this.size -= this.sizeDecrement;
        this.time > this.phaseTime ? this.restart() : this.time++;
        var r = 360 / this.phaseTime,
          e = r * this.time;
        this.color = opts.spark.color;
        this.color = this.color.replace("hue", 30 - this.hueFactor * this.time);
        this.color = this.color.replace("alpha", 1.25 - this.alphaFactor * this.time);
        this.x = this.equation(e)[0];
        this.y = this.equation(e)[1];
      };

      this.render = function (x, y) {
        canvas.beginPath();
        canvas.arc(this.x + x, this.y + y, Math.abs(this.size), 0, Math.PI * 2);
        canvas.closePath();
        canvas.fillStyle = this.color;
        canvas.fill()
      };

      this.start = function () {
        this.time = this.delay;
        this.size = opts.spark.startSize;
        this.sizeDecrement = opts.spark.startSize / this.phaseTime;
        this.equation = function (x) {
          var X = Math.radians(x);
          return [Math.sin(X) * this.xIncrement * this.direction, -X * this.yIncrement];
        }
      };
      this.restart = function () {
        this.time = 0;
        this.size = opts.spark.startSize;
        this.color = opts.spark.color;
      }
      this.start();
    };
  Math.radians = function (deg) {
    return deg * (Math.PI / 180);
  }
  function setup() {
    for (var i = 0; i < opts.canvas.fireAmount; i++) {
      fires.push(new Fire({
        x: w / opts.canvas.fireAmount * i,
        y: h - opts.fire.height - Math.random() * (opts.fire.height / 3),
        sparksAmount: opts.fire.sparksAmount + Math.random() * (opts.fire.sparksAmount / 2)
      }));
    }
    fires.map(function (Fire) {
      Fire.init();
      Fire.update();
    });
    window.requestAnimationFrame(loop);
  };
  function loop() {
    canvas.fillStyle = opts.canvas.backgroundColor;
    canvas.fillRect(0, 0, w, h);

    tick++;
    fires.map(function (Fire) {
      Fire.update();
      Fire.render();
    });
    window.requestAnimationFrame(loop);
  };
  setup();

  window.addEventListener("resize", function () {
    w = canvasBody.width = window.innerWidth;
    h = canvasBody.height = window.innerHeight;
  });
})();
