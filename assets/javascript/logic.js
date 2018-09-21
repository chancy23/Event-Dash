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

//All images for top of card
var allImages = ["./assets/images/colorSplashBG.jpg", "./assets/images/stagelights.jpg", "./assets/images/pinkfireworks.jpg"]
//functions======================================================================
function getRandomImg() {
 //randomly select an image from the array
 var randomImg = allImages[Math.floor(Math.random() * allImages.length)];
 // console.log(randomImg);
 return randomImg;
};


  //global variables==============================================================


// Twitter Authentication ==========================================================
// Create an instance of the Twitter provider object
var provider = new firebase.auth.TwitterAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    // You can use these server side with your app's credentials to access the Twitter API.
    var token = result.credential.accessToken;
    var secret = result.credential.secret;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });


  firebase.auth().signInWithPopup(provider);


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

  //Google Maps and Smarty Streets APIs=================================================================


// function for map appearing on event card
function map(latLong) {
  console.log(latLong);
  var lat = latLong[0];
  console.log(lat);
  var lng = latLong[1];
  console.log(lng);

  var map = new google.maps.Map(document.getElementById("mapArea"), {
      center: {lat: lat, lng: lng},
      zoom: 16
  });
  
      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: 'Event location'
      });
      console.log(marker);
  }

//If both geocode() and verifyAddress() have run successfully, and address is valid, google maps API runs to get the complete address through geocoding, including longitude and latitude.
function geocode2(location) {
  console.log(location);
  var address = location.join(",");
  console.log(address);
  axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
    params:{
        address: address,
        key: "AIzaSyDk3_3qxzVHdnPcw7syHGUTjO72-Z_Ksss"
    }
  })
  .then(function(response) {
  console.log(response);


  //format address
  console.log(response.data.results[0].formatted_address);

  //Address Components
  console.log(response.data.results[0].address_components);

  //Geometry data
  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  console.log(lat);
  console.log(lng);
  var latLong = [lat, lng];
  console.log(latLong);
  dataCheck(latLong);
  map(latLong);

})
.catch(function(error) {
  console.log(error);
})
}

//Runs Smarty Streets API to check that entered address is valid.
  function verifyAddress(address) {
    var street = address[0];
    // var streetTwo = address[1];
    var city = address[1];
    var state = address[2];
    var zip = address[3];
    var url = "https://us-street.api.smartystreets.com/street-address?auth-id=beff4c51-98d9-dd74-a59f-33303a666a0d&auth-token=kiDHgo3nIXOholQGZQSX&candidates=1";
    var completeUrl = url + "&street=" + street + "&city=" + city + "&state=" + state + "&zipcode=" + zip;
   console.log(completeUrl);

  $.ajax({
  url: completeUrl,
  method: "GET"
  }).then(function(response) {
      console.log(response);
      if (response.length < 1 || response == undefined) {
        $("#invalidAddressError").modal("open");
        // $(".helper-text").show();
        console.log("running?");
        return false;
      } else {
          geocode2(address);
      }
  });
  }

  //intializes grabbing address input info from form. Then fires verifyAddress() function to ensure that an actual address was entered.
function geocode() {

  var street = $("#street").val().trim();
  console.log(street);
  // var streetTwo = document.getElementById("street-two-input").value;
  // console.log(streetTwo);
  var city = $("#city").val().trim();;
  console.log(city);
  var state = $("#state").val().trim();
  console.log(state);
  var zip = $("#zip").val().trim();
  console.log(zip);

  var location = [street, city, state, zip];
  verifyAddress(location);
}

  //this is the onclick for when the "Submit" button is pushed from the Add Event form 
  //add input to the DB and create and display the item on the page
  $("#submitEvent").on("click", function(event) {
    event.preventDefault();
    geocode();

  });
    
  function dataCheck(latLong) {
    console.log(latLong);
    var lat = latLong[0];
    var lng = latLong[1];
    console.log("is this function working?");
    var eventTitle = $("#eventTitle").val().trim();
    var date = $("#date").val().trim();
    var time = $("#time").val().trim();
    var street = $("#street").val().trim();
    var apt = $("#apt").val().trim();
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
        description: description,
        lat: lat,
        lng: lng
      };
      console.log("working?");

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
      console.log("event lat: " + lat);
      console.log("event lng: " + lng);
      console.log("event details: " + description);

      //reset the form after submit is clicked
      resetForm();
    };
  }

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
    lat = cv.lat;
    lng = cv.lng;
    console.log(lat);
    console.log(lng);
    var latLong = [lat, lng];
    map(latLong);
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
      lat = v.lat;
      lng = v.lng;
      description = v.description;
      console.log(lat);
      console.log(lng);

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