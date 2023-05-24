import { Link } from "react-router-dom";
import "./Home.css"

const Home = () => {
  return (
    <div className="Home">
      <h1 className="home-title">Meal-Sharing-App</h1>
      <Link className="home-link" to={"/meals"}>
        <button>Meals</button>
      </Link>
    </div>
  );
};

export default Home;
