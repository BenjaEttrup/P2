const utils = require('./utils');

test('Testing encodeCharacters', () => {
    expect(utils.encodeCharacters('Ørred')).toBe('%C3%B8rred');
    expect(utils.encodeCharacters('Æske')).toBe('%C3%A6ske');
    expect(utils.encodeCharacters('Ål')).toBe('%C3%A5l');
})

test('Testing if callApi always gives an answer', () => {
    var apiResponse = utils.callApi('testwadawdaw');
    expect(apiResponse).toBeDefined()
    expect(apiResponse).not.toBeNull();
})

test('Testing findRecipeIndex', () => {
    let recipeObject = require("./recipe.test.json")
    let userObject = require("./user.test.json")
    expect(utils.findRecipeIndex('1', recipeObject, "recipes")).toBe("1");
    expect(utils.findRecipeIndex('ø', recipeObject, "recipes")).toBe(false);
    expect(utils.findRecipeIndex('i', userObject, "recipes")).toBe(false);
    expect(utils.findRecipeIndex('1', userObject, "shoppingList")).toBe(1);
    expect(utils.findRecipeIndex('a', userObject, "shoppingList")).toBe(false);
    expect(utils.findRecipeIndex('1', recipeObject, "list")).toBe(false);
})

test('Testing findIngredientIndex', ()=>{
    let userObject = "./user.test.json"
    expect(utils.findIngredientIndex("1", "63861", userObject, "shoppingList")).toBe("1")
    expect(utils.findIngredientIndex("2", "63861", userObject, "shoppingList")).toBe(undefined)
    expect(utils.findIngredientIndex("3", "51061", userObject, "shoppingList")).toBe("11")
    expect(utils.findIngredientIndex("3", "63861", userObject, "shoppingList")).toBe(undefined)
    expect(utils.findIngredientIndex("0", "20555", userObject, "shoppingList")).toBe("0")
})

test('Testing comparePrice', () => {
    let suggestionsObject = require("./suggestions.test.json")
    expect(utils.comparePrice(suggestionsObject.suggestions[1],suggestionsObject.suggestions[2])).toBe(0.25)
    expect(utils.comparePrice(suggestionsObject.suggestions[1],suggestionsObject.suggestions[1])).toBe(0)
})

test ('Testing stringRecipeSearch', () => {
    let recipeObject = require("./recipeObject.test.json")
    expect(utils.stringRecipeSearch("Svampe risotto", recipeObject)).toStrictEqual([])
    expect(utils.stringRecipeSearch("Simpel wokret", recipeObject)).toStrictEqual(
        [{"recipe": {
          "title": "Simpel wokret"},
          "ingredients" : [
                            {"kyllingebryst": 
                                            {
                                              "amount" : 1,
                                              "unit": "stk"
                                              },
                              "title" :"Kyllingebryst",
                              "price" : 10.00
                                            },
                           {"wokblanding": {"amount": 0.5,"unit": "stk"}, "title" :"Wokblanding", "price" : 10.00}]}])
    expect(utils.stringRecipeSearch("1", recipeObject)).toStrictEqual([])
})

test ('Testing stringIngredientSearch', () => {
    let recipeObject = require("./recipeObject.test.json")
    expect(utils.stringIngredientSearch("wokblanding",recipeObject)).toStrictEqual(
        [{"recipe": {
          "title": "Simpel wokret"},
          "ingredients" : [
                            {"kyllingebryst": 
                                            {
                                              "amount" : 1,
                                              "unit": "stk"
                                              },
                              "title" :"Kyllingebryst",
                              "price" : 10.00
                                            },
                           {"wokblanding": {"amount": 0.5,"unit": "stk"}, "title" :"Wokblanding", "price" : 10.00}]}])
    expect(utils.stringIngredientSearch("pasta",recipeObject)).toStrictEqual([])
    expect(utils.stringIngredientSearch("8",recipeObject)).toStrictEqual([])
    
})

test ('Testing betweenPricesSearch', () => {
    let recipeObject = require("./recipeObject.test.json")
    expect(utils.betweenPricesSearch(39,41,recipeObject)).toStrictEqual([])
    expect(utils.betweenPricesSearch(19,21,recipeObject)).toStrictEqual(
    [{"recipe": {
    "title": "Simpel wokret"},
    "ingredients" : [
                      {"kyllingebryst": 
                                      {
                                        "amount" : 1,
                                        "unit": "stk"
                                        },
                        "title" :"Kyllingebryst",
                        "price" : 10.00
                                      },
                     {"wokblanding": {"amount": 0.5,"unit": "stk"}, "title" :"Wokblanding", "price" : 10.00}]}])
})
