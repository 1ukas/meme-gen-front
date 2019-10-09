import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<Route exact path="/" component={Home} />
				<Footer />
			</div>
		);
	}
}
export default App;
