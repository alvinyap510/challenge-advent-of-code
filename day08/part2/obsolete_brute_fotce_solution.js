// Plan:
// Extract every hands into an object
// Sort every hands according to their strongness using bubble sort
// Create sub functions to
// - determine hand type
// - compare hands

/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/***  Sub Logics ***/
// Extract instructions into a single string
function extractInstructions(linesArray) {
  return linesArray[0];
}

// Extract map into an object
function extractMap(linesArray) {
  let mapContainer = {};

  for (let i = 2; i < linesArray.length; i++) {
    let splittedText = linesArray[i].split(" = ");
    let key = splittedText[0];
    let [left, right] = splittedText[1].split(", ");
    left = left.replace("(", "");
    right = right.replace(")", "");
    mapContainer[key] = {};
    mapContainer[key].left = left;
    mapContainer[key].right = right;
  }
  return mapContainer;
}

function getMultiStartingPoints(map) {
  let startingPoints = [];
  for (let key in map) {
    if (key.endsWith("A")) startingPoints.push(key);
  }
  return startingPoints;
}

function allEndsWithZ(positions) {
  for (let pos of positions) {
    if (!pos.endsWith("Z")) return false;
  }
  return true;
}

function travel(instructions, positions, map) {
  let stepCounter = 0;
  let instructionsLength = instructions.length;
  while (!allEndsWithZ(positions)) {
    let direction = instructions[stepCounter % instructionsLength]; // L or R
    for (let i = 0; i < positions.length; i++) {
      if (direction == "L") {
        positions[i] = map[positions[i]].left;
      } else if (direction == "R") {
        positions[i] = map[positions[i]].right;
      }
    }
    stepCounter++;
    if (stepCounter % 1000000 === 0) console.log("Current Step: ", stepCounter);
  }
  console.log("Ending Points", positions);
  console.log("Final Steps: ", stepCounter);
}

/*** Logics ***/
function processInput(linesArray) {
  // Extract Instructions
  let instructions = extractInstructions(linesArray);
  console.log("Instructions: \n", instructions);

  // // Extract Map
  let map = extractMap(linesArray);
  console.log("Map: \n", map);

  // Extract Multiple Starting Points into Array
  let startingPoints = getMultiStartingPoints(map);
  console.log("Starting Points", startingPoints);
  // // Travel to end
  travel(instructions, startingPoints, map);
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

    processInput(linesArray);
  });
}

main();
