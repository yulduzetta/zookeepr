const express = require("express");
const fs = require("fs");

// This is another module built into the Node.js API that
// provides utilities for working with file and directory paths.
// It ultimately makes working with our file system a little more predictable,
// especially when we work with production environments such as Heroku.
const path = require("path");

const { animals } = require("./data/animals.json");

const PORT = process.env.PORT || 5000;

// instanditates the server
const app = express();

/********************** MIDDLEWARE BEGINS ***********************/
// app.use() is a method executed by our Express.js server that
// mounts a function to the server that our requests will pass through
// before getting to the intended endpoint.
// The functions we can mount to our server are referred to as middleware.
// Middleware functions can serve many different purposes.
// Ultimately they allow us to keep our route endpoint callback functions more readable
// while letting us reuse functionality across routes to keep our code DRY.

// It takes incoming POST data and converts it to key/value pairings that
// can be accessed in the req.body object.
// The extended: true option set inside the method call informs our server that
// there may be sub-array data nested in it as well,
// so it needs to look as deep into the POST data as possible
// to parse all of the data correctly.
app.use(express.urlencoded({ extended: true }));

// Takes incoming POST data in the form of JSON and
// parses it into the req.body JavaScript object.
app.use(express.json());

// Provided aa filre path (static in this case),
// and instruct the server to make these files static resources.
// This means that all of front end code can now be accessed without having
// a specific server endpoint created for it.
app.use(express.static("public"));
/********************** MIDDLEWARE ENDS ***********************/

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
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  console.log(body);
  // our function's main codee will go here!
  const animal = body;
  animalsArray.push(animal);

  // Synchronous version of fs.writeFile() and doesn't require a callback function.
  // If we were writing to a much larger data set, the asynchronous version would be better.
  // But because this isn't a large file, it will work for our needs.
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),

    // Next, we need to save the JavaScript array data as JSON,
    // so we use JSON.stringify() to convert it.
    // The other two arguments used in the method, null and 2,
    // are means of keeping our data formatted.
    // The null argument means we don't want to edit any of our existing data;
    // if we did, we could pass something in there.
    // The 2 indicates we want to create white space between our values
    // to make it more readable.
    // If we were to leave those two arguments out,
    // the entire animals.json file would work, but it would be really hard to read.
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

// ***************** ROUTES ***************** //
// REMEMBER Remember that the order of your routes matter.
// It's important that this route is added before the * route.

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  // sends data back to client
  res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    // sends data back to client
    res.sendStatus(404);
  }
});

app.post("/api/animals", (req, res) => {
  // req.body is wheere our incoming content will be
  console.log(req.body);

  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);

  if (!validateAnimal(req.body)) {
    // Anything in the 400 range means that it's a user error
    // and not a server error
    res.status(400).send("The animal is now properly formatted.");
  }
  // sends data back to client
  res.json(animal);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});

app.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

// listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
