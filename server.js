const express = require("express");
const { animals } = require("./data/animals.json");

const PORT = process.env.PORT || 3001;

// instanditates the server
const app = express();

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    // Save personalityTraits as aa dedicated array.
    // If personalityTraaits is a stringg, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Chech the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we are updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }

                // ***************** ROUTES ***************** //
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    if (result){
        res.json(result);
    }
    else {
        res.sendStatus(404);
    }
});

// listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
