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

  getTotalRecipePrice(recipePrice) {
    this.setState((prevState, props) => ({
      recipeSum: prevState.recipeSum + recipePrice
    }));

  }

  updateTotalRecipePrice(priceElement) {
    this.setState((prevState, props) => ({
      recipeSum: Number(prevState.recipeSum - priceElement.price).toFixed(2)
    }));
  }

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
    if(Number.isInteger(params.recipeID)){
      this.updateTotalRecipePrice(stashRowElement);
    }
  }

  /**
   *@function searches all recipes after a specific recipe
   */
  findIngredientInRecipes(myStashIngredient) {
    this.state.shoppingListRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if(myStashIngredient.prod_id == ingredient.prod_id) {
          
          console.log(myStashIngredient);
          this.updateTotalRecipePrice(ingredient);
        }
      })
    });
    // TODO send this function as a param to stashRow elem
    // console.log(this);
    // this.state.shoppingListRecipes.forEach(recipe => {
    //   console.log("________________________________________")
    //   console.log(recipe);
    // })
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

    this.updateTotalRecipePrice(recipe)
    
  }

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
                this.state.shoppingListRecipes.map((recipe) => {
                  return (
                    <ShoppingListRecipe
                      removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
                      removeRecipe={(recipe) => this.removeRecipe(recipe)}
                      key={this.state.shoppingListRecipes.indexOf(recipe)}
                      getTotalRecipePrice={(recipePrice) => this.getTotalRecipePrice(recipePrice)}
                      recipe={recipe}
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
