import React from 'react'
import Spin from './spinner';
import { compareTwoStrings } from 'string-similarity';

import '../stylesheets/spinTheMeal.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class SpinTheMeal extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super(props);

    this.props.updateNavFunction(3);

    this.state = {
      allRecipes: [],
      recipes: [],
      minPrice: 0,
      maxPrice: 0,
      myStashChecked: false,
      myStash: []
    }
  }

  componentDidMount() {
    fetch(`/stash/get`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        let data = {
          myStash: res
        }
        this.setState(data, () => {
          fetch(`/recipes/getAll`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })
            .then(res => res.json())
            .then((json) => {
              let data = {
                allRecipes: json.recipes
              }
              this.setState(data, () => {
                this.updateRecipes();
              });
            }).catch(err => {
              console.error(err);
            });
        });
      }).catch(err => {
        console.error(err);
      });
  }

  updateRecipes() {
    let updatedRecipes = this.state.allRecipes
    if (this.state.myStashChecked) {
      updatedRecipes = myStashSearch(this.state.allRecipes, this.state.myStash);
    }

    updatedRecipes = betweenPricesSearch(this.state.minPrice === '' ? 0 : this.state.minPrice, this.state.maxPrice === '' || this.state.maxPrice === 0 ? 1000 : this.state.maxPrice, updatedRecipes)

    this.setState({
      recipes: updatedRecipes
    })
  }

  setMinPriceValue(evt) {
    this.setState({
      minPrice: evt.target.value
    }, () => {
      this.updateRecipes();
    })
  }

  setMaxPriceValue(evt) {
    this.setState({
      maxPrice: evt.target.value
    }, () => {
      this.updateRecipes();
    })
  }

  myStashChanged() {
    this.setState(prevState => ({
      myStashChecked: !prevState.myStashChecked
    }), () => {
      this.updateRecipes();
    });

  }

  render() {
    return (
      <div class="container">
        <div className="SpinTheMeal">
          <div class="spinTheMeal">
            <h1><center>Spin The Meal</center></h1><br />
          </div>
          <div class="row">
            <div class="col-lg-4 mb-2">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="">Pris</span>
                </div>
                <input type="number" class="form-control" placeholder="Min" id="min_price"
                  onChange={(evt) => { this.setMinPriceValue(evt) }} />
                <input type="number" class="form-control" placeholder="Max" id="max_price"
                  onChange={(evt) => { this.setMaxPriceValue(evt) }} />
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" onChange={() => { this.myStashChanged() }} />
                <label class="form-check-label" for="defaultCheck1">My Stash</label>
              </div>
            </div>
            <div class="col-lg-8 bg-light border pt-5 pb-5">
              <Spin recipes={this.state.recipes} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SpinTheMeal;
/**
 * Given a list of recipes, return a list of recipes that fall between a min and max price
 * @param minPrice - The minimum price you want to pay for your recipe.
 * @param maxPrice - The maximum price you want to pay for your recipe.
 * @param recipes - an array of recipes
 * @returns An array of recipes.
 */
function betweenPricesSearch(minPrice, maxPrice, recipes) {
  let returnRecipes = [];
  recipes.forEach((recipe) => {
    let price = 0;

    recipe.ingredients.forEach((ingredient) => {
      price += ingredient.price;
    })

    if (price >= minPrice && price <= maxPrice) {
      returnRecipes.push(recipe);
    }
  })
  return returnRecipes;
}

function myStashSearch(recipes, myStash) {
  let tempRecipes = JSON.parse(JSON.stringify(recipes))
  let updatedRecipes = []
  let containsIngredientFromStash = false;

  tempRecipes.forEach((recipe) => {
    let tempRecipe = recipe;
    let updatedIngredients = [];

    tempRecipe.ingredients.forEach((ingredient) => {
      let isSimilar = false;
      myStash.forEach((stashIngredient) => {
        let similarity = compareTwoStrings(ingredient.title, stashIngredient.title);

        if (similarity >= 0.5 && isSimilar === false) {
          isSimilar = true;
          containsIngredientFromStash = true;
        } else if (similarity <= 0.5 && isSimilar === false) {
          isSimilar = false;
        }
      })
      if (!isSimilar) {
        updatedIngredients.push(ingredient);
      }
    })
    let newPrice = 0;

    updatedIngredients.forEach((ingredient) => {
      newPrice += ingredient.price;
    })

    tempRecipe.ingredients = updatedIngredients;
    tempRecipe.recipe.price = Number(newPrice.toFixed(2));

    if (containsIngredientFromStash) {
      updatedRecipes.push(tempRecipe)
    }
  })

  return updatedRecipes;
}
