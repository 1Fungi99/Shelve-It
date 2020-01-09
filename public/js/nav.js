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

$("#signup-show").on("click", function() {
  if ($("#password")[0].type == "password") {
    $("#password")[0].type = "text";
  } else {
    $("#password")[0].type = "password";
  }
});

$("#login-show").on("click", function() {
  if ($("#password")[0].type == "password") {
    $("#password")[0].type = "text";
  } else {
    $("#password")[0].type = "password";
  }
});

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log("Full Name: " + profile.getName());
  console.log("Given Name: " + profile.getGivenName());
  console.log("Family Name: " + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
}