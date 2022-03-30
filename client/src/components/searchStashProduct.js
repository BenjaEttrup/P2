import React from 'react';


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
    //Your code here
  }

  //Functions go here
  changeSearchValue (evt) {
    this.setState({
        searchValue: evt.target.value
    }, () => {
        this.getIngredient ()
    })
  }
  getIngredient() {
    fetch(`/stash/search/${this.state.searchValue}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then((res)=>{
        console.log(res)
        this.setState({
            products: res.suggestions
        }, ()=>  {console.log(this.state.products)})
    }).catch(err => {
      console.error(err);
    });
  }

    searchBarDropdown(){
        
    }
  
  /* this.state.product.prod_ID */

  //This is the render function. This is where the
  //html is.
  render() {
    return (
     <div class="col-6">
        <div class="input-group rounded">
            <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" onChange={(evt)=>{this.changeSearchValue(evt)}} />
            <span class="input-group-text border-0" id="search-addon">
            <i class="fa fa-search" aria-hidden="true"></i>
            </span>
        </div>
      </div>


    );
  }
}

export default SearchStashProduct;
