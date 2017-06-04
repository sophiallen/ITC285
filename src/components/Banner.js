import React from 'react';
import PropTypes from 'prop-types';

const Banner = ({img, children}) => {
	return (
		<div className="banner" style={{backgroundImage: 'url(' + img + ')'}}>
			<div className="overlay">
				{children}
			</div>
		</div>
	);
}

export default Banner;