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
  constructor(recipe) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
    
    //Your code here
  }

  //Functions go here

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
                    <Link class="nav-link active" to={"/"}>Inspiration</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to={"/shoppingList"}>Shopping List</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to={"/spinTheMeal"}>Spin The Meal</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to={"/myStash"}>My Stash</Link>
                  </li>
                </ul>
                <ul class="navbar-nav" id="user-and-recipe">
                  <li class="nav-item">
                    <div class="btn-group">
                      <button class='hidden-btn' type='button' data-bs-toggle="dropdown">
                        <img src="./pictures/cookbook.png" alt="opskrifter" width="50" height="50" />
                      </button>
                      <ul class="dropdown-menu dropdown-card">
                        <li id='dropdown-recipes' class="">
                          <Dropdown />
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li class="nav-item">
                    <img src="./pictures/user.png" alt="brugerprofil" width="50" height="50" />
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
