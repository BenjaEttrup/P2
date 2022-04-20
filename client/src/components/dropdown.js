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
    this.state = {
      newRecipes: []
    }
  }

  //Functions go here

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="Dropdown">
        <h5 class="dropdown-title">Recipes</h5>
        <div>
        <table class="table table-striped table-borderless">
          <thead>
            <tr>
              <th class="col-6" scope="col"></th>
              <th class="col-4" scope="col"></th>
              <th class="col-1" scope="col"></th>
            </tr>
          </thead>
              <tbody>
                {this.props.recipes.map((recipe) => {
                  return (
                    <tr class="table-content  table-rounded">
                      <td>{recipe.recipe.title.length > 18 ? recipe.recipe.title.substring(0, 18) + '...' : recipe.recipe.title}</td>
                      <td class="table-content-secondary">
                      {recipe.recipe.price + ' DKK'}
                      </td>
                      <td class="right-align-text">
                        <i class="fa fa-trash" onClick={() => this.props.removeRecipe(recipe.recipe.recipeID)}></i>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
