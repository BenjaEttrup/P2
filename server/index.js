const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
// const token = '80ddad90-954d-4440-b54c-8f3a8a403cb2' //Benjamin
// const token = 'cbb2cbdb-9fd3-4e2a-9f97-ae6125a8ef43' //Ass
const token = '1b04ee97-264e-4f04-9dde-6a5e397c5a49' //Mads
const config = {
    headers: { 'Authorization': `Bearer ${token}` }
};

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/findProduct/:productName', async (req, res) => {
    try{
        let apiResponse = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + req.params.productName, config).then((res) => {
            return res.data;
        })
        res.send(apiResponse);
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
});

app.get('/findAllRecipes', async (req, res) => {
    const recipeData = require('../opskrifter/recipes.json');

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

            //console.log(tempIngredient);
            try{
                let apiResponse = await callApi(encodeCharacters(tempIngredient));
                apiResponse.suggestions.sort(comparePrice);
                recipeObject.ingredients.push(apiResponse.suggestions[0])
            } catch(e) {
                console.error(e);
                res.status(500).send();
            }
        }

        recipeObjects.recipes.push(recipeObject);
    }

    //Filters the recipes given some search params. This can be a string for 
    //title or two number for max and min price
    if(Object.keys(req.query).length !== 0) {
        if(req.query.search !== undefined){
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

        if(req.query.maxPrice !== undefined && req.query.minPrice !== undefined){
            let minPrice = req.query.minPrice;
            let maxPrice = req.query.maxPrice;

            let searchedRecipes = betweenPricesSearch(minPrice, maxPrice, recipeObjects.recipes)

            recipeObjects.recipes = searchedRecipes;
        }
    }

    //console.log(recipeObjects)

    res.json(recipeObjects);
});


// Retrieves a single recipe from an ID
app.get('/findRecipe/:ID', async (req, res) => {
    const recipeData = require('../opskrifter/recipes.json');

    let recipeObject = {
        recipe: {},
        ingredients: []
    };

    //console.log(`The ingredients in recipe ${req.params.ID} are: = ${recipeData.recipes[0].ingredients}`);

    recipeIndex = findIndex(req.params.ID, recipeData);
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
        recipeObject.recipe["price"] = totalPrice;
    }

    res.json(recipeObject);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

async function callApi(product) {
    let apiRes;
    try{
        sleep(200);
        apiRes = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + product, config).then((res) => {
            return res.data;
        });
    } catch(e) {
        console.error(e);
        return false;
    }
    return apiRes
}

// Encodes the ingredients and turns them lower case.
function encodeCharacters(ingredient){
    ingredient = ingredient.toLowerCase();

    // encodeURIComponent does not handle backslash and percentage sign. These are manually handled here
    ingredient = ingredient.replace(/%/g, "");
    ingredient = ingredient.replace(/\//g, "%2F");
    ingredient = encodeURIComponent(ingredient);
    return ingredient;
}

// Finds the index of a recipe
function findIndex(ID, recipeData) {
    let validated;

    for (element in recipeData.recipes) {
        // Accesses a single recipe, as element will be the index of a recipe
        let recipe = recipeData.recipes[element];
        validated = (ID == recipe.recipeID);

        if (validated) {
            return element;
        }
    }
    return false;
};

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
            return { "price": 0, "title": ingredient, "productID": "null"};
        }
        console.log(`Request for ${ingredient.name}, price is ${apiResponse.suggestions[0].price}`);

        return apiResponse.suggestions[0];
    } catch (e) {
        console.error(e);
        //res.status(500).send();
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
        if(recipeTitleLowerCase.includes(searchValue.toLowerCase())){
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
            if(ingredientTitleLowerCase.includes(searchValue.toLowerCase())){
                doesIncludeIngredient = true;
            }
        })
        if(doesIncludeIngredient) {
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

        if(price >= minPrice && price <= maxPrice){
            returnRecipe.push(recipe);
        }
    })
    return returnRecipe;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
