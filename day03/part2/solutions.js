// Bear with me the spagetti code
// Was meant to solve it quick

/* Imports */
const fs = require("fs");
const readline = require("readline");

// Utilities / Helper Functions
function isDigit(char) {
  if (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) return true;
  return false;
}

function isDot(char) {
  return char == ".";
}

function isAsterisk(char) {
  return char == "*";
}

function getGearRatio(linesArray, row, col) {
  // Check
  console.log("\n");
  console.log("Row: ", row, "Column: ", col);
  console.log("\n");

  // Container
  let adjacentNumbers = [];

  // Print Lines
  for (let line of linesArray) {
    console.log(line);
  }

  // Surrounding Parameters
  let upperRow = row === 0 ? 0 : row - 1;
  let lowerRow = row + 1 > linesArray.length - 1 ? row : row + 1;
  let startCol = col === 0 ? 0 : col - 1;
  let endCol = col + 1 > linesArray[0].length - 1 ? col : col + 1;
  console.log("Upper Row: ", upperRow);
  console.log("Current Row: ", row);
  console.log("Lower Row: ", lowerRow);
  console.log("Start Column: ", startCol);
  console.log("End Column: ", endCol);
  console.log("\n");

  // Scan surroundings of asterisk
  for (let i = upperRow; i <= lowerRow; i++) {
    console.log("Here1");
    for (let j = startCol; j <= endCol; j++) {
      console.log("Here2");
      // Reverse to left while is digit
      while (j - 1 >= 0 && isDigit(linesArray[i][j])) {
        j--;
      }
      console.log("Here3");
      // Move forward for one place
      if (!isDigit(linesArray[i][j])) j += 1;
      console.log("Here4"); // debug
      console.log(i, j); // debug
      console.log("Here5");
      for (let k = j; j <= endCol || !isDigit(linesArray[i][k]); k++) {
        numTxt = "";
        while (isDigit(linesArray[i][k])) {
          numTxt += linesArray[i][k];
          k++;
          if (k == linesArray[i].length) break;
        }
        if (numTxt) {
          console.log("Extracted Value: ", numTxt);
          adjacentNumbers.push(numTxt);
        }
        j = k;
        break;
      }
    }
  }
  console.log(adjacentNumbers);
  if (adjacentNumbers.length == 2) {
    return parseInt(adjacentNumbers[0]) * parseInt(adjacentNumbers[1]);
  }

  return 0;
}

// Function to parse each line
function parseLinesArray(linesArray) {
  let sum = 0; // Sum of total gear ratios
  // Loop through all lines
  for (let i = 0; i < linesArray.length; i++) {
    line = linesArray[i];
    // Search for asterisks
    for (let j = 0; j < line.length; j++) {
      if (isAsterisk(linesArray[i][j])) {
        sum += getGearRatio(linesArray, i, j);
      }
    }
  }
  return sum;
}

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
    console.log("Answer: ", parseLinesArray(linesArray));
  });
}

main();

// Answer => 526404
