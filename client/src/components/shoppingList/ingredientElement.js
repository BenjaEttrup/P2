import React from 'react';

//This is a React class it extends a React component which
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class IngredientElement extends React.Component {
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
      wasTrashed: false,
    };
  }

  componentDidMount() {
    if (this.props.hasOwnProperty('shoppingList') && !this.state.inited) {
      this.initShoppingListElement();
    }

    if (this.props.hasOwnProperty('passToStashComponents') && !this.state.inited) {
      this.initStashElement();
    }
  }

  /**
   * @function initializes this shopping ingredient and calls a function that lets the recipe track this component
   * @param {*} hide whether this ingredient should be hidden initially
   */
  initShoppingListElement(hide) {
    if (!this.state.inited) {
      this.setState({
        inited: true,
        hide: hide,
      }, () => {
        this.props.trackShoppingListElement(this, hide)
      });
    }
  }

  /**
   * @function Initializes a stash ingredient and calls a function, that lets shoppingList component track it.
   */
  initStashElement() {
    this.setState({
      inited: true,
      hide: false,
    }, () => {
      this.props.trackStashElement(this)
    })
  }



  /**
   * 
   * @param {*} stashRowElement 
   * @param {*} endPoint the endpoint that we want to access when removing this ingredientElement 
   * as it could either be a recipe ingredient or stash ingredient. 
   */
  hideStashRowElement(stashRowElement, endPoint) {
    // Updates the state to match a "removed" ingredient.
    this.setState({
      wasTrashed: true,
      boxChecked: false,
      hide: true,
    })

    let params = {
      endPoint: endPoint
    };

    // If it is a recipe ingredient, the endpoint will be '/shoppinglist/remove/ingredient/'
    if (this.props.hasOwnProperty('recipeID')) {
      this.setState({
        hide: !this.state.hide,
        wasTrashed: true
      }, () => {
        params['recipeID'] = this.props.recipeID;
        this.props.removeIngredient(stashRowElement, params)
        this.props.updateRecipePrice()
      })
    }
    // If it is a stash ingredient, the endpoint will be '/stash/remove/'
    else {
      params['recipeID'] = false;
      this.props.matchIngredient(this, false, true);
      this.props.removeIngredient(stashRowElement, params);
    }
  }

  /**
   * @function sets boxChecked as false and hides the shopping list ingredient.
   * The shopping list ingredient will be added to the stash. 
   * @param {*} evt 
   */
  addItemToStash(evt) {
    this.setState(() => ({
      boxChecked: false,
      hide: true,
    }), () => {
      let stashRowElement = this;
      // Used to format the shopping list ingredient as a stash ingredient. 
      let ingredient = this.props.ingredient;
      ingredient["amount"] = 1;
      ingredient["unit"] = "stk";
      fetch(`/stash/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(this.props.ingredient)
        // updates the user's stash
      }).then(stashRowElement.props.updateMyStashIngredients(stashRowElement))
        // Finds all the other ingredients matching this ingredient and updates the states. 
        .then(this.props.matchIngredient(this, true, false, true))
    });
  }

  /**
   * @function changes the state of the checkbox in a stash ingredient and updates the state on all matching ingredients from recipes.
   */
  checkCheckBox() {
    this.setState((prevState) => ({
      boxChecked: !prevState.boxChecked
    }), () => {
      if (this.state.boxChecked) {
        this.props.matchIngredient(this, true, false);
      }
      else {
        this.props.matchIngredient(this, false, false);
      }
    });

  }

  //This is the render function. This is where the
  //html is.
  render() {
    if (this.state.hide || this.state.wasTrashed) {
      return null;
    }

    if (this.props.hasOwnProperty('shoppingList')) {
      if (!this.state.priceWasAdded) {
        this.setState({
          priceWasAdded: true
        })
      }
      return (
        <tr>
          <td class="capitalize_first">{this.props.ingredient ? this.props.ingredient.title : ""}</td>
          <td className="right-align">{this.props.ingredient ? Number(this.props.ingredient.price).toFixed(2) : ""} kr.</td>
          <td className="right-align">
            <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, '/shoppinglist/remove/ingredient/') }} className="deleteButton">
              <i className="fa fa-trash"></i></button>
          </td>
          <td className="right-align center" width="2%">
            <div className="form-check align-middle">
              <input className="form-check-input" type="checkbox" onChange={() => this.addItemToStash()}
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
            <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, '/stash/remove/') }} className="deleteButton">
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

export default IngredientElement;
