
var firebaseConfig = {
    apiKey: "AIzaSyA6k2WLjpA78K1rsNlRl7K2jcM0rILkkLs",
    authDomain: "projectname-8d1ad.firebaseapp.com",
    databaseURL: "https://projectname-8d1ad.firebaseio.com",
    projectId: "projectname-8d1ad",
    storageBucket: "",
    messagingSenderId: "945579325544",
    appId: "1:945579325544:web:d0eb09ca59574b74"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function (snap) {

    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

connectionsRef.on("value", function (snapshot) {

    $("#train-table > tbody").text(snapshot.numChildren());
});

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        first: firstTrain,
        frequency: trainFrequency
    };

    database.ref().push(newTrain);

    alert("Train successfully added");

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

    database.ref().on("child_added", function (childSnapshot) {

        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().first;

        var frequency = parseInt(frequency);

        var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

        var currentTime = moment();

        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

        var remainingTime = diffTime % trainFrequency;

        var minutesAway = trainFrequency - remainingTime;

        var nextTrain = moment().add(minutesAway, "minutes");

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(nextTrain),
            $("<td>").text(minutesAway),
        );

        $("#train-table > tbody").append(newRow);
    });
});