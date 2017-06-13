import React from 'react';
import Header from './Header';
import Banner from './Banner';
import SearchBar from './SearchBar';
import SearchResultDisplay from './SearchResults';

import axios from 'axios';

class App extends React.Component {
	state = {
		test: 'We have state!',
		didSearch: false
	};
	componentDidMount() {
		//ajax calls, listeners
	}
	componentWillUnmount() {
		//clean up timers & listeners
	}

	onSearch(data){
		console.log("Search triggered");
		this.setState({data: false, didSearch: true});
		let that = this;
		axios.get('/api/search', {
			params: data
		}).then(function(response){
			console.log(response.status);
			if (response.status === 200){
				console.log("got data");
				console.log(response);
				console.log(response.data);
				that.setState({data: response.data});
			} else {
				console.log("something went wrong...");
				that.setState({displayError: "something went wrong!"});
			}
		});
	}

	render() {
		let errorMsg = this.state.displayError? <p>{this.state.displayError}</p> : "";
		return (
			<div className="App">
				<Header title="Capstone"/>
				<Banner img="images/stefancik-md.jpg">
					<h1 className="text-center">Are <strong>you</strong> in demand?</h1>
					<SearchBar onSearch={this.onSearch.bind(this)}/>
				</Banner>
				{errorMsg}
				{this.state.didSearch? <SearchResultDisplay {...this.state.data}/> :''}
				<div className="upArrow"></div>
				<div className="about">
					<h2>Learn what skills employers want most.</h2>
					<p>You've got some serious skills. But are they what employers want? Show employers your strengths by anticipating
					the skills they are looking for, before they ask! Rather than slogging through job posts to guess at trends, use Capstone
					to compare your skills to real job post data in seconds. Learn which of your skills are getting the most buzz, compare your 
					skills across different cities and job titles, and jump straight to the job posts that best suit your personal strengths.</p>
				</div>
			</div>
		);
	}
};

export default App;