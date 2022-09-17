// click the start game
document.querySelector(".control-buttons span").onclick = function () {
  // write the player name
  let yourName = prompt("What's Your Name?");
  // if name empty
  if (yourName == null || yourName == "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    // if there is name
    document.querySelector(".name span").innerHTML = yourName;
  }
  // remove start screen
  document.querySelector(".control-buttons").remove();
  interval = setInterval(displayTimer, 10);
};

// time for rotating images
let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");

let blocks = Array.from(blocksContainer.children);

// هنعمل اراي طولها نفس طول الديفات اللي فيها الصور وهنطلعها من 0 الى 19 مثلا لو اراي 20 عنصر
let orderRange = [...Array(blocks.length).keys()];

// console.log(orderRange);
shuffle(orderRange);
// console.log(orderRange);

// Add Order css to game block
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];

  // Add click event
  block.addEventListener("click", function () {
    // triger the flip block function
    flipBlock(block);
  });
});

// flip block function
function flipBlock(selectedBlock) {
  // Add class to current card
  selectedBlock.classList.add("is-flipped");

  // collect all flipped cards
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );
  // if two selected
  if (allFlippedBlocks.length == 2) {
    // console.log("two");
    // stop clicking function
    stopClicking();

    // check matched block function
    checkedMatchedBlock(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
  festival();
}

// stop clicking function
function stopClicking() {
  // Add class no clicking on main container
  blocksContainer.classList.add("no-clicking");

  // Remove no clicking class after duration
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// check matched block function
function checkedMatchedBlock(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.animal === secondBlock.dataset.animal) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
    document.getElementById("fail").play();
  }
}

// shuffle an array
function shuffle(array) {
  // set variables
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    // get random number
    random = Math.floor(Math.random() * current);
    // decrese length by one
    current--;

    // [1] Save current element in stach
    temp = array[current];

    // [2] current element = random element
    array[current] = array[random];

    // [3] random element = get element from stach
    array[random] = temp;
  }
  return array;
}

document.getElementById("another-game-btn").onclick = () => {
  location.reload();
};

function festival() {
  let hasMatchs = blocks.filter((hasMatch) =>
    hasMatch.classList.contains("has-match")
  );
  if (hasMatchs.length === blocks.length) {
    clearInterval(interval);
    newPlayer();
    showPlayer();
    document.getElementById(
      "your-time"
    ).innerHTML = `Your Time: ${timer.innerHTML}`;
    setTimeout(() => {
      document.querySelector(".win-screen").style.display = "block";
      document.getElementById("win").play();

      document.getElementById("another-game-btn").style.display = "block";

      document.getElementById("my-canvas").style.display = "block";

      let confettiSettings = { target: "my-canvas" };
      let confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    }, duration);
  }
}

let [milliseconds, seconds, minutes] = [0, 0, 0];
let timer = document.querySelector(".stopwatch");
let interval = null;

function displayTimer() {
  milliseconds += 10;

  if (milliseconds == 1000) {
    milliseconds = 0;
    seconds++;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
  }

  let m = minutes < 10 ? `0${minutes}` : minutes;
  let s = seconds < 10 ? `0${seconds}` : seconds;
  let ms =
    milliseconds < 10
      ? `00${milliseconds}`
      : milliseconds < 100
      ? `0${milliseconds}`
      : milliseconds;

  timer.innerHTML = `${m}:${s}:${ms}`;
}

let results = [];

if (localStorage.games != null) {
  results = JSON.parse(localStorage.games);
} else {
  results = [];
}

async function newPlayer() {
  let newPlayer = {
    playerName: document.querySelector(".name span").innerHTML.toLowerCase(),
    playerTime: timer.innerHTML,
    playerWrongTries: document.querySelector(".tries span").innerHTML,
  };

  let result = await results.find(
    (result) => result.playerName === newPlayer.playerName
  );

  if (result) {
    if (+result.playerWrongTries > +newPlayer.playerWrongTries) {
      result.playerWrongTries = newPlayer.playerWrongTries;
      result.playerTime = newPlayer.playerTime;
      document.querySelector("#win-screen div").innerHTML =
        "You Won And Got New Personal Best";
      document
        .querySelector("#win-screen div")
        .classList.add("personal-best-msg");
    } else {
      return false;
    }
  } else {
    results.push(newPlayer);
  }

  window.localStorage.setItem("games", JSON.stringify(results));
  showPlayer();
}

function showPlayer() {
  let playerTable = "";

  // sorting the results before put it in the table
  results.sort((a, b) => a.playerWrongTries - b.playerWrongTries); // b - a for reverse sort

  for (let i = 0; i < results.length; i++) {
    playerTable += `
      <tr>
        <td id="rank">${i + 1}</td>
        <td id="player-name">${results[i].playerName}</td>
        <td id="player-time">${results[i].playerTime}</td>
        <td id="player-wrong-tries">${results[i].playerWrongTries}</td>
      </tr>
    `;
  }
  document.getElementById("player-table-body").innerHTML = playerTable;
}
showPlayer();
