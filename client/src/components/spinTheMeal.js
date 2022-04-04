import React from 'react';
import '../stylesheets/spinTheMeal.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class SpinTheMeal extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super(props);

    this.props.updateNavFunction(3);
    
    //Your code here
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

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="SpinTheMeal">
        <div class="spinTheMeal">
          <h1><center>What's for dinner?</center></h1><br />
          <div id="mainbox" class="mainbox">
            <div id="box" class="box">
              <div class="box1">
                <span class="span1 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>Test</b></span>
                <span class="span2 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>Pasta med ketchup</b></span>
                <span class="span3 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>Fisk med ris</b></span>
                <span class="span4 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>burger</b></span>
              </div>
              <div class="box2">
                <span class="span1 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>Shoplifters</b></span>
                <span class="span2 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>Inception</b></span>
                <span class="span3 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>Deadpool</b></span>
                <span class="span4 spinTheMeal-span" id="span2" name="Pasta med ketchup"><b>Terminator</b></span>
              </div>
            </div>
            <button class="spin" onClick={() => this.spin_the_wheel()}>SPIN</button>
          </div>
        </div>
      </div>
    );
  }
}

export default SpinTheMeal;
