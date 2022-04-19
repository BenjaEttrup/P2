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
      myStashComponents: [],
      shoppingListRecipeComponents: [],
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
          boxChecked: true
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
    console.log("")
    console.log("UpdatingMystashingredients")
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
    }).then(fetch(`/stash/get`, {
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
      })
    )

    // if (Number.isInteger(params.recipeID)) {
    //   this.updateTotalRecipePrice(stashRowElement, true);
    // }
  }


  componentDidMatch(recipeComponent, stashIngredient) {
    let ingredientMatch = undefined
    recipeComponent.state.recipeIngredientComponent.forEach((ingredientComponent, ingredientIndex) => {
      if (Number(ingredientComponent.props.ingredient.prod_id) === Number(stashIngredient.props.ingredient.prod_id)) {
        ingredientMatch = ingredientComponent
        console.log(`__________________`);
        console.log(`ComponentDidMatch`);
        console.log(ingredientMatch);
        console.log(`__________________`);
        return ingredientComponent;
      }
    })
    return ingredientMatch;
  }


  matchIngredient(stashIngredient, subtract, wasTrashed = false) {
    let isStashItem = false;
    let ingredientComponent = undefined;
    if (stashIngredient.hasOwnProperty('prod_id')) {
      isStashItem = true;
    }

    console.log("")
    console.log(`New matchIngredient call subtract = ${subtract}, wasTrashed = ${wasTrashed}`)
    console.log(stashIngredient);

    // Updates the hide state of the recipeIngredient/stashRowElement component.
    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      console.log(recipeComponent);
      ingredientComponent = this.componentDidMatch(recipeComponent, stashIngredient);
      console.log(ingredientComponent);
      if (ingredientComponent) {
        // The case where the trash can on the stashRowElement was pushed
        if (wasTrashed) {
          ingredientComponent.setState({
            hide: false,
            boxChecked: true,
          })
          return;
        }

        // Two cases: the component in my stash is checked or unchecked  
        ingredientComponent.setState({
          hide: stashIngredient.state.boxChecked,
          boxChecked: true
        })





      }
    })
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

  trackShoppingListRecipeComponent(shoppingListRecipeInstance) {
    let shoppingListComponents = this.state.shoppingListRecipeComponents;

    shoppingListComponents.push(shoppingListRecipeInstance);

    this.setState({
      shoppingListRecipeComponents: shoppingListComponents
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
                      trackShoppingListRecipeComponent={(shoppingListRecipeInstance) => this.trackShoppingListRecipeComponent(shoppingListRecipeInstance)}
                      matchIngredient={(stashIngredient, subtract) => this.matchIngredient(stashIngredient, subtract)}
                      removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
                      removeRecipe={(recipe) => this.removeRecipe(recipe)}
                      key={this.state.shoppingListRecipes.indexOf(recipe)}
                      calculateTotalRecipePrice={(recipePrice) => this.calculateTotalRecipePrice(recipePrice)}
                      recipe={recipe}
                      ingredientInStash={(ingredient, ingredientIndex) => this.ingredientInStash(ingredient, ingredientIndex)}
                      recipeIndex={index}
                      updateTotalRecipePrice={(priceElement, remove) => this.updateTotalRecipePrice(priceElement, remove)}
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
                          removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
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
