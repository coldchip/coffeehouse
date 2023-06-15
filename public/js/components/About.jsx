import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function About(props) {
	useEffect(() => {
		document.title = "CoffeeHouse - About";
	}, []);

	return (
		<div className={cssf(css, "about")}>
			<i className={cssf(css, "fa-solid fa-circle-arrow-left")}></i>
			<div className={cssf(css, "wrapper")}>
				<h1 className={cssf(css, "title text")}>
					CoffeeHouse About
				</h1>
				<p className={cssf(css, "data text mt-4")}>
					Welcome to CoffeeHouse, an immersive Unity-based game where players can step into a virtual world of coffee and socializing. 
					CoffeeHouse implements the multiplayer mode in a game which can help leverage the user experience and allow the users to socialize.

				</p>
			</div>
		</div>
	);
}

export default About;