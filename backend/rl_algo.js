const fs = require('fs');
const csv = require('csvtojson');

async function csvToJSON(filepath) {
    const csvData = await fs.promises.readFile(filepath, 'utf8');
    return csv().fromString(csvData);
}

async function getRandomStyleFromJSON() {
    jsonData = await csvToJSON('./final.csv')
    // console.log(jsonData)
    // console.log(Object.keys(jsonData[0]))
    const attributes = Object.keys(jsonData[0])
    // const attributes = jsonData[0].slice(4); // Get attributes from 4th column onwards
  
    // Function to get a random element from an array
    function getRandomInt() {
        return Math.floor(Math.random() * (jsonData.length));
      }
  
    style = {}
    // Loop through remaining objects in JSON array
    for(let i = 4; i < attributes.length;i++){
        style[attributes[i]] = jsonData[getRandomInt()][attributes[i]]
    }

    return style
  
    // Throw an error if no styles were found
    throw new Error('No styles found in the JSON data');
  }

async function runner(){
    const ans = await getRandomStyleFromJSON()
    console.log(ans)
}

runner()

module.exports = {
    getRandomStyleFromJSON
};
