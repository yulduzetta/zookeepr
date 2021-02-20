const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

router.get("/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  // sends data back to client
  res.json(results);
});

router.get("/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    // sends data back to client
    res.sendStatus(404);
  }
});

router.post("/animals", (req, res) => {
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

module.exports  = router;

