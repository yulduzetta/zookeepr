const router = require("express").Router();
const animalRoutes = require("../api/animalRoutes");
const zookeepersRoutes = require("../api/zookeepersRoutes");

router.use([animalRoutes, zookeepersRoutes]);

module.exports = router;
