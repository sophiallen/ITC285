import React from 'react';
import Header from './Header';
import Banner from './Banner';
import SearchBar from './SearchBar';

import axios from 'axios';

class App extends React.Component {
	state = {test: 'We have state!'};
	componentDidMount() {
		//ajax calls, listeners
	}
	componentWillUnmount() {
		//clean up timers & listeners
	}

	onSearch(data){
		console.log("Search triggered");
		axios.get('/api/search', {
			params: data
		}).then(function(response){
			console.log(response);
		});
	}

	render() {
		return (
			<div className="App">
				<Header title="Capstone"/>
				<Banner img="images/stefancik-md.jpg">
					<h1 className="text-center">Are <strong>you</strong> in demand?</h1>
					<SearchBar onSearch={this.onSearch.bind(this)}/>
				</Banner>
				<h2>{this.state.test}</h2>
				<p>Details about the subsection. So many details!</p>
			</div>
		);
	}
};

export default App;