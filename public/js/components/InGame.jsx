import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function About(props) {
	useEffect(() => {
		document.title = "CoffeeHouse - Game Session";
	}, []);

	function back() {
		window.location.href = "/mainmenu";
	}

	return (
		<div className={cssf(css, "ingame")}>
			<button className={cssf(css, "text mt-2")} onClick={() => {
				back();
			}}>Return to Main Menu</button>
		</div>
	);
}

export default About;