import React from 'React';
//import Pie from 'react-pie';



class KeywordsChart extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		let chartData = this.props.data.map( (keyword) => {
			return {text: keyword.term, quantity: keyword.hits};
		});
		chartData.push({text: 'no match', 'quantity': this.props.misses});

		let	colors = ['#D7263D', '#F46036', '#2E294E', '#1B998B', '#C5D86', '#2F6690'];
		let highlights = ['#E16171', '#F8997F', '#8D8A9E', '#82C7Bf', '#D4E294', '#5481A4'];
		
		return (
			// <Pie colorRange={colors} data={chartData} 
			// width={this.props.width} height={this.props.height} />
		)
	}
}

export default KeywordsChart;