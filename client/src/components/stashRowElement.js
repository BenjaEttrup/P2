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
      inited: false,
      priceWasAdded: false,
    };
  }

  //Functions go here
  initShoppingListElement(hide) {
    if (hide) {
      this.setState({
        inited: true,
        hide: hide,
      });

      this.props.trackShoppingListElement(this)
    }
  }

  initStashElement(hide) {
    this.setState({
      inited: true,
      hide: hide,
    })

    this.props.trackStashElement(this)

  }



  hideStashRowElement(stashRowElement, endPoint) {
    this.setState({
      hide: !this.state.hide,
    })

    let params = {
      endPoint: endPoint
    };

    console.log("pushed Trashcan")
    if (this.props.hasOwnProperty('recipeID')) {
      params['recipeID'] = this.props.recipeID;
      this.props.updateRecipePrice(stashRowElement, true);
    }
    else {
      params['recipeID'] = false;
      console.log("removing stash")
      // TODO removeIngredient should fetch delete.
      this.props.matchIngredient(stashRowElement, false, true);
      this.props.removeIngredient(stashRowElement, params);
    }
  }

  addItemToStash(evt) {
    this.setState((prevState) => ({
      boxChecked: false,
      hide: false,
    }), () => {
      console.log("")
      console.log("")
      console.log("boxUnchecked")
      console.log("FETCHING")
      // TODO fix bug where price is subtracted twice, and fix bug where it keeps subtracting price
      let stashRowElement = this;
      fetch(`/stash/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(this.props.ingredient)
      }).then(() => {
        stashRowElement.props.updateMyStashIngredients(stashRowElement)
      });
      this.props.matchIngredient(stashRowElement, true, false);


      // TODO fix the recipe sums, maybe use whether or not the boxes are unchecked
      // The bug happens when both are unchecked, the recipeIngredient is added/checked
      // and the stashingredient is checked again.
      // console.log("Calling matchingredient with subtract")

      // console.log(this)

    });
  }

  checkCheckBox(evt) {
    this.setState((prevState) => ({
      boxChecked: !prevState.boxChecked
    }), () => {
      if (this.state.boxChecked) {
        console.log("")
        console.log("BoxChecked")
        // TODO the state of boxChecked should be checked in the matching stashRowElem recipeComponent
        this.props.matchIngredient(this.props.ingredient, true, false);
      }
      else {
        console.log("")
        console.log("boxUnchecked")
        this.props.matchIngredient(this.props.ingredient, false, false);
      }
    });

  }

  //This is the render function. This is where the
  //html is.
  render() {
    if (this.props.hasOwnProperty('passToShoppingList') && !this.state.inited) {
      this.initShoppingListElement(this.props.isHidden);
    }

    if (this.props.hasOwnProperty('passToStashComponents') && !this.state.inited) {
      this.initStashElement(false);
    }

    if (this.state.hide) {
      return null;
    }
    // if (this.props.isHidden) return null;

    if (this.props.hasOwnProperty('shoppingList')) {
      if(!this.state.priceWasAdded){
        this.initShoppingListElement(this.state.hide);
      }
      return (
        <tr>
          <td>{this.props.ingredient ? this.props.ingredient.title : ""}</td>
          <td className="right-align">{this.props.ingredient ? this.props.ingredient.price : ""} kr.</td>
          <td className="right-align">
            <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, '') }}>
              <i className="fa fa-trash"></i></button>
          </td>
          <td className="right-align center" width="2%">
            <div className="form-check align-middle">
              <input className="form-check-input" type="checkbox" onChange={(evt) => this.addItemToStash(evt)}
                id="flexCheckChecked" checked={!this.state.boxChecked}>
              </input>
            </div>
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
