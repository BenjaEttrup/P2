import React from 'react';
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
    fetch(`/shoppinglist/add`, {
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
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      if (this.props.isSpinning === false) {
        const selectedItem = Math.floor(Math.random() * this.props.items.length);

        if (this.props.onSelectItem) {
          this.props.onSelectItem();
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

    return (
      <div className="wheel-container">
        <div className={`wheel ${spinning}`} style={wheelVars} onClick={this.selectItem} data-toggle="modal">
          {items.map((item, index) => (
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              <p class="text-overflow-wheel">{item.recipe.title}</p>
            </div>
          ))}
        </div>
        <div class="modal fade" id="spinnerPopupModal" tabindex="-1" aria-labelledby="spinnerPopupModal" aria-hidden="true">
          {items !== [] && selectedItem !== null ? < PopupRecipe items={items} selectedItem={selectedItem} dropdownShowFunction={this.props.dropdownShowFunction} updateShoppingList={() => this.props.updateShoppingList()} /> : ""}
        </div>
      </div>
    );
  }
}
