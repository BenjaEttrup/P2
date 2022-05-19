import React from 'react';
import IngredientElement from './ingredientElement';
import { Link } from 'react-router-dom';

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

    this.state = {
      hide: false,
      initedIsHiddenValues: false,
      price: 0,
      recipeIngredientComponent: [],
      inited: false,
      isTrackingAllIngredientComponents: false,
    };

  }

  /**
   * Is called on initialization and lets shoppingList component track this recipe component.
   */
  initShoppingListRecipe() {
    this.setState({
      inited: true,
    });

    this.props.trackShoppingListRecipeComponent(this);
  }

  /**
   * Tracks an ingredientElement (an ingredient from the shopping list) component
   * @param {*} ingredientElement an instance of a shopping list ingredient.
   */
  trackShoppingListElement(stashRowElementInstance, isHidden) {
    let recipeIngredientComponent = this.state.recipeIngredientComponent;
    let tempRICLength = this.state.recipeIngredientComponent.length;

    // ingredientElement is added to recipeingredientComponents if it contains less elements than all of the recipe's ingredients
    if (tempRICLength < this.props.recipe.ingredients.length) {
      recipeIngredientComponent.push(stashRowElementInstance);
      tempRICLength++;

      this.setState({
        recipeIngredientComponent: recipeIngredientComponent
      })
    }

    // All instances of ingredientElements instanced by this recipe (from the map function) are now tracked.
    if ((tempRICLength === this.props.recipe.ingredients.length) && !this.state.isTrackingAllIngredientComponents) {
      this.setState({
        isTrackingAllIngredientComponents: true,
      });
    }
  }

  /**
   * UpdateRecipePrice updates the prices recipes of all by calling updateRecipePrices from shoppingList component 
   */
  updateRecipePrice() {
    this.props.updateRecipePrices(true);
  }


  componentDidMount() {
    this.setState({
      price: this.props.recipe.recipe.price
    })
    this.props.calculateTotalRecipePrice(this.props.recipe.recipe.price);
  }

  /**
   * Removes the recipe from the user's shopping list
   * @param {*} recipe the recipe 
   */
  hideRecipe(recipe) {
    this.setState({
      hide: true
    }, () => {
      this.props.removeRecipe(recipe)
    })
  }

  //This is the render function. This is where the
  //html is.
  render() {
    if (!this.state.inited) {
      this.initShoppingListRecipe();
    }
    if (this.state.hide) return null;
    return (
      <table className="table table-striped table-borderless">
        <thead>
          <tr>
            <th className='col-8' scope='col'><Link to={`/recipe/${this.props.recipe.recipe.recipeID}`} className="recipeLink">{this.props.recipe.recipe.title}</ Link></th>
            <th className="col-4 recipe-price">{this.state.price} kr.</th>
            <th>
              <button type="button" onClick={() => { this.hideRecipe(this.props.recipe.recipe) }} className="deleteButton">
                <i className="fa fa-trash"></i></button>
            </th>
            <th>
              <i class="fa fa-inbox" aria-hidden="true"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.recipe.ingredients.map((ingredient, ingredientIndex) => {
              return (
                <IngredientElement
                  key={ingredientIndex}
                  ingredientIndex={ingredientIndex}
                  recipeID={this.props.recipe.recipe.recipeID}
                  ingredient={ingredient}
                  shoppingList={true}
                  removeIngredient={(stashRowElement, params) => this.props.removeIngredient(stashRowElement, params)}
                  updateRecipePrice={() => this.updateRecipePrice()}
                  recipeIndex={this.props.recipeIndex}
                  trackShoppingListElement={(stashRowElementInstance, isHidden) => this.trackShoppingListElement(stashRowElementInstance, isHidden)}
                  matchIngredient={(stashIngredient, subtract, wasTrashed, addedToStash) => this.props.matchIngredient(stashIngredient, subtract, wasTrashed, addedToStash)}
                  updateMyStashIngredients={(stashIngredient) => this.props.updateMyStashIngredients(stashIngredient)}
                  ingredientInStash={(ingredient, ingredientIndex) => this.props.ingredientInStash(ingredient, ingredientIndex)}
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
