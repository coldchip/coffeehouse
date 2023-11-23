import React, { useState, useEffect, useCallback } from 'react';
import fetch from './../fetch.js';
import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function ScoreBoard(props) {
	const [score, setScore] = useState([]);

	var a = useCallback(() => {
		document.title = "CoffeeHouse - ScoreBoard";

		fetch(`/getscore`, {
			method: "GET"
		}).then((response) => {
			var { status, body } = response;

			setScore(body);
		}).catch((response) => {
			var { status, body } = response;
		}).finally(() => {
		});
	}, []);

	useEffect(() => {
		a();
		setInterval(a, 500);
	}, []);

	return (
		<div className={cssf(css, "scoreboard")}>
			<table className={cssf(css, "table")}>
				<tr className={cssf(css, "title")}>
					<th>Rank</th>
					<th>User</th>
					<th>Score</th>
				</tr>
				{
				score.slice() // create a shallow copy of the array to avoid mutating the original
					.sort((a, b) => b.score - a.score) // sort by score in descending order
					.map((row, index) => (
						<tr key={index} className={cssf(css, "lineText")}>
							<td>{index + 1}.</td>
							<td>{row.user.username}</td>
							<td>{row.score}</td>
						</tr>
					))
				}
			</table>
		</div>
	);
}

document.body.style.backgroundColor = '#556B2F';

export default ScoreBoard;
