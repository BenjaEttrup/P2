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

})
