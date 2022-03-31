import React from 'react';
import StashRowElement from '../stashRowElement';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class ShoppingListRecipe extends React.Component {
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

  updateRecipePrice(stashRowElement) {
    console.log("called updateRecipePrice");
    console.log(this.props.recipe.recipe.price - stashRowElement.price);
    this.props.recipe.recipe.price = Number(this.props.recipe.recipe.price - stashRowElement.price).toFixed(2);
  }

  componentDidMount() {
    this.props.getTotalRecipePrice(this.props.recipe.recipe.price);
  }
  
  //This is the render function. This is where the
  //html is.
  render() {
    return (
        <table class="table table-striped">
        <thead>
          <tr>
            <th class='col-9' scope='col'>{this.props.recipe.recipe.title}</th>
            <th class="text-success">Pris på opskrift: {this.props.recipe.recipe.price} kr.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.recipe.ingredients.map((ingredient) => {
              return (
                <StashRowElement
                recipeID = {this.props.recipe.recipe.recipeID} 
                ingredient={ingredient} 
                shoppingList = {true}
                removeIngredient = {(stashRowElement, params) => this.props.removeIngredient(stashRowElement, params)}
                updateRecipePrice = {(stashRowElement) => this.updateRecipePrice(stashRowElement)}
                />
              )
            })
          }
        </tbody>
      </table>
    );
  }
}

export default ShoppingListRecipe;
