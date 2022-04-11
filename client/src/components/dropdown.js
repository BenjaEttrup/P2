import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/dropdown.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class Dropdown extends React.Component {
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
      <div className="Dropdown">
        <h5 className="">Recipes</h5>
        <div className="row">
          <div className="col-6">
            Pasta med ketchup
          </div>
          <div className="col-3 right-align">
            49,95 kr.
          </div>
          <div className="col-2">
            <i className="fa fa-trash"></i>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            Pasta med ketchup
          </div>
          <div className="col-3 right-align">
            49,95 kr.
          </div>
          <div className="col-2">
            <i className="fa fa-trash"></i>
          </div>
        </div>
        <div className="btn-row">
          <Link to="/shoppingList">
            <button className="btn btn-primary">
              Shopping List
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Dropdown;
