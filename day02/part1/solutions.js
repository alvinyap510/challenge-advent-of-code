/* Imports */
const fs = require("fs");
const readline = require("readline");

/* Readlien Functions */
const LOADED = {
  red: 12,
  green: 13,
  blue: 14,
};

// Function to checkt the possibility
function checkPossible(line, LOADED) {
  let args = line.split(", ");
  console.log(args);
  for (let arg of args) {
    number = parseInt(arg);
    color = arg.split(" ")[1];
    if (number > LOADED[color]) return false;
  }
  return true;
}

function parseLine(line, loaded) {
  // Split the line between game id and values
  splittedLine = line.split(":");
  gameLine = splittedLine[0];
  // Extract Game ID
  gameID = gameLine.substring(5);
  console.log("Game ID: ", gameID);
  // Extract Values
  valueArray = splittedLine[1].split(";");
  for (let i = 0; i < valueArray.length; i++) {
    valueArray[i] = valueArray[i].substring(1);
    console.log(valueArray[i]);
  }
  for (value of valueArray) if (!checkPossible(value, LOADED)) return 0;
  return parseInt(gameID);
}

async function main() {
  /* Create readstream */
  const fileStream = fs.createReadStream("game.txt");
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
    let sum = 0;
    for (line of linesArray) {
      sum += parseLine(line);
    }
    console.log(sum);
  });
}

main();
