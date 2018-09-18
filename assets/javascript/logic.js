$(document).ready(function() {
  

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCFbllCxMFFxxOEKE-aUK62T3zATwg13hQ",
    authDomain: "grouponeproject-16fef.firebaseapp.com",
    databaseURL: "https://grouponeproject-16fef.firebaseio.com",
    projectId: "grouponeproject-16fef",
    storageBucket: "",
    messagingSenderId: "329171341802"
  };

  firebase.initializeApp(config);
  
  var database = firebase.database();
  var eventRef = database.ref("event/");

  //global variables==============================================================





  //functions======================================================================
  function resetForm() {
    //clear the input fields for the user and reset the validate class on required inputes 
    $("#eventTitle").val("").attr("class", "validate");
    $("#date").val("").attr("class", "validate");
    $("#time").val("").attr("class", "validate");
    $("#street").val("").attr("class", "validate");
    $("#city").val("").attr("class", "validate");
    $("#state").val("").attr("class", "validate");
    $("#zip").val("").attr("class", "validate");
    $("#description").val("");
    // placeholder for invitees based on twitter API call
    //$("#invitees").val("");

    //reset the lable active state back to inactive or blank
    $("label").attr("class", "");
  };

  //onclick events=================================================================

  //when cancel in the form is clicked, reset the form to its original state
  $("#cancelButton").click(resetForm);

  //This opens the modals on the applicable button click
  $("#addEvent, #emptyFieldError").modal();

  //initialize floating action button on event card (currently not working)
  // $(".goToDetails").floatingActionButton();

  //this is the onclick for when the "Submit" button is pushed from the Add Event form 
  //add input to the DB and create and display the item on the page
  $("#submitEvent").on("click", function(event) {
    event.preventDefault();
    
    
    var eventTitle = $("#eventTitle").val().trim();
    var date = $("#date").val().trim();
    var time = $("#time").val().trim();
    var street = $("#street").val().trim();
    var city = $("#city").val().trim();
    var state = $("#state").val().trim();
    var zip = $("#zip").val().trim();
    var description = $("#description").val().trim();
    // placeholder for invitees based on twitter API call
    //var invitees = $("#invitees").val().trim();

    //make it so that if there is an empty field form won't submit (user input validation)
    if ((eventTitle === "") || (date === "") ||(time === "") || (street === "") || (city === "") || (state === "") || (zip === "")) {
      $("#emptyFieldError").modal("open");
      //make empty required fields turn red, even if they aren't clicked in first...but how
      $(".helper-text").show();
      return false;
      
    }
    //if all complete then they can continue (sends info to DB, clears inputs, and closes form)
    else {
      //create an object to hold all inputs to send to the DB
      var eventInfo = {
        eventTitle: eventTitle,
        date: date,
        time: time,
        street: street,
        city: city,
        state: state,
        zip: zip,
        description: description
      };

      // send the event info to the db under an event node
      database.ref("event/").push(eventInfo);

      //testing area
      console.log("event title: "+ eventTitle);
      console.log("event date: "+ date);
      console.log("event time: "+ time);
      console.log("event street: "+ street);
      console.log("event city: "+ city);
      console.log("event state: "+ state);
      console.log("event zip: "+ zip);
      console.log("event details: "+ description);

      //reset the form after submit is clicked
      resetForm();
    };
  });

  //on child event for datbase to be call to get the snapshot values
  eventRef.on("child_added", function(snapshotChild) {
    //create a variable to hold the child value
    var cv = snapshotChild.val();

    //create a key for the event...the keys in console.log are different than the ones in the DB 
    //and they change every time page is refreshed...why
    // var eventKey = eventRef.get().key;
    // console.log(eventKey);

    //assign the child snapshot values to the  variables
    eventTitle = cv.eventTitle;
    date = cv.date;
    time = cv.time;
    street = cv.street;
    city = cv.city;
    state = cv.state;
    zip = cv.zip;
    description = cv.description;

    //create the div and a card div to add the information to
    var $eventCardDiv = $("<div>").addClass("col s12 m4 eventDiv");
    var $eventCard = $("<div>").addClass("card small");
    //add an image to the top of the card (*note the image size impacts the height of the img portion current img is 700px*)
    //would like to use different images, maybe an array of images and a for loop to grab a random img?
    var $eventImgDiv = $("<div>").addClass("card-image");
    var $eventImg = $("<img>").attr("src", "./assets/images/colorSplashBG.jpg");
    //create a span to have the title over over the image at top of card
    var $eventTitle = $("<span>").addClass("card-title").text(eventTitle);

    //add a button to take user to the event detials page....not opening page need to TS with a TA)
    // var $detailsButton = $("<button>").addClass("btn-floating cyan halfway-fab waves-effect waves-cyan goToDetails");
    // var $buttonLink = $("<a>").attr("href", "./eventdetails.html");
    // var $buttonIcon = $("<i>").addClass("material-icons").text("info_outline");
    // //append link and icon to the button element
    // $detailsButton.append($buttonLink, $buttonIcon);


    //create a div for the card content, to put some of the info
    var $eventCardBody = $("<div>").addClass("card-content");
    //create a $var for each db out and assign to a p element to append to card body variable
    var $dateTime = $("<p>").text(date + "  |  " + time);
    // var $time = $("<p>").text(time);
    var $description = $("<p>").text(description);

    //link section to link to event details
    var $actionDiv = $("<div>").addClass("card-action");
    var $eventDetails = $("<a>").attr("href", "./eventdetails.html").text("Full Details");
    $actionDiv.append($eventDetails);

     //append image and Event title to the image div
     $eventImgDiv.append($eventImg, $eventTitle);

    //append the p elements and the button to the card content
    $eventCardBody.append(
      $dateTime,
      $description
    );

    //append the card image div and card body to the card div
    $eventCard.append(
      $eventImgDiv,
      $eventCardBody,
      $actionDiv
      // $detailsButton
    );

    //append the card to the overall event div element
    $eventCardDiv.append($eventCard);

    //and finally append card to the dom
    $("#allEvents").append($eventCardDiv);

  });

  //on click for when user clicks the "info" button on the event card. Goes to Event details page
  //not working I htink I need to add "action" or something to the button when its added
  $("#allEvents").on("click", ".goToDetails", function(event) {
    event.preventDefault();
    console.log("event details button clicked");
  });
    
  





})