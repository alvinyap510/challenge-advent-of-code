// Plan:
// Extract every hands into an object
// Sort every hands according to their strongness using bubble sort
// Create sub functions to
// - determine hand type
// - compare hands

/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/*** Utilities and Helper Functions */
function isAllZeroes(numArray) {
  for (let i of numArray) {
    if (i !== 0) return false;
  }
  return true;
}

/*** Sub Logics ***/
function predictNextNum(line) {
  // Container for multi dimension num array
  let multiNumArray = [];
  // Parse the current line
  let numArray = line.split(" ").map((s) => parseInt(s));

  // Generate the 3 dimension num array
  multiNumArray.push(numArray);

  while (!isAllZeroes(multiNumArray[multiNumArray.length - 1])) {
    let newArray = [];
    for (
      let i = 0;
      i + 1 < multiNumArray[multiNumArray.length - 1].length;
      i++
    ) {
      firstNum = multiNumArray[multiNumArray.length - 1][i];
      secondNum = multiNumArray[multiNumArray.length - 1][i + 1];
      newArray.push(secondNum - firstNum);
    }
    multiNumArray.push(newArray);
  }

  //  Fill the 3 dimension num array to predict the new number of first line
  let matricSize = multiNumArray.length;

  for (let i = matricSize - 1; i - 1 >= 0; i--) {
    // Get the last numbers start from below
    let lastNumOne = multiNumArray[i - 1][multiNumArray[i - 1].length - 1];
    let lastNumTwo = multiNumArray[i][multiNumArray[i].length - 1];
    multiNumArray[i - 1].push(lastNumOne + lastNumTwo);
  }

  // Return the last number of the first num array
  return multiNumArray[0][multiNumArray[0].length - 1];
}

/*** Logics ***/
function processInput(linesArray) {
  // Sum
  let sum = 0;
  // Loop all lines and get the predictive number
  for (let line of linesArray) {
    let nextNum = predictNextNum(line);
    sum += nextNum;
  }
  console.log("Sum: ", sum);
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
