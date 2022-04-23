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

  unHideStashElement(shoppingListElement) {
    let myStashComponents = this.state.myStashComponents;

    myStashComponents.forEach(component => {
      if (Number(component.props.ingredient.prod_id) === Number(shoppingListElement.props.ingredient.prod_id)) {
        component.setState({
          hide: false,
          boxChecked: true,
          wasTrashed: false
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

    myStashIngredients.forEach((stashIngredient, index) => {
      if (Number(stashIngredient.prod_id) === Number(shoppingListElement.props.ingredient.prod_id)) {
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

    console.log("PUSHING TO MYSTASHINGREDIENTS")
    console.log(shoppingListElement.props.ingredient);
    myStashIngredients.push(shoppingListElement.props.ingredient);


    this.setState((prevState) => ({
      myStashIngredients: myStashIngredients
    }))

    console.log(`myStashIngredients.length = ${myStashIngredients.length}`)


  }



  /**
   * 
   * @param {*} stashRowElement ingredient object
   * @param {*} params an object that contains the members recipeId and an endpoint (the url to access)
   */
  removeIngredient(stashRowElement, params) {
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
    })

  }


  /**
   * It takes a recipeComponent and a stashIngredient and returns the ingredientComponent that matches
   * the stashIngredient.
   * @param recipeComponent - The component that contains the recipe ingredients
   * @param stashIngredient - is the ingredient that is being dragged
   * @returns The ingredientComponent that matches the stashIngredient.
   */
  componentDidMatch(recipeComponent, stashIngredient, subtract, addedToStash) {
    let ingredientMatch = undefined
    recipeComponent.state.recipeIngredientComponent.forEach((ingredientComponent, ingredientIndex) => {
      if (Number(ingredientComponent.props.ingredient.prod_id) === Number(stashIngredient.props.ingredient.prod_id)) {
        ingredientMatch = ingredientComponent
        return ingredientComponent;
      }
    })
    return ingredientMatch;
  }

  /**
   * 
   * @param {*} priceElement Ingredient object
   * @param {*} subtract Removes element if true, and adds element if false
   * @function Adds or removes ingredient price from total price
  */
  updateTotalRecipePrice(totalRecipeSum = undefined) {
    // Optional parameter because of async, so the state of the recipeComponents might not have set
    // when first initalizing the shopping list

    if (totalRecipeSum !== undefined) {
      this.setState({
        recipeSum: totalRecipeSum
      }, () => {
        return;
      })
      return;
    }
    let tempRecipeSum = 0;

    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      console.log(``)
      console.log(`updateTotalRecipePrice to = ${tempRecipeSum}`)
      console.log(``)
      tempRecipeSum += recipeComponent.state.price
    })



    this.setState({
      recipeSum: tempRecipeSum,
    }, () => {
      return
    })
  }

  // TODO fix bug where when all shoppinglist elements are hidden, then the recipe price does not equate to 0
  updateRecipePrices(lastIngredientPassedToShoppingLists = false) {
    let totalRecipeSum = 0;
    // console.log(this.state.shoppingListRecipeComponents)
    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      let recipeSum = 0;
      console.log(``);
      console.log(`________updateRecipePrices forEach ${rcIndex}________`);
      console.log(recipeComponent.state.recipeIngredientComponent)

      recipeComponent.state.recipeIngredientComponent.forEach((recipeIngredientComponent, ricIndex) => {
        console.log(``);
        console.log(`________recipeIngredientComponent forEach ${ricIndex}________`);
        console.log(`recipeIngredientComponent.state.hide = ${recipeIngredientComponent.state.hide} recipeIngredientComponent.state.wasTrashed = ${recipeIngredientComponent.state.wasTrashed}`);
        let tempIngredientPrice = recipeIngredientComponent.props.ingredient.price;

        if (recipeIngredientComponent.state.hide || recipeIngredientComponent.state.wasTrashed) {
          tempIngredientPrice = 0;
        }
        else {
          this.state.myStashComponents.forEach((stashComponent, scIndex) => {
            console.log(stashComponent);
            if (Number(stashComponent.props.ingredient.prod_id) === recipeIngredientComponent.props.ingredient.prod_id) {
              if (stashComponent.state.hide || !stashComponent.state.boxChecked) {
                tempIngredientPrice = 0;
              }
            }
          })
        }

        console.log(`Before changing recipe sum`)
        console.log(`recipeSum = ${recipeSum} adding ${recipeIngredientComponent.props.ingredient.price} to recipeSum`);
        recipeSum = Number(+recipeSum + +tempIngredientPrice).toFixed(2)
        recipeComponent.setState({
          price: recipeSum
        })
      })
      console.log(`Adding ${recipeSum} to totalRecipeSum ${totalRecipeSum}`)
      console.log(``);
      totalRecipeSum = Number(+totalRecipeSum + +recipeSum);
    })

    console.log(this.state.shoppingListRecipeComponents)
    this.updateTotalRecipePrice(totalRecipeSum);
  }

  /**
   * The function is called when a user checks or unchecks a checkbox on a stashRowElement component. 
   * 
   * The function is supposed to update the hide state of the recipeIngredient component that matches
   * the stashRowElement component. 
   * 
   * The function is also supposed to update the boxChecked state of the recipeIngredient component
   * that matches the stashRowElement component. 
   * 
   * The function is also supposed to update the hide state of the stashRowElement component that
   * matches the recipeIngredient component. 
   * 
   * The function is also supposed to update the boxChecked state of the stashRowElement component that
   * matches the recipeIngredient component. 
   * 
   * The function is also supposed to update the hide state of the recipeIngredient component that
   * matches the stashRowElement component. 
   * 
   * The function is also supposed to update the boxChecked state of the recipeIng
   * @param stashIngredient - the stashRowElement component that was just checked/unchecked
   * @param subtract - boolean
   * @param [wasTrashed=false] - boolean
   */
  matchIngredient(stashIngredient, subtract, wasTrashed = false, addedToStash = false) {
    let ingredientComponent = undefined;

    console.log("")
    console.log(`New matchIngredient call subtract = ${subtract}, wasTrashed = ${wasTrashed}, addedToStash = ${addedToStash}`)
    console.log(stashIngredient);
    console.log(this);

    // Updates the hide state of the recipeIngredient/stashRowElement component.
    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      console.log(recipeComponent);
      ingredientComponent = this.componentDidMatch(recipeComponent, stashIngredient, subtract, addedToStash);
      console.log(`_______________MatchIngredient_forEach ${rcIndex}_________________`)
      console.log("THE MATCHED INGREDIENT COMPONENT")
      console.log(ingredientComponent);
      if (ingredientComponent) {
        // The case where the trash can on the stashRowElement was pushed
        if (wasTrashed) {
          ingredientComponent.setState({
            hide: false,
            boxChecked: true,
            wasTrashed: true,
          }, () => {
            this.updateRecipePrices();
          })
          // return;
        }

        // Two cases: the recipeIngredient was added to stash or it wasn't
        if (addedToStash) {
          ingredientComponent.setState({
            hide: true,
            boxChecked: true
          }, () => {
            this.updateRecipePrices();
            console.log("if addedToStash callback")
          })
        }
        else {
          ingredientComponent.setState({
            hide: stashIngredient.state.boxChecked,
            boxChecked: true
          }, () => {
            console.log("else callback")
            this.updateRecipePrices();
          })
        }

        // this.updateRecipePrices();

        // let price = subtract ? recipeComponent.state.price - ingredientComponent.props.ingredient.price :
        // +recipeComponent.state.price + +ingredientComponent.props.ingredient.price;

        // To stop the case where a removed ingredient will also reduce the recipe sum further
        // if (ingredientComponent.state.wasTrashed) {
        //   price = recipeComponent.state.price;
        //   console.log("IngredientComponent was trashed")
        // }

        // console.log(`Updating recipe price to ${Number(price).toFixed(2)}`)
        // recipeComponent.setState({
        //   price: Number(price).toFixed(2)
        // })

        // if (stopPriceUpdate) {
        //   console.log("Price shouldnt update")
        //   return;
        // }
        // else {
        // this.updateTotalRecipePrice();
        // }
      }
      else {
        console.log("didnt find match")
        // let price = subtract ? recipeComponent.state.price - stashIngredient.props.ingredient.price :
        //   +recipeComponent.state.price + +stashIngredient.props.ingredient.price;

        console.log(stashIngredient)
        console.log(`stashIngredient.state.inited = ${stashIngredient.state.inited}`)
        console.log(`stashIngredient.state.hide = ${stashIngredient.state.hide}`)
        console.log(`stashIngredient.state.wasTrasheed = ${stashIngredient.state.wasTrashed}`)
        console.log(`recipeComponent.state.inited = ${recipeComponent.state.inited}`)
        if (!stashIngredient.state.inited && this.state.myStashComponents.length >= 1) {
          // console.log("updating price")
          // recipeComponent.setState({
          //   price: Number(price).toFixed(2)
          // })
        }

        recipeComponent.setState({
          inited: true,
        })


      }
    })
    // console.log("reached matchIngredient end")
  }


  ingredientInStash(shoppingListIngredient, ingredientIndex) {
    let isInStash = false;
    let myStashIngredients = this.state.myStashIngredients;
    if (ingredientIndex === undefined) {
      return isInStash
    }

    myStashIngredients.forEach((ingredient, i) => {
      if (Number(ingredient.prod_id) === Number(shoppingListIngredient.prod_id)) {
        isInStash = true
      }
    });

    return isInStash
  }

  removeRecipe(recipe) {
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
  }

  trackShoppingListRecipeComponent(shoppingListRecipeInstance) {
    let shoppingListComponents = this.state.shoppingListRecipeComponents;

    if (this.state.shoppingListRecipeComponents.length === this.state.shoppingListRecipes.length) {
      return;
    }

    shoppingListComponents.push(shoppingListRecipeInstance);

    this.setState({
      shoppingListRecipeComponents: shoppingListComponents
    })
  }

  trackStashElement(stashRowElementInstance) {
    let myStashComponents = this.state.myStashComponents;
    let isDuplicate = false;


    myStashComponents.forEach(stashComponent => {
      if (Number(stashRowElementInstance.props.ingredient.prod_id) === Number(stashComponent.props.ingredient.prod_id)) {
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
                      matchIngredient={(stashIngredient, subtract, wasTrashed, addedToStash) => this.matchIngredient(stashIngredient, subtract, wasTrashed, addedToStash)}
                      removeIngredient={(stashRowElement, params) => this.removeIngredient(stashRowElement, params)}
                      removeRecipe={(recipe) => this.removeRecipe(recipe)}
                      key={this.state.shoppingListRecipes.indexOf(recipe)}
                      calculateTotalRecipePrice={(recipePrice) => this.calculateTotalRecipePrice(recipePrice)}
                      recipe={recipe}
                      ingredientInStash={(ingredient, ingredientIndex) => this.ingredientInStash(ingredient, ingredientIndex)}
                      recipeIndex={index}
                      updateTotalRecipePrice={(stashRowElement, subtract) => this.updateTotalRecipePrice(stashRowElement, subtract)}
                      updateMyStashIngredients={(stashIngredient) => this.updateMyStashIngredients(stashIngredient)}
                      updateRecipePrices={(lastIngredientPassedToShoppingLists) => this.updateRecipePrices(lastIngredientPassedToShoppingLists)}
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
