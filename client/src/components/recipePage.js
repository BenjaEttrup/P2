import React from 'react';
import '../stylesheets/recipe.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class RecipePage extends React.Component {
    //This is a contructor this function gets called when a object gets created
    //from the App class. It is often used to set the values in the object
    constructor(props) {
        //Super has to be called as the first thing
        //this says that the code from the React component
        //runs before our code in the contructor
        super();

        this.state = {
            recipe: {
                recipeId: "",
                title: "",
                description: "",
                size: "",
                ingredients: [],
                time: "",
                method: [],
                rating: "",
                image: "",
                url: "",
                totalPrice: "",
                recipeIndex: ""
            },
            ingredients: []
        };
    };

    //Request back-end function stash get, to add my stash data to this.state.products.  
    componentDidMount() {
        fetch(`/findRecipe/${this.props.id}`)
            .then((response) => response.json())
            .then((response) => {
                this.setState({ recipe: response.recipe, ingredients: response.ingredients })
                console.log(this.state.recipe.totalPrice);
                console.log(this.state.recipe);
            }).catch((e) => console.log(e));
    }




    // HTML
    render() {
        return (
            <div>
                <div class="card shadow bgcolor">
                    <div class="card-body shadow-rounded">
                        <img src={this.state.recipe.image} alt={this.state.recipe.title} class="card-popup-image" />
                        <div class="card-popup-content">
                            <h3>{this.state.recipe.title}</h3>
                            <div class="info-row">
                                <div class="info-display">
                                    <i class="fa fa-user info-icons" aria-hidden="true"></i>
                                    <p class="info-text">{this.state.recipe.size}</p>
                                </div>
                                <div class="info-display info-duration">
                                    <i class="fa fa-clock-o info-icons" aria-hidden="true"></i>
                                    <p class="info-text">{this.state.recipe.time} min</p>
                                </div>
                            </div>
                            <div class="description">
                                <h6>Description</h6>
                                <p class="word-break">
                                    {this.state.recipe.description}
                                </p>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <h6>Directions</h6>
                                    <div class="text-style">
                                        {this.state.recipe.method.map((step, index) => {
                                            return (
                                                <div class="row">
                                                    <div class="col-1 pr-0"><p class="step">{index + 1}</p></div>
                                                    <div class="col-11 pl-0">
                                                        <p class="step-text word-break">{step}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div class="col">
                                    <h6>Ingredients</h6>
                                    <div class="text-style">
                                        {this.state.recipe.ingredients.map((ingredient, index) => {
                                            return (
                                                <div class="row">
                                                    <div class="col-6"><p>{ingredient}</p></div>
                                                    <div class="col-3 right-align"><p>49g</p></div>
                                                    <div class="col-3 right-align"><p>49,95 DKK</p></div>
                                                </div>);
                                        })}




                                        <div class="row">
                                            <div class="col-6"><p>Pizza</p></div>
                                            <div class="col-3 right-align"><p>49g</p></div>
                                            <div class="col-3 right-align"><p>49,95 DKK</p></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-6"><p>Mozzarella</p></div>
                                            <div class="col-3 right-align"><p>49g</p></div>
                                            <div class="col-3 right-align"><p>49,95 DKK</p></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-6"><p>Ting</p></div>
                                            <div class="col-3 right-align"><p>49 stk</p></div>
                                            <div class="col-3 right-align"><p>49,95 DKK</p></div>
                                        </div>
                                        <div class="row bold-total">
                                            <div class="col-6"><p>Total</p></div>
                                            <div class="col-6 right-align"><p>99,01 DKK</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-buttons row g-0">
                                <div class="col-6">
                                    <button type="button" class="btn card-button">
                                        Add to shopping list
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button type="button" class="btn card-button card-button-secondary">
                                        Go to recipe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}


export default RecipePage;


            // <div class="shoppingList">
            //     <div class="card shadow shoppingList">
            //         <div class="card-body shoppingList-card-body">
            //             <div class="">
            //                 <h4>
            //                     hej {id}
            //                 </h4>
            //             </div>
            //         </div>
            //     </div>
            // </div>