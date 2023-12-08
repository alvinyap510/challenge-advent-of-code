// Plan:
// Extract every hands into an object
// Sort every hands according to their strongness using bubble sort
// Create sub functions to
// - determine hand type
// - compare hands

/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/*** Utilities & Helper Functions */

/***  Sub Logics ***/
function extractInstructions(linesArray) {
  return linesArray[0];
}

/*** Logics ***/

function processInput(linesArray) {
  // Extract Instructions
  let instructions = extractInstructions(linesArray);
  console.log(instructions);
  // Extract Map
}

/*** Main ***/

async function main() {
  /* Create readstream */
  const fileStream = fs.createReadStream("test_input1.txt");
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
