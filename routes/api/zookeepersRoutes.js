const uuid = require("uuid");

const {
  filterByQuery,
  findById,
  createNewZookeeper,
  validateZookeeper,
} = require("../../lib/zookeepers");
const { zookeepers } = require("../../data/zookeepers.json");
const router = require("express").Router();

router.get("/zookeepers", (req, res) => {
  let results = zookeepers;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  // sends data back to client
  res.json(results);
});

router.get("/zookeepers/:id", (req, res) => {
  const result = findById(req.params.id, zookeepers);
  if (result) {
    res.json(result);
  } else {
    // sends data back to client
    res.sendStatus(404);
  }
});

router.post("/zookeepers", (req, res) => {
  // req.body is where our incoming content will be
  req.body.id = uuid.v4();

  // add zookeeper to json file and zookeepers array in this function
  const zookeeper = createNewZookeeper(req.body, zookeepers);

  if (!validateZookeeper(req.body)) {
    // Anything in the 400 range means that it's a user error
    // and not a server error
    console.log(req.body)
    res.status(400).send("The zookeeper is not properly formatted.");
  }
  // sends data back to client
  res.json(zookeeper);
});

module.exports = router;
