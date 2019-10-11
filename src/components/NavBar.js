import React, { Component } from 'react';
import  { Link } from 'react-router-dom';

class NavBar extends Component {
	render() {
		return (
			<header id="page-hero" className="site-header mb-4">
				<nav className="site-nav navbar navbar-expand-lg bg-light navbar-light">

					<div className="container-fluid">

            <Link className="navbar-brand" to="/">Meme Generator</Link>

						<button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#site-navbar-toggle"
							aria-controls="#site-navbar-toggle" aria-label="Toggle Navigation">
							<span className="navbar-toggler-icon"></span>
						</button>

						<section className="collapse navbar-collapse" id="site-navbar-toggle">
							<div className="navbar-nav ml-auto">
                <Link className="nav-item nav-link" to="/">Create</Link>
                <Link className="nav-item nav-link" to="/explore">Explore</Link>
							</div>
						</section>

					</div>

				</nav>
			</header>
		);
	}
}

export default NavBar;