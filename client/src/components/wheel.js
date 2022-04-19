import React from 'react';
// import { Link } from 'react-router-dom';
import PopupRecipe from './recipePopup';

import '../stylesheets/wheel.css';
import '../stylesheets/popupRecipe.css';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0
    this.state = {
      selectedItem: null,
      selectedRecipe: null
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
      if (this.props.isSpinning === false) {
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

  resetIndex() {
    this.index = 0;
  }

  addToIndex() {
    this.index++
  }


  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';
    console.log(items)
    console.log(selectedItem)
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
        {items && selectedItem ? < PopupRecipe items={items} selectedItem={selectedItem}/> : ""}
        </div>
      </div>
    );
  }
}

