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

    this.state = {
      hide: false
    };

  }

  updateRecipePrice(stashRowElement, remove) {
    if (remove) {
      this.props.recipe.recipe.price = Number(this.props.recipe.recipe.price - stashRowElement.price).toFixed(2);
      this.props.updateTotalRecipePrice(stashRowElement, true);
    }
    else {
      this.props.recipe.recipe.price = Number(this.props.recipe.recipe.price + stashRowElement.price).toFixed(2);
      this.props.updateTotalRecipePrice(stashRowElement, true);
    }
  }

  initShoppingListIngredient(ingredient, ingredientIndex) {
    // if(this.props.ingredientInStash(ingredient, ingredientIndex)){
    //   this.props.updateTotalRecipePrice(ingredient, true);
    // }
    return this.props.ingredientInStash(ingredient, ingredientIndex);
  }

  componentDidMount() {
    this.props.calculateTotalRecipePrice(this.props.recipe.recipe.price);
  }

  hideRecipe(recipe) {
    this.setState({
      hide: true
    })

    // TODO: set removeRecipe as a property in shoppingList
    this.props.removeRecipe(recipe)
  }

  //This is the render function. This is where the
  //html is.
  render() {
    if (this.state.hide) return null;
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th className='col-8' scope='col'>{this.props.recipe.recipe.title}</th>
            <th className="col-4 text-success">Pris på opskrift: {this.props.recipe.recipe.price} kr.</th>
            <th>
              <button type="button" onClick={() => { this.hideRecipe(this.props.recipe.recipe) }}>
                <i className="fa fa-trash"></i></button>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.recipe.ingredients.map((ingredient, ingredientIndex) => {
              return (
                <StashRowElement
                  key={ingredientIndex}
                  recipeID={this.props.recipe.recipe.recipeID}
                  isHidden={this.initShoppingListIngredient(ingredient, ingredientIndex)}
                  ingredient={ingredient}
                  shoppingList={true}
                  removeIngredient={(stashRowElement, params) => this.props.removeIngredient(stashRowElement, params)}
                  updateRecipePrice={(stashRowElement) => this.updateRecipePrice(stashRowElement)}
                  recipeIndex={this.props.recipeIndex}
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
