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

	componentWillReceiveProps(){
		console.log("about to recieve props");
		this.setState({displayNum:5});
	}

	sortKeywords(){
		let sorted = this.props.keywordData.sort( (a,b) => {
			return b.hits - a.hits;
		});

		return sorted;
	}

	displayKeywordData(keyword){
		return (<p key={keyword.term}><strong>{keyword.term.capitalize()}</strong>: {keyword.hits} posts, {keyword.mentions} total mentions</p>);
	}

	displayJobData(){
		let numKeywords = this.props.keywordData.length;

		//sort jobs first by number of keywords matched, then number of mentions. 
		let sorted = this.props.postsData.sort( (a,b) => {
			let aTerms = Object.keys(a.termMatches).length;
			let bTerms = Object.keys(b.termMatches).length;
			if (aTerms === bTerms){
				return b.matches - a.matches;
			} else {
				return bTerms - aTerms;
			}
		});

		return sorted.slice(0, this.state.displayNum).map(this.singleJob);
	}

	singleJob(job, i){
		return (<p key={job.title + "_" + i}><a href={job.url}>{job.title}</a>: matched: {Object.keys(job.termMatches).join(", ")}</p>);
	}

	capitalize(word){
		return word[0].toUpperCase() + word.slice(1);
	}

	showMore(){
		let num = this.state.displayNum + 5;
		this.setState({displayNum: num});
	}

	render(){
		console.log("props: ", this.props);

		if (this.props.keywordData){		
			console.log("props.keywordData: ", this.props.keywordData);
			let keywords = this.sortKeywords(this.props.keywordData);
			let displayMoreBtn = "";
			if (this.state.displayNum < this.props.postsData.length){
				displayMoreBtn =(<button onClick={this.showMore.bind(this)}>Show me more!</button>);
			}


			return (
				<div className="result-display">
					<h2>We found {this.props.postsData.length} results!</h2>
					<h3>Your top skill is: {keywords[0].term.capitalize()}</h3>
					{keywords.map(this.displayKeywordData)}
					<p>{this.props.misses} posts did not mention your skills at all :-/ </p>
					<h3>Here are your top matching jobs:</h3>
					{this.displayJobData()}
					{displayMoreBtn}
				</div>);
		} else {
			return this.renderSpinner();
		}
	}
}

String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
}

export default SearchResultDisplay;