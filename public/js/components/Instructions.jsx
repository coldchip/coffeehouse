import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function Instructions(props) {
	useEffect(() => {
		document.title = "CoffeeHouse - Instructions";
	}, []);

	function back() {
		window.location.href = "/mainmenu";
	}

	return (
		<div className={cssf(css, "instructions")}>
			<i className={cssf(css, "fa-solid fa-circle-arrow-left")}></i>
			<div className={cssf(css, "wrapper")}>
				<div className={cssf(css, "header-wrapper mb-4")}>
					<i className={cssf(css, "!fas !fa-long-arrow-left back me-3")} onClick={() => {
						back();
					}}></i>
					<h1 className={cssf(css, "title text")}>
						Make a CoffeeHouse Instructions
					</h1>
				</div>
				<p className={cssf(css, "data text mt-4")}>
					The menu order will be shown and based on the menu, follow the ingredients list from the monitor.
					Follow the correct sequence of mixture of ingredients, in order to win. 
					There will be a scoring system that will shows the amount of cups that you did correctly.
					Hope You Enjoy the Coffee Game! 
				</p>
				{/* <button type="button">Back</button> */}
			</div>
		</div>
	);
}

export default Instructions;