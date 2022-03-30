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

  //Functions go here
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

  };
  

  render() {
    return (
      <div className="SpinTheMeal">
        <div class="spinTheMeal">
          <h1><center>What's for dinner?</center></h1><br />
          <Spin />
        </div>
    

    <div>
 	    <label for="fname">MinPrice:</label><br/>
  	  <input type="text" id="fname" name="fname" placeholder="Min"  /><br/>
  	  <label for="lname">MaxPrice:</label><br/>
 	    <input type="text" id="lname" name="lname" placeholder="Max" /><br/><br/>
  	  <input type="submit" value="Submit"/>

    </div>
      </div>
    );
  }
}
function getChecked() {
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
}


export default SpinTheMeal;
