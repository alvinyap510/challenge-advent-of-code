// Plan:
// Extract every hands into an object
// Sort every hands according to their strongness using bubble sort
// Create sub functions to
// - determine hand type
// - compare hands

/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/***  ***/
const CARDS_ORDER = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

/*** Utilities & Helper Functions ***/
function isFiveOfAKind(cardCounter) {
  for (let card in cardCounter) {
    if (cardCounter[card] === 5) return true;
  }
  return false;
}

function isFourOfAKind(cardCounter) {
  for (let card in cardCounter) {
    if (cardCounter[card] === 4) return true;
  }
  return false;
}

function isFullHouse(cardCounter) {
  let treeCard = 0;
  let twoCard = 0;
  for (let card in cardCounter) {
    if (cardCounter[card] === 3) treeCard += 1;
    if (cardCounter[card] === 2) twoCard += 1;
  }
  if (treeCard === 1 && twoCard === 1) return true;
  return false;
}

function isThreeOfAKind(cardCounter) {
  let treeCard = 0;
  let twoCard = 0;
  for (let card in cardCounter) {
    if (cardCounter[card] === 3) treeCard += 1;
    if (cardCounter[card] === 2) twoCard += 1;
  }
  if (treeCard === 1 && twoCard !== 1) return true;
  return false;
}

function isTwoPairs(cardCounter) {
  let twoCard = 0;
  for (let card in cardCounter) {
    if (cardCounter[card] === 2) twoCard += 1;
  }
  if (twoCard === 2) return true;
  return false;
}

function isOnePair(cardCounter) {
  let twoCard = 0;
  for (let card in cardCounter) {
    if (cardCounter[card] === 2) twoCard += 1;
  }
  if (twoCard === 1) return true;
  return false;
}

// Determine the strength of a hand
// Five of a kind   : 7
// Four of a kind   : 6
// Full house       : 5
// Three of a kind  : 4
// Two Pair         : 3
// One Pair         : 2
// High Card        : 1
function determineHandStrength(hand) {
  let cards = hand.cards;
  let cardCounter = {};
  for (let card of cards) {
    // if (!card in counter) counter[card] = 0;
    if (!cardCounter.hasOwnProperty(card)) cardCounter[card] = 0;
    cardCounter[card] += 1;
  }

  // console.log Tester
  //   console.log(cardCounter);
  //   console.log("Five of A Kind: ", isFiveOfAKind(cardCounter));
  //   console.log("Four of A Kind: ", isFourOfAKind(cardCounter));
  //   console.log("Full House: ", isFullHouse(cardCounter));
  //   console.log("Three of A Kind: ", isThreeOfAKind(cardCounter));
  //   console.log("Two Pairs: ", isTwoPairs(cardCounter));
  //   console.log("One Pair: ", isOnePair(cardCounter));
  if (isFiveOfAKind(cardCounter)) return 7;
  if (isFourOfAKind(cardCounter)) return 6;
  if (isFullHouse(cardCounter)) return 5;
  if (isThreeOfAKind(cardCounter)) return 4;
  if (isTwoPairs(cardCounter)) return 3;
  if (isOnePair(cardCounter)) return 2;
  return 1; // High Card
}

function compareHands(handOne, handTwo) {
  let handOneStrength = determineHandStrength(handOne);
  let handTwoStrength = determineHandStrength(handTwo);

  if (handOneStrength > handTwoStrength) return "left";
  else if (handTwoStrength > handOneStrength) return "right";
  else {
    let handOneCards = handOne.cards;
    let handTwoCards = handTwo.cards;

    for (let i = 0; i < handTwoCards.length; i++) {
      let cardOneIndex = CARDS_ORDER.indexOf(handOneCards[i]);
      let cardTwoIndex = CARDS_ORDER.indexOf(handTwoCards[i]);
      if (cardOneIndex < cardTwoIndex) return "left";
      if (cardTwoIndex < cardOneIndex) return "right";
    }
  }
}

function bubbleSort(parsedHands) {
  let n = parsedHands.length;
  let swapped;

  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (compareHands(parsedHands[i], parsedHands[i + 1]) == "left") {
        let temp = parsedHands[i];
        parsedHands[i] = parsedHands[i + 1];
        parsedHands[i + 1] = temp;
        swapped = true;
      }
    }
    n--;
  } while (swapped);
  return parsedHands;
}

function calculateWinning(sortedHands) {
  let sum = 0;
  for (let i = 0; i < sortedHands.length; i++) {
    sum += sortedHands[i].bid * (i + 1);
  }
  return sum;
}

function parseArguments(linesArray) {
  // Container to store parsed hands
  let parsedHands = [];

  // Parsing
  for (let line of linesArray) {
    let handObj = {};
    let splittedText = line.split(" ");
    handObj.cards = splittedText[0];
    handObj.bid = parseInt(splittedText[1]);
    parsedHands.push(handObj);
  }
  return parsedHands;
}

/*** Logics ***/
function processInputs(linesArray) {
  // Determine how many hands are there
  const totalHands = linesArray.length;
  console.log("Total Number of Hands: ", totalHands);

  // Extract hand's value into an array of object
  const parsedHands = parseArguments(linesArray);
  console.log("Unsorted Hand: ", parsedHands);
  let sortedHands = bubbleSort(parsedHands);
  console.log("Sorted Hand: ", sortedHands);
  let totalWinnings = calculateWinning(sortedHands);
  console.log("Total Winnings: ", totalWinnings);

  //   for (let hand of parsedHands) determineHandStrength(hand);
}

/*** Main ***/

async function main() {
  /* Create readstream */
  const fileStream = fs.createReadStream("input.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Line Array
  let linesArray = [];

  // Asynchronous
  rl.on("line", (line) => {
    linesArray.push(line);
  });

  // After read line event has finished
  rl.on("close", () => {
    console.log("Input: \n");
    for (let line of linesArray) console.log(line);
    console.log("\n");

    processInputs(linesArray);
  });
}

main();

// function testMain() {
//   const handOne = { cards: "KJT23", bid: 120 };
//   const handTwo = { cards: "KJQ28", bid: 220 };

//   console.log(determineHandStrength(handOne));
//   console.log(determineHandStrength(handTwo));

//   console.log(compareHands(handOne, handTwo));
// }
// testMain();

// Answer: 249483956
