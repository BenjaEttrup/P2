const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');

const { token } = require('./config.json');

const fs = require('fs');

const config = {
  headers: { 'Authorization': `Bearer ${token}` }
};

const userPath = '../user/user.json';
const recipeDataPath = '../opskrifter/recipes.json';
const cachePath = '../cache/cache.json';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/findProduct/:productName', async (req, res) => {
  try {
    let apiResponse = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + req.params.productName, config).then((res) => {
      return res.data;
    })
    res.send(apiResponse);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

// Recipes
// /findAllRecipes
app.get('/recipes/getAll', async (req, res) => {
  const recipeData = require('../opskrifter/recipes.json');

  let recipeObjects = {
    recipes: []
  };

  fs.readFile(cachePath, async (err, data) => {
    if (err) {
      console.log(err);
      return
    }

    let parsedData;

    try {
      parsedData = JSON.parse(data);
    } catch (err) {
      parsedData = {
        date: 0
      }
    }

    if (Date.now() - Date.parse(parsedData.date) > 24 * 60 * 60 * 1000) {
      console.log("Making new data");
      //Builds recipeObjects object from a recipe file and then searches 
      //the salling API for the recipes ingredients.
      for (let index1 = 0; index1 < recipeData.recipes.length; index1++) {
        const tempRecipe = recipeData.recipes[index1];
        let totalPrice = 0;

        var recipeObject = {
          recipe: {},
          ingredients: []
        };

        recipeObject.recipe = tempRecipe;

        console.log(`Getting ingredients for ${tempRecipe.title}`);
        startTimer();

        for (let index2 = 0; index2 < tempRecipe.ingredients.length; index2++) {
          const tempIngredient = Object.keys(recipeData.recipes[index1].ingredients[index2])[0];

          try {
            let apiResponse = await callApi(encodeCharacters(tempIngredient));
            if (apiResponse === false) {
              console.log(`Something went wrong with ${tempIngredient}`);
              console.log(apiResponse);
            } else {
              if (apiResponse.suggestions[0] === undefined) {
                console.log(`Failed to get ${tempIngredient}`);
              } else {
                apiResponse.suggestions.sort(comparePrice);
                recipeObject.ingredients.push(apiResponse.suggestions[0])
                totalPrice += apiResponse.suggestions[0].price;
              }
            }
          } catch (e) {
            console.error(e);

            //Dis breka da thing 
            //res.status(500).send();
          }
        }

        recipeObject.recipe['price'] = Number(totalPrice.toFixed(2));

        logTime()

        recipeObjects.recipes.push(recipeObject);
      }
      console.log('Done getting recipes');

      //Filters the recipes given some search params. This can be a string for 
      //title or two number for max and min price
      if (Object.keys(req.query).length !== 0) {
        if (req.query.search !== undefined) {
          let searchedRecipes = [];

          stringRecipeSearch(req.query.search, recipeObjects.recipes).forEach((recipe) => {
            searchedRecipes.push(recipe);
          })

          let notAlreadyChosen = recipeObjects.recipes.filter((recipe) => {
            return !searchedRecipes.includes(recipe);
          })

          stringIngredientSearch(req.query.search, notAlreadyChosen).forEach((recipe) => {
            searchedRecipes.push(recipe)
          })

          recipeObjects.recipes = searchedRecipes;
        }

        if (req.query.maxPrice !== undefined && req.query.minPrice !== undefined) {
          let minPrice = req.query.minPrice;
          let maxPrice = req.query.maxPrice;

          let searchedRecipes = betweenPricesSearch(minPrice, maxPrice, recipeObjects.recipes)

          recipeObjects.recipes = searchedRecipes;
        }
      }

      let cacheData = {
        date: new Date(),
        data: recipeObjects
      }

      fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2), (err) => { if (err) console.log(err) })
    } else {
      console.log("Using old data");
      recipeObjects = parsedData.data;
    }
    res.json(recipeObjects);
  })
});

// Retrieves a single recipe from an ID
// /findRecipe/:ID
app.get('/recipes/get/:ID', async (req, res) => {
  const recipeData = require(recipeDataPath);

  let recipeObject = {
    recipe: {

    },
    ingredients: []
  };
  let recipeIndex = findRecipeIndex(req.params.ID, recipeData, "recipes");
  if (recipeIndex) {
    let totalPrice = 0;

    // Finds the cheapest price for the ingredient and adds the details to the recipeObject
    // let ingredient = recipeData.recipes[recipeIndex].ingredients[i];
    for (let i = 0; i < recipeData.recipes[recipeIndex].ingredients.length; i++) {
      let ingredient = Object.keys(recipeData.recipes[recipeIndex].ingredients[i])[0] //keys from JSON recipe file, inserted in ingredient.
      //console.log(ingredient)//
      let details = await callApi(encodeCharacters(ingredient)); //API call
      //recipeObject.ingredients[i] = recipeData.recipes[recipeIndex][i];
      details.suggestions.sort(comparePrice); //ingredients from API call is sorted and stored in details.
      recipeObject.ingredients[i] = details.suggestions[0] //Store cheapest ingredient in recipeObject
      recipeObject.ingredients[i].title = ingredient
      totalPrice += details.suggestions[0].price; //sum of recipe.
      recipeObject.ingredients[i]["amount"] = recipeData.recipes[recipeIndex].ingredients[i][ingredient].amount;
      recipeObject.ingredients[i]["unit"] = recipeData.recipes[recipeIndex].ingredients[i][ingredient].unit;
    }
    // Rounds the price of the recipe to two decimals and converts it to a number in this case float. 
    recipeObject.recipe["title"] = recipeData.recipes[recipeIndex].title
    recipeObject.recipe["method"] = recipeData.recipes[recipeIndex].method
    recipeObject.recipe["url"] = recipeData.recipes[recipeIndex].url
    recipeObject.recipe["image"] = recipeData.recipes[recipeIndex].image
    recipeObject.recipe["size"] = recipeData.recipes[recipeIndex].size
    recipeObject.recipe["time"] = recipeData.recipes[recipeIndex].time
    recipeObject.recipe["rating"] = recipeData.recipes[recipeIndex].rating
    recipeObject.recipe["description"] = recipeData.recipes[recipeIndex].description
    recipeObject.recipe["recipeID"] = recipeData.recipes[recipeIndex].recipeID
    recipeObject.recipe["price"] = Number(totalPrice.toFixed(2));
    recipeObject.recipe["recipeIndex"] = recipeIndex;
  }

  res.json(recipeObject);
});

// Stash
// Returns json containing stash info
app.get("/stash/get", (req, res) => {
  fs.readFile(userPath, (err, fileData) => {
    if (err) {
      console.log("Can't, read file")
    }
    else {
      user = JSON.parse(fileData);
      res.json(user.myStash);
    }
  });
});

// Add given product to stash json file. 
app.post("/stash/add", (req, res) => {
  // Product json given via body
  let newProductJson = req.body
  // If file can't be read, create new one with {myStash:[]} structure
  fs.access(userPath, fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      console.log("File doesn't exist. Trying to create empty file")
      fs.writeFile(userPath, JSON.stringify({ myStash: [] }), err => {
        if (err)
          console.log("Error writing file:", err);
        return
      });
    }

    // When file exists, take file data and add newly added product to the data. Write all data in new file after
    fs.readFile(userPath, (err, fileData) => {
      if (err) {
        console.log("Can't read file")
      }
      else {
        // Gets already stored data and adds new product to it
        let parsedJson = JSON.parse(fileData);
        let duplicatedProduct = true;
        for (element in parsedJson.myStash) {
          if (parsedJson.myStash[element].prod_id === newProductJson.prod_id) {
            parsedJson.myStash[element].amount += 1;
            duplicatedProduct = false;
          }
        }
        if (duplicatedProduct) {
          parsedJson.myStash.push(newProductJson);
        }

        fs.writeFile(userPath, JSON.stringify(parsedJson, null, 4), err => {
          if (err) console.log("Error writing file:", err);
        })
      }
    })
  })
  res.status(200).send(newProductJson)
})

// Remove product by id in stash json file
app.delete("/stash/remove/:prod_id", (req, res) => {
  // When file exists, take file data and remove product from the data. opdate data in new file after
  fs.readFile(userPath, (err, fileData) => {
    if (err) {
      console.log("Can't read file")
      res.status(404).send("File couldn't be read")
    }
    else {
      // Gets already stored ingredients and removes ingredient by id.
      let parsedJson = JSON.parse(fileData)
      jsonArray = parsedJson.myStash
      //Loops through file, and remove all products with the given id. 
      for (let i = 0; i < jsonArray.length; i++) {
        // console.log("Kører for-loop")
        // console.log(`Index: ${i}  |  jsonArray[i].prod_id == req.body.prod_id:  ${jsonArray[i].prod_id == req.params.prod_id}`)
        // console.log("Req.body.prod_id i if: " + req.params.prod_id)
        // console.log("jsonArray prod_id i if: " + jsonArray[i].prod_id)
        if (jsonArray[i].prod_id == req.params.prod_id) {
          if (jsonArray[i].amount > 1) {
            jsonArray[i].amount--;
          }
          else {
            jsonArray.splice(i, 1)
          }
          break;
        }
      }
      res.status(200).send(parsedJson)

      fs.writeFile(userPath, JSON.stringify(parsedJson, null, 4), err => {
        if (err) console.log("Error writing file:", err);
      })
    }
  })
})

//Search after a specific product in Salling group API and returns json with data on products.
app.get("/stash/search/:productName", async (req, res) => {
  try {
    let apiResponse = await callApi(encodeCharacters(req.params.productName))
    //console.log(apiResponse)
    res.json(apiResponse);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
})

// Allows the user to add a recipe to their shopping list.
// /addRecipeToShoppingList
app.post('/shoppingList/add', (req, res) => {
  fs.readFile(userPath, function readFileCallback(err, data) {
    if (err) {
      console.log("Could not read file");
    } else {
      // Lets us manipalute the json object in js
      let userData = JSON.parse(data);

      // TODO: needs to validate the req.body object.

      // In theory, only the recipeID should be stored in myStash to reduce the amount of storage needed
      // However, we're limited to only a single api call per second.
      userData.shoppingList.push(req.body);
      let json = JSON.stringify(userData, null, 2);
      fs.writeFile(userPath, json, function (err, result) {
        if (err) console.log("Error", err);
      });
    }
  });

  res.status(202).send(req.body);
});

// Retrieves the data from the user's shoppinglist
// /shoppingList
app.get('/shoppingList/get', (req, res) => {
  fs.readFile(userPath, "utf-8", (err, userDataString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }

    try {
      userData = JSON.parse(userDataString);
      //let userData = require(userPath);
      userData.shoppingList.forEach((recipe) => {
        console.log(recipe.recipe.title);
      })
      //console.log(userData.shoppingList);
      res.json(userData.shoppingList);
    } catch (err) {
      console.log(err);
    }
  })
});

// /removeIngredientFromShoppingList/:ID&:prod_id
app.delete('/shoppinglist/remove/ingredient/:ID&:prod_id', (req, res) => {
  // TODO: needs validation! if req.params.prod_id is %19965, this will mess up
  try {
    fs.readFile(userPath, function readFileCallback(err, data) {
      let userData = JSON.parse(data);
      let recipeIndex = findRecipeIndex(req.params.ID, userPath, "shoppingList");
      let ingredientIndex = findIngredientIndex(recipeIndex, req.params.prod_id, userPath, "shoppingList");

      if (ingredientIndex) {
        userData.shoppingList[recipeIndex].ingredients.splice(ingredientIndex, 1); // 2nd parameter means remove one item only
      }
      else {
        console.log("Failed to get product ID index");
        res.status(500).send();
      }

      let json = JSON.stringify(userData, null, 4);

      fs.writeFile(userPath, json, function readFileCallback(err, data) {
        if (err) {
          res.status(500).send();
        }
        res.status(202).send();
      });
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

/** Removes a recipe from the shoppinglist* */
// /removeRecipeFromShoppingList/:ID
app.delete('/shoppingList/remove/recipe/:ID', (req, res) => {
  try {
    fs.readFile(userPath, function readFileCallback(err, data) {
      let userData = JSON.parse(data);
      let recipeIndex = findRecipeIndex(req.params.ID, userData, "shoppingList");
      if (recipeIndex !== false) {
        userData.shoppingList.splice(recipeIndex, 1); // 2nd parameter means remove one item only
      }
      else {
        console.log("Failed to get recipe ID index");
        res.status(500).send();
      }

      let json = JSON.stringify(userData, null, 4);

      fs.writeFile(userPath, json, function readFileCallback(err, data) {
        if (err) {
          console.error(err)
          res.status(500).send();
        }
        res.status(202).send();
      });
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})

/**
 * This function calls the Salling Group API and returns the product ID and price of the first product
 * in the list of relevant products
 * @param product - The product name to search for.
 * @returns The API returns a JSON object with the following keys:
 */
async function callApi(product) {
  let apiRes;
  try {
    sleep(200);
    apiRes = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + product, config).then((res) => {
      return res.data;
    });
    if (!apiRes.suggestions.length) {
      return { suggestions: [{ "price": 0, "title": product, "productID": "null" }] };
    }
  } catch (e) {
    console.error(e);
    return { suggestions: [{ "price": 0, "title": product, "productID": "null" }] };
  }
  return apiRes
}

/**
 * Replace all the special characters in the ingredient with their encoded values
 * @param ingredient - the ingredient to be encoded
 * @returns The ingredient name is being encoded to be used in the URL.
 */
function encodeCharacters(ingredient) {
  ingredient = ingredient.toLowerCase();

  // encodeURIComponent does not handle backslash and percentage sign. These are manually handled here
  ingredient = ingredient.replace(/%/g, "");
  ingredient = ingredient.replace(/\//g, "%2F");
  ingredient = encodeURIComponent(ingredient);

  return ingredient;
}

/**
 * This function finds the index of a recipe in the file.
 * @param ID - The ID of the recipe you're looking for.
 * @param filePath - The path to the file you want to search.
 * @param option - member we want to acess in the file.
 * @returns The index of the recipe.
 */
function findRecipeIndex(ID, data, option) {
  let numberID = Number.parseInt(ID)
  let returnValue = false;
  if (option === "shoppingList") {
    let index = 0;
    data[option].forEach((recipe) => {
      if (recipe.recipe.recipeID === numberID) {
        returnValue = index;
      }
      index++
    })
  }
  else if (option === "recipes") {
    for (object in data[option]) {
      if (data[option][object].recipeID == ID) {
        return object;
      }
    }
  }

  return returnValue;
  // TODO reevaluate this function design
}

/**
 * Find the index of an ingredient in a recipe
 * @param recipeIndex - The index of the recipe in the user's recipe list.
 * @param productID - The ID of the product you want to find.
 * @param filePath - the path to the user data file
 * @param option - the member we want to access in the user.json file
 * @returns The index of the ingredient in the recipe.
 */
function findIngredientIndex(recipeIndex, productID, filePath, option) {
  let userData = require(userPath);
  productID = Number(productID);

  // Loops through the ingredients found in userData.shoppinglist[recipeIndex].ingredients and compares prod ID.
  for (ingredient in userData[option][recipeIndex].ingredients) {
    if (userData[option][recipeIndex].ingredients[ingredient].prod_id === productID) {
      return ingredient;
    }
  }
}

/**
 * Compare the price of two items and return the difference
 * @param a - The first item to compare.
 * @param b - The second value to compare.
 * @returns The function is being called with the arguments of a and b. The function is then returning
 * the result of a.price - b.price.
 */
function comparePrice(a, b) {
  return a.price - b.price;
}

/**
 * Given a search value and a list of recipes, return a list of recipes that contain the search value
 * in the title
 * @param searchValue - The string that you want to search for.
 * @param recipes - an array of recipes
 * @returns An array of recipes that match the search value.
 */
function stringRecipeSearch(searchValue, recipes) {
  let returnRecipes = [];
  recipes.forEach((recipe) => {
    let recipeTitleLowerCase = recipe.recipe.title.toLowerCase();
    if (recipeTitleLowerCase.includes(searchValue.toLowerCase())) {
      returnRecipes.push(recipe);
    }
  })
  return returnRecipes;
}

/**
 * Given a search value and a list of recipes, return a list of recipes that include the search value
 * in their ingredients
 * @param searchValue - The string that you want to search for in the recipe ingredients.
 * @param recipes - an array of recipes
 * @returns An array of recipes that contain the search value in their ingredients.
 */
function stringIngredientSearch(searchValue, recipes) {
  let returnRecipes = [];
  recipes.forEach((recipe) => {
    let doesIncludeIngredient = false;
    recipe.ingredients.forEach((ingredient) => {
      let ingredientTitleLowerCase = ingredient.title.toLowerCase();
      if (ingredientTitleLowerCase.includes(searchValue.toLowerCase())) {
        doesIncludeIngredient = true;
      }
    })
    if (doesIncludeIngredient) {
      returnRecipes.push(recipe);
    }
  })
  return returnRecipes;
}

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

    if (price >= minPrice && price <= maxPrice) {
      returnRecipe.push(recipe);
    }
  })
  return returnRecipe;
}

/**
 * Sleep for a given number of milliseconds
 * @param milliseconds - The number of milliseconds to wait.
 */
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var startTime, endTime;

/**
 * It starts the timer.
 */
function startTimer() {
  startTime = new Date();
};

/**
 * It calculates the time difference between the start time and the end time, 
 * and logs the time difference in seconds to the console
 */
function logTime() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}
