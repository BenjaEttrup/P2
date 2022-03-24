const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const fs = require('fs');
// const token = '80ddad90-954d-4440-b54c-8f3a8a403cb2' //Benjamin
// const token = 'cbb2cbdb-9fd3-4e2a-9f97-ae6125a8ef43' //Ass
const token = '1b04ee97-264e-4f04-9dde-6a5e397c5a49' //Mads
const config = {
    headers: { 'Authorization': `Bearer ${token}` }
};
const userPath = '../user/user.json';
const recipeDataPath = '../opskrifter/recipes.json';
const { stringify } = require('querystring');

app.use(express.urlencoded({ extended: false }));

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

// Allows the user to add a recipe to their shopping list.
app.post('/addRecipeToShoppingList', (req, res) => {
    fs.readFile(userPath, function readFileCallback(err, data) {
        if (err) {
            console.log("Could not read file");
        } else {
            // Lets us manipalute the json object in js
            let userData = JSON.parse(data);

            // In theory, only the recipeID should be stored in myStash to reduce the amount of storage needed
            // However, we're limited to only a single api call per second.
            userData.shoppingList.push(req.body);
            let json = JSON.stringify(userData, null, 4);
            fs.writeFile(userPath, json, function (err, result) {
                if (err) console.log("Error", err);
            });
        }
    });

    res.status(202).send(req.body);
});

app.get('/shoppingList', (req, res) => {


});

app.delete('/removeRecipeFromShoppingList/:ID', (req, res) => {
    try {
        fs.readFile(userPath, function readFileCallback(err, data) {
            let userData = JSON.parse(data);
            let recipeIndex = findRecipeIndex(req.params.ID, userPath, "shoppingList");

            if (recipeIndex) {
                userData.shoppingList.splice(recipeIndex, 1); // 2nd parameter means remove one item only
            }
            else {
                console.log("Failed to get recipe ID index");
                res.status(500).send();
            }

            let json = JSON.stringify(userData, null, 4);

            fs.writeFile(userPath, json, function readFileCallback(err, data){
                if (err){
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

app.get('/findAllRecipes', async (req, res) => {
    const recipeData = require();

    const config = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

    var recipeObjects = {
        recipes: []
    };

    //Builds recipeObjects object from a recipe file and then searches 
    //the salling API for the recipes ingredients.
    for (let index1 = 0; index1 < recipeData.recipes.length; index1++) {
        const tempRecipe = recipeData.recipes[index1];

        var recipeObject = {
            recipe: {},
            ingredients: []
        };

        recipeObject.recipe = tempRecipe;

        for (let index2 = 0; index2 < tempRecipe.ingredients.length; index2++) {
            const tempIngredient = recipeData.recipes[index1].ingredients[index2];

            try {
                let apiResponse = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + tempIngredient, config).then((res) => {
                    return res.data;
                });
                apiResponse.suggestions.sort(comparePrice);
                recipeObject.ingredients.push(apiResponse.suggestions[0])
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }
        }

        recipeObjects.recipes.push(recipeObject);
    }

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

    res.json(recipeObjects);
});


// Retrieves a single recipe from an ID
app.get('/findRecipe/:ID', async (req, res) => {
    const recipeData = require(recipeDataPath);

    let recipeObject = {
        recipe: {},
        ingredients: []
    };

    console.log(`The ingredients in recipe ${req.params.ID} are: = ${recipeData.recipes[0].ingredients}`);

    recipeIndex = findRecipeIndex(req.params.ID, recipeDataPath, "recipes");
    if (recipeIndex) {
        let details;
        let totalPrice = 0;

        // Finds the cheapest price for the ingredient and adds the details to the recipeObject
        for (let i = 0; i < recipeData.recipes[recipeIndex].ingredients.length; i++) {
            let ingredient = recipeData.recipes[recipeIndex].ingredients[i];
            details = await getCheapestIngredient(encodeCharacters(ingredient));

            recipeObject.ingredients[i] = details;
            recipeObject.recipe = recipeData.recipes[recipeIndex];
            totalPrice += details.price;
        }
        // Rounds the price of the recipe to two decimals and converts it to a number in this case float.
        recipeObject.recipe["price"] = Number(totalPrice.toFixed(2));
        console.log(recipeObject);
    }

    res.json(recipeObject);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

// Encodes the ingredients and turns them lower case.
function encodeCharacters(ingredient) {
    ingredient = ingredient.toLowerCase();

    // encodeURIComponent does not handle backslash and percentage sign. These are manually handled here
    ingredient = ingredient.replace(/%/g, "");
    ingredient = ingredient.replace(/\//g, "%2F");
    ingredient = encodeURIComponent(ingredient);

    return ingredient;
}

// Finds the index of a recipe
function findRecipeIndex(ID, filePath, option) {
    let validated;
    let file = require(filePath);

    for (element in file[option]) {
        // Accesses a single recipe, as element will be the index of a recipe
        console.log("id = " + ID);
        console.log("file[][] = " + file[option][element].recipeID);
        console.log("element = " + element);
        console.log("file.shoppingList[element].recipeID = " + file.shoppingList[element].recipeID);
        if (ID == file[option][element].recipeID) {
            console.log("exited findrecipe with index = " + element);
            return element;
        }
    }
    return false;
}


//     switch (filePath) {
//         case (userPath):

//             for (element in file.myStash) {
//                 // Accesses a single recipe, as element will be the index of a recipe
//                 // let recipe = file.mystash[element];
//                 console.log(file[option][element].recipeID);
//                 if (ID == file.myStash[element].recipeID) {
//                     return element;
//                 }
//             }
//             return false;

//         case (recipeDataPath):
//             for (element in file.recipes) {
//                 // Accesses a single recipe, as element will be the index of a recipe    
//                 console.log(file[option][element].recipeID)            
//                 if (ID == file.recipes[element].recipeID) {
//                     return element;
//                 }
//             }
//             return false;

//         default:
//             console.log("Default case");
//     }

// Retrieves the ingredient
async function getCheapestIngredient(ingredient) {

    try {
        let apiResponse = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + ingredient, config).then((res) => {
            return res.data;
        });
        // Sorts the the prise of the suggestions in terms of the price
        apiResponse.suggestions.sort(comparePrice);

        // Errorhandling for when 0 suggestions regarding the ingredient are found
        if (!apiResponse.suggestions.length) {
            return { "price": 0, "title": ingredient, "productID": "null" };
        }
        console.log(`Request for ${ingredient.name}, price is ${apiResponse.suggestions[0].price}`);

        return apiResponse.suggestions[0];
    } catch (e) {
        console.error(e);
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
