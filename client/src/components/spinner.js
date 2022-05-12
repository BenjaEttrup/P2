import React from "react";
import { Modal } from 'bootstrap';
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

  activePopup() {
    this.setState({
      isSpinning: true
    })
    setTimeout(() => {
      var spinnerModal = new Modal(document.getElementById("spinnerPopupModal"), {});
      spinnerModal.show()
      this.setState({
        isSpinning: false
      })
    }, 5000)
  }

  render() {
    return (
      <div className="Spin">
        {
          this.props.recipes ? <Wheel items={this.props.recipes} onSelectItem={() => this.activePopup()} setStateFunction={this.setState} isSpinning={this.state.isSpinning} dropdownShowFunction={this.props.dropdownShowFunction} updateShoppingList={() => this.props.updateShoppingList()} /> : ''
        }
      </div>
    );
  }
}

export default Spin;
