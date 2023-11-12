const express = require("express");
const router = express.Router();
const knex = require("../database");

// Returns all reviews

router.get("/", async (request, response) => {
  const result = await knex("review");
  try {
    if (!result.length) {
      return response.status(404).json("No data found");
    } else {
      response.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Enternal server error");
  }
});

// Adds a new review to the database

router.post("/", async (request, response) => {
  debugger;
  const postData = request.body;
  try {
    if (!Object.entries(postData).length) {
      return response.status(400).json("Bad request, nothing to add");
    } else {
      await knex("review").insert(postData);
      response
        .status(201)
        .json({ message: "New review has been added successfully" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// 	Returns a review by id

router.get("/:id", async (request, response) => {
  const givenId = request.params.id;
  const result = await knex("review").select().where("id", givenId);
  try {
    if (!result.length) {
      return response.json(`review with Id: ${givenId} is not found`);
    } else {
      response.json(result);
    }
  } catch {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

// Updates the review by id

router.put("/:id", async (request, response) => {
  const givenId = request.params.id;
  const newData = request.body;
  const res = await knex("review").select("*").where("id", givenId);
  try {
    // if body is empty
    if (!Object.entries(newData).length) {
      return response.status(400).json("Bad request, nothing to update");
    } else if (!res.length) {
      // if there are no such id in review-table
      return response.status(404).json(`review with Id: ${givenId} is not found`);
    } else {
      // updata the data
      await knex("review").select("*").where("id", givenId).update(newData);
    }
    // show the object after the update
    response
      .status(200)
      .json(await knex("review").select("*").where("id", givenId));
  } catch {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

// Deletes the review by id

router.delete("/:id", async (request, response) => {
  const givenId = request.params.id;
  const res = await knex("review").select("*").where("id", givenId);
  try {
    if (!res.length) {
      // if there are no such id in review-table
      return response.status(404).json(`review with Id: ${givenId} is not found`);
    } else {
      await knex("review").where("id", givenId).del();
      response
        .status(200)
        .json(`review object with id: ${givenId} has been deleted`);
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
