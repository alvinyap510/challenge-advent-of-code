// This is reverse brute force solution for day05 part 2
// It is workable but still not elegant way to solve the problem

/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/*** Utilities & Helper Functions ***/

/*** Logics ***/

// Parse the map into obj
function reverseParseMapToObj(mapContainer) {
  let parsedMapContainer = [];

  for (let map of mapContainer) {
    let obj = {};
    for (let line of map) {
      let splittedTxt = line.split(" ");
      obj[splittedTxt[0]] = {};
      obj[splittedTxt[0]].source = parseInt(splittedTxt[1]);
      obj[splittedTxt[0]].range = parseInt(splittedTxt[2]);
    }
    parsedMapContainer.push(obj);
  }
  return parsedMapContainer;
}

// Extract the map in a reverse manner
function reverseExtractMap(linesArray) {
  let i = 0;
  let mapContainer = [];
  // Iterate to the first occurence of "map" word
  while (!linesArray[i].includes("map")) i++;
  let parsedMapContainer;
  // Extract every maps out
  for (; i < linesArray.length; i++) {
    // Jump one line to the values
    if (linesArray[i].includes("map")) i++;
    let subContainer = [];
    while (linesArray[i]) {
      subContainer.push(linesArray[i]);
      i++;
    }
    mapContainer.unshift(subContainer);
    parsedMapContainer = reverseParseMapToObj(mapContainer);
    // console.log(mapContainer);
    // console.log(parsedMapContainer);
  }
  return parsedMapContainer;
}

function traverseToSeed(location, maps) {
  let idx = location;
  for (let map of maps) {
    for (let key in map) {
      let rangeEnd = parseInt(key) + map[key].range - 1;
      if (idx >= parseInt(key) && idx <= rangeEnd) {
        let newIdx = idx - parseInt(key) + map[key].source;
        idx = newIdx;
        break;
      }
    }
  }
  console.log("location: ", location, "seed: ", idx);
  return idx;
}

function processSeedRange(linesArray) {
  let seedRageArr = [];
  let line = linesArray[0].split(":")[1];
  let splitLine = line.split(" ").filter((str) => str !== "");

  for (let i = 0; i < splitLine.length; i += 2) {
    let currentObj = {};
    currentObj.min = parseInt(splitLine[i]);
    currentObj.max = parseInt(splitLine[i]) + parseInt(splitLine[i + 1]) - 1;
    seedRageArr.push(currentObj);
  }
  return seedRageArr;
}

// Check whether a seed is within the seed range or not
function seedExists(seedNum, seedRange) {
  for (let range of seedRange) {
    if (seedNum >= range.min && seedNum <= range.max) return true;
  }
  return false;
}

function reverseTravelling(seedRange, maps) {
  for (let i = 0; i < Infinity; i++) {
    let currentSeed = traverseToSeed(i, maps);
    if (seedExists(currentSeed, seedRange)) return i;
  }
}

function processInput(linesArray) {
  // Get maps as an reverse path form location to seed
  let maps = reverseExtractMap(linesArray);
  let seedRange = processSeedRange(linesArray);

  // Reverse travel to find lowest posible seed that exists
  let lowestLocation = reverseTravelling(seedRange, maps);
  console.log(lowestLocation);
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
    // for (let line of linesArray) console.log(line);
    processInput(linesArray);
  });
}

main();

// answer => 4917124
