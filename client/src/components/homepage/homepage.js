import React from 'react';
import RecipeCard from './recipeCard';
import Carousel from './carousel';
import { compareTwoStrings } from 'string-similarity';
import { Modal } from 'bootstrap';
import PopupRecipe from '../recipePopup';

import '../../stylesheets/homepage.css';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class HomePage extends React.Component {
	//This is a contructor this function gets called when a object gets created 
	//from the App class. It is often used to set the values in the object
	constructor(props) {
		//Super has to be called as the first thing 
		//this says that the code from the React component
		//runs before our code in the contructor
		super(props);

		this.props.updateNavFunction(1);

		//Your code here
		this.state = {
			allRecipes: [],
			recipes: [],
			myStash: [],
			minPrice: 0,
			maxPrice: 0,
			searchValue: '',
			categoryID: '1',
			myStashChecked: false,
			selectedRecipeID: 1
		}
	}

	//Functions go here
	componentDidMount() {
		fetch(`/stash/get`, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})
			.then(res => res.json())
			.then((res) => {
				let data = {
					myStash: res
				}
				this.setState(data, () => {
					fetch(`/findAllRecipes`, {
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
						}
					})
						.then(res => res.json())
						.then((json) => {
							let data = {
								allRecipes: json.recipes
							}
							this.setState(data, () => {
								this.refreshSearch();
							});
						}).catch(err => {
							console.error(err);
						});
				});
			}).catch(err => {
				console.error(err);
			});
	}

	setSearchValue(evt) {
		this.setState({
			searchValue: evt.target.value
		}, () => {
			this.refreshSearch();
		})
	}

	setMinPriceValue(evt) {
		this.setState({
			minPrice: evt.target.value
		}, () => {
			this.refreshSearch()
		})
	}

	setMaxPriceValue(evt) {
		this.setState({
			maxPrice: evt.target.value
		}, () => {
			this.refreshSearch()
		})
	}

	refreshSearch() {
		let searchedRecipes = [];

		stringRecipeSearch(this.state.searchValue, this.state.allRecipes).forEach((recipe) => {
			searchedRecipes.push(recipe);
		})

		let notAlreadyChosen = this.state.allRecipes.filter((recipe) => {
			return !searchedRecipes.includes(recipe);
		})

		stringIngredientSearch(this.state.searchValue, notAlreadyChosen).forEach((recipe) => {
			searchedRecipes.push(recipe)
		})

		if (searchedRecipes === []) {
			searchedRecipes = this.state.allRecipes;
		}

		if (this.state.myStashChecked) {
			searchedRecipes = myStashSearch(searchedRecipes, this.state.myStash)
		}

		if (this.state.maxPrice !== 0 && this.state.maxPrice !== '') {
			searchedRecipes = betweenPricesSearch(this.state.minPrice, this.state.maxPrice, searchedRecipes);
		}

		if (this.state.categoryID === '1') {
			searchedRecipes.sort(comparePrice)
		} else if (this.state.categoryID === '2') {
			searchedRecipes.sort(compareRating)
		}

		let data = {
			recipes: searchedRecipes
		}

		this.setState(data);
	}

	changeCategory(evt) {
		this.setState({
			categoryID: evt.target.value
		}, () => {
			this.refreshSearch()
		})
	}

	onStashChange() {
		this.setState({
			myStashChecked: !this.state.myStashChecked
		}, () => {
			this.refreshSearch()
		})
	}


	toggleModal() {
		this.setState(prevState => ({
			showModal: !prevState.showModal
		}), () => {
			console.log(this.state.showModal)
		})
	}

	activePopup(id) {
		console.log("Kører active popup: " + id)
		this.setState({ selectedRecipeID: id }, () => {
			try {
				var popup = document.getElementById("popupRecipeModal1")
				console.log(popup)

				var myModal2 = new Modal(popup, {});
				console.log(myModal2);

				myModal2.show()
			} catch (e) {
				console.log(e);
				console.log("Test")
			}
		})
	}


	//This is the render function. This is where the
	//html is.
	render() {
		return (
			<div className="HomePage">
				<Carousel recipes={this.state.allRecipes} />
				<div class="container searchbar">
					<div class="row height d-flex justify-content-center align-items-center">
						<div class="col-md-6">
							<div class="form shadow-rounded"><i class="fa fa-search"></i>
								<input type="text" class="form-control form-input" placeholder="Search recipe..." onChange={this.state.recipes ? (evt) => { this.setSearchValue(evt) } : ''} />
							</div>
						</div>
					</div>
				</div>
				<div class="page-spacing center">
					<div id="searchAndFilterOptions">
						<div class="row bd-example">

							<div class="col-5 btn-group">
								<div class="form-check-group">
									<label class="form-check-label" for="flexCheckDefault" >
										My Stash
										<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={this.state.myStashChecked} onChange={() => { this.onStashChange() }} />
									</label>
								</div>
								<button type="button" id="filterButton" class="btn dropdown-toggle" data-bs-toggle="dropdown"
									aria-expanded="false">Price</button>
								<ul class="dropdown-menu" id="price-dropdown">
									<li>
										<h6>Price range</h6>
										<div class="max-min-price">
											<div class="input-group">
												<span class="input-group-text" id="min-input-left">Min</span>
												<input type="number" class="form-control" id="min-input-right"
													step="10.00" min="00.00" placeholder="DKK" aria-label="Minimum price"
													aria-describedby="basic-addon1" onChange={(evt) => { this.setMinPriceValue(evt) }} />
											</div>
											<div class="input-group max-min-margin">
												<span class="input-group-text" id="max-input-left">Max</span>
												<input type="number" class="form-control" id="max-input-right" step="10.00"
													min="00.00" placeholder="DKK" aria-label="Maximum price"
													aria-describedby="basic-addon2" onChange={(evt) => { this.setMaxPriceValue(evt) }} />
											</div>
										</div>
									</li>
								</ul>
							</div>
							<div class="col-3 btn-group" role="group" aria-label="Basic radio toggle button group">
								<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" value='1' onClick={(evt) => { this.changeCategory(evt) }} checked={this.state.categoryID === '1' ? true : false} />
								<label class="btn btn-outline-primary" for="btnradio1">Price</label>
								<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" value='2' onClick={(evt) => { this.changeCategory(evt) }} checked={this.state.categoryID === '2' ? true : false} />
								<label class="btn btn-outline-primary" for="btnradio2">Rating</label>
							</div>
						</div>
					</div>
					<div class="content center">
						<div class="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1">
							{
								this.state.recipes.map((recipe) => {
									return (
										<RecipeCard recipes={this.state.recipes} recipe={recipe} onSelectCard={(id) => this.activePopup(id)} updateShoppingList={() => this.props.updateShoppingList()} />
									)
								})
							}
						</div>
						<div class="modal fade" id="popupRecipeModal1" aria-labelledby="exampleModalLabel" aria-hidden="true">
							{this.state.allRecipes !== [] && this.state.selectedRecipeID ? <PopupRecipe items={this.state.allRecipes} selectedItem={this.state.selectedRecipeID} /> : ""}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

/**
 * Given a search value and a list of recipes, return a list of recipes that contain the search value
 * in the title
 * @param searchValue - The string that you want to search for.
 * @param recipes - an array of recipes
 * @returns An array of recipes that match the search value.
 */
function stringRecipeSearch(searchValue, recipes) {
	let returnRecipes = [];
	recipes.forEach((recipe) => {
		let recipeTitleLowerCase = recipe.recipe.title.toLowerCase();
		if (recipeTitleLowerCase.includes(searchValue.toLowerCase())) {
			returnRecipes.push(recipe);
		}
	})
	return returnRecipes;
}

/**
 * Given a search value and a list of recipes, return a list of recipes that include the search value
 * in their ingredients
 * @param searchValue - The string that you want to search for in the recipe ingredients.
 * @param recipes - an array of recipes
 * @returns An array of recipes that contain the search value in their ingredients.
 */
function stringIngredientSearch(searchValue, recipes) {
	let returnRecipes = [];
	recipes.forEach((recipe) => {
		let doesIncludeIngredient = false;
		recipe.ingredients.forEach((ingredient) => {
			let ingredientTitleLowerCase = ingredient.title.toLowerCase();
			if (ingredientTitleLowerCase.includes(searchValue.toLowerCase())) {
				doesIncludeIngredient = true;
			}
		})
		if (doesIncludeIngredient) {
			returnRecipes.push(recipe);
		}
	})
	return returnRecipes;
}

/**
 * Given a list of recipes, return a list of recipes that fall between a min and max price
 * @param minPrice - The minimum price you want to pay for your recipe.
 * @param maxPrice - The maximum price you want to pay for your recipe.
 * @param recipes - an array of recipes
 * @returns An array of recipes.
 */
function betweenPricesSearch(minPrice, maxPrice, recipes) {
	let returnRecipe = [];
	recipes.forEach((recipe) => {
		let price = 0;

		recipe.ingredients.forEach((ingredient) => {
			price += ingredient.price;
		})

		if (price >= minPrice && price <= maxPrice) {
			returnRecipe.push(recipe);
		}
	})
	return returnRecipe;
}

/**
 * Given two objects, return the difference between the price of the first and the price of the second
 * @param a - The first item to compare.
 * @param b - The recipe to compare against.
 * @returns The function is being called with the arguments a and b. The function returns
 * a.recipe.price - b.recipe.price.
 */
function comparePrice(a, b) {
	return a.recipe.price - b.recipe.price;
}

/**
 * The function takes two objects, compares their rating properties, and returns the difference between
 * the two.
 * @param a - The first object to be compared.
 * @param b - the second object to compare
 * @returns the difference between the two values.
 */
function compareRating(a, b) {
	return a.recipe.rating - b.recipe.rating;
}

function myStashSearch(recipes, myStash) {
	let tempRecipes = JSON.parse(JSON.stringify(recipes))
	let updatedRecipes = []
	tempRecipes.forEach((recipe) => {
		let tempRecipe = recipe;
		let updatedIngredients = [];

		tempRecipe.ingredients.forEach((ingredient) => {
			let isSimilar = false;
			myStash.forEach((stashIngredient) => {
				let similarity = compareTwoStrings(ingredient.title, stashIngredient.title);

				if (similarity >= 0.5 && isSimilar === false) {
					isSimilar = true;
				} else if (similarity <= 0.5 && isSimilar === false) {
					isSimilar = false;
				}
			})
			if (!isSimilar) {
				updatedIngredients.push(ingredient);
			}
		})
		let newPrice = 0;

		updatedIngredients.forEach((ingredient) => {
			newPrice += ingredient.price;
		})

		tempRecipe.ingredients = updatedIngredients;
		tempRecipe.recipe.price = Number(newPrice.toFixed(2));

		updatedRecipes.push(tempRecipe)
	})

	return updatedRecipes;
}

export default HomePage;
