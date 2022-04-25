import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/navbar.css';
import Dropdown from './dropdown';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class Navbar extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super(props);

    //Your code here
    this.shown = false;
  }

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="Navbar">
        <header>
          <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
            <div class="container-fluid" id="center">
              <img id="logo" src="./pictures/logo.png" alt="logo" width="50" height="50" margin="0.5rem" />
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="navigationbar">
                  <li class="nav-item">
                    <Link class={this.props.active === 1 ? "nav-link active" : "nav-link"} to={"/"}>Inspiration</Link>
                  </li>
                  <li class="nav-item">
                    <Link class={this.props.active === 2 ? "nav-link active" : "nav-link"} to={"/shoppingList"}>Shopping List</Link>
                  </li>
                  <li class="nav-item">
                    <Link class={this.props.active === 3 ? "nav-link active" : "nav-link"} to={"/spinTheMeal"}>Spin The Meal</Link>
                  </li>
                  <li class="nav-item">
                    <Link class={this.props.active === 4 ? "nav-link active" : "nav-link"} to={"/myStash"}>My Stash</Link>
                  </li>
                </ul>
                <ul class="navbar-nav" id="user-and-recipe">
                  <li class="nav-item">
                    <div class="btn-group">
                      <button class='hidden-btn icon' type='button' data-bs-auto-close="false" data-bs-toggle="dropdown" onClick={() => {
                        this.props.updateRecipes()
                        this.shown = !this.shown
                      }}>
                        <i class="fa fa-book"></i>
                      </button>
                      <ul class={this.shown ? "show dropdown-menu dropdown-card dropdown-menu-end" : "dropdown-menu dropdown-card dropdown-menu-end"}>
                        <li id='dropdown-recipes'>
                          <Dropdown recipes={this.props.recipes} updateRecipes={this.props.updateRecipes} removeRecipe={this.props.removeRecipe} />
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li class="nav-item">
                    <button class='hidden-btn icon' type='button' data-bs-toggle="dropdown">
                      <i class="fa fa-user icon"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default Navbar;
