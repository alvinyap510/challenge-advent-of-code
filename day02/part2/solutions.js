/* Imports */
const fs = require("fs");
const readline = require("readline");

/* Readlien Functions */
const LOADED = {
  red: 12,
  green: 13,
  blue: 14,
};

function getMinLoadingValue(valueArray) {
  // Determine an object to store min value
  let memory = {
    red: 0,
    green: 0,
    blue: 0,
  };

  // Iterate through all games
  for (let line of valueArray) {
    // Split into each single grab
    args = line.split(", ");

    // Iterate through every color in that grab to set the min value
    for (let arg of args) {
      console.log(arg);
      number = parseInt(arg);
      color = arg.split(" ")[1];
      if (memory[color] < number) {
        memory[color] = number;
      }
    }
  }
  console.log(memory);
  let value = 1;
  for (let key in memory) {
    value *= memory[key];
  }
  return value;
}

function parseLine(line) {
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
  return getMinLoadingValue(valueArray);
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
    console.log("Answer: ", sum);
  });
}

main();

// Answer => 71274
