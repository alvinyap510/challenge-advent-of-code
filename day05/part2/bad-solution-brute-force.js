// There is a whopping 1 billion + seeds
// Need to use different way other than brute borce

/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/*** Utilities & Helper Functions ***/

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
  //   console.log(`Seed ${seed}`);
  for (let map of maps) {
    for (let key in map) {
      let rangeEnd = parseInt(key) + map[key].range - 1;
      if (idx >= parseInt(key) && idx <= rangeEnd) {
        let newIdx = idx - parseInt(key) + map[key].dest;
        // console.log(`From ${idx} to ${newIdx}`);
        idx = newIdx;
        break;
      }
    }
  }
  //   console.log("Location", idx);
  return idx;
}

function processSeed(linesArray, maps) {
  // Lowest Location Memory
  let lowestLocationMemory = Infinity;

  // Original Extract Seed
  let seedLine = linesArray[0];
  let intermediateArr = seedLine
    .split(":")[1]
    .split(" ")
    .filter((str) => str !== "");

  let track = 0;
  for (let i = 0; i < intermediateArr.length; i += 2) {
    for (let k = 0; k < parseInt(intermediateArr[i + 1]); k++) {
      let location = findLocation(parseInt(intermediateArr[i]) + k, maps);
      //   console.log(`Comparaing ${location} to ${lowestLocationMemory}`);
      if (location < lowestLocationMemory) {
        lowestLocationMemory = location;
      }
      if (track % 100_000 == 0) console.log("Track", track);
      track++;
    }
  }
  return lowestLocationMemory;
}

/*** Logics ***/
function inputParser(linesArray) {
  // Maps
  let maps = extractMap(linesArray);

  let lowestLocationMemory = processSeed(linesArray, maps);

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

// Answer => 993500720
