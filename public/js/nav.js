import { application } from "express";

// Dependancies
// Grabbing the new User model
// var ajax = require("ajax");

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
});
$("#login-show").on("click", function() {
  if ($("#password")[0].type == "password") {
    $("#password")[0].type = "text";
  } else {
    $("#password")[0].type = "password";
  }
});
// ================= Show Password Logic Above =================

$("#login-submit").on("click", function() {
  $;
});

$("#signup-submit").on("click", function() {
  var newUserData = {
    username: $("#username").val(),
    pass: $("#password").val(),
    first_name: $("#first-name").val(),
    middle_initial: $("#middle_initial").val(),
    last_name: $("#last-name").val(),
    email_address: $("#email").val()
  };
  if ($("#passowrd").text() === $("#passowrd-confirm")) {
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : window.location + "api/users/save",
      data : JSON.stringify(formData),
      dataType : 'json',
      success : function(customer) {
        $("#postResultDiv").html("<p>" + 
          "Post Successfully! <br>" +
          "--> " + newUserData.first_name + " " + " " + newUserData.middle_initial+ " "+ newUserData.last_name + " " + newUserData.username+ " " + newUserData.password+ " " + newUserData.email_address + ", createdAt: " + customer.createdAt+  "</p>"); 
      },
  })
};

// ================= Google Signup/Login Logic Below =================

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
// ================= Google Signup/Login Logic Above =================
