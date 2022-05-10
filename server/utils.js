const axios = require("axios");

const { token } = require("./config.json");

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

module.exports = {
  /**
   * Replace all the special characters in the ingredient with their encoded values
   * @param ingredient - the ingredient to be encoded
   * @returns The ingredient name is being encoded to be used in the URL.
   */
  encodeCharacters(ingredient) {
    ingredient = ingredient.toLowerCase();
  
    // encodeURIComponent does not handle backslash and percentage sign. These are manually handled here
    ingredient = ingredient.replace(/%/g, "");
    ingredient = ingredient.replace(/\//g, "%2F");
    ingredient = encodeURIComponent(ingredient);
  
    return ingredient;
  },

  /**
   * This function calls the Salling Group API and returns the product ID and price of the first product
   * in the list of relevant products
   * @param product - The product name to search for.
   * @returns The API returns a JSON object with the following keys:
   */
  async callApi(product) {
    let apiRes;
    try {
      this.sleep(200);
      apiRes = await axios
        .get(
          "https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=" +
            product,
          config
        )
        .then((res) => {
          return res.data;
        });
      if (!apiRes.suggestions.length) {
        return { suggestions: [{ price: 0, title: product, productID: "null" }] };
      }
    } catch (e) {
      console.error(e);
      return { suggestions: [{ price: 0, title: product, productID: "null" }] };
    }
    return apiRes;
  },
  /**
   * Sleep for a given number of milliseconds
   * @param milliseconds - The number of milliseconds to wait.
   */
  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  },
  /**
   * This function takes in a recipe ID, a data object, and an option string. It then returns the index
   * of the recipe in the data object
   * @param ID - The ID of the recipe you want to find
   * @param data - the data object that contains the recipes and shopping list
   * @param option - "shoppingList" or "recipes"
   * @returns The index of the recipe in the shopping list or the recipe list.
   */
  findRecipeIndex(ID, data, option) {
    let numberID = Number.parseInt(ID);
    let returnValue = false;
    if (option === "shoppingList") {
      let index = 0;

      data.shoppingList.forEach((recipe) => {
        if (recipe.recipe.recipeID === numberID) {
          returnValue = index;
        }
        index++;
      });
    } else if (option === "recipes") {
      for (object in data[option]) {
        if (data[option][object].recipeID == ID) {
          return object;
        }
      }
    }
    return returnValue;
    // TODO reevaluate this function design
  },
  /**
 * Find the index of an ingredient in a recipe
 * @param recipeIndex - The index of the recipe in the user's recipe list.
 * @param productID - The ID of the product you want to find.
 * @param filePath - the path to the user data file
 * @param option - the member we want to access in the user.json file
 * @returns The index of the ingredient in the recipe.
 */
findIngredientIndex(recipeIndex, productID, filePath, option) {
  let userData = require(filePath);
  productID = Number(productID);

  // Loops through the ingredients found in userData.shoppinglist[recipeIndex].ingredients and compares prod ID.
  for (ingredient in userData[option][recipeIndex].ingredients) {
    if (
      Number(userData[option][recipeIndex].ingredients[ingredient].prod_id) ===
      productID
    ) {
      return ingredient;
    }
  }
},
/**
 * Compare the price of two items and return the difference
 * @param a - The first item to compare.
 * @param b - The second value to compare.
 * @returns The function is being called with the arguments of a and b. The function is then returning
 * the result of a.price - b.price.
 */
 comparePrice(a, b) {
  return a.price - b.price;
},
/**
 * Given a search value and a list of recipes, return a list of recipes that contain the search value
 * in the title
 * @param searchValue - The string that you want to search for.
 * @param recipes - an array of recipes
 * @returns An array of recipes that match the search value.
 */
 stringRecipeSearch(searchValue, recipes) {
  let returnRecipes = [];
  recipes.forEach((recipe) => {
    let recipeTitleLowerCase = recipe.recipe.title.toLowerCase();
    if (recipeTitleLowerCase.includes(searchValue.toLowerCase())) {
      returnRecipes.push(recipe);
    }
  });
  return returnRecipes;
},
/**
 * Given a search value and a list of recipes, return a list of recipes that include the search value
 * in their ingredients
 * @param searchValue - The string that you want to search for in the recipe ingredients.
 * @param recipes - an array of recipes
 * @returns An array of recipes that contain the search value in their ingredients.
 */
 stringIngredientSearch(searchValue, recipes) {
  let returnRecipes = [];
  recipes.forEach((recipe) => {
    let doesIncludeIngredient = false;
    recipe.ingredients.forEach((ingredient) => {
      let ingredientTitleLowerCase = ingredient.title.toLowerCase();
      if (ingredientTitleLowerCase.includes(searchValue.toLowerCase())) {
        doesIncludeIngredient = true;
      }
    });
    if (doesIncludeIngredient) {
      returnRecipes.push(recipe);
    }
  });
  return returnRecipes;
},
/**
 * Given a list of recipes, return a list of recipes that fall between a min and max price
 * @param minPrice - The minimum price you want to pay for your recipe.
 * @param maxPrice - The maximum price you want to pay for your recipe.
 * @param recipes - an array of recipes
 * @returns An array of recipes.
 */
 betweenPricesSearch(minPrice, maxPrice, recipes) {
  let returnRecipe = [];
  recipes.forEach((recipe) => {
    let price = 0;

    recipe.ingredients.forEach((ingredient) => {
      price += ingredient.price;
    });

    if (price >= minPrice && price <= maxPrice) {
      returnRecipe.push(recipe);
    }
  });
  return returnRecipe;
}
}
