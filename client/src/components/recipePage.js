import React from 'react';
import { withRouter } from "react-router-dom";
import '../stylesheets/recipe.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class Recipe extends React.Component {
  //This is a contructor this function gets called when a object gets created
  //from the App class. It is often used to set the values in the object
  constructor(props) {
    super(props);
    //Super has to be called as the first thing
    //this says that the code from the React component
    //runs before our code in the contructor
    this.state = {
      recipeData: {
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
          price: "",
          recipeIndex: ""
        },
        ingredients: []
      },
    };
  };

  //Request back-end function findRecipe, to add the recipe respons to this.state.products.  
  componentDidMount() {
    fetch(`/recipes/get/${this.props.match.params.id}`)
      .then((response) => response.json())
      .then((response) => {
        this.setState({ recipeData: { recipe: response.recipe, ingredients: response.ingredients } });
      }).catch((e) => console.log(e));
  }

  addRecipe(recipe) {
    fetch(`/shoppingList/add`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(recipe),
    })
      .then(() => {
        this.props.updateShoppingList()
        this.props.dropdownShowFunction(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // HTML
  render() {
    return (
      <div>
        <div className="card-recipe bgcolor">
          <div className="card-body-recipe shadow-rounded">
            <img src={this.state.recipeData.recipe.image} alt={this.state.recipeData.recipe.title} className="card-popup-image" />
            <div className="card-popup-content">
              <div className="info-row">
                <div className="info-display  info-title">
                  <h3>{this.state.recipeData.recipe.title}</h3>
                </div>
                <div className="info-display">
                  <i className="fa fa-user info-icons" aria-hidden="true"></i>
                  <p className="info-text">{this.state.recipeData.recipe.size}</p>
                </div>
                <div className="info-display info-duration">
                  <i className="fa fa-clock-o info-icons" aria-hidden="true"></i>
                  <p className="info-text">{this.state.recipeData.recipe.time + " min"} </p>
                </div>
              </div>
              <div className="description">
                <h6>Beskrivelse</h6>
                <p className="word-break">
                  {this.state.recipeData.recipe.description}
                </p>
              </div>
              <div className="row">
                <div className="col">
                  <h6>Metode</h6>
                  <div className="text-style">
                    {this.state.recipeData.recipe.method.map((step, index) => {
                      return (
                        <div className="row">
                          <div className="col-1 pr-0">
                            <p className="step">{index + 1}</p>
                          </div>
                          <div className="col-11 pl-0">
                            <p className="step-text word-break">{step}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col">
                  <table className="table table-striped table-borderless">
                    <thead>
                      <tr>
                        <th>
                          <h6>Ingredienser</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-style ">
                      {this.state.recipeData.ingredients.map((ingredient, index) => {
                        return (
                          <tr >
                            <td>
                              <p className="ingredientsTabelCol capitalize_first">{ingredient.title}</p>
                            </td>
                            <td>
                              <p className="ingredientsTabelCol">{ingredient.amount + " " + ingredient.unit}</p>
                            </td>
                            <td>
                              <p className="ingredientsTabelCol">{ingredient.price + " kr."}</p>
                            </td>
                          </tr>
                        );
                      })}
                      <tr >
                        <td>
                          <p className="ingredientsTabelCol">Pris i alt</p>
                        </td>
                        <td>
                          <p className="ingredientsTabelCol"></p>
                        </td>
                        <td>
                          <p className="ingredientsTabelCol">{this.state.recipeData.recipe.price + " kr."}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="card-buttons-recipe g-0 ">
                    <div className="recipe-button" >
                      <button type="button" className="btn card-button-recipe" onClick={() => { this.addRecipe(this.state.recipeData); }}>
                        Tilføj til Shopping List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default withRouter(Recipe);
