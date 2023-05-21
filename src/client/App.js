import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import TestComponent from "./components/TestComponent/TestComponent";
import Home from "./components/Home";
import "./App.css"
// meals
import MealsList from "./components/meals/MealsList";
import MealDetail from "./components/meals/MealDetail";
import AddMeal from "./components/meals/AddMeal"

function App() {
  return (
    <Router>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/add-meal">
        <AddMeal/>
      </Route>
      <Route exact path="/meals">
        <MealsList />
      </Route>
      <Route exact path="/meals/:id">
        <MealDetail />
      </Route>
      {/* <Route exact path="/lol">
        <p>lol</p>
      </Route>
      <Route exact path="/test-component">
        <TestComponent></TestComponent>
      </Route> */}
    </Router>
  );
}

export default App;
