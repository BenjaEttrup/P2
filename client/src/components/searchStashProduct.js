import React, { useState, useRef, useEffect } from "react";

//This is a React class it extends a React component which
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class SearchStashProduct extends React.Component {
  //This is a contructor this function gets called when a object gets created
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
  
    this.state = {
      products: [],
      showDropdown: true,
      searchValue: "",
    };
  }

  //Updates search parameters
  changeSearchValue(evt) {
    this.setState(
      {
        searchValue: evt.target.value,
      },
      () => {
        this.getIngredient();
      }
    );
  }

  //Take the search parameters to request back-end for the products.
  getIngredient() {
    fetch(`/stash/search/${this.state.searchValue}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res); //If this is false, server is down!
        this.setState(
          {
            products: res.suggestions,
          },
          () => {
            console.log(this.state.products);
          }
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }


  //The choosen product, is added to my stash. 
  addIngredient(product) {
    console.log(product);
    let productData = {
      prod_id: parseInt(product.prod_id),
      title: product.title,
      amount: 1,
      unit: "stk",
    };
    console.log(productData);
    fetch(`/stash/add`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(productData),
    })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        this.setState({
          showDropdown: false,
        });
        this.props.updateFunction();
      });
  }
  //sets show dropdown to false.
  handleBlur = (evt) => {
    console.log("Blur evt");
    if (!evt.currentTarget.contains(evt.relatedTarget)) {
      console.log("Blur event if");
      this.setState({ showDropdown: false });
    }
  };

  //Reset the search value.
  resetSearch(evt) {
    console.log("reset!");
    this.setState({
      searchValue: "",
    });
    this.setState({ products: [] });
  }

  /* this.state.product.prod_ID */

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="SearchStashProduct">
        <div
          className="searchWidth"
          onBlur={this.handleBlur}
          onFocus={() => {
            this.setState({ showDropdown: true });
          }}
        >
          <div className="form rounded">
            <i className="fa fa-search"></i>
            <input
              type="search"
              className="form-control rounded search-bar"
              value={this.state.searchValue}
              placeholder="Add item to my stash..."
              aria-label="Search"
              aria-describedby="search-addon"
              onChange={(evt) => {
                this.changeSearchValue(evt);
                this.setState({ showDropdown: true });
              }}
            />
          </div>
          <div className="searchResults">
            <ul className="list-group">
              {this.state.showDropdown
                ? this.state.products !== undefined
                  ? this.state.products.map((product) => {
                      return (
                        <button
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            this.addIngredient(product);
                            this.resetSearch();
                          }}
                        >
                          <i className="fa fa-plus-circle searchResult"></i>
                          {product.title}
                        </button>
                      );
                    })
                  : ""
                : ""}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchStashProduct;
