import React from 'react';
import '../stylesheets/shoppingList.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class ShoppingList extends React.Component {
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

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="ShoppingList">
        <div class="card shadow shoppingList">
          <div class="card-body shoppingList-card-body">
            <div class="">
              <h4>
                Shoppinglist
              </h4>

              <table class="table table-striped">
                <thead>
                  <tr>
                    <th class='col-9' scope='col'>Pasta</th>
                    <th class="text-success">Price 45 DKK</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">10 DKK</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">10 DKK</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">10 DKK</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">10 DKK</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div id="totalPrice">
                <p> Total Price: 7667 DKK</p>
              </div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th class='col-9' scope='col'>My Stash</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                  <tr>
                    <td>Product name</td>
                    <td class="right-align">
                      <i class="fa fa-trash"></i>
                      <input class="form-check-input shoppingList-check" type="checkbox" value="" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>  
        </div>
      </div>
    );
  }
}

export default ShoppingList;
