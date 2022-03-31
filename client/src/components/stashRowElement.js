import React from 'react';


//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class StashRowElement extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
    //Your code here

    this.state = {
      hide: false
    };
  }

  //Functions go here

  hideStashRowElement(stashRowElement, endPoint) {
    this.setState({
      hide: true
    })

    let params = {
      endPoint: endPoint
    };

    console.log(`this.props.hasOwnProperty = ${this.props.hasOwnProperty('recipeID')}`);
    if (this.props.hasOwnProperty('recipeID')){
      params['recipeID'] = this.props.recipeID;
      this.props.removeIngredient(stashRowElement, params);
      this.props.updateRecipePrice(stashRowElement);
    }
    else {
      params['recipeID'] = false;
      this.props.removeIngredient(stashRowElement, params);
      this.props.updateRecipePrice(stashRowElement);
    }
  }

  //This is the render function. This is where the
  //html is.
  render() {
    if (this.state.hide) return null;
    else {
      if (this.props.hasOwnProperty('myStash')) {
        return (
          <tr>
            {/* <td>{this.props.ingredient1 ? this.props.ingredient1.title + " ID: " + this.props.ingredient1.prod_ID : ""}</td> */}
            <td>{this.props.ingredient ? this.props.ingredient.title : ""}</td>
            {/* <td>{this.props.ingredient1 ? this.props.ingredient1.amount : ""} {this.props.ingredient1 ? this.props.ingredient1.unit : ""}</td> */}
            <td class="right-align">{this.props.ingredient ? this.props.ingredient.amount : ""} {this.props.ingredient ? this.props.ingredient.unit : ""}</td>
            <td class="right-align">
              <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, '/stash/remove/') }}>
                <i class="fa fa-trash"></i></button>
            </td>
          </tr>
        )
      }
      else if (this.props.hasOwnProperty('shoppingList')) {
        return (
          <tr>
            {/* <td>{this.props.ingredient1 ? this.props.ingredient1.title + " ID: " + this.props.ingredient1.prod_ID : ""}</td> */}
            <td>{this.props.ingredient ? this.props.ingredient.title : ""}</td>
            {/* <td>{this.props.ingredient1 ? this.props.ingredient1.amount : ""} {this.props.ingredient1 ? this.props.ingredient1.unit : ""}</td> */}
            <td class="right-align">{this.props.ingredient ? this.props.ingredient.price : ""} kr.</td>
            <td class="right-align">
              <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, '/removeIngredientFromShoppingList/') }}>
                <i class="fa fa-trash"></i></button>
            </td>
          </tr>
        );
      }
    }
  }
}

export default StashRowElement;
