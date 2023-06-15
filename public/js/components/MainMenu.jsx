import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function MainMenu(props) {
	useEffect(() => {
		document.title = "CoffeeHouse - Main Menu";
	}, []);

	const [hasStarted, setHasStarted] = useState(false);

	function startGame() {
		if(window.vuplex) {
			window.vuplex.postMessage({type: "START_GAME", token: "0"});
		}
		setHasStarted(true);
	}

	function instructions() {
		window.location.href = "/instructions"
	}

	var renderMainMenu = () => {
		if(hasStarted) {
			return (
				<>
					<button className={cssf(css, "text mt-2")} onClick={() => {
						setHasStarted(false);
					}}>Return to Main Menu</button>
				</>
			);
		} else {
			return (
				<>
					<button className={cssf(css, "text mt-2")} onClick={startGame}>Play</button>

					<button className={cssf(css, "text mt-2")} onClick={() => {}}>About</button>
					<button className={cssf(css, "text mt-2")} onClick={instructions}>How to Play</button>
					<button className={cssf(css, "text mt-2")}>Back</button>
				</>
			);
		}
	}

	return (
		<div className={cssf(css, "mainmenu")}>
			<div className={cssf(css, "wrapper")}>
				{renderMainMenu()}
			</div>
		</div>
	);
}

export default MainMenu;