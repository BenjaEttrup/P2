const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
// const token = 'cbb2cbdb-9fd3-4e2a-9f97-ae6125a8ef43' //Ass
const token = '1b04ee97-264e-4f04-9dde-6a5e397c5a49' //Mads
const config = {
    headers: { 'Authorization': `Bearer ${token}` }
};

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/findProduct/:productName', async (req, res) => {
    const config = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

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


// Retrieves a single recipe from an ID
app.get('/findRecipe/:ID', async (req, res) => {
    const recipeData = require('../opskrifter/recipes.json');

    let recipeObject = {
        recipe: {},
        ingredients: []
    };

    console.log(`The ingredients in recipe ${req.params.ID} are: = ${recipeData.recipes[0].ingredients}`);

    recipeIndex = findIndex(req.params.ID, recipeData);
    if (recipeIndex) {
        let details;
        let totalPrice = 0;

        // Finds the cheapest price for the ingredient and adds the details to the recipeObject
        for (let i = 0; i < recipeData.recipes[recipeIndex].ingredients.length; i++) {
            console.log(`Ingredient = ${recipeData.recipes[recipeIndex].ingredients[i]}`);
            details = await getCheapestIngredient(recipeData.recipes[recipeIndex].ingredients[i]);

            recipeObject.ingredients[i] = details;
            recipeObject.recipe = recipeData.recipes[recipeIndex];
            totalPrice += details.price;
        }
        recipeObject.recipe["price"] = totalPrice;
        console.log(recipeObject);
    }

    res.json(recipeObject);
});

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
async function getCheapestIngredient(name) {

    try {
        let apiResponse = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + name, config).then((res) => {
            return res.data;
        });
        // Sorts the the prise of the suggestions in terms of the price
        apiResponse.suggestions.sort(comparePrice);
        
        // Errorhandling for when 0 suggestions regarding the ingredient are found
        if (!apiResponse.suggestions.length){
            return { "price": 0, "name": name };
        }
        console.log(`Request for ${name}, price is ${apiResponse.suggestions[0].price}`);

        return { "price": apiResponse.suggestions[0].price, "name": apiResponse.suggestions[0].title };
    } catch (e) {
        console.error(e);
        //res.status(500).send();
    }
}

// Compares the price of "two" ingredient options
function comparePrice(a, b) {
    return a.price - b.price;
}


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})




