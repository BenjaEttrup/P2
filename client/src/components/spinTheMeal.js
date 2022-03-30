import React from 'react'
import '../stylesheets/spinTheMeal.css'
import Spin from './spinTheMealv2';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class SpinTheMeal extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(recipe) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
    
    this.state ={
      allRecipes: []
    }
    
  }

  /*//Functions go here
  spin_the_wheel() {
    var x = 1024;
    var y = 9999;

    var deg = Math.floor(Math.random() * (x -y)) + y;

    document.getElementById('box').style.transform = "rotate(" + deg + "deg)";

    var element = document.getElementById('mainbox');
    element.classList.remove('animate');
    setTimeout(function(){
      element.classList.add('animate');

      var inputVal = document.getElementById("span2").name;
      alert(inputVal);
    }, 5000);
  }

  componentDidMount() {
    fetch("/findAllRecipes").then((response) => response.json()).then(response => {
      let recipesSort = response.recipes
      recipesSort.sort(comparePrice)

      let data = {
        allRecipes: response.recipes,
      }
      this.setState(data)
    })

  };*/
  

  render() {
    return (
      <div class="container">
        <div className="SpinTheMeal">
          <div class="spinTheMeal">
            <h1><center>What's for dinner?</center></h1><br />
          </div>
          <div class="row">
            <div class="col-lg-4 mb-2">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="">Price</span>
                </div>
                <input type="number" class="form-control" placeholder="Min" id="min_price" />
                <input type="number" class="form-control" placeholder="Max" id="max_price" />
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                <label class="form-check-label" for="defaultCheck1">My stash</label>
              </div>
              <button type="button" class="btn btn-primary col-sm-12">Submit</button>
            </div>
            <div class="col-lg-8 bg-light border pt-5 pb-5">
              <Spin />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/* function getChecked() {
  const checkBox = document.getElementById('MinPrice').checked;
  if (checkBox === true) {
    console.log(true);
    } else {
      console.log(false);
  }
} 
function getChecked() {
  const checkBox = document.getElementById('MaxPrice').checked;
  if (checkBox === true) {
    console.log(true);
    } else {
      console.log(false);
  }
}

function comparePrice(a, b) {
  return a.recipe.price - b.recipe.price;
}*/


export default SpinTheMeal;
