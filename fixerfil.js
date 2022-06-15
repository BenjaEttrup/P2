function updateRecipePrices() {
    let totalRecipeSum = 0;

    this.state.shoppingListRecipeComponents.forEach((recipeComponent, rcIndex) => {
      let recipeSum = 0;

      if (recipeComponent.state.hide) {
        return;
      }

      recipeComponent.state.recipeIngredientComponent.forEach((recipeIngredientComponent, ricIndex) => {
        let tempIngredientPrice = recipeIngredientComponent.props.ingredient.price;

        if (recipeIngredientComponent.state.hide || recipeIngredientComponent.state.wasTrashed) {
          tempIngredientPrice = 0;
        }
        else {
          this.state.myStashComponents.forEach((stashComponent, scIndex) => {
            let similarity = compareTwoStrings(stashComponent.props.ingredient.title, recipeIngredientComponent.props.ingredient.title);
            if (similarity >= 0.5) {
              if (!stashComponent.state.hide && stashComponent.state.boxChecked) {
                tempIngredientPrice = 0;

                recipeIngredientComponent.setState({
                  hide: true,
                })
              }
            }
          })
        }

        recipeSum = Number(+recipeSum + +tempIngredientPrice).toFixed(2)
        recipeComponent.setState({
          price: recipeSum
        })
      })

      totalRecipeSum = Number(+totalRecipeSum + +recipeSum).toFixed(2);
    })
}
