/* Imports */
const fs = require("fs");
const readline = require("readline");

const VALUE_DICT = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  zero: 0,
};

function isDigit(char) {
  // Evaluate
  if (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) return true;
  return false;
}

function findFirstDigit(text) {
  for (let i = 0; i < text.length; i++) {
    // If is numeric, directly return the value
    if (isDigit(text[i])) return text[i];

    let word = "";
    // If is alphabet
    for (let j = i; j < text.length && !isDigit(text[j]); j++) {
      word += text[j];
      if (word in VALUE_DICT) {
        return VALUE_DICT[word].toString();
      }
    }
  }
}

function findLastDigit(text) {
  for (let i = text.length - 1; i >= 0; i--) {
    // If is numeric, directly return the value
    if (isDigit(text[i])) return text[i];

    let word = "";
    // If is alphabet
    for (let j = i; j < text.length && !isDigit(text[j]); j++) {
      word += text[j];
      if (word in VALUE_DICT) {
        return VALUE_DICT[word].toString();
      }
    }
  }
}

function parseValue(text) {
  let firstDigit = findFirstDigit(text);
  let lastDigit = findLastDigit(text);
  return firstDigit + lastDigit;
}

async function main() {
  /* Create readstream */
  const fileStream = fs.createReadStream("input.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  /* Code */
  let processed_value_array = [];

  // Asynchronous
  rl.on("line", (line) => {
    const value = parseValue(line);
    processed_value_array.push(value);
  });

  // After read line event has finished
  rl.on("close", () => {
    console.log("Processed line value : ", processed_value_array);
    let sum = 0;
    for (value of processed_value_array) {
      sum += parseInt(value);
    }
    console.log("Sum : ", sum);
  });
}

main();

//Answer : 53312 => Correct
