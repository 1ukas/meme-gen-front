import React, { Component } from 'react';

class Footer extends Component {
	render() {
		return (
			<footer className="site-footer my-3 justify-content-center text-center">
				<section>
					<p>Meme generator by <a href="https://github.com/fanta232">fanta232</a></p>
					<p>Open-sourced on <a href="https://github.com/fanta232/meme-gen-front"><i className="fab fa-github"></i></a></p>
				</section>
			</footer>
		);
	}
}
export default Footer;