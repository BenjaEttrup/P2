import React from 'react';
import '../../stylesheets/shoppingList.css'
import ShoppingListRecipe from './shoppingListRecipe';
import IngredientElement from './ingredientElement';
import { compareTwoStrings } from 'string-similarity';
import { Link } from 'react-router-dom';

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
      filteredStash: false,
      matchingIngredients: undefined,
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
          // after retrieving the recipes, the stashitems that match ingredients should be found.
        }, () => { this.filterStashItems() });
      }).catch(err => {
        console.error(err);
      });
  }


  filterStashItems() {
    let filteredStash = [];

    this.state.myStashIngredients.forEach(stashIngredient => {
      let similarity = 0;
      this.state.shoppingListRecipes.forEach(recipe => {
        for (let recipeIngredient of recipe.ingredients) {
          // the similarity between the user's stash ingredients and recipe ingredients will all be compared here.
          similarity = compareTwoStrings(stashIngredient.title, recipeIngredient.title);
          if (similarity >= 0.5) {
            break;
          }
        }
      })

      // If the Sørensen dice coefficient is larger or equal to 0.5 then it is considered a match and is therefore included in the filteredStash.
      if (similarity >= 0.5) {
        filteredStash.push(stashIngredient);
      }
    })

    // The stash ingredients are updated to only include the ingredients that were found in any recipe.
    this.setState({
      myStashIngredients: filteredStash,
      filteredStash: true,
    }, () => {
      this.updateRecipePrices();
    })
  }


  /**
   * @function Updates the sum of the recipes by adding all recipe prices together
   */
  calculateTotalRecipePrice(recipePrice) {
    this.setState((prevState) => ({
      recipeSum: Number(prevState.recipeSum + recipePrice).toFixed(2)
    }));
  }

  unHideStashElement(shoppingListElement) {
    let myStashComponents = this.state.matchingIngredients?.stashComponents;
    let bestMatches = this.state.matchingIngredients;
    let mostSimilarComponent = undefined; //could use a better name

    // if myStashComponents is undefined it is because this.state.matchingIngredients has not been intialized yet.
    if (!myStashComponents) {
      return;
    }

    myStashComponents.forEach((component, cIndex) => {
      // TODO This should be its own function as it is also used in matchIngredients.
      let similarity = compareTwoStrings(component.props.ingredient.title, shoppingListElement.props.ingredient.title);
      if (similarity >= 0.5) {
        let bestMatchSimilarity = bestMatches.matches[cIndex] ? bestMatches.matches[cIndex].similarity : 0;
        if (similarity >= bestMatchSimilarity) {
          let match = { "component": shoppingListElement, "similarity": similarity, "next": undefined }
          mostSimilarComponent = component;

          if ((bestMatches.matches[cIndex] === undefined) || (similarity > bestMatchSimilarity)) {
            bestMatches.matches[cIndex] = match;
            return;
          }

          let tailEnd = this.linkedListTailEnd(bestMatches.matches[cIndex]);
          tailEnd.next = match;
        }
      }
    })

    // Updates the state of the stash ingredient that matched the shoppingListElement(ingredient)
    if (mostSimilarComponent !== undefined) {
      mostSimilarComponent.setState({
        hide: false,
        boxChecked: true,
        wasTrashed: false
      })
    }
  }

  /**
   * @function updates the state of myStashIngredients to add the new ingredient
   * @param {*} stashIngredient the stashIngredient
   */
  updateMyStashIngredients(shoppingListElement) {
    let myStashIngredients = this.state.myStashIngredients;
    let isDuplicate = false;

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
   * 
   * @param {*} priceElement Ingredient object
   * @param {*} subtract Removes element if true, and adds element if false
   * @function Adds or removes ingredient price from total price
  */
  updateTotalRecipePrice(totalRecipeSum = undefined) {
    // If totalRecipeSum is not undefined then this would be the sum of the recipes else we must iterate over the price of each recipe.
    let tempRecipeSum = totalRecipeSum? totalRecipeSum : 0;

    if (totalRecipeSum === undefined) {
      this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
        tempRecipeSum += recipeComponent.state.price
      })
    }

    this.setState({
      recipeSum: tempRecipeSum
    })
  }

  updateRecipePrices() {
    let totalRecipeSum = 0;

    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      let recipeSum = 0;

      // Hidden recipes should be ignored
      if (recipeComponent.state.hide) {
        return;
      }

      recipeComponent.state.recipeIngredientComponent.forEach((recipeIngredientComponent, ricIndex) => {
        let tempIngredientPrice = recipeIngredientComponent.props.ingredient.price;

        // Hidden or deleted ingredients from a recipe should not have their prices added to the sum
        if (recipeIngredientComponent.state.hide || recipeIngredientComponent.state.wasTrashed) {
          tempIngredientPrice = 0;
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

  findBestMatchingIngredient(recipeComponent, stashIngredient) {
    let ingredientMatch = undefined;
    let highestSimilarity = 0;
    recipeComponent.state.recipeIngredientComponent.forEach((ingredientComponent, ingredientIndex) => {
      let similarity = compareTwoStrings(ingredientComponent.props.ingredient.title, stashIngredient.props.ingredient.title);

      if ((similarity >= 0.5) && (similarity >= highestSimilarity)) {
        highestSimilarity = similarity
        ingredientMatch = { "component": ingredientComponent, "similarity": highestSimilarity, "next": undefined };
      }
    })

    console.log("")
    console.log("findBestMatchingIngredient best match = ")
    return ingredientMatch;
  }

  /**
   * It takes a recipeComponent and a stashIngredient and returns the ingredientComponent that matches
   * the stashIngredient.
   * @param recipeComponent - The component that contains the recipe ingredients
   * @param stashIngredient - is the ingredient that is being dragged
   * @returns The ingredientComponent that matches the stashIngredient.
   */
  componentDidMatch(recipeComponent, stashIngredient) {
    let ingredientMatch = undefined

    this.state.matchingIngredients?.stashComponents.forEach((stashComponent, scIndex) => {
      if (stashIngredient.props.ingredient.title === stashComponent.props.ingredient.title) {
        if (this.state.matchingIngredients.matches[scIndex] !== undefined) {
          ingredientMatch = this.state.matchingIngredients.matches[scIndex]
          return ingredientMatch;
        }
        else {
          ingredientMatch = this.findBestMatchingIngredient(recipeComponent, stashIngredient);
          return ingredientMatch;
        }
      }
    })

    // Should probably return an array (this.state.matchingIngredients.matches[scIndex])
    // As there can be multiple matches over multiple recipes which would be found in this.state.matchingIngredients.matches[scIndex].next
    console.log(`The match that was found is`)
    console.log(ingredientMatch)
    return ingredientMatch;
  }

  updateMatchState(ingredientMatch, stashIngredient, wasTrashed, addedToStash) {
    if (ingredientMatch) {

      console.log("Updating state on match")
      // The case where the trash can on the stashRowElement was pushed
      if (wasTrashed) {
        // console.log(ingredientMatch.component.props.ingredient.title)
        // console.log(ingredientMatch)
        // console.log("changing boxChecked to True")
        ingredientMatch.component.setState({
          hide: false,
          boxChecked: true,
          wasTrashed: false,
        }, () => {
          // this.state.myStashComponents.forEach(component => {
          //   console.log(`component ${component.props.ingredient.title} boxchecked = ${component.state.boxChecked}`)
          // })
          this.updateRecipePrices();
        })
        return;
      }

      // Two cases: the recipeIngredient was added to stash or it wasn't
      let hide = addedToStash ? true : stashIngredient.state.boxChecked;

      // console.log("")
      // console.log("After ternary statement")
      // console.log(ingredientMatch.component.props.ingredient.title)
      // console.log(ingredientMatch)
      // console.log("changing boxChecked to True")
      ingredientMatch.component.setState({
        hide: hide,
        boxChecked: true,
      }, () => {
        // this.state.myStashComponents.forEach(component => {
        //   console.log(`component ${component.props.ingredient.title} boxchecked = ${component.state.boxChecked}`)
        // })
        this.updateRecipePrices();
      })

    }
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
    let match = undefined;
    let nextMatch = undefined;

    // Updates the hide state of the recipeIngredient/stashRowElement component.
    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      match = this.componentDidMatch(recipeComponent, stashIngredient, subtract, addedToStash);
      this.updateMatchState(match, stashIngredient, wasTrashed, addedToStash);
      if (match) {
        nextMatch = match.next;
      }
      while (nextMatch !== undefined) {
        this.updateMatchState(nextMatch, stashIngredient, wasTrashed, addedToStash);
        nextMatch = nextMatch.next;
      }
    })
  }

  linkedListTailEnd(linkedListNode) {
    let nextNode = linkedListNode;
    while (nextNode.next !== undefined) {
      nextNode = nextNode.next;
    }

    return nextNode;
  }

  matchIngredients() {
    let bestMatches = {
      "stashComponents": this.state.myStashComponents,
      "matches": []
    };

    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      recipeComponent.state.recipeIngredientComponent.forEach((recipeIngredientComponent, ricIndex) => {
        bestMatches.stashComponents.forEach((stashComponent, scIndex) => {
          let similarity = compareTwoStrings(stashComponent.props.ingredient.title, recipeIngredientComponent.props.ingredient.title);
          if (similarity >= 0.5) {
            let bestMatchSimilarity = bestMatches.matches[scIndex] ? bestMatches.matches[scIndex].similarity : 0;
            if (similarity >= bestMatchSimilarity) {
              let match = { "component": recipeIngredientComponent, "similarity": similarity, "next": undefined }
              if ((bestMatches.matches[scIndex] === undefined) || (similarity > bestMatchSimilarity)) {
                bestMatches.matches[scIndex] = match;
                return;
              }

              let tailEnd = this.linkedListTailEnd(bestMatches.matches[scIndex]);
              tailEnd.next = match;
            }
          }
        })
      })
    })

    this.setState({
      matchingIngredients: bestMatches
    })
    console.log(bestMatches)
    return bestMatches;
  }

  ingredientInStash() {
    let bestMatches = this.matchIngredients();

    for (let match of bestMatches.matches) {
      let nextMatch = match.next;
      while (nextMatch !== undefined) {
        nextMatch.component.setState({
          hide: true,
        }, () => { })
        nextMatch = nextMatch.next;
      }
      match.component.setState({
        hide: true,
      }, () => { this.updateRecipePrices() })
    }
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
    shoppingListComponents.push(shoppingListRecipeInstance);

    this.setState({
      shoppingListRecipeComponents: shoppingListComponents
    })
  }

  trackStashElement(stashRowElementInstance) {
    let myStashComponents = this.state.myStashComponents;
    let isDuplicate = false;

    // Checks if an instance of a stash ingredient already has been added 
    myStashComponents.forEach(stashComponent => {
      if (Number(stashRowElementInstance.props.ingredient.prod_id) === Number(stashComponent.props.ingredient.prod_id)) {
        isDuplicate = true;
      }
    })
    if (isDuplicate) return;

    myStashComponents.push(stashRowElementInstance);
    this.setState({
      myStashComponents: myStashComponents
    }, () => {
      // If all ingredients have been instanced as ingredientElement components, then we should find if they respond to ingredients in the user's recipes.
      if (myStashComponents.length === this.state.myStashIngredients.length) {
        this.ingredientInStash();
      }
    })
  }

  //This is the render function. This is where the
  //html is.
  render() {
    console.log(this.state.filteredStash)
    return (
      <div className="ShoppingList">
        <div className="card shadow shoppingList">
          <div className="card-body shoppingList-card-body">
            <div className="">
              <h4>
                Shopping List
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
              <div>
                {this.state.recipeSum > 0 ? <p id="totalPrice"> Den samlet pris er {
                  this.state.recipeSum
                } kr.</p>: <p id="emptyList">Shoppinglisten er tom.</p>}
              </div>
              <table className="table table-striped table-borderless">
                <thead>
                  <tr>
                    <th className='col-9' scope='col'><Link to='/myStash' className='recipeLink'>My Stash</Link></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.myStashIngredients.map((ingredient) => {
                      if (this.state.filteredStash) {
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
                      }
                      else {
                        return null;
                      }
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
