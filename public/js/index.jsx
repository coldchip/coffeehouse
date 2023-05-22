import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

import css from "./assets/style/index.scss";
import cssf from "./CSSFormat";

function CoffeeHouse(props) {
	useEffect(() => {
		document.title = "CoffeeHouse Login";
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<h1>Im fat nibba</h1>} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="*" element={<h1>404</h1>} />
			</Routes>
		</BrowserRouter>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CoffeeHouse />);