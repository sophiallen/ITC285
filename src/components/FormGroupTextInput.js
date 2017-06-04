import React from 'react';
import PropTypes from 'prop-types';


class TextInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e){
		this.props.update(this.props.name, e.target.value);
	}

	render() {
		return (
			<div className="form-group">
				<label className="sr-only" htmlFor={this.props.name}>{this.props.label}</label>
				<input type="text" id={this.props.name}
				 className="form-content"
				  placeholder={this.props.placeholder}
				  onChange={this.handleChange}></input>
			</div>
		);
	}
}

module.exports.TextInput = TextInput;