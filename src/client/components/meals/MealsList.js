import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MealCard from "./MealCard";
import "./mealsList.css";
import Error from "../Error";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/meals")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMeals(data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        });
    };
    fetchData();
  }, []);

  return (
    <div className="MealsList">
      <Link to={"/"}>
        <button>Home</button>
      </Link>
      {error ? (
        <Error />
      ) : meals.length ? (
        <ul className="meal-list">
          {meals.map((meal) => (
            <li className="meal-item" key={meal.id}>
              <MealCard meal={meal} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="Loading-message">Loading....</p>
      )}
      <Link to={"/add-meal"}>
        <button>Add new meal</button>
      </Link>
    </div>
  );
};

export default MealsList;
