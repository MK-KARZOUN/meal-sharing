import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./mealDetail.css";
import { useHistory } from "react-router-dom";

const MealDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5000/api/meals/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMeal(data[0]);
          console.log(meal);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  }, [id]);

  const handelDelete = (e) => {
    const responce = fetch(`http://localhost:5000/api/meals/${id}`, {
      method: "delete",
    })
      .then((response) => {
        if (response.ok) {
          console.log(`${meal.title} is deleted`);
          history.push("/meals");
        } else {
          throw new Error("Error deleting meal");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="meal-details">
      <div className="links">
        <Link to={"/meals"}>
          <button>Meals</button>
        </Link>
        <Link to={"/"}>
          <button>Home</button>
        </Link>
      </div>
      {meal ? (
        <ul key={id} className="detail-container">
          <h2 className="title">{meal.title}</h2>
          {meal.price && <p className="price">Price: {meal.price}</p>}
          {meal.description && (
            <p className="description">Description: {meal.description}</p>
          )}
          {meal.location && (
            <p className="location">Location: {meal.location}</p>
          )}
          {meal.when_ && <p className="when">When: {meal.when_}</p>}
          {meal.max_reservation && (
            <p className="max-reservation">
              Max Reservations: {meal.max_reservation}
            </p>
          )}
          {meal.created_date && (
            <p className="created-date">Created Date: {meal.created_date}</p>
          )}
          <button className="delete-btn" onClick={handelDelete}>
            Delete
          </button>
        </ul>
      ) : (
        <p>Loading....</p>
      )}
    </div>
  );
};

export default MealDetail;
