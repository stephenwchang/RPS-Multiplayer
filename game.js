// Initialize Firebase
var config = {
  apiKey: "AIzaSyBEyzR3biNI_Ovf-HSGwUz0U_QJq1YXMYk",
  authDomain: "fir-project-2-6fe62.firebaseapp.com",
  databaseURL: "https://fir-project-2-6fe62.firebaseio.com",
  projectId: "fir-project-2-6fe62",
  storageBucket: "",
  messagingSenderId: "742679029203"
  };
firebase.initializeApp(config);

// Initial Values
const db = firebase.firestore(),
      game = db.collection('HW-7').doc('RPS'),
      rpsButton = document.getElementsByClassName("rps-button"),
      usernameButton = document.getElementById("username-button"),
      usernameInput = document.getElementById("username-input"),
      resultsOutput = document.getElementById("results-output"),
      currentChoice = document.getElementById("current-choice"),
      choicesOutput = document.getElementById("choices-output");

let usersOnline,
    userChoice,
    userId,
    userName,
    userNumber;

// disable game buttons prior to usernames being submitted as well as reset game on page load
game.update({
  userOne: false,
  userTwo: false,
  userOneChoice: false,
  userTwoChoice: false
});
disableRpsButtons(true);


// requesting username input from user
usernameButton.addEventListener('click', function() {
  game.get().then(function(doc) {
    if (!doc.data().userOne) {
      userNumber = 1;
      userName = usernameInput.value;
      game.update({
        userOne: userName
      });
      disableRpsButtons(false);
      usernameInput.value = '';
    } else if (!doc.data().userTwo) {
      userNumber = 2;
      userName = usernameInput.value;
      game.update({
        userTwo: userName
      });
      // RPS buttons will activate after both usernames are submitted
      disableRpsButtons(false);
      usernameInput.value = '';
    }
  });
});


// listener
game.onSnapshot(function(doc) {
  // RPS logic on event listener, triggers when both user choices are truthy
  let userOneChoice = doc.data().userOneChoice,
      userTwoChoice = doc.data().userTwoChoice,
      userOneName = doc.data().userOne,
      userTwoName = doc.data().userTwo;
  if (userOneChoice && userTwoChoice) {
    setTimeout(function(){
      disableRpsButtons(false);
      currentChoice.innerHTML = "";
      resultsOutput.innerHTML = "";
      choicesOutput.innerHTML = "";
      game.update({
        userOneChoice: false,
        userTwoChoice: false
      });
    }, 5000);

    choicesOutput.innerHTML = userOneName + " chose " + userOneChoice + ". " + userTwoName + " chose " + userTwoChoice + ".";

    if (userOneChoice === userTwoChoice) {
      resultsOutput.innerHTML = "Tie!";
    } else {
      if (userOneChoice === "rock") {
        if (userTwoChoice === "scissor") {
            resultsOutput.innerHTML = userOneName + " Wins";
        }
        else {
            resultsOutput.innerHTML = userTwoName + " Wins";
        }
    }
      if (userOneChoice === "paper") {
        if (userTwoChoice === "rock") {
            resultsOutput.innerHTML = userOneName + " Wins";
        }
        else {
            resultsOutput.innerHTML = userTwoName + " Wins";
        }
      }
      if (userOneChoice === "scissor") {
        if (userTwoChoice === "paper") {
            resultsOutput.innerHTML = userOneName + " Wins";
        }
        else {
            resultsOutput.innerHTML = userTwoName + " Wins";
        }
      }
    }
  }
});

// click function on each rps button
Array.from(rpsButton).forEach(function(element) {
  element.addEventListener('click', function() {

    // disable buttons until next round limiting user to one choice
    disableRpsButtons(true);

    userChoice = this.value;
    currentChoice.innerHTML = "You have currently selected " + userChoice;

    // get data to see which if userchoices have already been made
      if (userNumber === 1) {
        game.update({
          userOneChoice: userChoice
        });
      } else if (userNumber === 2) {
        game.update({
          userTwoChoice: userChoice
        });
      }

  });
});

// function to enable/disable rps buttons
function disableRpsButtons(boolean) {
  document.getElementById("rock").disabled = boolean;
  document.getElementById("paper").disabled = boolean;
  document.getElementById("scissor").disabled = boolean;
}
