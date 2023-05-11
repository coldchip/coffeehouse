import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';

import Login from './components/Login.jsx';

import css from "./assets/style/index.scss";
import cssf from "./CSSFormat";

function CoffeeHouse(props) {
	useEffect(() => {
		document.title = "CoffeeHouse Login";
	}, []);

	return (
		<Login />
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CoffeeHouse />);