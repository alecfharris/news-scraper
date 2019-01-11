const getComments = data => {
// The title of the article
$("#notes").append("<h2>" + data.title + "</h2>");
// An input to enter a new title
$("#notes").append("<input id='titleinput' name='title' >");
// A textarea to add a new note body
$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
// A button to submit a new note, with the id of the article saved to it
$("#notes").append("<div id=action-button></div>");
$("#action-button").append("<button data-id='" + data._id + "' id='make-new'>Submit</button>");
$("#notes").append("<div id=results></div>");

if (data.note){
for (var i = 0; i < data.note.length; i++) {
  // ...populate #results with a p-tag that includes the note's title and object id
  $("#results").prepend("<p class='data-entry' data-id=" + data.note[i]._id + "><span class='dataTitle' data-id=" +
    data.note[i]._id + ">" + data.note[i].title + "</span><span class=delete>X</span></p>");
}
}
}

// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p class=article data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", ".article", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        getComments(data);
        // // If there's a note in the article
        // if (data.note) {
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.note.body);

          
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#make-new", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    if($("#titleinput").val() != "" && $("#bodyinput").val() != ""){
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function(data) {
      // Add the title and delete button to the #results section
        $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
        data._id + ">" + $("#titleinput").val() + "</span><span class=delete>X</span></p>");
        // Clear the note and title inputs on the page
        $("#titleinput").val("");
        $("#bodyinput").val("");
      });
    }
  });


// When user clicks the delete button for a note
$(document).on("click", ".delete", function() {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#bodyinput").val("");
      $("#titleinput").val("");
      // Make sure the #action-button is submit (in case it's update)
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});

// When user click's on note title, show the note, and allow for updates
$(document).on("click", ".dataTitle", function() {
  // Grab the element
  var selected = $(this);
  // Make an ajax call to find the note
  // This uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
        // Fill the inputs with the data that the ajax call collected
      $("#bodyinput").val(data.body);
      $("#titleinput").val(data.title);
  
      // Make the #action-button an update button, so user can
      // Update the note s/he chooses
      $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
    }
  });
});

// When user click's update button, update the specific note
$(document).on("click", "#updater", function() {
  // Save the selected element
  var selected = $(this);
  // Make an AJAX POST request
  // This uses the data-id of the update button,
  // which is linked to the specific note title
  // that the user clicked before
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#titleinput").val(),
      note: $("#bodyinput").val()
    },
    // On successful call
    success: function(data) {
      // Clear the inputs
      $("#bodyinput").val("");
      $("#titleinput").val("");
      // Revert action button to submit
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});

  