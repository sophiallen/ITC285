import React from 'react';
import PropTypes from 'prop-types';


const Header = ({ title, subtitle }) => {
	let sub = subtitle? <h2 className="text-center">{subtitle}</h2> : "";
	return (
		<header>
			<h3 className="site-title">
				{title}
			</h3>
			
		</header>
	)
}

Header.propTypes = {
	title: PropTypes.string.isRequired,
	subTitle: PropTypes.string
};

export default Header;