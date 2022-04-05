import React from 'react';
import '../../stylesheets/shoppingList.css'
import ShoppingListRecipe from './shoppingListRecipe';
import StashRowElement from '../stashRowElement';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class ShoppingList extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();

    this.state = {
      shoppingListRecipes: [],
      myStashIngredients: [],
      recipeSum: 0,
      hiddenShoppingListIngredients: [],
    };
  }

  // Base function in react, called immediately after a component is mounted. Triggered after re-rendering
  componentDidMount() {
    // Retrieves shoppinglist information
    fetch(`/shoppingList`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        let data = {
          shoppingListRecipes: res
        };
        this.setState(data);
      }).catch(err => {
        console.error(err);
      });

    // Retrieves mystash information
    fetch(`/stash/get`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        let data = {
          myStashIngredients: res
        };
        this.setState(data);
      }).catch(err => {
        console.error(err);
      });
  }


  //Functions go here

  /**
   *@function searches all recipes after a specific recipe and removes ingreient from stash
   *@returns true if passed ingredient is in stash. Else false
  */

//  TODO should either pass the recipeIndex of the ingredient or add it to the shoppingListIngredient object
//  Move shoppingListIngredient into this.state.hiddenStashIngredients with the ingredient recipeIndex
//  
  isIngredientInStash(shoppingListIngredient, recipeIndex) {
    let isInStash = false;
    let ingredientIndex = 0;
    let shoppingList = this.state.shoppingListRecipes;

    this.state.myStashIngredients.forEach(ingredient => {
      if (ingredient.prod_id == shoppingListIngredient.prod_id){
        isInStash = true
        shoppingList[0].ingredients.splice(0, 1);
        // this.setState({
        //   shoppingListRecipes: shoppingList
        // })

        // this.setState(this.moveIngredientToHiddenStash(shoppingListIngredient, ingredientIndex, recipeIndex));
        // this.updateTotalRecipePrice(shoppingListIngredient, true);
      }

      ingredientIndex++;
    });

    return isInStash
  }
  
  /**
   * 
   * @param {*} shoppingListIngredient the shoppingListIngredient object 
   * @param {*} ingredientIndex the index of the ingredient within the Recipe
   * @param {*} recipeIndex the index of the recipe
   * @returns an object with two properties: shoppingListRecipes 
   * (the now updated array of shoppingListRecipes) and hiddenShoppingListIngredients (where the ingredient was moved to)
   */
  moveIngredientToHiddenStash(shoppingListIngredient, ingredientIndex, recipeIndex){
    let hiddenShoppingListIngredients = this.state.hiddenShoppingListIngredients;
    let shoppingList = this.state.shoppingListRecipes;
    console.log(shoppingListIngredient);
    console.log(ingredientIndex);
    console.log(recipeIndex);

    shoppingList[recipeIndex].ingredients.splice(ingredientIndex, 1); //should use recipeIndex to remove the specific ingredient
    hiddenShoppingListIngredients.push(shoppingListIngredient);

    return {
      shoppingListRecipes: shoppingList, hiddenShoppingListIngredients: hiddenShoppingListIngredients}
  }

  /**
   * @function Adds all recipe prices together
   */
  calculateTotalRecipePrice(recipePrice) {
    this.setState((prevState) => ({
      recipeSum: prevState.recipeSum + recipePrice
    }));
  }

  /**
   * 
   * @param {*} priceElement Ingredient object
   * @param {*} remove Removes element if true, and adds element if false
   * @function Adds or removes ingredient price from total price
   */
  updateTotalRecipePrice(priceElement, remove) {
    // If we want to remove element
    if (remove === true){
      this.setState((prevState) => ({
        recipeSum: Number(prevState.recipeSum - priceElement.price).toFixed(2)
      }));
    }
    // If we want to add element
    else if (remove === false) {
      this.setState((prevState) => ({
        recipeSum: Number(prevState.recipeSum + priceElement.price).toFixed(2)
      }));
    }
  }

  /**
   * 
   * @param {*} stashRowElement ingredient object
   * @param {*} params an object that contains the members recipeId and an endpoint (the url to access)
   */
  removeIngredient(stashRowElement, params) {
    console.log(`Deleting ingredient in stash with prod_id = ${stashRowElement.prod_id}, endPoint = ${params.endPoint} recipeID = ${params.recipeID}`);
    console.log(stashRowElement);
    console.log(`fetching endpoint = ${params.endPoint}${Number.isInteger(params.recipeID)? params.recipeID + "&" : ""}${stashRowElement.prod_id}`)
    
    fetch(`${params.endPoint}${Number.isInteger(params.recipeID)? params.recipeID + "&" : ""}${stashRowElement.prod_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }).catch(err => {
      console.error(err);
    });

    if(this.ingredientBelongsToShoppingList(params)){
      this.updateTotalRecipePrice(stashRowElement, true);
    }
  }

  ingredientBelongsToShoppingList(params) {
    return Number.isInteger(params.recipeID);
  }
  

  removeRecipe(recipe) {
    console.log(`Deleting ingredient in stash with recipeID = ${recipe.recipeID}`);
    console.log(recipe);
    console.log(`fetching endpoint = /removeRecipeFromShoppingList/${recipe.recipeID}`)

    fetch(`/removeRecipeFromShoppingList/${recipe.recipeID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }).catch(err => {
      console.error(err);
    });

    this.updateTotalRecipePrice(recipe, true)
    
  }

  // findIngredientInRecipes(myStashIngredient) {
  //   let ingredientToHide;
  //   this.state.shoppingListRecipes.forEach(recipe => {
  //     recipe.ingredients.forEach(ingredient => {
  //       if(myStashIngredient.prod_id == ingredient.prod_id) {
  //         ingredientToHide = ingredient;
  //       }
  //     })
  //   });

  //   this.updateTotalRecipePrice(ingredientToHide, true);
  // }

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="ShoppingList">
        <div class="card shadow shoppingList">
          <div class="card-body shoppingList-card-body">
            <div class="">
              <h4>
                Shoppinglist
              </h4>
              {
                this.state.shoppingListRecipes.map((recipe, index) => {
                  return (
                    <ShoppingListRecipe
                      removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
                      removeRecipe={(recipe) => this.removeRecipe(recipe)}
                      key={this.state.shoppingListRecipes.indexOf(recipe)}
                      calculateTotalRecipePrice={(recipePrice) => this.calculateTotalRecipePrice(recipePrice)}
                      isIngredientInStash={(ingredient) => this.isIngredientInStash(ingredient)}
                      recipe={recipe}
                      recipeIndex={index}
                      updateTotalRecipePrice={(priceElement, remove) => this.updateTotalRecipePrice(priceElement, remove)}
                    />
                  )
                })
              }
              <div id="totalPrice">
                <p> Samlet pris: {
                  this.state.recipeSum
                } kr.</p>
              </div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th class='col-9' scope='col'>My Stash</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.myStashIngredients.map((ingredient) => {
                      return (
                        <StashRowElement 
                        key={this.state.myStashIngredients.indexOf(ingredient)} 
                        ingredient={ingredient} myStash = {true} 
                        removeIngredient={this.removeIngredient}
                        findIngredientInRecipes={(ingredient) => this.findIngredientInRecipes(ingredient)}
                        />
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShoppingList;
