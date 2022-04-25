import React from "react";
import { Modal } from 'bootstrap';
import PopupRecipe from "./recipePopup.js";

import Wheel from "./wheel.js";

import "../stylesheets/spinner.css";

/**
 * Here are the elements in the spinner
 */
export class Spin extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedItem: '',
      isSpinning: false
    }
  }

  activePopup(value, recipes) {
    this.setState({
      isSpinning: true
    })
    setTimeout(() => {
      var myModal = new Modal(document.getElementById("popupRecipeModal"), {});
      myModal.show()
      this.setState({
        isSpinning: false
      })
    }, 5000)
    console.log(recipes[value]);
  }

  render() {
    return (
      <div className="Spin">
        {
          this.props.recipes ? <Wheel items={this.props.recipes} onSelectItem={(value, recipes) => this.activePopup(value, recipes)} setStateFunction={this.setState} isSpinning={this.state.isSpinning} /> : ''
        }
      </div>
    );
  }
}

export default Spin;
