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
      hide: false,
      boxChecked: true,
      passedToShoppingList: false
    };
  }

  //Functions go here
  initStashRowElement(hide) {
      if(hide){
        console.log(`Setting state hide = ${hide}`)
        this.setState({
          passedToShoppingList: true,
          hide: hide
        });
        console.log(`isHidden = ${this.props.isHidden} hide = ${this.state.hide}`)

        this.props.passStashRowElement(this)
      }
    }



  hideStashRowElement(stashRowElement, endPoint) {
    this.setState({
      hide: true
    })

    let params = {
      endPoint: endPoint
    };

    if (this.props.hasOwnProperty('recipeID')) {
      params['recipeID'] = this.props.recipeID;
      this.props.updateRecipePrice(stashRowElement, true);
    }
    else {
      params['recipeID'] = false;
      this.props.removeIngredient(stashRowElement, params);
    }
  }

  checkCheckBox(evt) {
    this.setState((prevState) => ({
      boxChecked: !prevState.boxChecked
    }), () => {
      if (this.state.boxChecked) {
        console.log("Checked")
        this.props.matchIngredient(this.props.ingredient, false);
      }
      else {
        // TODO HANDLE the scenario where the price was originally subtracted due to the recipeIngredient isHidden
        console.log("Unchecked")
        this.props.matchIngredient(this.props.ingredient, true);
      }
    });

  }

  //This is the render function. This is where the
  //html is.
  render() {
    if (this.props.hasOwnProperty('passToShoppingList') && !this.state.passedToShoppingList){
      this.initStashRowElement(this.props.isHidden);
    } 
    if (this.state.hide) return null;
    // if (this.props.isHidden) return null;

    if (this.props.hasOwnProperty('shoppingList')) {
      return (
        <tr>
          <td>{this.props.ingredient ? this.props.ingredient.title : ""}</td>
          <td className="right-align">{this.props.ingredient ? this.props.ingredient.price : ""} kr.</td>
          <td className="right-align">
            <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, '/removeIngredientFromShoppingList/') }}>
              <i className="fa fa-trash"></i></button>
          </td>
        </tr>
      );
    }
    else if (this.props.hasOwnProperty('myStash')) {
      return (
        <tr>
          <td>{this.props.ingredient ? this.props.ingredient.title : ""}</td>
          <td className="right-align">{this.props.ingredient ? this.props.ingredient.amount : ""} {this.props.ingredient ? this.props.ingredient.unit : ""}</td>
          <td className="right-align">
            <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, '/stash/remove/') }}>
              <i className="fa fa-trash"></i>
            </button>
          </td>
          <td className="right-align center" width="2%">
            <div className="form-check align-middle">
              <input className="form-check-input" type="checkbox" onChange={(evt) => this.checkCheckBox(evt)}
                id="flexCheckChecked" checked={this.state.boxChecked}>
              </input>
            </div>
          </td>
        </tr>
      )
    }
  }
}

export default StashRowElement;
