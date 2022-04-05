import React from 'react';
import '../stylesheets/recipe.css'
import { useParams } from 'react-router-dom';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
function Recipe() {
    let { id } = useParams();
    fetch(`/findRecipe/${id}`)
        .then((response) => response.json())
        .then((response) => {
            this.setState({ products: response }, () => {
                //console.log(this.state.products);
            });
        })
        .catch((e) => console.log(e));

    console.log(id)


    // HTML
    return (
        <div class="card shadow">
            <div class="card-body shadow-rounded">
                <img src="pizza.jpg" alt="Pizza" class="card-popup-image" />
                <div class="card-popup-content">
                    <div class="info-row">
                        <div class="info-display">
                            <i class="fa fa-user info-icons" aria-hidden="true"></i>
                            <p class="info-text">2</p>
                        </div>
                        <div class="info-display info-duration">
                            <i class="fa fa-clock-o info-icons" aria-hidden="true"></i>
                            <p class="info-text">30 min</p>
                        </div>
                    </div>
                    <div class="description">
                        <h6>Description</h6>
                        <p class="word-break">
                            lorem ipsum dolor sit amipsum dolor sit amipsum dolor sit dolor sit
                            amipsum computer dolor sitsss computer dolor sit amipsum dolor sit
                            am
                        </p>
                    </div>
                    <div class="row">
                        <div class="col">
                            <h6>Directions</h6>
                            <div class="text-style">
                                <div class="row">
                                    <div class="col-1 pr-0"><p class="step">1</p></div>
                                    <div class="col-11 pl-0">
                                        <p class="step-text word-break">Tilføj salt</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-1 pr-0"><p class="step">2</p></div>
                                    <div class="col-11 pl-0">
                                        <p class="step-text word-break">
                                            Tilføj Mere asd asda sda sssssssshpoahs computer daphos udoa
                                            ushplt
                                        </p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-1 pr-0"><p class="step">3</p></div>
                                    <div class="col-11 pl-0">
                                        <p class="step-text word-break">Mere salt</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-1 pr-0"><p class="step">4</p></div>
                                    <div class="col-11 pl-0">
                                        <p class="step-text word-break">Min brormand bare spis</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <h6>Ingredients</h6>
                            <div class="text-style">
                                <div class="row">
                                    <div class="col-6"><p>Pizzadej</p></div>
                                    <div class="col-3 right-align"><p>49g</p></div>
                                    <div class="col-3 right-align"><p>49,95 DKK</p></div>
                                </div>
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
    );

}

export default Recipe;

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