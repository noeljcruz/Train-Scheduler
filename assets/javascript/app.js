
var firebaseConfig = {
    apiKey: "AIzaSyCqHu5QWNuKtXsu5QJOO_chkuwagAYJEok",
    authDomain: "train-scheduler-701a0.firebaseapp.com",
    databaseURL: "https://train-scheduler-701a0.firebaseio.com",
    projectId: "train-scheduler-701a0",
    storageBucket: "",
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

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
        var trainFrequency = childSnapshot.val().frequency;

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