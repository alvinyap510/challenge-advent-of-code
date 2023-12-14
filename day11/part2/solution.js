/*** Imports ***/
const fs = require("fs");
const { parse } = require("path");
const readline = require("readline");

/*** Class, Constants & Configurations ***/

const EXPAND_FACTOR = 1;

// CRACK WITH SIMPLE MATHS

// test_input.txt => all difference 82
// 1 = 292
// 2 = 374
// 3 = 456
// 4 = 538
// 9 = 948
// 10 = 1030
// 11 = 1112
// 12 = 1194

// input.txt
// 1 = 9269864 // Diff = 377310
// 2 = 9647174
// 1000000 = 9647174 + (377310 x 999998) = 377318892554

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/*** Utilities and Helper Functions */
function logMap(map) {
  for (let line of map) {
    let str = "";
    for (let char of line) {
      str += char;
    }
    console.log(str);
  }
}

function isEmptyRow(line) {
  for (let char of line) {
    if (char !== ".") return false;
  }
  return true;
}

function isEmptyColumn(expandedMap, col) {
  for (let i = 0; i < expandedMap.length; i++) {
    if (expandedMap[i][col] !== ".") return false;
  }
  return true;
}

function getPoint(val, map) {
  let foundPoint;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (parseInt(map[i][j]) === val) {
        foundPoint = new Point(j, i);
        return foundPoint;
      }
    }
  }
}

/*** Sub Logics ***/
function extractMap(linesArray) {
  let map = [];
  for (let line of linesArray) {
    let array = line.split("");
    map.push(array);
  }
  return map;
}

function expandCosmosColumn(expandedMap, col) {
  let expandExpandedMap = [];

  for (let i = 0; i < expandedMap.length; i++) {
    let line = [];
    for (let j = 0; j < expandedMap[i].length; j++) {
      line.push(expandedMap[i][j]);
      if (j === col) {
        for (let i = 0; i < EXPAND_FACTOR - 1; i++) {
          line.push(expandedMap[i][j]);
        }
      }
    }
    expandExpandedMap.push(line);
  }
  return expandExpandedMap;
}

function expandCosmos(map) {
  let expandedMap = [];
  // Expand Rows
  for (let line of map) {
    expandedMap.push(line);
    if (isEmptyRow(line)) {
      for (let i = 0; i < EXPAND_FACTOR - 1; i++) {
        expandedMap.push(line);
      }
    }
  }
  // Expand Column
  for (let i = 0; i < expandedMap[0].length; i++) {
    if (isEmptyColumn(expandedMap, i)) {
      expandedMap = expandCosmosColumn(expandedMap, i);
      i += EXPAND_FACTOR;
    }
  }

  return expandedMap;
}

function markGalaxies(map) {
  let galaxyNum = 1;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        map[i][j] = galaxyNum.toString();
        galaxyNum++;
      }
    }
  }
  return [map, galaxyNum - 1];
}

function generateUniquePairs(num) {
  let uniquePairs = [];
  for (let i = 1; i <= num; i++) {
    for (let j = i + 1; j <= num; j++) {
      let pair = [];
      pair.push(i);
      pair.push(j);
      uniquePairs.push(pair);
    }
  }
  return uniquePairs;
}

function getShortestPath(pair, map) {
  let start = getPoint(pair[0], map);
  let end = getPoint(pair[1], map);

  // Starting and End Point
  console.log("Start Point: ", start);
  console.log("End Point: ", end);

  // Keep track visited points
  const visited = Array.from({ length: map.length }, () =>
    Array(map[0].length).fill(false)
  );

  // Queue to resolve
  let queue = [[start, 0]];
  visited[start.y][start.x] = true;

  while (queue.length > 0) {
    // Process Queue
    const [currentPoint, distance] = queue.shift();

    // Return if found
    if (currentPoint.x === end.x && currentPoint.y === end.y) {
      return distance;
    }

    // Directions
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    for (const [dy, dx] of directions) {
      const nx = currentPoint.x + dx;
      const ny = currentPoint.y + dy;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < map[0].length &&
        ny < map.length &&
        !visited[ny][nx]
      ) {
        queue.push([new Point(nx, ny), distance + 1]);
        visited[ny][nx] = true;
      }
    }
  }
}

/*** Logics ***/
function processInput(linesArray) {
  // Extract Map
  let map = extractMap(linesArray);

  // Expand Cosmos
  map = expandCosmos(map);

  // Mark Galaxy Number
  let totalGalaxies;
  [map, totalGalaxies] = markGalaxies(map);
  console.log("Expanded Marked Map: ");
  logMap(map);

  // Get all unique pairs of galaxies
  let uniquePairs = generateUniquePairs(totalGalaxies);
  console.log(uniquePairs);

  // Get shorted path with dynamic programming
  let totalPaths = 0;
  for (let pair of uniquePairs) {
    totalPaths += getShortestPath(pair, map);
  }
  console.log("Total Paths", totalPaths);
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
