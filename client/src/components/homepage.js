import React from 'react';
import '../stylesheets/homepage.css'

//This is a React class it extends a React component which 
//means that you can use all the code from the React component and it runs the
//standart code in the React component
class HomePage extends React.Component {
  //This is a contructor this function gets called when a object gets created 
  //from the App class. It is often used to set the values in the object
  constructor(recipe) {
    //Super has to be called as the first thing 
    //this says that the code from the React component
    //runs before our code in the contructor
    super();
    
    //Your code here
  }

  //Functions go here

  //This is the render function. This is where the
  //html is.
  render() {
    return (
      <div className="HomePage">
		<div id="homepage-carousel" class="carousel slide center" data-bs-ride="carousel">
			<div class="carousel-indicators">
				<button type="button" data-bs-target="#homepage-carousel" data-bs-slide-to="0" class="active"
					aria-current="true" aria-label="Slide 1"></button>
				<button type="button" data-bs-target="#homepage-carousel" data-bs-slide-to="1"
					aria-label="Slide 2"></button>
				<button type="button" data-bs-target="#homepage-carousel" data-bs-slide-to="2"
					aria-label="Slide 3"></button>
			</div>
			<div class="carousel-inner">
				<div class="carousel-item carousel-img active">
					<div class="img-gradient img-gradient-black img-gradient-rounded">
						<img src="./pictures/pizza.jpg" class="d-block w-100 carousel-img" alt="..." />
					</div>
					<div class="carousel-caption d-none d-md-block">
						<h5>First slide label</h5>
						<p>Some representative placeholder content for the first slide.</p>
					</div>
				</div>
				<div class="carousel-item carousel-img">
					<div class="img-gradient img-gradient-black img-gradient-rounded">
						<img src="./pictures/pasta-med-hvidloeg-og-olie-spaghetti-aglio-e-olio-500x500.jpg"
							class="d-block w-100 carousel-img" alt="..." />
					</div>
					<div class="carousel-caption d-none d-md-block">
						<h5>Second slide label</h5>
						<p>Some representative placeholder content for the second slide.</p>
					</div>
				</div>
				<div class="carousel-item carousel-img">
					<div class="img-gradient img-gradient-black img-gradient-rounded">
						<img src="./pictures/lasagne-1200x900.jpg" class="d-block w-100 carousel-img" alt="..." />
					</div>
					<div class="carousel-caption d-none d-md-block">
						<h5>Third slide label</h5>
						<p>Some representative placeholder content for the third slide.</p>
					</div>
				</div>
			</div>
			<button class="carousel-control-prev" type="button" data-bs-target="#homepage-carousel" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" data-bs-target="#homepage-carousel" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>
		</div>

		<div class="container searchbar">
			<div class="row height d-flex justify-content-center align-items-center">
				<div class="col-md-6">
					<div class="form shadow-rounded"><i class="fa fa-search"></i>
						<input type="text" class="form-control form-input" placeholder="Search recipe..." />
					</div>
				</div>
			</div>
		</div>

		<div class="page-spacing center">
			<div id="searchAndFilterOptions">
				<div class="bd-example">

					<div class="btn-group">
						<div class="form-check-group">
							<label class="form-check-label"  for="flexCheckDefault" >
								My Stash
								<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
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
										<input type="number" class="form-control" id="min-input-right" value="00.00"
											step="10.00" min="00.00" placeholder="DKK" aria-label="Minimum price"
											aria-describedby="basic-addon1" />
									</div>

									<div class="input-group max-min-margin">
										<span class="input-group-text" id="max-input-left">Max</span>
										<input type="number" class="form-control" id="max-input-right" step="10.00"
											min="00.00" placeholder="DKK" aria-label="Maximum price"
											aria-describedby="basic-addon2" />
									</div>
								</div>
							</li>
						</ul>
						<button type="button" id="sortingButton" class="btn dropdown-toggle shadow-sm"
							data-bs-toggle="dropdown" aria-expanded="false">Sort</button>
						<ul class="dropdown-menu">
							<li><a class="dropdown-item" href="#">Price</a></li>
							<li><a class="dropdown-item" href="#">Rating</a></li>
							<li><a class="dropdown-item" href="#">Best match</a></li>
						</ul>
					</div>

				</div>
			</div>
			<div class="content center">
				<div class="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1">
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div class="col mb-4 outer-item-card">
						<a href="#">
							<div class="card card-item h-100">
								<div class="img-gradient img-gradient-black card-img-border">
									<img src="./pictures/pizza.jpg" class="card-img" alt="..." height="175" />
								</div>
								<div class="card-img-overlay">
									<button type="button" class="button-add">
										<h4 class="button-plus">+</h4>
									</button>
									<div class="card-info row">
										<h5 class="card-title col">Name</h5>
										<p class="card-text card-price col">0 DKK</p>
									</div>
								</div>
							</div>
						</a>
					</div>


				</div>
			</div>
		</div>
      </div>
    );
  }
}

export default HomePage;
