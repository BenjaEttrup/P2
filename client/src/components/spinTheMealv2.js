import React from "react";
import ReactDOM from "react-dom";

import Wheel from "./spin2.js";

import "../stylesheets/spinTheMealp2.css";

export class Spin extends React.Component {
  constructor() {
    super();
    this.places = [
      "Pizzas",
      "Pizzas",
      "Pizzas",
      "Pizzas",
      "Soup",
      "Japanese food",
      "Pastas"
    ];
  }

  render() {
    return (
      <div className="Spin">
        <Wheel items={this.places} />
      </div>
    );
  }
}

export default Spin;

/**
 * Given a list of recipes, return a list of recipes that fall between a min and max price
 * @param minPrice - The minimum price you want to pay for your recipe.
 * @param maxPrice - The maximum price you want to pay for your recipe.
 * @param recipes - an array of recipes
 * @returns An array of recipes.
 */
 function betweenPricesSearch(minPrice, maxPrice, recipes) {
    let returnRecipe = [];
    recipes.forEach((recipe) => {
      let price = 0;
  
      recipe.ingredients.forEach((ingredient) => {
          price += ingredient.price;
      })
  
      if(price >= minPrice && price <= maxPrice){
          returnRecipe.push(recipe);
      }
    })
    return returnRecipe;
  }

  /**
   * Given two objects, return the difference between the price of the first and the price of the second
   * @param a - The first item to compare.
   * @param b - The recipe to compare against.
   * @returns The function is being called with the arguments a and b. The function returns
   * a.recipe.price - b.recipe.price.
   */
  function comparePrice(a, b) {
    return a.recipe.price - b.recipe.price;
  }

