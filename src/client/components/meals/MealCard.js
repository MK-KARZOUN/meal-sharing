import "./mealCard.css";
import { Link } from "react-router-dom";
const MealCard = ({ meal }) => {
  return (
    <div className="meal-card">
      <Link className="meal-link" key={meal.id} to={`/meals/${meal.id}`}>
        <h2 className="meal-title">{meal.title}</h2>
        <p className="meal-price">{meal.price}</p>
      </Link>
    </div>
  );
};

export default MealCard;
