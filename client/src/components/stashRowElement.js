import React from 'react';


//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class StashRowElement extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
    //Your code here
  }

  //Functions go here

  removeIngredient() {
    fetch(`/stash/remove/${this.props.product.prod_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).catch(err => {
      console.error(err);
    });
    this.props.updateFunction(this.props.product.prod_id);
  }
  /* this.state.product.prod_ID */

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <tr>
        {/* <td>{this.props.ingredient1 ? this.props.ingredient1.title + " ID: " + this.props.ingredient1.prod_ID : ""}</td> */}
        <td>{this.props.ingredient1 ? this.props.ingredient1 + " ID: " + this.props.ingredient1 : ""}</td>
        {/* <td>{this.props.ingredient1 ? this.props.ingredient1.amount : ""} {this.props.ingredient1 ? this.props.ingredient1.unit : ""}</td> */}
        <td>{this.props.ingredient1 ? this.props.ingredient1 : ""} {this.props.ingredient1 ? this.props.ingredient1 : ""}</td>
        <td class ="right-align">
          <button type="button" onClick={() => { this.removeIngredient() }}>
            <i class="fa fa-trash"></i></button>
        </td>
      </tr>
    );
  }
}

export default StashRowElement;
