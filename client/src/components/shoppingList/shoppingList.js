import React from 'react';
import '../../stylesheets/shoppingList.css'
import ShoppingListRecipe from './shoppingListRecipe';
import IngredientElement from './ingredientElement';
import { compareTwoStrings } from 'string-similarity';
import { param } from 'jquery';

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
    super(props);

    this.props.updateNavFunction(2);

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
    // Retrieves mystash information
    fetch(`/stash/get`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          myStashIngredients: res,
        });
      }).catch(err => {
        console.error(err);
      }).then(() => {
        // Retrieves shoppinglist information
        this.fetchShoppingList();
      });

  }

  fetchShoppingList() {
    fetch(`/shoppingList/get`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          shoppingListRecipes: res,
        }, () => {this.filterStashItems()});
      }).catch(err => {
        console.error(err);
      });
  }

  filterStashItems() {
    console.log(this.state.shoppingListRecipes);
    console.log(this.state.myStashIngredients)
    let filteredStash = [];

    this.state.myStashIngredients.forEach(stashIngredient => {
      let similarity;
      this.state.shoppingListRecipes.forEach(recipe => {
        for (let recipeIngredient of recipe.ingredients) {
          similarity = compareTwoStrings(stashIngredient.title, recipeIngredient.title);
          if (similarity >= 0.5) {
            break;
          }
        }
      })

      if (similarity >= 0.5) {
        filteredStash.push(stashIngredient);
      }
    })

    this.setState({
      myStashIngredients: filteredStash
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
      let similarity = compareTwoStrings(component.props.ingredient.title, shoppingListElement.props.ingredient.title);

      if (similarity >= 0.5) {
        component.setState({
          hide: false,
          boxChecked: true,
          wasTrashed: false
        })
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

    myStashIngredients.push(shoppingListElement.props.ingredient);


    this.setState((prevState) => ({
      myStashIngredients: myStashIngredients
    }))
  }

  /**
   * 
   * @param {*} stashRowElement ingredient object
   * @param {*} params an object that contains the members recipeId and an endpoint (the url to access)
   */
  removeIngredient(stashRowElement, params) {
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
      let similarity = compareTwoStrings(ingredientComponent.props.ingredient.title, stashIngredient.props.ingredient.title);

      if (similarity >= 0.5) {
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
      tempRecipeSum += recipeComponent.state.price
    })

    this.setState({
      recipeSum: tempRecipeSum,
    }, () => {
      return
    })
  }

  updateRecipePrices() {
    let totalRecipeSum = 0;

    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      let recipeSum = 0;

      if (recipeComponent.state.hide) {
        return;
      }

      recipeComponent.state.recipeIngredientComponent.forEach((recipeIngredientComponent, ricIndex) => {
        let tempIngredientPrice = recipeIngredientComponent.props.ingredient.price;

        if (recipeIngredientComponent.state.hide || recipeIngredientComponent.state.wasTrashed) {
          tempIngredientPrice = 0;
        }
        else {
          this.state.myStashComponents.forEach((stashComponent, scIndex) => {
            let similarity = compareTwoStrings(stashComponent.props.ingredient.title, recipeIngredientComponent.props.ingredient.title);
            if (similarity >= 0.5) {
              if (!stashComponent.state.hide && stashComponent.state.boxChecked) {
                tempIngredientPrice = 0;

                recipeIngredientComponent.setState({
                  hide: true,
                })
              }
            }
          })
        }

        recipeSum = Number(+recipeSum + +tempIngredientPrice).toFixed(2)
        recipeComponent.setState({
          price: recipeSum
        })
      })

      totalRecipeSum = Number(+totalRecipeSum + +recipeSum).toFixed(2);
    })

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

    // Updates the hide state of the recipeIngredient/stashRowElement component.
    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      ingredientComponent = this.componentDidMatch(recipeComponent, stashIngredient, subtract, addedToStash);
      if (ingredientComponent) {
        // The case where the trash can on the stashRowElement was pushed
        if (wasTrashed) {
          ingredientComponent.setState({
            hide: false,
            boxChecked: true,
            wasTrashed: false,
          }, () => {
            this.updateRecipePrices();
          })
          return;
        }

        // Two cases: the recipeIngredient was added to stash or it wasn't
        let hide = addedToStash ? true : stashIngredient.state.boxChecked;
        ingredientComponent.setState({
          hide: hide,
          boxChecked: true,
        }, () => {
          this.updateRecipePrices();
        })

      }
      // If no matching ingredient component was found.
      else {
        // IS this every reachable?
        console.log("INITING RECIPECOMPONENT")
        recipeComponent.setState({
          inited: true,
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
      let similarity = compareTwoStrings(ingredient.title, shoppingListIngredient.props.ingredient.title);

      if (similarity >= 0.5) {
        isInStash = true
        shoppingListIngredient.setState({
          hide: true,
        }, () => {
          this.updateRecipePrices();
          return isInStash
        })
      }
    });
    return isInStash

  }

  removeRecipe(recipe) {
    console.log(recipe);
    console.log(`fetching endpoint = /shoppinglist/remove/recipe/${recipe.recipeID}`)

    fetch(`/shoppinglist/remove/recipe/${recipe.recipeID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }).catch(err => {
      console.error(err);
    });
    this.updateRecipePrices();
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
    }
    )
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
                      updateRecipePrices={() => this.updateRecipePrices()}
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
                        <IngredientElement
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
