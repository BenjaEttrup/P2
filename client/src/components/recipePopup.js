import React from 'react';
import { Link } from 'react-router-dom';


import '../stylesheets/wheel.css';
import '../stylesheets/popupRecipe.css';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class PopupRecipe extends React.Component {
  constructor(props) {
    super(props);

    this.index = 0
    this.state = {
      selectedItem: null,
    };
  }

  componentDidMount() {
    this.setState({
      selectedItem: this.props.selectedItem
    })
  }

  addRecipe(recipe) {
    fetch(`/addRecipeToShoppingList`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(recipe),
    })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        console.log('Success');
      });
  }

  resetIndex() {
    this.index = 0;
  }

  addToIndex() {
    this.index++
  }


  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <img src={this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.image : ''} alt="popupPicture" class="modal-recipe-header picture-perfect" />
            <div class="btn-spacing">
              <button type="button" class="btn-close exit-btn" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 top-description">
                <h1 class="modal-title" id="exampleModalLabel">{this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.title : ''}</h1>
                <p class="text-left"><i class="fa fa-user"></i></p>
                <p class="text-left">{this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.size : ''}</p>
                <p class="text-left"><i class="fa fa-clock-o"></i></p>
                <p class="text-left">{this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.time : ''}</p>
              </div>
              <div class="col-md-12 mb-3">
                <h5>Description</h5>
                {this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.description : ''}
              </div>
              <h5>Ingredients</h5>
              <ul class="ingrediens-list">
                <table class="table table-striped table-borderless" id="stash-table">
                  <thead>
                    <tr>
                      <th class="col-6" scope="col">
                        Ingredients
                      </th>
                      <th scope="col-3">Amount</th>
                      <th scope="col-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.resetIndex()}
                    {
                      this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.ingredients.map((ingredient) => {
                        let currentIndex = this.index
                        this.addToIndex()
                        return (
                          <tr>
                            <td class="capitalize"> {Object.keys(ingredient)[0]}</td>
                            <td>{ingredient[Object.keys(ingredient)[0]].amount} {ingredient[Object.keys(ingredient)[0]].unit}</td>
                            <td>{this.props.items[this.props.selectedItem].ingredients[currentIndex].price ? this.props.items[this.props.selectedItem].ingredients[currentIndex].price + ' DKK' : ''}</td>
                          </tr>

                        )
                      }) : ''
                    }
                  </tbody>
                </table>
              </ul>
              <div class="row mb-3">
                <b><div class="col-7">Total price</div></b>
                <div class="col-5">
                  {this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.price : ''} DKK
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <button type="button" onClick={() => this.addRecipe(this.props.items[this.props.selectedItem])} data-bs-dismiss="modal" class="btn btn-primary col-12">Add to shopping list</button>
                </div>
                <div class="col-6" data-bs-dismiss="modal" >
                  <Link to={`/recipe/${this.props.selectedItem && this.props.items.length !== 0 ? this.props.items[this.props.selectedItem].recipe.recipeID : ''}`} class="btn btn-secondary col-12">Go to recipe</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PopupRecipe;
