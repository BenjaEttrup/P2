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
      shoppingListElements: [],
      myStashComponents: [],
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

  /**
   * @function Adds all recipe prices together
   */
  calculateTotalRecipePrice(recipePrice) {
    this.setState((prevState) => ({
      recipeSum: prevState.recipeSum + recipePrice
    }));
  }

  // TODO should map recipe ingredient to 
  unHideStashElement(shoppingListElement) {
    let myStashComponents = this.state.myStashComponents;

    myStashComponents.forEach(component => {
      if (component.props.ingredient.prod_id == shoppingListElement.props.ingredient.prod_id) {
        component.setState({
          hide: false,
          priceWasAdded: true
        })
        console.log("")
        console.log("Changed hide to false")
        console.log(component)
        console.log("")
      }
    })

  }

  /**
   * @function updates the state of myStashIngredients to add the new ingredient
   * @param {*} stashIngredient the stashIngredient
   */
  updateMyStashIngredients(shoppingListElement) {
    let myStashIngredients = this.state.myStashIngredients;
    let isDuplicate = false;
    console.log(shoppingListElement)

    myStashIngredients.forEach(stashIngredient => {
      if (stashIngredient.prod_id == shoppingListElement.props.ingredient.prod_id) {
        isDuplicate = true;
        shoppingListElement.setState({
          hide: true
        })
      }
    })

    this.unHideStashElement(shoppingListElement);

    console.log(this)
    if (isDuplicate) {
      return;
    }

    myStashIngredients.push(shoppingListElement.props.ingredient);

    console.log(this)
    this.setState((prevState) => ({
      myStashIngredients: myStashIngredients
    }))
  }

  /**
   * 
   * @param {*} priceElement Ingredient object
   * @param {*} subtract Removes element if true, and adds element if false
   * @function Adds or removes ingredient price from total price
   */
  updateTotalRecipePrice(priceElement, subtract) {
    // If we want to subtract the price of an element
    if (subtract === true) {
      this.setState((prevState) => ({
        recipeSum: Number(prevState.recipeSum - priceElement.price).toFixed(2)
      }));
    }
    // If we want to add the price of an element
    else if (subtract === false) {
      this.setState((prevState) => ({
        recipeSum: Number(+prevState.recipeSum + +priceElement.price).toFixed(2)
      }));
    }
  }

  /**
   * 
   * @param {*} stashRowElement ingredient object
   * @param {*} params an object that contains the members recipeId and an endpoint (the url to access)
   */
  removeIngredient(stashRowElement, params) {
    console.log(stashRowElement);
    console.log(`Deleting ingredient in stash with prod_id = ${stashRowElement.prod_id}`);
    console.log(stashRowElement);
    console.log(`fetching endpoint = ${params.endPoint}${Number.isInteger(params.recipeID) ? params.recipeID + "&" : ""}${stashRowElement.prod_id}`)

    fetch(`${params.endPoint}${Number.isInteger(params.recipeID) ? params.recipeID + "&" : ""}${stashRowElement.prod_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }).catch(err => {
      console.error(err);
    });

    if (Number.isInteger(params.recipeID)) {
      this.updateTotalRecipePrice(stashRowElement, true);
    }
  }

  // isPriceUpdateAllowed(shoppingListIngredientComponent) {
  //   let stashComponents = this.state.myStashComponents;
  //   console.log(stashComponents);

  //   // A function could probably be used to do the same
  //   // as this is done in many places
  //   stashComponents.forEach(component => {
  //     console.log(shoppingListIngredientComponent)
  //     if (shoppingListIngredientComponent.props.ingredient.prod_id == component.props.ingredient.prod_id) {
  //       console.log(`shoppingIngredient.state.boxChecked = ${shoppingListIngredientComponent.state.boxChecked}
  //       stashIngredient.state.boxChecked = ${shoppingListIngredientComponent.state.boxChecked}`);
  //     }
  //   })

  // }

  matchIngredient(stashIngredient, subtract, wasTrashed = false) {
    let recipes = this.state.shoppingListRecipes;
    let isStashItem = false;
    if (stashIngredient.hasOwnProperty('prod_id')) {
      isStashItem = true;
    }
    else {

    }

    // Updates the hide state of the recipeIngredient/stashRowElement component.
    this.state.shoppingListElements.forEach(recipeIngredient => {
      if (recipeIngredient.props.ingredient.prod_id == stashIngredient.prod_id) {
        if (wasTrashed) {
          recipeIngredient.setState({
            hide: false,
            // Figure out why it is always unchecked with boxChecked being true :')
            boxChecked: true
          })
        }
        else {
          recipeIngredient.setState({
            hide: !recipeIngredient.state.hide,
            // Figure out why it is always unchecked with boxChecked being true :')
            boxChecked: true
          })
        }
      }
    })



    // Updates the price of the recipes
    recipes.forEach((recipe, recipeIndex) => {
      recipe.ingredients.forEach((recipeIngredient, index) => {
        if (recipeIngredient.prod_id == (isStashItem ? stashIngredient.prod_id : stashIngredient.props.ingredient.prod_id)) {
          // Situations where the price should not be updated e.g. when 
          // both are unchecked, the recipeIngredient is added/checked
          // and the stashingredient is checked again.
          if (!isStashItem) {
            console.log(stashIngredient);
            // this.isPriceUpdateAllowed()
          }
          if (subtract) {
            console.log("SUBTRACTING")
            this.state.shoppingListRecipes[recipeIndex].recipe.price = Number(this.state.shoppingListRecipes[recipeIndex].recipe.price - recipeIngredient.price).toFixed(2);
          }
          else {
            console.log("ADDING")
            this.state.shoppingListRecipes[recipeIndex].recipe.price = Number(+this.state.shoppingListRecipes[recipeIndex].recipe.price + +recipeIngredient.price).toFixed(2);
          }
          console.log(stashIngredient);
          this.updateTotalRecipePrice(recipeIngredient, subtract);
        }
      })
    });
  }


  ingredientInStash(shoppingListIngredient, ingredientIndex) {
    let isInStash = false;
    let myStashIngredients = this.state.myStashIngredients;
    if (ingredientIndex === undefined) {
      return isInStash
    }

    myStashIngredients.forEach((ingredient, i) => {
      if (ingredient.prod_id == shoppingListIngredient.prod_id) {
        isInStash = true
      }
    });

    return isInStash
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

  trackShoppingListElement(stashRowElementInstance) {
    let shoppingListElements = this.state.shoppingListElements;

    shoppingListElements.push(stashRowElementInstance);
    this.setState({
      shoppingListElements: shoppingListElements
    })
  }

  trackStashElement(stashRowElementInstance) {
    let myStashComponents = this.state.myStashComponents;
    let isDuplicate = false;


    myStashComponents.forEach(stashComponent => {
      if (stashRowElementInstance.props.ingredient.prod_id == stashComponent.props.ingredient.prod_id) {
        isDuplicate = true;
      }
    })
    if (isDuplicate) return;

    myStashComponents.push(stashRowElementInstance);
    this.setState({
      myStashComponents: myStashComponents
    })
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
                this.state.shoppingListRecipes.map((recipe, index) => {
                  return (
                    <ShoppingListRecipe
                      matchIngredient={(stashIngredient, subtract) => this.matchIngredient(stashIngredient, subtract)}
                      removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
                      removeRecipe={(recipe) => this.removeRecipe(recipe)}
                      key={this.state.shoppingListRecipes.indexOf(recipe)}
                      calculateTotalRecipePrice={(recipePrice) => this.calculateTotalRecipePrice(recipePrice)}
                      recipe={recipe}
                      ingredientInStash={(ingredient, ingredientIndex) => this.ingredientInStash(ingredient, ingredientIndex)}
                      recipeIndex={index}
                      updateTotalRecipePrice={(priceElement, remove) => this.updateTotalRecipePrice(priceElement, remove)}
                      trackShoppingListElement={(stashRowElementInstance) => this.trackShoppingListElement(stashRowElementInstance)}
                      updateMyStashIngredients={(stashIngredient) => this.updateMyStashIngredients(stashIngredient)}
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
                          matchIngredient={(stashIngredient, subtract, matchIngredient) => this.matchIngredient(stashIngredient, subtract, matchIngredient)}
                          key={this.state.myStashIngredients.indexOf(ingredient)}
                          ingredient={ingredient} myStash={true}
                          removeIngredient={this.removeIngredient}
                          testRecipePrice={(priceElement) => this.testRecipePrice(priceElement)}
                          trackStashElement={(stashRowElementInstance) => this.trackStashElement(stashRowElementInstance)}
                          passToStashComponents={true}
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
