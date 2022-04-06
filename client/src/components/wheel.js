import React from 'react';
import { Link } from 'react-router-dom';

import '../stylesheets/wheel.css';
import '../stylesheets/popupRecipe.css';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0
    this.state = {
      selectedItem: null,
    };
    this.selectItem = this.selectItem.bind(this);
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

  selectItem() {
    if (this.state.selectedItem === null) {
      if(this.props.isSpinning === false){
        const selectedItem = Math.floor(Math.random() * this.props.items.length);
        
        if (this.props.onSelectItem) {
          this.props.onSelectItem(selectedItem, this.props.items);
        }
        this.setState({ selectedItem });
      }
    }
    else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }
  
  getIndex() {

  }

  addToIndex() {
    this.index ++
  }
  

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';
    return (
      <div className="wheel-container">
        <div className={`wheel ${spinning}`} style={wheelVars} onClick={this.selectItem} data-toggle="modal">
          {items.map((item, index) => (
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              <p class="text-overflow-wheel">{item.recipe.title}</p>
            </div>
          ))}
        </div>
        <div show={this.state.showModal} class="modal fade" id="popupRecipeModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <img src={selectedItem ? this.props.items[selectedItem].recipe.image : ''} alt="popupPicture" class="modal-recipe-header picture-perfect" />
                <button type="button" class="btn-close exit-btn" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-12 top-description">
                  <h1 class="modal-title" id="exampleModalLabel">{selectedItem ? this.props.items[selectedItem].recipe.title : ''}</h1>
                    <p class="text-left"><i class="fa fa-user"></i></p>
                    <p class="text-left">{selectedItem ? this.props.items[selectedItem].recipe.size : ''}</p>
                    <p class="text-left"><i class="fa fa-clock-o"></i></p>
                    <p class="text-left">{selectedItem ? this.props.items[selectedItem].recipe.time : ''}</p>
                  </div>
                  <div class="col-md-12 mb-3">
                    <h5>Description</h5>
                    {selectedItem ? this.props.items[selectedItem].recipe.description : ''}
                  </div>
                 {/* <div class="col-md-6">
                    <h5>Directions</h5>
                    {selectedItem ? this.props.items[selectedItem].recipe.method : ''} DKK
                  </div>
          <div class="col-md-6"> */}
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
                      { 

                        selectedItem ? this.props.items[selectedItem].recipe.ingredients.map((ingredient) => {
                          let currentIndex = this.index
                          this.addToIndex()
                          return (
                            <tr>
                              <td>{Object.keys(ingredient)[0]}</td>
                              <td>{ingredient[Object.keys(ingredient)[0]].amount} {ingredient[Object.keys(ingredient)[0]].unit}</td>
                              <td>{this.props.items[selectedItem].ingredients[currentIndex] ? this.props.items[selectedItem].ingredients[currentIndex].price +" DKK":""}</td>
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
                        {selectedItem ? this.props.items[selectedItem].recipe.price : ''} DKK
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <button type="button" onClick={() => this.addRecipe(this.props.items[selectedItem])} class="btn btn-primary col-12">Add to shopping list</button>
                      </div>
                      <div class="col-6">
                        <Link to={`/recipe/${selectedItem ? this.props.items[selectedItem].recipe.recipeID : ''}`} class="btn btn-secondary col-12">Go to recipe</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

