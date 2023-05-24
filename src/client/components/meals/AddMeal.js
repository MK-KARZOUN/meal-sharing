import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./AddMeal.css"

const AddMeal = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setprice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const meal = { title, description, price };
    console.log(meal);
    await fetch("http://localhost:5000/api/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meal),
    })
      .then(() => {
        console.log("New meal added successfully");
        history.push("/meals");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="AddMeal">
      <h2>Add a new meal</h2>
      <form onSubmit={handleSubmit}>
        <label>Title : </label>
        <input
          required
          placeholder="Enter the meal name ..."
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Description :</label>
        <input
          required
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <label>Price :</label>
        <input
          required
          type="text"
          name="price"
          value={price}
          onChange={(e) => setprice(e.target.value)}
        />
        <button className="submit" type="submit">submit</button>
      </form>
    </div>
  );
};

export default AddMeal;
