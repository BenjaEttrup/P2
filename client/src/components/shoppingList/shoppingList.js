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
   * Updates the sum of the recipes by adding all recipe prices together
   */
  calculateTotalRecipePrice(recipePrice) {
    this.setState((prevState) => ({
      recipeSum: Number(prevState.recipeSum + recipePrice).toFixed(2)
    }));
  }


  /**
   * Finds the recipe ingredient that best matches the stash ingredient above a similarity of 0.5
   * @param {*} stashComponent an ingredient in the user's stash
   * @param {*} recipeIngredientComponent an ingredient in the user's recipes
   * @param {*} scIndex the index of an ingredient in bestMatches.stashComponents 
   * @param {*} bestMatches the stash ingredients that have or have not been mapped to recipe ingredients
   * @returns a matching stash ingredient (component) if found
   */
  stashIngredientToRecipeIngredient(stashComponent, recipeIngredientComponent, scIndex, bestMatches) {
    let similarity = compareTwoStrings(stashComponent.props.ingredient.title, recipeIngredientComponent.props.ingredient.title);
    if (similarity >= 0.5) {
      let bestMatchSimilarity = bestMatches.matches[scIndex] ? bestMatches.matches[scIndex].similarity : 0;
      if (similarity >= bestMatchSimilarity) {
        let match = { "component": recipeIngredientComponent, "similarity": similarity, "next": undefined }
        // if there is no existing match of the stash ingredient (component) mapping to the recipe ingredient (component)
        if ((bestMatches.matches[scIndex] === undefined) || (similarity > bestMatchSimilarity)) {
          bestMatches.matches[scIndex] = match;
          return match;
        }

        // If there is an existing match, then this match should be put at the end of the linked list.
        let tailEnd = this.linkedListTailEnd(bestMatches.matches[scIndex]);
        tailEnd.next = match;
        return match;
      }
    }
  }


  /**
   * Updates the state of the now matching stash ingredient, as the shoppingListElement was added to stash.
   * @param {*} shoppingListElement the ingredient from a shopping list
   */
  unHideStashElement(shoppingListElement) {
    let bestMatches = this.state.matchingIngredients;
    let matchingStashIngredient = undefined;
    let highestSimilarity = 0;

    // Optional chaining operator is used, as this function ca be called when this.state.matchingIngredients is undefined
    bestMatches?.stashComponents.forEach((stashComponent, scIndex) => {
      let match = this.stashIngredientToRecipeIngredient(stashComponent, shoppingListElement, scIndex, bestMatches);
      // Handles situations where no match was found (similarity was < 0.5)
      if (match?.similarity >= highestSimilarity) {
        highestSimilarity = match.similarity;
        matchingStashIngredient = stashComponent;
      }
    })

    this.setState({
      matchingIngredients: bestMatches,
    })

    // If a matching stash ingredient was found
    if (matchingStashIngredient !== undefined) {
      matchingStashIngredient.setState({
        hide: false,
        boxChecked: true,
        wasTrashed: false
      })
    }
  }

  /**
   * Updates the state of myStashIngredients to add the new ingredient
   * @param {*} shoppingListElement an ingredient in a shopping list
   */
  updateMyStashIngredients(shoppingListElement) {
    let myStashIngredients = this.state.myStashIngredients;
    let isDuplicate = false;

    myStashIngredients.forEach((stashIngredient, index) => {
      // Checks if the ingredient already exists in the user's stash
      if (Number(stashIngredient.prod_id) === Number(shoppingListElement.props.ingredient.prod_id)) {
        isDuplicate = true;
        shoppingListElement.setState({
          hide: true
        })
      }
    })

    // unhides the stash ingredient corresponding to the shoppingListElement 
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
   * Removes a recipe or stash ingredient from the user
   * @param {*} stashRowElement an ingredient from the user's stash or shopping list
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
   * Updates the total sum of all the recipes
   * @param {*} totalRecipeSum the total sum of the recipes
   */
  updateTotalRecipePrice(totalRecipeSum = undefined) {
    // If totalRecipeSum is not undefined then this would be the sum of the recipes else we must iterate over the price of each recipe.
    let tempRecipeSum = totalRecipeSum ? totalRecipeSum : 0;

    if (totalRecipeSum === undefined) {
      this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
        tempRecipeSum += recipeComponent.state.price
      })
    }

    this.setState({
      recipeSum: tempRecipeSum
    })
  }

  /**
   * Updates the prices of the recipes by seeing which ingredients are hidden or removed.
   */
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

  /**
   * Finds the recipe ingredient that matches the stash ingredient the best above a similarity of 0.5 
   * @param {*} recipeComponent an instance of a shopingListRecipe component
   * @param {*} stashIngredient an instance of a ingredient in
   * @returns the ingredient from a recipe that corresponds best to the stashIngredient
   */
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

    // Optional chaining operator used, as matchingIngredients might be undefined.
    this.state.matchingIngredients?.stashComponents.forEach((stashComponent, scIndex) => {
      if (stashIngredient.props.ingredient.title === stashComponent.props.ingredient.title) {
        if (this.state.matchingIngredients.matches[scIndex] !== undefined) {
          ingredientMatch = this.state.matchingIngredients.matches[scIndex]
          return ingredientMatch;
        }
        // Never seems to reach this else.
        else {
          console.log(this.state.matchingIngredients.matches[scIndex])
          ingredientMatch = this.findBestMatchingIngredient(recipeComponent, stashIngredient);
          return ingredientMatch;
        }
      }
    })

    return ingredientMatch;
  }


  /**
   * Updates the state of ingredientMatch accordingly based on state changes in stashIngredient 
   * and updates the price of recipes
   * @param {*} ingredientMatch the matching ingredient
   * @param {*} stashIngredient the stash ingredient
   * @param {*} wasTrashed if the stashIngredient was removed or not
   * @param {*} addedToStash if the stashIngredient was added to stash or not
   * 
   */
  updateMatchState(ingredientMatch, stashIngredient, wasTrashed, addedToStash) {
    if (ingredientMatch) {
      // The case where the ingredientElement was removed
      if (wasTrashed) {
        ingredientMatch.component.setState({
          hide: false,
          boxChecked: true,
          wasTrashed: false,
        }, () => {
          this.updateRecipePrices();
        })
        return;
      }
      // Two cases: the recipeIngredient was added to stash or it wasn't
      // If an ingredient wasn't added to stash, then the boxchecked state of a stashIngredient must have changed.
      let hide = addedToStash ? true : stashIngredient.state.boxChecked;

      ingredientMatch.component.setState({
        hide: hide,
        boxChecked: true,
      }, () => {
        this.updateRecipePrices();
      })

    }
  }

  /**
   * Is called when a stash/recipe ingredient is removed and updates the states of all matching ingredients
   * @param stashIngredient - the stashRowElement component that had its box checked/unchecked or was removed
   * @param [wasTrashed=false] - if the ingredient was removed
   */
  matchIngredient(stashIngredient, wasTrashed = false, addedToStash = false) {
    let match = undefined;
    let nextMatch = undefined;

    // Updates the hide state of the recipeIngredient/stashRowElement component.
    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      match = this.componentDidMatch(recipeComponent, stashIngredient);
      this.updateMatchState(match, stashIngredient, wasTrashed, addedToStash);

      // If a match was found, we should see if other recipes have the same ingredient
      // these matches would be in match.next. 
      if (match) {
        nextMatch = match.next;
      }
      while (nextMatch !== undefined) {
        this.updateMatchState(nextMatch, stashIngredient, wasTrashed, addedToStash);
        nextMatch = nextMatch.next;
      }
    })
  }

  /**
   * Finds the tail of a linked list
   * @param {*} linkedListNode a node/element in a linked list 
   * @returns the linkedList element, that points to undefined and is therefore the tail.
   */
  linkedListTailEnd(linkedListNode) {
    let nextNode = linkedListNode;
    while (nextNode.next !== undefined) {
      nextNode = nextNode.next;
    }

    return nextNode;
  }

  /**
   * Maps the user's stash ingredients to recipe ingredients 
   * @returns an object containing all the stashComponents, and all the recipe ingredients 
   * (ingredientElement instances) that matched a stash ingredient
   */

  matchIngredients() {
    let bestMatches = {
      "stashComponents": this.state.myStashComponents,
      "matches": []
    };

    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      recipeComponent.state.recipeIngredientComponent.forEach((recipeIngredientComponent, ricIndex) => {
        bestMatches.stashComponents.forEach((stashComponent, scIndex) => {
          this.stashIngredientToRecipeIngredient(stashComponent, recipeIngredientComponent, scIndex, bestMatches);
        })
      })

    })

    this.setState({
      matchingIngredients: bestMatches
    })
    return bestMatches;
  }

  /**
   * @function hides every recipe ingredient that was matched to an ingredient in the user's stash.
   * and updates the prices of the recipes
   */
  ingredientInStash() {
    let bestMatches = this.matchIngredients();

    // Iterates all the matching recipe ingredients found
    for (let match of bestMatches.matches) {
      let nextMatch = match.next;

      // hides every recipe ingredient that matched a stash ingredient
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

  /**
   * @function removes a recipe by the endpoint /shoppinglist/remove/recipe/:ID and updates the total sum of the recipes
   * @param {*} recipe a recipe from the user's shopping list
   */
  removeRecipe(recipe) {
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

  /** 
   * @function Tracks a new shoppingListRecipe component and updates state.
   * @param {*} shoppingListRecipeInstance an instance of a shoppingListRecipe component
   */
  trackShoppingListRecipeComponent(shoppingListRecipeInstance) {
    let shoppingListComponents = this.state.shoppingListRecipeComponents;
    shoppingListComponents.push(shoppingListRecipeInstance);

    this.setState({
      shoppingListRecipeComponents: shoppingListComponents
    })
  }

  /**
   * @function tracks an ingredient component from the user's stash
   * @param {*} stashRowElementInstance the component instance of ingredientElement. 
   */
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
      // If all ingredients have been instanced as ingredientElement components, then we should find if they correspond to ingredients in the user's recipes.
      if (myStashComponents.length === this.state.myStashIngredients.length) {
        this.ingredientInStash();
      }
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
                {this.state.recipeSum > 0 ? <p id="totalPrice"> Den samlede pris er {
                  this.state.recipeSum
                } kr.</p> : <p id="emptyList">Shoppinglisten er tom.</p>}
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
