/*** Imports ***/
const fs = require("fs");
const { parse } = require("path");
const readline = require("readline");

/*** Class, Constants & Configurations ***/

/*** Utilities and Helper Functions */
function isDoneFilling(settings) {
  for (let char of settings) {
    if (char === "?") return false;
  }
  return true;
}

function isObjEquivalent(combination, objA, objB) {
  // Get the keys of both objects
  let aProps = Object.getOwnPropertyNames(objA);
  let bProps = Object.getOwnPropertyNames(objB);

  // If number of properties is different, objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  // Check value of each property
  for (let prop of aProps) {
    if (objA[prop] !== objB[prop]) {
      return false;
    }
  }
  console.log(combination);
  console.log(objA);
  console.log(objB);

  // If we made it this far, objects are considered equivalent
  return true;
}

function subValidate(splitedSprings, splitedConditions) {
  if (splitedSprings.length !== splitedConditions.length) return false;

  for (let i = 0; i < splitedSprings.length; i++) {
    if (splitedSprings[i].length !== splitedConditions[i]) return false;
  }
  return true;
}

/*** Sub Logics ***/
function generateAllCombinations(settings) {
  let allPossibles = [];

  let DFS = (settings) => {
    if (isDoneFilling(settings)) {
      allPossibles.push(settings);
    } else {
      for (let i = 0; i < settings.length; i++) {
        if (settings[i] === "?") {
          let str1 = settings.slice(0, i) + "#" + settings.slice(i + 1);
          let str2 = settings.slice(0, i) + "." + settings.slice(i + 1);
          DFS(str1);
          DFS(str2);
          break;
        }
      }
    }
  };
  DFS(settings);
  return allPossibles;
}

function validateCombinations(allPossibleCombinations, condition) {
  let valid = 0;

  // Parse Conditions
  let splitedConditions = condition
    .split(",")
    .map((element) => parseInt(element));

  // Split all possible combinations
  for (let combination of allPossibleCombinations) {
    let splitedSrpings = combination.split(".").filter((str) => str !== "");
    if (subValidate(splitedSrpings, splitedConditions)) valid += 1;
  }
  return valid;
}

function calculatePossibilities(arg) {
  // Settings
  let settings = arg[0];
  // Conditions
  let condition = arg[1];

  // Generate all possible combinations
  let allPossibleCombinations = generateAllCombinations(settings);
  // console.log(allPossibleCombinations);

  // Validate all valid conbinations
  let validCombinations = validateCombinations(
    allPossibleCombinations,
    condition
  );
  return validCombinations;
}

/*** Logics ***/
function processInput(linesArray) {
  let args = [];

  // Extract Settings
  for (let line of linesArray) {
    let splitString = line.split(" ");
    args.push(splitString);
  }

  let sum = 0;
  console.log(args);

  for (let arg of args) {
    sum += calculatePossibilities(arg);
  }
  console.log("Valid Combinations: ", sum);
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
