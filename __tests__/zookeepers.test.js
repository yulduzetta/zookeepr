const {
  filterByQuery,
  findById,
  createNewZookeeper,
  validateZookeeper,
} = require("../lib/zookeepers");

const { zookeepers } = require("../data/zookeepers.json");
const uuid = require("uuid");

jest.mock("fs");

test("creates a zookeper object", () => {
  const id = uuid.v4();

  const newZooKeeperObject = {
    id: id,
    name: "Test",
    age: 28,
    favoriteAnimal: "sloth",
  };

  const zookeper = createNewZookeeper(newZooKeeperObject, zookeepers);

  expect(zookeper.name).toBe(newZooKeeperObject.name);
  expect(zookeper.id).toBe(newZooKeeperObject.id);
  expect(zookeper.age).toBe(newZooKeeperObject.age);
  expect(zookeper.favoriteAnimal).toBe(newZooKeeperObject.favoriteAnimal);
});

test("filters by query", () => {
  const startingZookeepers = [
    {
      id: 1,
      name: "First",
      age: 28,
      favoriteAnimal: "cat",
    },
    {
      id: 2,
      name: "Second",
      age: 38,
      favoriteAnimal: "dog",
    },
  ];

  const updatedZookeepers = filterByQuery(
    { favoriteAnimal: "dog" },
    startingZookeepers
  );

  expect(updatedZookeepers.length).toEqual(1);
});

test("finds by id", () => {
  const zookeepers = [
    {
      id: 1,
      name: "First",
      age: 28,
      favoriteAnimal: "cat",
    },
    {
      id: 2,
      name: "Second",
      age: 38,
      favoriteAnimal: "dog",
    },
  ];

  const searchResult = findById(1, zookeepers);
  expect(searchResult.name).toBe("First");
});

test("validates zookeeper", () => {
  const validZookeeperObj = {
    id: 1,
    name: "Valid",
    age: 28,
    favoriteAnimal: "cat",
  };
  const invalidZookeeperObj = {
    id: 1,
    name: 123,
    age: "28",
    favoriteAnimal: null,
  };

  expect(validateZookeeper(validZookeeperObj)).toBe(true);
  expect(validateZookeeper(invalidZookeeperObj)).toBe(false);
});
