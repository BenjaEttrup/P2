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
      hide: false,
      initedIsHiddenValues: false,
      price: 0,
      recipeIngredientComponent: [],
      inited: false,
      isTrackingAllIngredientComponents: false,
    };

  }

  initShoppingListRecipe(){
    this.setState({
      inited: true,
    });

    this.props.trackShoppingListRecipeComponent(this);
  }

  trackShoppingListElement(stashRowElementInstance, isHidden) {
    let recipeIngredientComponent = this.state.recipeIngredientComponent;
    let tempRICLength = this.state.recipeIngredientComponent.length;

    if(tempRICLength < this.props.recipe.ingredients.length){
      recipeIngredientComponent.push(stashRowElementInstance);
      tempRICLength++;

      this.setState({
        recipeIngredientComponent: recipeIngredientComponent
      })
    }

    if((tempRICLength === this.props.recipe.ingredients.length) && !this.state.isTrackingAllIngredientComponents){
      this.setState({
        isTrackingAllIngredientComponents: true,
      })
    }   
  }

  updateRecipePrice() {
    // TODO SHOULD LOOP THROUGH THE recipeIngredientComponents.forEach then check if props.isHidden
    // this value should tell whether the value of the ingredient should be added to the price of
    // the recipe or deducted.
    let recipeSum = 0;
    
    this.state.recipeIngredientComponent.forEach((recipeIngredientComponent, ricIndex) => {
      let isHidden =  this.props.ingredientInStash(recipeIngredientComponent, recipeIngredientComponent.props.ingredientIndex);
      if(isHidden){
        recipeIngredientComponent.setState({
          hide: true,
        }, () => {
          if(recipeIngredientComponent.state.hide){
            return;
          }

        })
      }
      else {
        recipeSum = Number(+recipeSum + +recipeIngredientComponent.props.ingredient.price)
      }

    })

    this.setState({
      price: recipeSum,
    }, () => {
      this.props.updateRecipePrices(true);
    })
  }

  initShoppingListIngredient(ingredient, ingredientIndex) {
    let isInStash = this.props.ingredientInStash(ingredient, ingredientIndex)
    
    if(isInStash && !this.state.initedIsHiddenValues){
      if(this.state.recipeIngredientComponent.length === this.props.recipe.ingredients.length){
        this.setState({
          initedIsHiddenValues: true
        }, () => {
          this.updateRecipePrice();
        });
      }
    }

    return isInStash;
  }

  componentDidMount() {
    this.setState({
      price: this.props.recipe.recipe.price
    })
    this.props.calculateTotalRecipePrice(this.props.recipe.recipe.price);
  }

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
      <table className="table table-striped">
        <thead>
          <tr>
            <th className='col-8' scope='col'>{this.props.recipe.recipe.title}</th>
            <th className="col-4 text-success">Pris på opskrift: {this.state.price} kr.</th>
            <th>
              <button type="button" onClick={() => { this.hideRecipe(this.props.recipe.recipe) }}>
                <i className="fa fa-trash"></i></button>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.recipe.ingredients.map((ingredient, ingredientIndex) => {
              let isHidden = this.initShoppingListIngredient(ingredient, ingredientIndex);
              return (
                <StashRowElement
                  key={ingredientIndex}
                  ingredientIndex={ingredientIndex}
                  recipeID={this.props.recipe.recipe.recipeID}
                  isHidden={isHidden}
                  passToShoppingList={true}
                  ingredient={ingredient}
                  shoppingList={true}
                  removeIngredient={(stashRowElement, params) => this.props.removeIngredient(stashRowElement, params)}
                  updateRecipePrice={() => this.updateRecipePrice()}
                  recipeIndex={this.props.recipeIndex}
                  trackShoppingListElement={(stashRowElementInstance, isHidden) => this.trackShoppingListElement(stashRowElementInstance, isHidden)}
                  matchIngredient={(stashIngredient, subtract, wasTrashed, addedToStash) => this.props.matchIngredient(stashIngredient, subtract, wasTrashed, addedToStash)}
                  updateMyStashIngredients={(stashIngredient) => this.props.updateMyStashIngredients(stashIngredient)}
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
