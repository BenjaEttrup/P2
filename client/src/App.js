import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./components/homepage/homepage";
import ShoppingList from "./components/shoppingList";
import SpinTheMeal from "./components/spinTheMeal";
import MyStash from "./components/myStash";

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/shoppingList">
            <ShoppingList />
          </Route>
          <Route path="/myStash">
            <MyStash />
          </Route>
          <Route path="/spinTheMeal">
            <SpinTheMeal />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
