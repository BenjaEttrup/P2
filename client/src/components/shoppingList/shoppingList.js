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

  updateTotalRecipePrice(stashRowElement) {
    this.setState((prevState, props) => ({
      recipeSum: Number(prevState.recipeSum - stashRowElement.price).toFixed(2)
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

    this.updateTotalRecipePrice(stashRowElement);
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
                        removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
                        />
                        // TODO: Fix bug where removing elements in my stash screws up the samlet pris 
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
