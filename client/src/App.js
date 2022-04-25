import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./components/homepage/homepage";
import ShoppingList from "./components/shoppingList/shoppingList";
import SpinTheMeal from "./components/spinTheMeal";
import MyStash from "./components/myStash";
import Recipe from "./components/recipe.js"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeNav: 0,
      recipes: []
    }
  }

  updateNav(id) {
    this.setNav(id)
  }

  setNav(id) {
    this.setState({
      activeNav: id
    })
  }

  updateRecipes() {
    fetch(`/shoppingList`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          recipes: res
        })
      }).catch(err => {
        console.error(err);
      });
  }

  removeRecipe(recipeID) {
    fetch(`/removeRecipeFromShoppingList/${recipeID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).catch((err) => {
      console.error(err);
    });

    let tempRecipes = this.state.recipes;
    let newRecipes = [];

    tempRecipes.forEach(recipe => {
      if (recipe.recipe.recipeID !== recipeID) {
        newRecipes.push(recipe)
      }
    });

    this.setState({
      recipes: newRecipes
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar active={this.state.activeNav} updateRecipes={() => { this.updateRecipes() }} removeRecipe={(recipeID) => { this.removeRecipe(recipeID) }} recipes={this.state.recipes} />
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/shoppingList">
              <ShoppingList updateNavFunction={(id) => { this.updateNav(id) }} />
            </Route>
            <Route path="/myStash">
              <MyStash updateNavFunction={(id) => { this.updateNav(id) }} />
            </Route>
            <Route path="/spinTheMeal">
              <SpinTheMeal updateNavFunction={(id) => { this.updateNav(id) }} />
            </Route>
            <Route path="/recipe/:id">
              <Recipe />
            </Route>
            <Route path="/">

              <HomePage updateNavFunction={(id) => { this.updateNav(id) }} updateShoppingList={() => this.updateRecipes()} />
            </Route>
          </Switch>
        </div>
      </Router >
    );
  }
}

export default App;
