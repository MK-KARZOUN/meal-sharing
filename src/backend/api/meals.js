const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/all-meals", async (request, response, next) => {
  try {
    const result = await knex("meal").select("*")
    response.json(result);
    return  next();
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage="Enternal server error"
  }
});

router.get("/future-meals", async (request, response, next) => {
  try {
    const result = await knex("meal")
    .select("*")
    .where('when_', '>',  new Date())
    response.json(result);
    return  next();
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage="Enternal server error"
  }
});

router.get("/past-meals", async (request, response, next) => {
  try {
    const result = await knex("meal")
    .select("*")
    .where('when_', '<',  new Date())
    response.json(result);
    return  next();
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage="Enternal server error"
  }

});
router.get("/first-meal", async (request, response, next) => {
  try {
    const result = await knex("meal")
    .select("*")
    .orderBy('id').first();
    if(!result){
      response.send("there are no meals");
      response.status = 404;
    }
    response.json(result);
    return next();
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage="Enternal server error"
  }
});

router.get("/last-meal", async (request, response, next) => {
  try {
    const result = await knex("meal")
    .select("*")
    .orderBy('id', 'desc').first();
    if(!result){
      response.send("there are no meals");
      response.status = 404;
    }
    response.json(result);
    return next();
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.statusMessage="Enternal server error"
  }
});

module.exports = router;
