import React from 'react';

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class Carousel extends React.Component {
	//This is the render function. This is where the
	//html is.
	render() {
		return (
			<div className="Carousel">
				{this.props.recipes.length !== 0 ?

					<div id="homepage-carousel" class="carousel slide center" data-bs-ride="carousel">
						<div class="carousel-indicators">
							<button
								type="button"
								data-bs-target="#homepage-carousel"
								data-bs-slide-to="0"
								class="active"
								aria-current="true"
								aria-label="Slide 1"
							></button>
							<button
								type="button"
								data-bs-target="#homepage-carousel"
								data-bs-slide-to="1"
								aria-label="Slide 2"
							></button>
							<button
								type="button"
								data-bs-target="#homepage-carousel"
								data-bs-slide-to="2"
								aria-label="Slide 3"
							></button>
						</div>
						<div class="carousel-inner">
							<div class="carousel-item carousel-img active">
								<div class="img-gradient img-gradient-black img-gradient-rounded">
									<img
										src={this.props.recipes[0].recipe.image}
										class="d-block w-100 carousel-img"
										alt="..."
									/>
								</div>
								<div class="carousel-caption d-none d-md-block">
									<div class="container">
										<div class="row">
											<div class="col">
												<h5 class="carousel-name">{this.props.recipes[0].recipe.title}</h5>
												<p class="carousel-description">
													{this.props.recipes[0].recipe.description.length > 80 ? this.props.recipes[0].recipe.description.substring(0, 80) + '...' : this.props.recipes[0].recipe.description}
												</p>
											</div>
											<div class="col">
												<h5 class="carousel-price">{this.props.recipes[0].recipe.price + ' DKK'}</h5>
												<button
													type="button"
													class="btn carousel-add-button shadow-rounded"
												>
													<p class="carousel-add-recipe">
														<i class="fa fa-plus-circle" aria-hidden="true"></i> Add
														recipe
													</p>
												</button>
											</div>
											<div class="w-100"></div>
											<div class="col"></div>
											<div class="col"></div>
										</div>
									</div>
								</div>
							</div>
							<div class="carousel-item carousel-img">
								<div class="img-gradient img-gradient-black img-gradient-rounded">
									<img
										src={this.props.recipes[1].recipe.image}
										class="d-block w-100 carousel-img"
										alt="..."
									/>
								</div>
								<div class="carousel-caption d-none d-md-block">
									<div class="container">
										<div class="row">
											<div class="col">
												<h5 class="carousel-name">{this.props.recipes[1].recipe.title}</h5>
												<p class="carousel-description">
													{this.props.recipes[1].recipe.description.length > 80 ? this.props.recipes[1].recipe.description.substring(0, 80) + '...' : this.props.recipes[1].recipe.description}
												</p>
											</div>
											<div class="col">
												<h5 class="carousel-price">{this.props.recipes[1].recipe.price + ' DKK'}</h5>
												<button
													type="button"
													class="btn carousel-add-button shadow-rounded"
												>
													<p class="carousel-add-recipe">
														<i class="fa fa-plus-circle" aria-hidden="true"></i> Add
														recipe
													</p>
												</button>
											</div>
											<div class="w-100"></div>
											<div class="col"></div>
											<div class="col"></div>
										</div>
									</div>
								</div>
							</div>
							<div class="carousel-item carousel-img">
								<div class="img-gradient img-gradient-black img-gradient-rounded">
									<img
										src={this.props.recipes[2].recipe.image}
										class="d-block w-100 carousel-img"
										alt="..."
									/>
								</div>
								<div class="carousel-caption d-none d-md-block">
									<div class="container">
										<div class="row">
											<div class="col">
												<h5 class="carousel-name">{this.props.recipes[2].recipe.title}</h5>
												<p class="carousel-description">
													{this.props.recipes[2].recipe.description.length > 80 ? this.props.recipes[2].recipe.description.substring(0, 80) + '...' : this.props.recipes[2].recipe.description}
												</p>
											</div>
											<div class="col">
												<h5 class="carousel-price">{this.props.recipes[2].recipe.price + ' DKK'}</h5>
												<button
													type="button"
													class="btn carousel-add-button shadow-rounded"
												>
													<p class="carousel-add-recipe">
														<i class="fa fa-plus-circle" aria-hidden="true"></i> Add
														recipe
													</p>
												</button>
											</div>
											<div class="w-100"></div>
											<div class="col"></div>
											<div class="col"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<button
							class="carousel-control-prev"
							type="button"
							data-bs-target="#homepage-carousel"
							data-bs-slide="prev"
						>
							<span
								class="carousel-control-prev-icon prev-icon"
								aria-hidden="true"
							></span>
							<span class="visually-hidden">Previous</span>
						</button>
						<button
							class="carousel-control-next"
							type="button"
							data-bs-target="#homepage-carousel"
							data-bs-slide="next"
						>
							<span
								class="carousel-control-next-icon next-icon"
								aria-hidden="true"
							></span>
							<span class="visually-hidden">Next</span>
						</button>
					</div>
					: <div> <br /><br /> </div>}
			</div>
		);
	}
}

export default Carousel;
