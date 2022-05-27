import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/dropdown.css'
import '../stylesheets/myStash.css'

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

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);

    //Your code here
    this.state = {
      newRecipes: []
    }
  }

  // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  /* @Ben Bud https://stackoverflow.com/users/1212039/ben-bud stack overflow
      Class Implementation:
      After 16.3
    Used for creating wrapperref, handleClickOutside and adding eventlistener to the document in componentDidMount. 
  */
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event, pressedLink) {
    if(pressedLink) {
      this.props.dropdownShowFunction(this.props.dropdownShown);
      return;
    }

    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      console.log("You clicked outside of me!");
      this.props.dropdownShowFunction(this.props.dropdownShown);
    }
  }

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div ref={this.wrapperRef} className="Dropdown">
        <h5 class="dropdown-title">Opskrifter</h5>
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
                    <td><Link to={`recipe/${recipe.recipe.recipeID}`} className="recipeLink">{recipe.recipe.title.length > 18 ? recipe.recipe.title.substring(0, 18) + '...' : recipe.recipe.title}</ Link></td>
                    <td class="table-content-secondary">
                      {recipe.recipe.price + ' DKK'}
                    </td>
                    <td class="right-align-text">
                      <button class="deleteButton">
                        <i class="fa fa-trash" onClick={() => this.props.removeRecipe(recipe.recipe.recipeID)}></i>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div class="btn-row">
          <Link to="/shoppingList">
            <button onClick={(event) => this.handleClickOutside(event, true)} class="btn btn-primary add-recipe-btn">
              Shopping List
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Dropdown;
