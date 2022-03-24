import React from 'react';
import '../stylesheets/myStash.css'
import StashList from './myStashList';


//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class MyStash extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(recipe) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
    
    //Your code here
  }

  //Functions go here
  componentDidMount() {
    fetch("/stash/get").then((response) => response.json()).then(response => {
      
    }).catch((e)=>console.log(e))
  }

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="MyStash">
        <div id="myStash" class="card shadow">
          <div class="card-body myStash-card-body">
            <h4 class="card-title">My Stash</h4>
            <div class="row">
              <div class="col-6">
                <div class="input-group rounded">
                  <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" onKeyUp="stashSearch()" />
                  <span class="input-group-text border-0" id="search-addon">
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <div class="col-1">
                <i class="fa fa-filter filter-icon myStash-filter-icon" aria-hidden="true"></i>
              </div>
            </div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th class="col-11" scope='col'>Product</th>
                  <th scope='col'>Amount</th>
                  <th scope='col'></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pizza</td>
                  <td>49,95 kr.</td>
                  <td>
                    <i class="fa fa-trash"></i>
                  </td>
                </tr>
                <StashList/>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default MyStash;
