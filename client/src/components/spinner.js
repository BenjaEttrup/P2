import React from "react";
import {Modal} from 'bootstrap';

import Wheel from "./wheel.js";

import "../stylesheets/spinner.css";

/**
 * Here are the elements in the spinner
 */
export class Spin extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedItem: ''
    }
  }
 
  activePopup(value, recipes){
    setTimeout(() => {
      var myModal = new Modal(document.getElementById("popupRecipeModal"), {});
      myModal.show()
    }, 5000)
    console.log(recipes[value]);
  }

  render() {
    return (
      <div className="Spin">
        {
         this.props.recipes ? <Wheel items={this.props.recipes} onSelectItem={this.activePopup} setStateFunction={this.setState} /> : ''
        }
      </div>
    );
  }
}

export default Spin;
