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
      let isHiddenOnInit = this.props.ingredientInStash(this, this.props.ingredientIndex);
      this.initShoppingListElement(isHiddenOnInit);
    }

    if (this.props.hasOwnProperty('passToStashComponents') && !this.state.inited) {
      this.initStashElement(false);
    }
  }

  //Functions go here
  initShoppingListElement(hide) {
    if (hide) {
      this.setState({
        inited: true,
        hide: hide,
      }, () => {
        this.props.trackShoppingListElement(this, hide)
      });
    }
    else {
      if (!this.state.inited) {
        this.setState({
          inited: true,
          hide: hide,
        }, () => {
          this.props.trackShoppingListElement(this, hide)
        });
      }
    }
  }

  initStashElement(hide) {
    this.setState({
      inited: true,
      hide: hide,
    }, () => {
      this.props.trackStashElement(this, hide)
    })
  }



  hideStashRowElement(stashRowElement, endPoint) {
    this.setState({
      wasTrashed: true,
      boxChecked: false,
      hide: true,
    }, () => {

    })

    let params = {
      endPoint: endPoint
    };

    console.log("")
    console.log("pushed Trashcan")
    if (this.props.hasOwnProperty('recipeID')) {
      this.setState({
        hide: !this.state.hide,
        wasTrashed: true
      }, () => {
        params['recipeID'] = this.props.recipeID;
        console.log("removing recipeIngredient")
        this.props.removeIngredient(stashRowElement, params)
        this.props.updateRecipePrice()
      })
    }
    else {
      params['recipeID'] = false;
      console.log("removing stashIngredient")
      this.props.matchIngredient(this, false, true);
      this.props.removeIngredient(stashRowElement, params);
    }
  }

  addItemToStash(evt) {
    this.setState((prevState) => ({
      boxChecked: false,
      hide: true,
    }), () => {
      console.log("")
      console.log("Adding recipeIngredient to Stash")
      let stashRowElement = this;
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
      }).then(stashRowElement.props.updateMyStashIngredients(stashRowElement))
        .then(this.props.matchIngredient(this, true, false, true))
    });
  }

  checkCheckBox(evt) {
    this.setState((prevState) => ({
      boxChecked: !prevState.boxChecked
    }), () => {
      if (this.state.boxChecked) {
        console.log("")
        console.log("BoxChecked")
        this.props.matchIngredient(this, true, false);
      }
      else {
        console.log("")
        console.log("boxUnchecked")
        this.props.matchIngredient(this, false, false);
      }
    });

  }

  //This is the render function. This is where the
  //html is.
  render() {
    // TODO FIX BUG WHERE LOADING THE SHOPPING LIST WITH INGREDIENTS IN MY STASH DOES NOT HIDE THE INGREDIENTS IN THE RECIPES.
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
          <td>{this.props.ingredient ? this.props.ingredient.title : ""}</td>
          <td className="right-align">{this.props.ingredient ? this.props.ingredient.price : ""} kr.</td>
          <td className="right-align">
            <button type="button" onClick={() => { this.hideStashRowElement(this.props.ingredient, 'removeIngredientFromShoppingList/') }}>
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

export default IngredientElement;
