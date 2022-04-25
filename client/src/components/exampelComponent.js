import React from 'react';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class ComponentName extends React.Component {
	//This is a contructor this function gets called when a object gets created 
	//from the App class. It is often used to set the values in the object
	constructor(props) {
		//Super has to be called as the first thing 
		//this says that the code from the React component
		//runs before our code in the contructor
		super(props);

		//Your code here
	}

	//Functions go here

	//This is the render function. This is where the
	//html is.
	render() {
		return (
			<div className="ComponentName">
				HTML here
			</div>
		);
	}
}

export default ComponentName;
