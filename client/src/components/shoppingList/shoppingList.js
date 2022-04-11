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
      tempShoppingListRecipes: [],
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
        console.log("Fetching shoppinglist")
        console.log(res)
        let data = {
          tempShoppingListRecipes: res,
          shoppingListRecipes: res,
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
   *@function searches all recipes after a specific recipe and removes ingredient from stash
   *@returns true if passed ingredient is in stash. Else false
  */

//  TODO should either pass the recipeIndex of the ingredient or add it to the shoppingListIngredient object
//  Move shoppingListIngredient into this.state.hiddenStashIngredients with the ingredient recipeIndex
//  
  isIngredientInStash(shoppingListIngredient, recipeIndex, ingredientIndex) {
    // console.log("tempShoppingListRecipes")
    // console.log(this.state.tempShoppingListRecipes)
    // console.log("shoppingListRecipes")
    // console.log(this.state.shoppingListRecipes)
    
    let isInStash = false;
    if(ingredientIndex === undefined){
      return isInStash
    }
      this.state.myStashIngredients.forEach((ingredient, i) => {
        if (ingredient.prod_id === shoppingListIngredient.prod_id){
          isInStash = true
          console.log("removing ingredients");
          console.log(this.state.shoppingListRecipes);
          this.setState(this.moveIngredientToHiddenStash(shoppingListIngredient, ingredientIndex, recipeIndex));
        }});

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
      let tempShoppingListRecipes = this.state.tempShoppingListRecipes;
      console.log("Tempshoppinglist")
      console.log(tempShoppingListRecipes);
      // tempShoppingListRecipes[recipeIndex].ingredients = this.elementRemove(ingredientIndex, tempShoppingListRecipes[recipeIndex].ingredients);
      tempShoppingListRecipes[recipeIndex].ingredients.splice(ingredientIndex, 1); //should use recipeIndex to remove the specific ingredient
      hiddenShoppingListIngredients.push(shoppingListIngredient);
  
      return {
        tempShoppingListRecipes: tempShoppingListRecipes,
        hiddenShoppingListIngredients: hiddenShoppingListIngredients
      }
    }

  findIngredientInRecipes(stashIngredient) {
    let shoppingList = this.state.shoppingListRecipes;
    let tempShoppingList = this.state.tempShoppingListRecipes; 
    let hiddenShoppingListIngredients = this.state.hiddenShoppingListIngredients;

    shoppingList.forEach((recipe, recipeIndex) => {
      recipe.ingredients.forEach((ingredient) => {
        console.log(`stashIngredient.prod_id ${stashIngredient.prod_id} ingredient.prod_id = ${ingredient.prod_id}`)
          if (stashIngredient.prod_id === ingredient.prod_id){
            // this.moveIngredientFromHiddenStash(shoppingListIngredient, recipeIndex);
            // hiddenShoppingListIngredients.splice(index, 1);
          }
      })
    })

  }

  elementRemove(index, array){
    let tempArray = array.slice();

    if(index === 0){
      tempArray.length--;
      return tempArray;
    }
    for (let i = 0; i < array.length-1; i++){
      if (i >= index){
        tempArray[i] = tempArray[i+1];
      }
    }

    // only work on tempArray;
    console.log(tempArray);
    tempArray.length--;
    return tempArray;
  }

  moveIngredientFromHiddenStash(shoppingListIngredient, recipeIndex){
    let hiddenShoppingListIngredients = this.state.hiddenShoppingListIngredients;
    let tempShoppingList = this.state.tempShoppingListRecipes;
    let shoppingList = this.state.shoppingListRecipes;

    return {
      tempShoppingListRecipes: tempShoppingList, 
      hiddenShoppingListIngredients: hiddenShoppingListIngredients,
      shoppingListRecipes: shoppingList
    }
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

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="ShoppingList">
        <div className="card shadow shoppingList">
          <div className="card-body shoppingList-card-body">
            <div className="">
              <h4>
                Shoppinglist
              </h4>
              {
                this.state.tempShoppingListRecipes.map((recipe, index) => {
                  return (
                    <ShoppingListRecipe
                      removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
                      removeRecipe={(recipe) => this.removeRecipe(recipe)}
                      key={this.state.tempShoppingListRecipes.indexOf(recipe)}
                      calculateTotalRecipePrice={(recipePrice) => this.calculateTotalRecipePrice(recipePrice)}
                      isIngredientInStash={(ingredient, recipeIndex, ingredientIndex) => this.isIngredientInStash(ingredient, recipeIndex, ingredientIndex)}
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
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className='col-9' scope='col'>My Stash</th>
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
                        moveIngredientFromHiddenStash={(ingredient) => {this.moveIngredientFromHiddenStash(ingredient)}}                
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
