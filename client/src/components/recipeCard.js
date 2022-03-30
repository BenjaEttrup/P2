import React from 'react';


//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class RecipeCard extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
  }

  
  
  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="RecipeCard">
        <div class="col mb-4 outer-item-card">
          <a href="#">
            <div class="card card-item h-100">
              <div class="img-gradient img-gradient-black card-img-border">
                <img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
              </div>
              <div class="card-img-overlay">
                <div class="row card-info-row">
                  <h5 class="card-title col-7">{ this.props.recipe ? this.props.recipe.recipe.title : '' }</h5>
                  <div class="card-info col-5">
                    <button type="button col" class="button-add">
                      <h4 class="button-plus">+</h4>
                    </button>
                    <p class="card-text card-price col">{ this.props.recipe ? this.props.recipe.recipe.price + ' DKK' : '' }</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default RecipeCard;
