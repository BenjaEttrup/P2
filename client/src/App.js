import React from 'react';
import './App.css';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class App extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor() {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
    this.state = {count: 0};
    let testList = ['test1', 'test2', 'test3'];
    this.listItems = testList.map((item) => 
      <li key={item}>{item}</li>
    );
  }

  //This is a function in the class 
  //We can use this in the render function
  clickFunction() {
    this.setState({count: this.state.count + 1});
  }

  //This is the render function. This is where the
  //html is. The button tag is an expample of a function being 
  //called with the press of a button
  render() {
    return (
      <div className="App">
        <body>
          <h1>TEST</h1>
          <button type='button' className='btn btn-primary' onClick={() => this.clickFunction()}>Testing</button>
          <p>{ this.state.count }</p>
          <ul>{this.listItems}</ul>
        </body>
      </div>
    );
  }
}

export default App;
