import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Explore from './components/Explore';

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<Route exact path="/" component={Home} />
        <Route path="/explore" component={Explore} />
				<Footer />
			</div>
		);
	}
}
export default App;
