import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/dropdown.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class Dropdown extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super(props);
    
    //Your code here
  }

  //Functions go here

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="Dropdown">
        <h5 class="">Recipes</h5>
        <div>
            {this.props.recipes.map((recipe) => {
              return (
                <div class="row recipe-row">
                  <div class="col-6">
                    {recipe.recipe.title.length > 18 ? recipe.recipe.title.substring(0, 18) + '...' : recipe.recipe.title}
                  </div>
                  <div class="col-4 right-align">
                    {recipe.recipe.price + ' DKK'}
                  </div>
                  <div class="col-1">
                    <i class="fa fa-trash"></i>
                  </div>
                </div>
              )
            })}
        </div>
        <div class="btn-row">
          <Link to="/shoppingList">
            <button class="btn btn-primary add-recipe-btn">
              Shopping List
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Dropdown;
