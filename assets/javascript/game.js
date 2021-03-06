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
      choicesOutput = document.getElementById("choices-output"),
      waiting = document.getElementById("waiting-for-opponent");

let usersOnline,
    userChoice,
    userId,
    userName,
    userNumber,
    choicePicked = false;

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
usernameButton.disabled = true;
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
  let userOneChoice = doc.data().userOneChoice,
      userTwoChoice = doc.data().userTwoChoice,
      userOneName = doc.data().userOne,
      userTwoName = doc.data().userTwo;


  // RPS logic on event listener, triggers when both user choices are truthy
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

    choicePicked = false;
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

  // opponent status
  if (userName && userOneName && !userTwoName) {
    waiting.innerHTML = "waiting for opponent...";
  } else if (!userName && userOneName && !userTwoName) {
    waiting.innerHTML = "you have an opponent waiting, please enter a username!";
  } else if (userOneName && userTwoName && !userOneChoice && !userTwoChoice) {
    waiting.innerHTML = "Make your choice! Good luck!";
  } else if (!choicePicked && (userOneChoice && !userTwoChoice || userTwoChoice && !userOneChoice)) {
    waiting.innerHTML = "You're opponent has made their choice. Now it is up to you.";
  } else {
    waiting.innerHTML = "";
  }
});

// click function on each rps button
Array.from(rpsButton).forEach(function(element) {
  element.addEventListener('click', function() {

    // disable buttons until next round limiting user to one choice
    disableRpsButtons(true);

    userChoice = this.value;
    currentChoice.innerHTML = "You have currently selected " + userChoice;
    choicePicked = true;

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



// chat functionality


const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');
const button = document.getElementById('button');

db.collection("HW-7-Chat").orderBy("date")
.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
        if (change.type === "added") {
          renderChat(change.doc.data().text, change.doc.data().timestamp, change.doc.data().user);
        }
        if (change.type === "modified") {
            console.log("Modified city: ", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("Removed city: ", change.doc.data());
        }
    });
});



// on button click, set variable to input, input into server
button.addEventListener('click', function() {
  if (userName) {
    let text = chatInput.value.trim();
    let date = Date.now();
    let timeStamp = moment().format("hh:mm A");

    db.collection('HW-7-Chat').add({
      text: text,
      date: date,
      timestamp:timeStamp,
      user: userName
    })
    chatInput.value = '';
  } else {
    alert('please enter a username before chatting')
  }
});

// renders chat
function renderChat(text, time, user) {
  let div = document.createElement('div');
  div.setAttribute('class', 'chat-line');
  div.innerHTML = time + ": " + user + ": " + text;
  chatBox.appendChild(div);

  // automatically scroll to bottom of chat box
  chatBox.scrollTop = chatBox.scrollHeight;

}

// enter key = submit button

chatInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    button.click();
  }
});
