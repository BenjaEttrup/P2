import React from 'react';
import '../stylesheets/shoppingList.css'
import ShoppingListRecipe from './shoppingListRecipe';
import StashRowElement from './stashRowElement';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class ShoppingList extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();

    this.state = {
      shoppingListRecipes: [],
      ingredientCount: 0,
      recipeCount: 0
    };

    
  }

  // Base function in react, called immediately after a component is mounted. Triggered after re-rendering
  componentDidMount() {
    fetch(`/shoppingList`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        let data = {
          shoppingListRecipes: res
        };
        this.setState(data, () => {
          this.elementCount();
        });
      }).catch(err => {
        console.error(err);
      });
  }

  /**
   * 
   * @param  shoppingListRecipes the json object containing the Recipes added by the user
   */
  elementCount (){
    let recipeCount = this.state.shoppingListRecipes.length;
    let ingredientCount = 0;

    for (let recipe in this.state.shoppingListRecipes){
      ingredientCount += this.state.shoppingListRecipes[recipe].ingredients.length;
    }
    
    this.setState({
      ingredientCount: ingredientCount,
      recipeCount: recipeCount
    }, () => {
      console.log(`ingredient Count = ${this.state.ingredientCount} recipeCount = ${this.state.recipeCount}`);
    }) 
  }

  
  //Functions go here

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="ShoppingList">
        <div class="card shadow shoppingList">
          <div class="card-body shoppingList-card-body">
            <div class="">
              <h4>
                Shoppinglist
              </h4>

              <table class="table table-striped">
                <ShoppingListRecipe user={this.state.user} />
              </table>
              <div id="totalPrice">
                <p> Total Price: 7667 DKK</p>
              </div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th class='col-9' scope='col'>My Stash</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <StashRowElement />
                  <StashRowElement />
                  <StashRowElement />
                  <StashRowElement />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShoppingList;
