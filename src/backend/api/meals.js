const express = require("express");
const router = express.Router();
const knex = require("../database");

// Returns all meals

// router.get("/", async (request, response) => {
//   const result = await knex("meal");

//   try {
//     if (!result.length) {
//       return response.status(404).json("No data found");
//     } else {
//       response.status(200).json(result);
//     }
//   } catch (error) {
//     console.error(error);
//     response.status(500).send("Enternal server error");
//   }
// });

// Adds a new meal to the database

router.post("/", async (request, response) => {
  const postData = request.body;
  const result = await knex("meal").insert(postData);
  try {
    if (!Object.entries(postData).length) {
      return response.status(400).json("Bad request, nothing to add");
    } else {
      response
        .status(201)
        .json({ message: "New meal has been added successfully" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// Returns the meal by id

router.get("/:id", async (request, response) => {
  const givenId = request.params.id;
  const result = await knex("meal").select().where("id", givenId);
  try {
    if (!result.length) {
      return response.json(`Meal with Id: ${givenId} is not found`);
    } else {
      response.json(result);
    }
  } catch {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

// Updates the meal by id

router.put("/:id", async (request, response) => {
  const givenId = request.params.id;
  const newData = request.body;
  const res = await knex("meal").select("*").where("id", givenId);
  try {
    // if body is empty
    if (!Object.entries(newData).length) {
      return response.status(400).json("Bad request, nothing to update");
    } else if (!res.length) {
      // if there are no such id in meal-table
      return response.status(404).json(`Meal with Id: ${givenId} is not found`);
    } else {
      // updata the data
      await knex("meal").select("*").where("id", givenId).update(newData);
    }
    // show the object after the update
    response
      .status(200)
      .json(await knex("meal").select("*").where("id", givenId));
  } catch {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

// Deletes the meal by id

router.delete("/:id", async (request, response) => {
  const givenId = request.params.id;
  const res = await knex("meal").select("*").where("id", givenId);
  try {
    if (!res.length) {
      // if there are no such id in meal-table
      return response.status(404).json(`Meal with Id: ${givenId} is not found`);
    } else {
      await knex("meal").where("id", givenId).del();
      response
        .status(200)
        .json(`meal object with id: ${givenId} has been deleted`);
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

// query parameters
router.get("/", async (request, response) => {
  const {
    maxPrice,
    availableReservations,
    title,
    dateAfter,
    dateBefore,
    limit,
    sortKey,
    sortDir,
  } = request.query;

  const isEmptyQuery = Object.keys(request.query).length === 0;
  if (isEmptyQuery) {
    const result = await knex("meal").select("*");
    return response.json(result);
  }

  let res = knex("meal");

  // Returns all meals that are cheaper than maxPrice.
  if (maxPrice) {
    const parsedMaxPrice = parseInt(maxPrice);
    if (isNaN(parsedMaxPrice)) {
      return response
        .status(400)
        .json("Bad request, maxPrice value is not valid");
    }
    res = res.select("*").where("price", "<=", parsedMaxPrice);
  }

  // Returns all meals that still have available spots left, if true. If false, return meals that have no available spots left
  if (availableReservations) {
    if (availableReservations.toLowerCase() === "true") {
      const result = await knex("meal")
        .select(
          "title as Meal_Name",
          knex.raw(
            "(max_reservations - count(reservation.id)) as Available_Spots"
          )
        )
        .leftJoin("reservation", "meal.id", "reservation.meal_id")
        .groupBy("title", "max_reservations")
        .havingRaw("COUNT(reservation.id) < max_reservations");
      return response.json(result);
    } else if (availableReservations.toLowerCase() === "false") {
      const result = await knex("meal")
        .select("title", "price", "description")
        .leftJoin("reservation", "meal.id", "reservation.meal_id")
        .groupBy("title", "max_reservations", "price", "description")
        .havingRaw("COUNT(reservation.id) >= max_reservations");
      return response.json(result);
    } else {
      return response
        .status(400)
        .json("Bad request, availableReservations value is not valid");
    }
  }

  // Returns all meals that partially match the given title. Rød grød will match the meal with the title Rød grød med fløde.
  if (title) {
    if (!title.length) {
      return response
        .status(400)
        .json("Bad request, there is no value for title");
    }
    res = res.select("*").where("title", "like", `%${title}%`);
  }

  // Returns all meals where the date for when is after the given date.
  if (dateAfter) {
    if (!dateAfter.length) {
      return response
        .status(400)
        .json("Bad request, there is no value for dateAfter");
    }
    res = res.where("when_", ">=", `${dateAfter}`);
  }

  // Returns all meals where the date for when is before the given date.
  if (dateBefore) {
    if (!dateBefore.length) {
      return response
        .status(400)
        .json("Bad request, there is no value for dateBefore");
    }
    res = res.where("when_", "<=", `${dateBefore}`);
  }

  // Returns the given number of meals.
  if (limit) {
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit)) {
      return response.status(400).json("Bad request, limit value is not valid");
    }
    res = res.limit(parsedLimit);
  }

  // Returns all meals sorted by the given key. Allows when, max_reservations and price as keys. Default sorting order is asc(ending).
  // Returns all meals sorted in the given direction. Only works combined with the sortKey and allows asc or desc.
  if (sortKey) {
    switch (sortKey) {
      case "when":
      case "max_reservations":
      case "price":
        res.orderBy(sortKey, sortDir || "asc");
        break;
      default:
        return response
          .status(400)
          .json("Bad request, sortkey value is not valid");
    }
  }

  try {
    const finalResult = await res;
    response.json(finalResult);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
