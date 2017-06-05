import React from 'react';

class SearchResultDisplay extends React.Component {
	constructor(props){
		super(props);
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

		return terms.map((term, i)=>{
			return <p key={i}>{term}: {counts[i]}</p>
		});
	}

	renderData(){
		return (
			<div className="result-display">
				<p>Here is the data!:</p>
				{this.displayCounts()}
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