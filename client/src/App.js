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
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res)
      this.setState({
        recipes: res
      }, () => {
        console.log(this.state.recipes)
      })
    }).catch(err => {
      console.error(err);
    });
  }

  render() {
    return (
      <Router>
        <div>

          <Navbar active={this.state.activeNav} updateRecipes={() => {this.updateRecipes()}} recipes={this.state.recipes} />
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

              <HomePage updateNavFunction={(id) => {this.updateNav(id)}} updateShoppingList={() => this.updateRecipes()} />
            </Route>
          </Switch>
        </div>
      </Router >
    );
  }
}

export default App;
