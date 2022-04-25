import React from "react";
import "../stylesheets/myStash.css";
import StashRowElement from "./stashRowElement";
import SearchStashProduct from "./searchStashProduct";

//This is a React class it extends a React component which
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class MyStash extends React.Component {
  //This is a contructor this function gets called when a object gets created
  //from the App class. It is often used to set the values in the object
  constructor(props) {

    //Super has to be called as the first thing
    //this says that the code from the React component
    //runs before our code in the contructor
    super(props);

    this.props.updateNavFunction(4);

    //Your code here
    this.state = {
      products: [],
    };
  }


  //Request back-end function stash get, to add my stash data to this.state.products.  
  componentDidMount() {
    fetch("/stash/get")
      .then((response) => response.json())
      .then((response) => {
        this.setState({ products: response }, () => {
          //console.log(this.state.products);
        });
      })
      .catch((e) => console.log(e));
  }

  //removes products from stash overview on front-end. 
  updateTable(id) {
    //products, not removed by id, is mapped to the new array.
    let updatedProducts = [];
    this.state.products.forEach((product) => {
      if (product.prod_id === id && product.amount > 1) {
        product.amount--;
        updatedProducts.push(product);
      } else if (product.prod_id !== id) updatedProducts.push(product);
    });
    this.setState({
      products: updatedProducts,
    });
  }

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="MyStash">
        <div id="myStash" className="card shadow">
          <div className="card-body myStash-card-body">
            <h2 className="card-title">My Stash</h2>
            <div id="search-bar">
              <SearchStashProduct
                updateFunction={() => this.componentDidMount()}
              />
            </div>
            <table
              className="table table-striped table-borderless"
              id="stash-table"
            >
              <thead>
                <tr>
                  <th className="col-11" scope="col">
                    Product
                  </th>
                  <th scope="col">Amount</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map((product) => {
                  return (
                    <StashRowElement
                      product={product}
                      updateFunction={(id) => this.updateTable(id)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default MyStash;
