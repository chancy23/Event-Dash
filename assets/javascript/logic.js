$(document).ready(function() {
  //materialize js intialization of components
  //for the modals
  $(".modal").modal();

  //for the date picker, set to auto close when date is picked
  $(".datepicker").datepicker({
    autoClose: true,
    format: "m/dd/yy"
  });

  //for time picker
  $(".timepicker").timepicker();

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
    $("#apt").val("").attr("class", "validate");
    $("#city").val("").attr("class", "validate");
    $("#state").val("").attr("class", "validate");
    $("#zip").val("").attr("class", "validate");
    $("#description").val("");

    //reset the lable active state back to inactive or blank
    $("label").attr("class", "");
  };

  //onclick events=================================================================

  //when cancel in the form is clicked, reset the form to its original state
  $("#cancelButton").click(resetForm);

  //this is the onclick for when the "Submit" button is pushed from the Add Event form 
  //add input to the DB and create and display the item on the page
  $("#submitEvent").on("click", function(event) {
    event.preventDefault();
    
    var eventTitle = $("#eventTitle").val().trim();
    var date = $("#date").val().trim();
    var time = $("#time").val().trim();
    var street = $("#street").val().trim();
    var apt = $("#apt").val().trim();
    var city = $("#city").val().trim();
    var state = $("#state").val().trim();
    var zip = $("#zip").val().trim();
    var description = $("#description").val().trim();

    //make it so that if there is an empty field form won't submit (user input validation)
    if ((eventTitle === "") || (date === "") ||(time === "") || (street === "") || (city === "") || (state === "") || (zip === "")) {
      $("#emptyFieldError").modal("open");
      //make empty required fields turn red, even if they aren't clicked in first...but how
      $(".helper-text").show();
      return false;
      
    }
    //if all complete then they can continue (sends info to DB, clears inputs, and closes form)
    else {

      //google API call to get long/lat and add that as a key and property instea of street, city, state,zip
      //create an object to hold all inputs to send to the DB
      var eventInfo = {
        eventTitle: eventTitle,
        date: date,
        time: time,
        street: street,
        apt: apt,
        city: city,
        state: state,
        zip: zip,
        description: description
      };

      // send the event info to the db under an event node
      database.ref("event/").push(eventInfo);

      //testing area
      console.log("event title: " + eventTitle);
      console.log("event date: " + date);
      console.log("event time: " + time);
      console.log("event street: " + street);
      console.log("event apt: " + apt);
      console.log("event city: " + city);
      console.log("event state: " + state);
      console.log("event zip: " + zip);
      console.log("event details: " + description);

      //reset the form after submit is clicked
      resetForm();
    };
  });

  //on child event for datbase to be call to get the snapshot values
  eventRef.on("child_added", function(snapshotChild) {
    //create a variable to hold the child value
    var cv = snapshotChild.val();

    //create a variable to hold the DB genereated ID for the event (used to call back the specific event)
    var eventKey = snapshotChild.key;

    //assign the child snapshot values to the  variables for the Event Thumbnail
    eventTitle = cv.eventTitle;
    date = cv.date;
    time = cv.time;
    description = cv.description;

    //For the Map API to get the lat/long
    street = cv.street;
    apt = cv.apt;
    city = cv.city;
    state = cv.state;
    zip = cv.zip;

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
    var $detailsButton = $("<button>").addClass("btn modal-trigger btn-floating cyan halfway-fab waves-effect waves-cyan goToDetails");
    $detailsButton.attr("data-id", eventKey);
    $detailsButton.attr("data-target", "eventDetailsModal");
    // var $buttonLink = $("<a>").attr("href", "./eventdetails.html");
    var $buttonIcon = $("<i>").addClass("material-icons").text("info_outline");
    //append icon to the button element
    $detailsButton.append($buttonIcon);

    //create a div for the card content, to put some of the info
    var $eventCardBody = $("<div>").addClass("card-content");
    //create a $var for each db out and assign to a p element to append to card body variable
    var $dateTime = $("<p>").addClass("dateTime").text(date + "  |  " + time);
    var $description = $("<p>").text(description);

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
      $detailsButton
    );

    //append the card to the overall event div element
    $eventCardDiv.append($eventCard);

    //and finally append card to the dom
    $("#allEvents").append($eventCardDiv);

  });

  //on click for when user clicks the "info" button on the event card. Goes to Event details page
  //not working I htink I need to add "action" or something to the button when its added
  // var testID;
  // console.log(testID);
  $("#allEvents").on("click", ".goToDetails", function(event) {
    event.preventDefault();
    //grab the specific event from the DB
    var eventId = $(this).attr("data-id");
    //make a variable of the event info from the child node called event and pass in the event ID
    var query = database.ref().child('event/' + eventId);
    //call the DB and grab the child event for the query variable
    query.on("value", function(snapshot) {
      //a new variable to hold the shapshot value of the key of the event selected
      var v = snapshot.val();

      //assign the child snapshot values to the  variables
      eventTitle = v.eventTitle;
      date = v.date;
      time = v.time;
      street = v.street;
      apt = v.apt;
      city = v.city;
      state = v.state;
      zip = v.zip;
      description = v.description;

      //testing section
      // console.log(v);
      // console.log("Event Detail Title " + eventTitle);
      // console.log("Event Detail date " + date);
      // console.log("Event Detail time " + time);
      // console.log("Event Detail street " + street);
      // console.log("Event Detail apt " + apt);
      // console.log("Event Detail city " + city);
      // console.log("Event Detail state " + state);
      // console.log("Event Detail zip " + zip);
      // console.log("Event Detail description " + description);

      //display in the location on the html page or modal window
      $("#detailTitle").text(eventTitle);
      $("#detailDate").text(date);
      $("#detailTime").text(time);
      $("#detailDescription").text(description);
      $("#detailStreet").text(street);
      $("#detailApt").text(" | " + apt);
      $("#detailCity").text(city);
      $("#detailState").text(state);
      $("#detailZip").text(zip);

      //displays it in the div on the eventsdetails html page
      // $("#test").append(showEventDetails);
      //opens event details pages
    // window.location.href = "./eventdetails.html";
    });
  });

})