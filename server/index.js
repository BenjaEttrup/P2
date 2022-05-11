const express = require("express");
const app = express();
const port = 3001;
const axios = require("axios");
const { check, validationResult } = require("express-validator");
const utils = require('./utils');

const { token } = require("./config.json");

const fs = require("fs");
const { Console } = require("console");

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

const userPath = "../user/user.json";
const recipeDataPath = "../opskrifter/recipes.json";
const cachePath = "../cache/cache.json";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/findProduct/:productName", async (req, res) => {
  try {
    let apiResponse = await axios
      .get(
        "https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=" +
          req.params.productName,
        config
      )
      .then((res) => {
        return res.data;
      });
    res.send(apiResponse);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

// Recipes
// /findAllRecipes
app.get("/recipes/getAll", async (req, res) => {
  const recipeData = require("../opskrifter/recipes.json");

  let recipeObjects = {
    recipes: [],
  };

  fs.readFile(cachePath, async (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let parsedData;

    try {
      parsedData = JSON.parse(data);
    } catch (err) {
      parsedData = {
        date: 0,
      };
    }

    if (Date.now() - Date.parse(parsedData.date) > 24 * 60 * 60 * 1000) {
      console.log("Making new data");
      //Builds recipeObjects object from a recipe file and then searches
      //the salling API the recipes ingredients.
      for (let index1 = 0; index1 < recipeData.recipes.length; index1++) {
        const tempRecipe = recipeData.recipes[index1];
        let totalPrice = 0;

        var recipeObject = {
          recipe: {},
          ingredients: [],
        };

        recipeObject.recipe = tempRecipe;

        console.log(`Getting ingredients for ${tempRecipe.title}`);

        for (let index2 = 0; index2 < tempRecipe.ingredients.length; index2++) {
          const tempIngredient = Object.keys(
            recipeData.recipes[index1].ingredients[index2]
          )[0];

          try {
            let apiResponse = await utils.callApi(utils.encodeCharacters(tempIngredient));
            if (apiResponse === false) {
              console.log(`Something went wrong with ${tempIngredient}`);
              console.log(apiResponse);
            } else {
              if (apiResponse.suggestions[0] === undefined) {
                console.log(`Failed to get ${tempIngredient}`);
              } else {
                apiResponse.suggestions.sort(utils.comparePrice);
                recipeObject.ingredients.push(apiResponse.suggestions[0]);
                totalPrice += apiResponse.suggestions[0].price;
              }
            }
          } catch (e) {
            console.error(e);

            //Dis breka da thing
            //res.status(500).send();
          }
        }

        recipeObject.recipe["price"] = Number(totalPrice.toFixed(2));

        recipeObjects.recipes.push(recipeObject);
      }
      console.log("Done getting recipes");

      //Filters the recipes given some search params. This can be a string for
      //title or two number for max and min price
      if (Object.keys(req.query).length !== 0) {
        if (req.query.search !== undefined) {
          let searchedRecipes = [];

          utils.stringRecipeSearch(req.query.search, recipeObjects.recipes).forEach(
            (recipe) => {
              searchedRecipes.push(recipe);
            }
          );

          let notAlreadyChosen = recipeObjects.recipes.filter((recipe) => {
            return !searchedRecipes.includes(recipe);
          });
          console.log(!searchedRecipes.includes(recipe))

          utils.stringIngredientSearch(req.query.search, notAlreadyChosen).forEach(
            (recipe) => {
              searchedRecipes.push(recipe);
            }
          );

          recipeObjects.recipes = searchedRecipes;
        }

        if (
          req.query.maxPrice !== undefined &&
          req.query.minPrice !== undefined
        ) {
          let minPrice = req.query.minPrice;
          let maxPrice = req.query.maxPrice;

          let searchedRecipes = utils.betweenPricesSearch(
            minPrice,
            maxPrice,
            recipeObjects.recipes
          );

          recipeObjects.recipes = searchedRecipes;
        }
      }

      let cacheData = {
        date: new Date(),
        data: recipeObjects,
      };

      fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2), (err) => {
        if (err) console.log(err);
      });
    } else {
      console.log("Using old data");
      recipeObjects = parsedData.data;
    }
    res.json(recipeObjects);
  });
});

// Retrieves a single recipe from an ID
// /findRecipe/:ID
app.get("/recipes/get/:ID", async (req, res) => {
  const recipeData = require(recipeDataPath);

  let recipeObject = {
    recipe: {},
    ingredients: [],
  };
  let recipeIndex = utils.findRecipeIndex(req.params.ID, recipeData, "recipes");
  if (recipeIndex) {
    let totalPrice = 0;

    // Finds the cheapest price for the ingredient and adds the details to the recipeObject
    // let ingredient = recipeData.recipes[recipeIndex].ingredients[i];
    for (let i = 0; i < recipeData.recipes[recipeIndex].ingredients.length; i++) {
      let ingredient = Object.keys(
        recipeData.recipes[recipeIndex].ingredients[i]
      )[0]; //keys from JSON recipe file, inserted in ingredient.
      //console.log(ingredient)//
      let details = await utils.callApi(utils.encodeCharacters(ingredient)); //API call
      //recipeObject.ingredients[i] = recipeData.recipes[recipeIndex][i];
      details.suggestions.sort(utils.comparePrice); //ingredients from API call is sorted and stored in details.
      recipeObject.ingredients[i] = details.suggestions[0]; //Store cheapest ingredient in recipeObject
      recipeObject.ingredients[i].title = ingredient;
      totalPrice += details.suggestions[0].price; //sum of recipe.
      recipeObject.ingredients[i]["amount"] =
        recipeData.recipes[recipeIndex].ingredients[i][ingredient].amount;
      recipeObject.ingredients[i]["unit"] =
        recipeData.recipes[recipeIndex].ingredients[i][ingredient].unit;
    }
    // Rounds the price of the recipe to two decimals and converts it to a number in this case float.
    recipeObject.recipe["title"] = recipeData.recipes[recipeIndex].title;
    recipeObject.recipe["method"] = recipeData.recipes[recipeIndex].method;
    recipeObject.recipe["url"] = recipeData.recipes[recipeIndex].url;
    recipeObject.recipe["image"] = recipeData.recipes[recipeIndex].image;
    recipeObject.recipe["size"] = recipeData.recipes[recipeIndex].size;
    recipeObject.recipe["time"] = recipeData.recipes[recipeIndex].time;
    recipeObject.recipe["rating"] = recipeData.recipes[recipeIndex].rating;
    recipeObject.recipe["description"] =
      recipeData.recipes[recipeIndex].description;
    recipeObject.recipe["recipeID"] = recipeData.recipes[recipeIndex].recipeID;
    recipeObject.recipe["price"] = Number(totalPrice.toFixed(2));
    recipeObject.recipe["recipeIndex"] = recipeIndex;

    res.json(recipeObject);
  } else {
    res.status(204).json(recipeObject);
  }
});

// Stash
// Returns json containing stash info
app.get("/stash/get", (req, res) => {
  fs.readFile(userPath, (err, fileData) => {
    if (err) {
      console.log("Can't, read file");
    } else {
      user = JSON.parse(fileData);
      res.json(user.myStash);
    }
  });
});

// Add given product to stash json file.
app.post(
  "/stash/add",
  [
    check("prod_id").isNumeric().withMessage("Not a number"),
    check("title").isString().withMessage("Not a string"),
    check(["unit", "amount"]).exists().withMessage("Does not exist"),
  ],
  (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Product json given via body
    let newProductJson = req.body;
    // If file can't be read, create new one with {myStash:[]} structure
    fs.access(userPath, fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        console.log("File doesn't exist. Trying to create empty file");
        fs.writeFile(userPath, JSON.stringify({ myStash: [] }), (err) => {
          if (err) console.log("Error writing file:", err);
          return;
        });
      }

      // When file exists, take file data and add newly added product to the data. Write all data in new file after
      fs.readFile(userPath, (err, fileData) => {
        if (err) {
          console.log("Can't read file");
        } else {
          // Gets already stored data and adds new product to it
          let parsedJson = JSON.parse(fileData);
          let duplicatedProduct = true;
          for (element in parsedJson.myStash) {
            if (
              parsedJson.myStash[element].prod_id === newProductJson.prod_id
            ) {
              parsedJson.myStash[element].amount += 1;
              duplicatedProduct = false;
            }
          }
          if (duplicatedProduct) {
            parsedJson.myStash.push(newProductJson);
          }

          fs.writeFile(userPath, JSON.stringify(parsedJson, null, 4), (err) => {
            if (err) console.log("Error writing file:", err);
          });
        }
      });
    });
    res.status(200).send(newProductJson);
  }
);

// Remove product by id in stash json file
app.delete(
  "/stash/remove/:prod_id",
  [check("prod_id").isNumeric().withMessage("Not a number")],
  (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // When file exists, take file data and remove product from the data. opdate data in new file after
    fs.readFile(userPath, (err, data) => {
      if (err) {
        console.log("Can't read file");
        return res.status(404).send("File couldn't be read");
      }
      // Gets already stored ingredients and removes ingredient by id.
      let userData = JSON.parse(data);
      for (element in userData.myStash) {
        if (userData.myStash[element].prod_id == req.params.prod_id) {
          userData.myStash[element].amount > 1
            ? userData.myStash[element].amount--
            : userData.myStash.splice(element, 1);
          break;
        }
      }
      res.status(200).send(userData);

      fs.writeFile(userPath, JSON.stringify(userData, null, 4), (err) => {
        if (err) console.log("Error writing file:", err);
      });
    });
  }
);

//Search after a specific product in Salling group API and returns json with data on products.
app.get("/stash/search/:productName", async (req, res) => {
  try {
    let apiResponse = await utils.callApi(utils.encodeCharacters(req.params.productName));
    //console.log(apiResponse)
    res.json(apiResponse);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

// Allows the user to add a recipe to their shopping list.
app.post(
  "/shoppingList/add",
  [
    check([
      "recipe.recipeID",
      "recipe.size",
      "recipe.time",
      "recipe.rating",
      "recipe.price",
      "ingredients.*.price",
    ])
      .isNumeric()
      .withMessage("Not a number"),
    check(["ingredients.*.id", "ingredients.*.prod_id"])
      .toInt()
      .isNumeric()
      .withMessage("Not a number (converted)"),
    check([
      "recipe.title",
      "recipe.description",
      "ingredients.*.title",
      "ingredients.*.description",
    ])
      .isString()
      .withMessage("Not a string"),
    check([
      "recipe.url",
      "recipe.image",
      "ingredients.*.img",
      "ingredients.*.link",
    ])
      .isURL()
      .withMessage("Not a URL"),
    check([
      "recipe.method",
      "recipe.method.*",
      "recipe.ingredients.*",
      "recipe.ingredients.*.*.unit",
      "recipe.ingredients.*.*.amount",
    ])
      .exists()
      .withMessage("Does not exists"),
    check(["recipe.method", "recipe.ingredients.*"])
      .notEmpty()
      .withMessage("Is empty"),
  ],
  (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    fs.readFile(userPath, function readFileCallback(err, data) {
      if (err) {
        console.log("Could not read file");
      } else {
        // Lets us manipalute the json object in js
        let userData = JSON.parse(data);

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
  }
);

// Retrieves the data from the user's shoppinglist
// /shoppingList
app.get("/shoppingList/get", (req, res) => {
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
      });
      //console.log(userData.shoppingList);
      res.json(userData.shoppingList);
    } catch (err) {
      console.log(err);
    }
  });
});

app.delete(
  "/shoppinglist/remove/ingredient/:ID&:prod_id",
  [check(["ID", "prod_id"]).isNumeric().withMessage("Not a number")],
  (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), params: req.params });
    }
    try {
      fs.readFile(userPath, function readFileCallback(err, data) {
        let userData = JSON.parse(data);
        let recipeIndex = utils.findRecipeIndex(
          req.params.ID,
          userData,
          "shoppingList"
        );
        let ingredientIndex = utils.findIngredientIndex(
          recipeIndex,
          req.params.prod_id,
          userPath,
          "shoppingList"
        );

        if (ingredientIndex) {
          userData.shoppingList[recipeIndex].ingredients.splice(
            ingredientIndex,
            1
          ); // 2nd parameter means remove one item only
        } else {
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
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
);

/** Removes a recipe from the shoppinglist* */
// /removeRecipeFromShoppingList/:ID
app.delete(
  "/shoppingList/remove/recipe/:ID",
  [check("ID").isNumeric().withMessage("Not a number")],
  (req, res) => {
    try {
      fs.readFile(userPath, function readFileCallback(err, data) {
        let userData = JSON.parse(data);
        let recipeIndex = utils.findRecipeIndex(
          req.params.ID,
          userData,
          "shoppingList"
        );
        if (recipeIndex !== false) {
          userData.shoppingList.splice(recipeIndex, 1); // 2nd parameter means remove one item only
        } else {
          console.log("Failed to get recipe ID index");
          res.status(500).send();
        }

        let json = JSON.stringify(userData, null, 4);

        fs.writeFile(userPath, json, function readFileCallback(err, data) {
          if (err) {
            console.error(err);
            res.status(500).send();
          }
          res.status(202).send();
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

