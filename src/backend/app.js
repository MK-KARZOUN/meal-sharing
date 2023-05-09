const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const knex = require("./database");
const mealsRouter = require("./api/meals");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const cors = require("cors");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/meals", mealsRouter);

router.get("/all-meals", async (request, response, next) => {
  try {
    const result = await knex("meal").select("*")
    response.json(result);
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage="Enternal server error"
  }
});

router.get("/future-meals", async (request, response) => {
  try {
    const result = await knex("meal")
      .select("*")
      .where("when_", ">", new Date());
    response.json(result);
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage = "Enternal server error";
  }
});

router.get("/past-meals", async (request, response) => {
  try {
    const result = await knex("meal")
      .select("*")
      .where("when_", "<", new Date());
    response.json(result);
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage = "Enternal server error";
  }
});
router.get("/first-meal", async (request, response) => {
  try {
    const result = await knex("meal").select("*").orderBy("id").first();
    if (!result) {
      response.send("there are no meals");
      response.status = 404;
    }
    response.json(result);
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage = "Enternal server error";
  }
});

router.get("/last-meal", async (request, response) => {
  try {
    const result = await knex("meal").select("*").orderBy("id", "desc").first();
    if (!result) {
      response.send("there are no meals");
      response.status = 404;
    }
    response.json(result);
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage = "Enternal server error";
  }
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file";
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;
