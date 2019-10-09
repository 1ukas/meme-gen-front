import React, { Component } from 'react';

class NavBar extends Component {
	render() {
		return (
			<header id="page-hero" className="site-header mb-4">
				<nav className="site-nav navbar navbar-expand-lg bg-light navbar-light">

					<div className="container-fluid">

						<a className="navbar-brand" href="#page-hero">
							Meme Generator
            </a>

						<button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#site-navbar-toggle"
							aria-controls="#site-navbar-toggle" aria-label="Toggle Navigation">
							<span className="navbar-toggler-icon"></span>
						</button>

						<section className="collapse navbar-collapse" id="site-navbar-toggle">
							<div className="navbar-nav ml-auto">
								<a className="nav-item nav-link" href="#page-hero">Create</a>
								<a className="nav-item nav-link" href="#page-hero">Explore</a>
							</div>
						</section>

					</div>

				</nav>
			</header>
		);
	}
}

export default NavBar;