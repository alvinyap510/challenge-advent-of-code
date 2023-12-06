/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/*** Utilities & Helper Functions ***/

/*** Logics ***/

// Function to extract the args into an array of objs
function extractArgsAsObj(linesArray) {
  let times = [];
  let distances = [];
  // Parse Time
  let rawTime = linesArray[0]
    .split(":")[1]
    .split(" ")
    .filter((str) => str !== "");
  for (let time of rawTime) {
    times.push(time);
  }
  let joinedTime = rawTime.join("");
  console.log("Joined Time: ", joinedTime);
  // Parse Distance
  let rawDist = linesArray[1]
    .split(":")[1]
    .split(" ")
    .filter((str) => str !== "");
  for (let dist of rawDist) {
    times.push(dist);
  }
  let joinedDist = rawDist.join("");
  console.log("Joined Distance: ", joinedDist);

  //Combine into an array of Obj
  // let objArray = [];
  // for (let i = 0; i < rawTime.length; i++) {
  //   let obj = {};
  //   obj.time = parseInt(rawTime[i]);
  //   obj.distance = parseInt(rawDist[i]);
  //   objArray.push(obj);
  // }
  // console.log("Parsed arguments: ", objArray);
  // return objArray;
  return [{ time: parseInt(joinedTime), distance: parseInt(joinedDist) }];
}

// Function to check whether a given parameter can win
function gameCanWin(acceleration, totalMatchTime, matchDistance) {
  let speed = acceleration;
  let remainingTime = totalMatchTime - acceleration;
  if (remainingTime * speed > matchDistance) return true;
  return false;
}

// Check all possibilities and sum the winning ways
function checkPossibilities(matches) {
  let winningWays = 0;

  for (let match of matches) {
    let startTime = 0;
    let lastTime = match.time;
    let foundStartingSolution = false;
    let winningStartNum = 0;
    let foundEndingSolution = false;
    let winningEndNum = 0;
    while (startTime <= lastTime) {
      // Only run when the starting winning number havent found
      if (!foundStartingSolution) {
        // Set the winningStartNum if found a solution
        if (gameCanWin(startTime, match.time, match.distance)) {
          winningStartNum = startTime;
          foundStartingSolution = true;
        }
      }
      if (!foundEndingSolution) {
        // Set the winningEndNum if found a solution
        if (gameCanWin(lastTime, match.time, match.distance)) {
          winningEndNum = lastTime;
          foundEndingSolution = true;
        }
      }
      if (foundStartingSolution && foundEndingSolution) break;
      if (!foundStartingSolution) startTime++;
      if (!foundEndingSolution) lastTime--;
    }
    winningWays += winningEndNum - winningStartNum + 1;
    winningEndNum = 0;
    winningStartNum = 0;
    foundStartingSolution = false;
    foundEndingSolution = false;
  }
  return winningWays;
}

function parseInput(linesArray) {
  // Extract args into array of obj
  const matches = extractArgsAsObj(linesArray);
  // Process and calculate possibilities of winning ways
  const winningWays = checkPossibilities(matches);

  console.log("Winning Ways: ", winningWays);
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

    parseInput(linesArray);
  });
}

main();
