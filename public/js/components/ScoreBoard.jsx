import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function ScoreBoard(props) {
	const [score, setScore] = useState([]);

	useEffect(() => {
		document.title = "CoffeeHouse - ScoreBoard";


		fetch(`/getscore`, {
			method: "GET"
		}).then((response) => {
			var {status, body} = response;

			setScore(body);
		}).catch((response) => {
			var {status, body} = response;

		}).finally(() => {
		});
	}, []);

	return (
		<div className={cssf(css, "scoreboard")}>
			<table>
				<tr>
					<th>Score</th>
					<th>User</th>
				</tr>
				{
					score.map(((row) => {
						return (
							<tr>
								<td>{row.score}</td>
								<td>{row.user.username}</td>
							</tr>
						)
					}))
				}
			</table>
		</div>
	);
}

export default ScoreBoard;