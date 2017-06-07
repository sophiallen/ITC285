import React from 'react';

class SearchResultDisplay extends React.Component {
	constructor(props){
		super(props);
	}

	state = {
		displayNum: 5
	}

	renderSpinner() {
		return (
			<div className="spinner">
			  <div className="bounce1"></div>
			  <div className="bounce2"></div>
			  <div className="bounce3"></div>
			</div>
		);
	}

	displayCounts(){
		let terms = Object.keys(this.props.data.counts);
		let counts = Object.values(this.props.data.counts);
		let hits = this.props.data.hits;
		return terms.map((term, i)=>{
			let percent = Math.round( (hits[term] / this.props.data.posts) * 100);
			return <p key={i}><strong>{term}:</strong> {counts[i]} mentions, {percent}% of posts.</p>
		});
	}

	sortJobs(){
		let keys = Object.keys(this.props.data.rankings);
		let rankings = this.props.data.rankings;

		let sortedJobs = keys.sort((a, b) =>{
			return -1 * (rankings[a].matches-rankings[b].matches);
		});

		return sortedJobs;
	}

	displayJobs(){

		let rankings = this.props.data.rankings;
		let top = this.sortJobs().slice(0, this.state.displayNum);

		return top.map((title) => {
			return <p key={title}><a href={rankings[title].url}>{title}</a>: {rankings[title].matches} matches</p>
		});
	}

	showMore(){
		let num = this.state.displayNum + 5;
		this.setState({displayNum: num});
	}

	renderData(){
		let moreBtn = '';
		let maxMatches = Object.keys(this.props.data.rankings).length;
		if (this.state.displayNum < maxMatches){
			moreBtn = <button onClick={this.showMore.bind(this)}>Shore me more!</button>;
		}
		return (
			<div className="result-display">
				<h2>We found {this.props.data.posts} posts! </h2>
				<h3>Of the posts we found: </h3>
				{this.displayCounts()}
				<h3>These were your top matches:</h3>
				{this.displayJobs()}
				{moreBtn}				
			</div>
		)
	}

	render(){
		if (this.props.data){
			return this.renderData();
		} else {
			return this.renderSpinner();
		}
	}
}

export default SearchResultDisplay;