/* Imports */
const fs = require("fs");
const readline = require("readline");

/* Utilities / Helper Functions */
function extractWinNums(string) {
  let winNumTxt = string.split(":")[1];
  //   console.log(winNumTxt);
  let winNumArr = winNumTxt.split(" ");
  let parsedWinNumArr = [];
  for (let num of winNumArr) {
    if (num !== "") parsedWinNumArr.push(num);
  }
  //   console.log(parsedWinNumArr);
  return parsedWinNumArr;
}

function extractMyHand(string) {
  let myNumArr = string.split(" ");
  let parsedMyNumArr = [];
  for (let num of myNumArr) {
    if (num !== "") parsedMyNumArr.push(num);
  }
  //   console.log(parsedMyNumArr);
  return parsedMyNumArr;
}

/* Sub functions */
function processTxt(linesArray) {
  // Total points
  let instanceArray = [];
  for (let i = 0; i < linesArray.length; i++) {
    instanceArray.push(1);
  }
  console.log(instanceArray);
  let i = 0;
  for (let line of linesArray) {
    let match = 0;
    // Process every hand
    let splittedText = line.split("|");
    let winNum = extractWinNums(splittedText[0]);
    let myNums = extractMyHand(splittedText[1]);

    // Find matches
    for (let num of myNums) {
      if (winNum.includes(num)) match += 1;
    }
    console.log(`Card ${i + 1} Matches: `, match);
    let extraCards = 0;
    for (let j = i; extraCards < match; j++) {
      instanceArray[j + 1] += 1 * instanceArray[i];
      extraCards += 1;
    }
    i++;
  }
  let sum = 0;
  for (num of instanceArray) sum += num;
  return sum;
}

/* Main Function */
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
    for (let line of linesArray) console.log(line);
    console.log("Answer: ", processTxt(linesArray));
  });
}

main();

// Answer => 23673
