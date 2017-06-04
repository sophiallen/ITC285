import React from 'react';
import {TextInput} from './FormGroupTextInput';


class SearchBar extends React.Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	};

	state = {
		city: '',
		keywords: '',
		jobTitle: ''
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log("state: ");
		console.dir(this.state);
		this.props.onSearch(this.state);
	};

	handleChange(name, value){
		this.setState({[name]: value});
	}

	render() {
		return (
			<form className="form-inline searchBar" >
				<TextInput label="City" name="city" placeholder="Enter a City" update={this.handleChange}/>
				<TextInput label="Job Title" name="jobTitle" placeholder="Enter a Job Title" update={this.handleChange}/>
				<TextInput label="Job Skills" name="keywords" placeholder="Enter up to five job skills" update={this.handleChange}/>
			    <button className="btn" onClick={this.handleSubmit}>Search!</button>
			</form>)
	}
}

export default SearchBar;