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
      activeNav: 0
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

  render() {
    return (
      <Router>
        <div>
          <Navbar active={this.state.activeNav} />

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
              <HomePage updateNavFunction={(id) => { this.updateNav(id) }} />
            </Route>
          </Switch>
        </div>
      </Router >
    );
  }
}

export default App;
