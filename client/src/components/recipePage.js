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
			}
		};
	};

	//Request back-end function findRecipe, to add the recipe respons to this.state.products.  
	componentDidMount() {
		fetch(`/findRecipe/${this.props.id}`)
			.then((response) => response.json())
			.then((response) => {
				this.setState({ recipeData: { recipe: response.recipe, ingredients: response.ingredients } }, () => {
					console.log(this.state.recipeData.recipe.totalPrice);
					console.log(this.state.recipeData.recipe);
				})

			}).catch((e) => console.log(e));
	}

	addRecipe(recipe) {
		fetch(`/addRecipeToShoppingList`, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(recipe),
		})
			.catch((err) => {
				console.error(err);
			})
			.then(() => {
				console.log('Success');
				//this.props.updateShoppingList()
			});
	}



	// HTML
	render() {
		return (
			<div>
				<div class="card-recipe shadow bgcolor">
					<div class="card-body-recipe shadow-rounded">
						<img src={this.state.recipeData.recipe.image} alt={this.state.recipeData.recipe.title} class="card-popup-image" />
						<div class="card-popup-content">
							<div class="info-row">
								<div class="info-display  info-title">
									<h3>{this.state.recipeData.recipe.title}</h3>
								</div>
								<div class="info-display">
									<i class="fa fa-user info-icons" aria-hidden="true"></i>
									<p class="info-text">{this.state.recipeData.recipe.size}</p>
								</div>
								<div class="info-display info-duration">
									<i class="fa fa-clock-o info-icons" aria-hidden="true"></i>
									<p class="info-text">{this.state.recipeData.recipe.time + " min"} </p>
								</div>
							</div>
							<div class="description">
								<h6>Description</h6>
								<p class="word-break">
									{this.state.recipeData.recipe.description}
								</p>
							</div>
							<div class="row">
								<div class="col">
									<h6>Directions</h6>
									<div class="text-style">
										{this.state.recipeData.recipe.method.map((step, index) => {
											return (
												<div class="row">
													<div class="col-1 pr-0">
														<p class="step">{index + 1}</p>
													</div>
													<div class="col-11 pl-0">
														<p class="step-text word-break">{step}</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
								<div class="col">
									<table class="table table-striped table-borderless">
										<thead>
											<tr>
												<th>
													<h6>Ingredients</h6>
												</th>
											</tr>
										</thead>
										<tbody class="text-style ">
											{this.state.recipeData.ingredients.map((ingredient, index) => {
												return (
													<tr >
														<td>
															<p class="ingredientsTabelCol capitalize">{ingredient.title}</p>
														</td>
														<td>
															<p class="ingredientsTabelCol">{ingredient.amount + " " + ingredient.unit}</p>
														</td>
														<td>
															<p class="ingredientsTabelCol">{ingredient.price + " kr."}</p>
														</td>
													</tr>
												);
											})}
											<tr >
												<td>
													<p class="ingredientsTabelCol capitalize">Total price</p>
												</td>
												<td>
													<p class="ingredientsTabelCol"></p>
												</td>
												<td>
													<p class="ingredientsTabelCol">{this.state.recipeData.recipe.price + " kr."}</p>
												</td>
											</tr>
										</tbody>
									</table>

									<div class="card-buttons-recipe g-0 ">
										<div class="recipe-button" >
											<button type="button" class="btn card-button-recipe" onClick={() => { this.addRecipe(this.state.recipeData); }}>
												Add to shopping list
											</button>
										</div>
									</div></div>
							</div>

						</div>
					</div>
				</div>
			</div >
		);
	}
}


export default RecipePage;
