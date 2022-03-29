import React from 'react';
import StashRowElement from './stashRowElement';

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

  removeRecipe() {
    console.log(this.props.recipe.recipeID);
    fetch(`/removeRecipeFromShoppingList/remove/${this.props.recipe.recipeID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ id: this.props.product.prod_ID })
    }).catch(err => {
      console.error(err);
    });
  }

  //This is the render function. This is where the
  //html is.
  render() {
    return (
        <table class="table table-striped">
        <thead>
          <tr>
            <th class='col-9' scope='col'>Pasta</th>
            <th class="text-success">Price 45 DKK</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            <StashRowElement ingredient1={this.props.shoppingListRecipes}/>
            <StashRowElement/>
            <StashRowElement/>
            <StashRowElement/>
        </tbody>
      </table>
    );
  }
}

export default ShoppingListRecipe;
