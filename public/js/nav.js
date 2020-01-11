// ================= Reset Modal Logic Below =================
// Once modal is closed, all fields reset.
$("#nav_login").on("click", function() {
  var loginForm = document.getElementById("login-form");
  loginForm.reset();
  $("#log-in").modal("show");
});
$("#nav_signup").on("click", function() {
  var signupForm = document.getElementById("signup-form");
  signupForm.reset();
  $("#sign-up").modal("show");
});
// ================= Reset Modal Logic Above =================

// ================= Show Password Logic Below =================
$("#signup-show").on("click", function() {
  if ($("#password")[0].type == "password") {
    $("#password")[0].type = "text";
  } else {
    $("#password")[0].type = "password";
  }
  if ($("#password-confirm")[0].type == "password") {
    $("#password-confirm")[0].type = "text";
  } else {
    $("#password-confirm")[0].type = "password";
  }
});
$("#login-show").on("click", function() {
  if ($("#login-password")[0].type == "password") {
    $("#login-password")[0].type = "text";
  } else {
    $("#login-password")[0].type = "password";
  }
});
// ================= Show Password Logic Above =================

// ================= Sign Up Logic Below =================

$("#signup-submit").on("click", function() {
  var match = false;
  $("#match-error").addClass("d-none");

  var newUserData = {
    pass: $("#password")
      .val()
      .trim(),
    first_name: $("#firstname").val(),
    last_name: $("#lastname").val(),
    email_address: $("#email")
      .val()
      .trim(),
    logged_in: true
  };

  $.get("/api/data/" + newUserData.email_address, function(data) {
    // .then(function (data) {
    console.log(data);
    if (data) {
      console.log(data);
      if (
        data.email_address ==
        $("#email")
          .val()
          .trim()
      ) {
        console.log("match error");
        $("#match-error").removeClass("d-none");
      }
    } else if (
      // Checking to see if the passwords match before sending to database
      $("#password")
        .val()
        .trim() ===
        $("#password-confirm")
          .val()
          .trim() &&
      newUserData.pass.length < 50 &&
      newUserData.pass.length > 1 &&
      // Validation of the first name length
      newUserData.first_name.length < 50 &&
      newUserData.first_name.length > 2 &&
      // Validation of the last name length
      newUserData.last_name.length < 50 &&
      newUserData.last_name.length > 2 &&
      // Validation of the email address length
      newUserData.email_address.length < 50 &&
      newUserData.email_address.length > 10
    ) {
      console.log("pass");
      $.ajax({
        type: "POST",
        url: "/api/signup",
        data: newUserData
      }).then(function(data) {
        console.log(data);
        $("#nav_login").addClass("d-none");
        $("#composeDiv1").addClass("d-none");
        $("#nav_signup").addClass("d-none");
        $("#nav_signout").removeClass("d-none");
        $("#composeLnk").removeClass("d-none");
        $("#composeDiv2").removeClass("d-none");
        $("#index-author-button").removeClass("d-none");

        $("#sign-up").modal("hide");
      });
    } else {
      $("#signup-alert").removeClass("d-none");
    }
  });
});
// ================= Sign Up Logic Above =================

// ================= Log In Logic Below =================
$("#login-submit").on("click", function() {
  var email = $("#login-email")
    .val()
    .trim();
  var password = $("#login-password")
    .val()
    .trim();

  $.get("/api/login/" + email, function(data) {
    if (data) {
      var logInUser = data;
      console.log(logInUser);
      if (logInUser.pass === password) {
        $("#nav_login").addClass("d-none");
        $("#composeDiv1").addClass("d-none");
        $("#nav_signup").addClass("d-none");
        $("#nav_signout").removeClass("d-none");
        $("#composeLnk").removeClass("d-none");
        $("#composeDiv2").removeClass("d-none");
        $("#index-author-button").removeClass("d-none");

        $("#log-in").modal("hide");

        user = logInUser;
      } else {
        $("#login-alert").removeClass("d-none");
      }
    }
  });
});
// ================= Log In Logic Above ================
