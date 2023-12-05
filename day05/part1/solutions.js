/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/*** Utilities & Helper Functions ***/

// Extract the seeds and return it in an array form
function extractSeed(linesArray) {
  let seedLine = linesArray[0];
  let seedArr = seedLine
    .split(":")[1]
    .split(" ")
    .filter((str) => str !== "");
  return seedArr;
}

// Sub function of extractMap to parse mapContainer into obj
function parseMapToObj(mapContainer) {
  let parsedMapContainer = [];

  for (let map of mapContainer) {
    let obj = {};
    for (let line of map) {
      let splittedTxt = line.split(" ");
      obj[splittedTxt[1]] = {};
      obj[splittedTxt[1]].dest = parseInt(splittedTxt[0]);
      obj[splittedTxt[1]].range = parseInt(splittedTxt[2]);
    }
    parsedMapContainer.push(obj);
  }
  return parsedMapContainer;
}

// Extract the value of the mappings
function extractMap(linesArray) {
  let i = 0;
  let mapContainer = [];
  // Iterate to the first occurence of "map" word
  while (!linesArray[i].includes("map")) i++;

  // Extract every maps out
  for (; i < linesArray.length; i++) {
    // Jump one line to the values
    if (linesArray[i].includes("map")) i++;
    let subContainer = [];
    while (linesArray[i]) {
      subContainer.push(linesArray[i]);
      i++;
    }
    mapContainer.push(subContainer);
  }
  let parsedMapContainer = parseMapToObj(mapContainer);
  return parsedMapContainer;
}

// Find location of a seed using the map
function findLocation(seed, maps) {
  let idx = seed;
  console.log(`Seed ${seed}`);
  for (let map of maps) {
    for (let key in map) {
      let rangeEnd = parseInt(key) + map[key].range - 1;
      if (idx >= parseInt(key) && idx <= rangeEnd) {
        let newIdx = idx - parseInt(key) + map[key].dest;
        console.log(`From ${idx} to ${newIdx}`);
        idx = newIdx;
        break;
      }
    }
  }
  console.log("Location", idx);
  return idx;
}

/*** Logics ***/
function inputParser(linesArray) {
  // 1. Extract the values

  // Seed Array
  let seedsArr = extractSeed(linesArray);

  // Maps
  let maps = extractMap(linesArray);

  // Find Location
  let lowestLocationMemory = Infinity;

  for (let seed of seedsArr) {
    let location = findLocation(seed, maps);
    if (location < lowestLocationMemory) {
      lowestLocationMemory = location;
    }
  }

  console.log("Lowest Location: ", lowestLocationMemory);
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
    for (let line of linesArray) console.log(line);
    inputParser(linesArray);
  });
}

main();
