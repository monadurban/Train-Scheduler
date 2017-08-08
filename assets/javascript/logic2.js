//Initialize Firebase
var config = {
  apiKey: "AIzaSyA49_NPdJ6rbNA7uTQevOsPB6qUuLHsUJE",
  authDomain: "train-scheduler-7c14d.firebaseapp.com",
  databaseURL: "https://train-scheduler-7c14d.firebaseio.com",
  projectId: "train-scheduler-7c14d",
  storageBucket: "train-scheduler-7c14d.appspot.com",
  messagingSenderId: "697187104186"
};

firebase.initializeApp(config);

// a var to represent the database
var database = firebase.database();


// Initial Values
var name = "";
var destination = "";
var firstTrainTime = 0;
var frequency = 0;

$("#trainInfoBtn").on("click", function(event)
  {
    // Don't refresh the page!
    event.preventDefault();
    
    //grabs user input
    var trainName = $("#name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var firstTrainTimeDb = $("#firstTime-input").val().trim();
      firstTrainTimeDb = moment(firstTrainTimeDb, "HH:mm").subtract
        (10,"years").format("X");
    var trainFreq = parseInt($("#frequency-input").val().trim());

    var newTrain = {
      name: trainName,
      destination: trainDest,
      firstTime: firstTrainTimeDb,
      frequency: trainFreq,
      dateAdded: Date.now()
    };

    // uploads train data to the database
    database.ref().push(newTrain);
    
    // Logs everything to console
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.firstTime);
      console.log(newTrain.frequency);
      console.log(newTrain.dateAdded);

    // Clears all of the text-boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#frequency-input").val("");
});

// Firebase watcher + initial loader HINT: .on("value")
  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
      //storing the snapshot.val()
      //var sv = childSnapshot.val();

      // Store everything into a variable.
      var trainName = childSnapshot.val().name;
      var trainDest = childSnapshot.val().destination;
      var trainTime = childSnapshot.val().firstTime;
      var trainFreq = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainTime);
    console.log(trainFreq);


    //Current time
    var diffTime = moment().diff(moment.unix(trainTime), "minutes");
    console.log("DIFFTIME: " + diffTime);

    //Calculates time remaining
    var timeRemaining = moment().diff(moment.unix(trainTime), "minutes") % trainFreq;
    console.log("timeRemaining: " + timeRemaining);
    
    //Calculates time difference
    var timeMinutes = trainFreq - timeRemaining;
    console.log("timeMinutes: " + timeMinutes);
    
    //Minutes until arrival of next train
    var timeArrival = moment().add(timeMinutes, "m").format("LT");
    console.log("ARRIVAL: " + timeArrival);


      // Full list of items to well
      var data = `

        <tr>
          <td>${trainName}</td>
          <td>${trainDest}</td>
          <td>${trainFreq}</td>
          <td>${timeArrival}</td>
          <td>${timeMinutes}</td>
        </tr>

    `

      $("#trainSchedTable").append(data)

    });

      
