$(document).ready(function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  var user = firebase.auth().currentUser;

  // ================= Reset Modal Logic Below =================
  // Once modal is closed, all fields reset.
  $("#nav_login").on("click", function () {
    var loginForm = document.getElementById("login-form");
    loginForm.reset();
    $("#log-in").modal("show");
  });
  $("#nav_signup").on("click", function () {
    var signupForm = document.getElementById("signup-form");
    signupForm.reset();
    $("#sign-up").modal("show");
  });
  // ================= Reset Modal Logic Above =================

  // ================= Show Password Logic Below =================
  $("#signup-show").on("click", function () {
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
  $("#login-show").on("click", function () {
    if ($("#login-password")[0].type == "password") {
      $("#login-password")[0].type = "text";
    } else {
      $("#login-password")[0].type = "password";
    }
  });
  // ================= Show Password Logic Above =================

  // ================= Sign Up Logic Below =================

  $("#signup-submit").on("click", function () {
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

    $.get("/api/data/" + newUserData.email_address, function (data) {
      if (data) {
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
        }).then(function (data) {
          // NOTE= Only saving id to local storage for security purposes.
          var userLogInData = data.id;
          localStorage.setItem("user", userLogInData);
          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function () {
              firebase.auth().createUserWithEmailAndPassword(data.email_address, data.pass)
                // Chaining request to update displayName in firebase when a new user is created - Emir
                .then(function (fbResult) {
                  return fbResult.user.updateProfile({
                    displayName: newUserData.first_name + " " + newUserData.last_name
                  });
                })
                .catch(function (error) {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log("Error code: " + errorCode);
                  console.log("Error message: " + errorMessage);
                });
            }).catch(function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log("Error code: " + errorCode);
              console.log("Error message: " + errorMessage);
            });

          $("#sign-up").modal("hide");
        });
      } else {
        $("#signup-alert").removeClass("d-none");
      }
    });
  });

  // ================= Sign Up Logic Above =================

  //calls function to popup
  $("#google-signup").on("click", function () {
    googleSignIn();
  });
  // ================= Log In Logic Below =================
  $("#login-submit").on("click", function () {
    //grabs input fields
    var email = $("#login-email")
      .val()
      .trim();
    var password = $("#login-password")
      .val()
      .trim();

    $.get("/api/login/" + email, function (data) {
      if (data == null) {
        $("#login-alert").removeClass("d-none");
      } else if (data.pass === password) {
        // Auth for log ins, sent to firebase
        // NOTE= Only saving id to local storage for security purposes.
        var userLogInData = data.id;
        localStorage.setItem("user", userLogInData);
        // "Session will only persist in the current session or tab, and will be cleared when the 
        // tab or window in which the user authenticated is closed. Applies only to web apps." FireB Docs - Emir
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
          .then(function () {
            return firebase.auth().signInWithEmailAndPassword(data.email_address, data.pass);
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error code: " + errorCode);
            console.log("Error message: " + errorMessage);
          });
        $("#log-in").modal("hide");
      } else {
        $("#login-alert").removeClass("d-none");
      }
    });
  });
  // ================= Log In Logic Above ================

  // ================= Sign Out Logic Above ================
  //sends firebase data that the user has signed out
  //UI should reflect as such
  $("#nav_signout").on("click", function () {
    $("#loggedInName").addClass("d-none");
    localStorage.clear();
    firebase.auth().signOut();
  });
  // ================= Sign Out Logic Above ================

  // changes UI when the authentication for the window is changed
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User is signed in!");
      var displayName = user.displayName;
      // Revising UI for log in
      // This line will change the text in compose path - Emir
      $("#composeHeader").html("Hello " + displayName + ", ready to Compose? <i class='fas fa-feather-alt'></i>");
      // These next two lines will change the text in drop down only when user is logged in - Emir
      $("#loggedInName").text("Hello " + displayName + "!");
      $("#loggedInName").removeClass("d-none");
      $("#nav_login").addClass("d-none");
      $("#composeDiv1").addClass("d-none");
      $("#nav_signup").addClass("d-none");
      $("#nav_signout").removeClass("d-none");
      $("#composeLnk").removeClass("d-none");
      $("#composeDiv2").removeClass("d-none");
      $("#index-author-button").removeClass("d-none");
      $("#google-signup").addClass("d-none");
    } else {
      // User is signed out.
      // Revising UI for sign out

      console.log("No user logged in.");
      $("#nav_login").removeClass("d-none");
      $("#composeDiv1").removeClass("d-none");
      $("#nav_signup").removeClass("d-none");
      $("#nav_signout").addClass("d-none");
      $("#composeLnk").addClass("d-none");
      $("#composeDiv2").addClass("d-none");
      $("#index-author-button").addClass("d-none");
      $("#google-signup").removeClass("d-none");
    }
  });

  //Helper Functions:

  // Google sign in function
  function googleSignIn() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error code: " + errorCode);
        console.log("Error message: " + errorMessage);
      });
  }
});
