/* Imports */
const fs = require("fs");
const readline = require("readline");

// Utilities / Helper Functions
function isDigit(char) {
  if (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) return true;
  return false;
}

function isDot(char) {
  if (char === ".") return true;
  return false;
}

function isSymbol(char) {
  if (!isDigit(char) && !isDot(char)) return true;
  return false;
}

// Function to scan the surroundings of a number
function nearSymbol(linesArray, numberTxt, row, column) {
  // Print Out Parameters
  console.log("\n");
  console.log("Lines Array: ");
  for (let line of linesArray) console.log(line);
  console.log("Number: ", numberTxt);
  console.log("Row: ", row);
  console.log("Column: ", column);
  console.log("\n");

  // Determine surroudings
  let len = numberTxt.length;
  let upperRow = row === 0 ? 0 : row - 1;
  let lowerRow = row + 1 > linesArray.length - 1 ? row : row + 1;
  let startCol = column === 0 ? 0 : column - 1;
  let endCol =
    column + numberTxt.length > linesArray[0].length - 1
      ? column + numberTxt.length - 1
      : column + numberTxt.length;

  console.log("Number Length: ", len);
  console.log("Upper Row: ", upperRow);
  console.log("Current Row: ", row);
  console.log("Lower Row: ", lowerRow);
  console.log("Start Column: ", startCol);
  console.log("End Column: ", endCol);

  // Scan surroundings
  for (let i = upperRow; i <= lowerRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      if (isSymbol(linesArray[i][j])) return true;
    }
  }
  return false;
}

// Function to parse each line
function parseLinesArray(linesArray) {
  let sum = 0; // Total sum of the values
  let numbersArray = []; // Array to hold valid numbers

  // Loop through all lines
  for (let i = 0; i < linesArray.length; i++) {
    line = linesArray[i];
    // Search for numbers
    for (let j = 0; j < line.length; j++) {
      let fixedPos;
      let numberTxt = "";
      // If encountered a digit, extract the entire number
      if (isDigit(line[j])) {
        fixedPos = j;
        numberTxt += line[j];
        j += 1;
        // Loop forward to extract the entire number
        while (j < line.length && isDigit(line[j])) {
          numberTxt += line[j];
          j++;
        }
        console.log(numberTxt);
        // Determine whether the number is adjacent to a symbol
        // If true then push into array
        if (nearSymbol(linesArray, numberTxt, i, fixedPos)) {
          numbersArray.push(numberTxt);
        }
        numberTxt = "";
      }
    }
  }
  console.log(numbersArray);
  for (let num of numbersArray) {
    sum += parseInt(num);
  }
  console.log(sum);
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
