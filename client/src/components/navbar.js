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
          <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
            <div className="container-fluid" id="center">
              <img id="logo" src="./pictures/logo.png" alt="logo" width="50" height="50" margin="0.5rem" />
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0" id="navigationbar">
                  <li className="nav-item">
                    <Link className="nav-link active" to={"/"}>Inspiration</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/shoppingList"}>Shopping List</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/spinTheMeal"}>Spin The Meal</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/myStash"}>My Stash</Link>
                  </li>
                </ul>
                <ul className="navbar-nav" id="user-and-recipe">
                  <li className="nav-item">
                    <div className="btn-group">
                      <button className='hidden-btn icon' type='button' data-bs-toggle="dropdown">
                        <i className="fa fa-book"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-card">
                        <li id='dropdown-recipes' className="">
                          <Dropdown />
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <button className='hidden-btn icon' type='button' data-bs-toggle="dropdown">
                        <i className="fa fa-user icon"></i>
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
