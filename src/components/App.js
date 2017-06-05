import React from 'react';
import Header from './Header';
import Banner from './Banner';
import SearchBar from './SearchBar';

import axios from 'axios';

class App extends React.Component {
	state = {
		test: 'We have state!',
		searching: false
	};
	componentDidMount() {
		//ajax calls, listeners
	}
	componentWillUnmount() {
		//clean up timers & listeners
	}

	onSearch(data){
		console.log("Search triggered");
		this.setState({searching: true});
		let that = this;
		axios.get('/api/search', {
			params: data
		}).then(function(response){
			that.setState({
				data: data,
				searching: false});
		});
	}

	render() {
		let childElement = "";
		if (this.state.searching) {
			childElement = <p>Spinner!</p>;
		} else if (this.state.data){
			childElement = <p>Data!</p>;
		} else {
			childElement = <p>About Us</p>;
		}
		return (
			<div className="App">
				<Header title="Capstone"/>
				<Banner img="images/stefancik-md.jpg">
					<h1 className="text-center">Are <strong>you</strong> in demand?</h1>
					<SearchBar onSearch={this.onSearch.bind(this)}/>
				</Banner>
				{childElement}
				<h2>{this.state.test}</h2>
				<p>Details about the subsection. So many details!</p>
			</div>
		);
	}
};

export default App;