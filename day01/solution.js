/* Imports */
const fs = require("fs");
const readline = require("readline");

// Helper function to find first digit occurrence
function findFirstDigit(text) {
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) >= 48 && text.charCodeAt(i) <= 57) {
      return text[i];
    }
  }
  return null;
}

// Helper function to find last digit occurrence
function findLastDigit(text) {
  for (let i = text.length; i >= 0; i--) {
    if (text.charCodeAt(i) >= 48 && text.charCodeAt(i) <= 57) {
      return text[i];
    }
  }
  return null;
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

//Answer : 53386 => Correct
