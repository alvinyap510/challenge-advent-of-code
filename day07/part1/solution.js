// Plan:
// Extract every hands into an object
// Sort every hands according to their strongness using bubble sort
// Create sub functions to
// - determine hand type
// - compare hands

/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

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

/*** Utilities & Helper Functions ***/
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
  for (let hand of parsedHands) determineHandStrength(hand);
}

/*** Main ***/

async function main() {
  /* Create readstream */
  const fileStream = fs.createReadStream("test_input.txt");
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
