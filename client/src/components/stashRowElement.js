import React from "react";

//This is a React class it extends a React component which
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class StashRowElement extends React.Component {
  removeIngredient() {
    fetch(`/stash/remove/${this.props.product.prod_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).catch((err) => {
      console.error(err);
    });
    this.props.updateFunction(this.props.product.prod_id);
  }

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <tr class="table-content  table-rounded">
        <td>{this.props.product ? this.props.product.title : ""}</td>
        <td class="table-content-secondary">
          {this.props.product
            ? this.props.product.amount + " " + this.props.product.unit
            : ""}
        </td>
        <td class="right-align-text">
          <button
            type="button"
            class="deleteButton"
            onClick={() => {
              this.removeIngredient();
            }}
          >
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    );
  }
}

export default StashRowElement;