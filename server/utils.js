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
   * This function finds the index of a recipe in the file.
   * @param ID - The ID of the recipe you're looking for.
   * @param filePath - The path to the file you want to search.
   * @param option - member we want to acess in the file.
   * @returns The index of the recipe.
   */
  findRecipeIndex(ID, data, option) {
    let numberID = Number.parseInt(ID);
    let returnValue = false;
    if (option === "shoppingList") {
      let index = 0;
      data[option].forEach((recipe) => {
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
  }
}
