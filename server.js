const express = require("express");

// The require() statements will read the index.js files
// in each of the directories indicated.
// If we navigate to a directory that doesn't have an index.html file,
// then the contents are displayed in a directory listing.
// But if there's an index.html file,
// then it is read and its HTML is displayed instead.
// Similarly, with require(), the index.js file will be the default file read
// if no other file is provided,
// which is the coding method we're using here.
const apiRoutes = require("./routes/api");
const htmlRoutes = require("./routes/html");

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


// Any time a client navigates to <ourhost>/api, 
// the app will use the router we set up in apiRoutes.
//  If / is the endpoint, then the router will serve back our HTML routes.
app.use('/api', apiRoutes);

app.use('/', htmlRoutes);

// Provided a file path (static in this case),
// and instruct the server to make these files static resources.
// This means that all of front end code can now be accessed without having
// a specific server endpoint created for it.
app.use(express.static("public"));
/********************** MIDDLEWARE ENDS ***********************/

// ***************** ROUTES ***************** //
// REMEMBER Remember that the order of your routes matter.
// It's important that this route is added before the * route.

// listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
