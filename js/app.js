let matchedCards = []; //stored tha matched cards
let openCards = [];//help to keep track of the flipped cards
let starsMissing = 0;//amount of stars the user lost until he finished
let totalMoves = 0; //total of moves made
let lockBoard = false;// help to lock the board

//Select the stars representing the amount of moves the user have left.
const starList = document.querySelector(".fa.fa-star");
//Select the container informing the amount of moves the user made
const screenCounter = document.getElementById("moveCounter");
//Select the container of the stars in the header
const starCounter = document.querySelector(".stars");
const finalTimer = document.querySelector("#final-timer");
//Select all the cards in the board
const allCards = document.querySelectorAll(".card");
//Select the replay icon on the header
const replay = document.getElementById("replay")
//select the first div that will start the game
const starterDiv = document.querySelector("#easy");
//select the button so we can add an event listener
const gameStarter = document.querySelector("#playButton");

const table = document.querySelector("#contentTable");


//Elements related to all the buttons and text presented in the modal
const cancelButton = document.querySelector("#cancel-button");
const modalRestart = document.querySelector("#game-button");
const modal = document.querySelector("#modal");
const modalText = document.querySelector("#modal-text");
const trophy = document.querySelector("#trophy");
const gameButton = document.querySelector("#game-button");

//modal event listeners and buttons
function executeModal () {
  "use strict";
  modal.style.display = "block";
  trophy.style.display = "block";
};
cancelButton.addEventListener("click", () => {
  "use strict";
  modal.style.display = "none";
  cancelButton.style.display = "none";
  startStop()
});
modalRestart.addEventListener("click", () => {
  "use strict";
  modal.style.display = "none";
  gameReboot();
  resetTimer();
});

// This function Flip the card on clicks.
// Store the fliped on "openCards" and trigger the matchOutcome function.
function flipCard(card) {
  "use strict";
  if (lockBoard === true) return; //avoid clicking in more than two cards at once
  if (card === openCards[0]) return; //avoid double clicking
  card.classList.add("open", "show");
  openCards.push(card);
  if (openCards.length === 2) {
    lockBoard = true;
    const [a,b] = openCards; // will use destructuring to assign value from the array
    openCards = []
    matchOutcome(a, b);
  };
};
// Unflip the cards removing all effect classes.
function unflipCard(card) {
  "use strict";
  card.classList.remove("open", "show", "fail", "match");
};
// This function it's trigerred when the card match fail.
function matchFail(cardA, cardB) {
  "use strict";
  cardA.classList.add("fail");
  cardB.classList.add("fail");
  setTimeout(() => unflipCard(cardA), 700);
  setTimeout(() => unflipCard(cardB), 700);
};
// This function is triggered when the card match is successful
function matchSuccess (cardA, cardB) {
  "use strict";
  cardA.removeEventListener("click", flipCard);
  cardB.removeEventListener("click", flipCard);
  cardA.classList.add("match");
  cardB.classList.add("match");
  matchedCards.push(cardA, cardB) //stpre the cards in the array
};
// This analyze the outcome of the drawgame, if the cards match or dont
// Also will keep track the amount of moves made by the user
function matchOutcome(cardA, cardB) {
  "use strict";
    if (cardA.dataset.framework !== cardB.dataset.framework) {
      matchFail(cardA, cardB);
      moveCounter();
      setTimeout(() => lockBoard = false, 600)
    } else {
      moveCounter();
      matchSuccess(cardA, cardB);
      setTimeout(() => lockBoard = false, 600)
    };
};
//this Function will update the rank and display it to the user when the game is over
function rankTable () {
  "use strict";
  let starCounter = document.querySelector(".stars");
  let rankCounter = document.querySelector("#ranker");
  rankCounter.appendChild(starCounter.cloneNode(true));
  table.style.display = "flex";
}

//This function will terminate the game when the user match all the cards
function gameOver() {
  "use strict";
  if (matchedCards.length === 16) {
    startStop();
    rankTable();
    finalTimer.textContent = `${displayMinutes}:${displaySeconds}`;
    cancelButton.style.display = "none";
    gameButton.textContent = `Play Again`;
    modalText.textContent = `Congratulations! You finished the game in ${totalMoves} moves!`;
    executeModal();
  }
};
//Used a more simplier version of shuffle changing the order of the cards
//by chaging their order style for a random number.
function shuffle () {
  "use strict";
  allCards.forEach(card => {
    unflipCard(card);;
    let randomNum = Math.floor(Math.random() * 12);
    card.style.order = randomNum;
  });
}
// Reset the game, all the variables are back to their original values and the cards are shuffled.
function gameReboot () {
  "use strict";
  for (let i = 0; starsMissing > i; i++) {
    starCounter.appendChild(starList.cloneNode(true))
    };
    starsMissing = 0;
    cancelButton.style.display = "none";
    matchedCards = [];
    openCards = [];
    totalMoves = 0;
    table.style.display = "none";
    screenCounter.textContent = `${totalMoves} Moves`;
    ranker.innerHTML ="";
    shuffle();
  };

//Count the amount of movements the user made to change the rank and remove stars from the rank
function moveCounter() {
  "use strict";
  totalMoves ++;
  screenCounter.textContent = `${totalMoves} Moves`
  switch (totalMoves) {
    case 10:
    starRemover();
    break;
    case 14:
    starRemover();
    break;
  }
};
//remove the stars from the rank
function starRemover () {
  "use strict"
  let starList = document.querySelector(".fa.fa-star");
  starList.remove();
  starsMissing++;
};


//All elements are related to the stopWatch function
let seconds = 0;
let minutes = 0;
let displaySeconds = 0;
let displayMinutes = 0;
let interval = null;
let status = "stopped";
let timerDisplay = document.querySelector(".display");

// Function stopWatch will keep track of the time the user played
function stopWatch () {
  "use strict";
  seconds++
  if (seconds === 60) {
    seconds = 0;
    minutes ++;
  };
  if (seconds < 10) {
    displaySeconds = "0" + seconds.toString();
  } else {
    displaySeconds = seconds;
  };
  if (minutes < 10) {
    displayMinutes = "0" + minutes.toString();
  } else{
    displayMinutes = minutes
  };
  timerDisplay.innerHTML = `Timer ${displayMinutes}:${displaySeconds}`;
};
//Will pause or start the stopwatch when triggered
function startStop () {
  "use strict";
  if(status === "stopped") {
    interval = window.setInterval(stopWatch, 1000);
    status = "started"
  } else {
    window.clearInterval(interval);
    status = "stopped";
  }
};
//Will reset the timer of the stopwatch when triggered
function resetTimer () {
  "use strict";
  seconds = 0;
  minutes = 0;
  displaySeconds = 0;
  displayMinutes = 0;
  timerDisplay.innerHTML = `Timer 0${displayMinutes}:0${displaySeconds}`;
  setTimeout(() => startStop (), 100);
}

// remove the div that start the game
function boxRemove () {
  "use strict";
  starterDiv.style.display ="none";
}
//Add the event listener to start button and initialize the game
gameStarter.addEventListener("click", () => {
  "use strict";
  gameReboot();
  boxRemove();
  startStop();
  //add the event listener to the cards
  allCards.forEach(card => {
    card.addEventListener("click", () => {
      "use strict";
      flipCard(card);
      gameOver();
    }, true);});
    // add the event listener to the reset button on the control board
  replay.addEventListener("click", () => {
    "use strict";
    executeModal ();
    startStop()
    trophy.style.display = "none";
    cancelButton.style.display = "inline";
    modalText.textContent = `You are about to restart the game.
    Do you want to continue?`;
    gameButton.textContent = `Restart`;
  });
});
