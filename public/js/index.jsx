import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './components/Login.jsx';
import LoginDev from './components/LoginDev.jsx';
import Register from './components/Register.jsx';
import MainMenu from './components/MainMenu.jsx';
import Instructions from './components/Instructions.jsx';

import css from "./assets/style/index.scss";
import cssf from "./CSSFormat";

function CoffeeHouse(props) {
	useEffect(() => {
		document.title = "CoffeeHouse Login";
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<h1>Homepage</h1>} />
				<Route path="/login" element={<Login />} />
				<Route path="/logindev" element={<LoginDev />} />
				<Route path="/register" element={<Register />} />
				<Route path="/mainmenu" element={<MainMenu />} />
				<Route path="/instructions" element={<Instructions />} />
				<Route path="*" element={<h1>404</h1>} />
			</Routes>
		</BrowserRouter>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CoffeeHouse />);