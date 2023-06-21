import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function About(props) {
	useEffect(() => {
		document.title = "CoffeeHouse - About";
	}, []);

	function back() {
		window.location.href = "/mainmenu";
	}

	return (
		<div className={cssf(css, "about")}>
			<div className={cssf(css, "wrapper")}>
				<div className={cssf(css, "header-wrapper mb-4")}>
					<i className={cssf(css, "!fas !fa-long-arrow-left back me-3")} onClick={() => {
						back();
					}}></i>
					<h1 className={cssf(css, "title text")}>
						CoffeeHouse About
					</h1>
				</div>
				<p className={cssf(css, "data text mt-4")}>
					Welcome to CoffeeHouse, an immersive Unity-based game where players can step into a virtual world of coffee and socializing. 
					CoffeeHouse implements the multiplayer mode in a game which can help leverage the user experience and allow the users to socialize.

				</p>
			</div>
		</div>
	);
}

export default About;