import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

import logo from "./../assets/img/logo.png";

function RegisterPopup(props) {
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(false);

	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		document.title = "CoffeeHouse - Register";
	}, []);

	var login = (e) => {
		e.preventDefault();

		setError(null);
		setSuccess(null);

		if(password === confirmPassword) {
			setLoading(true);

			fetch(`/api/v2/sso/register`, {
				method: "POST",
				body: new URLSearchParams({
					firstname: firstname,
					lastname: lastname,
					username: username,
					password: password
				}).toString(),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then((response) => {
				var {status, body} = response;

				setSuccess("Register success");
			}).catch((response) => {
				var {status, body} = response;

				setError(body.message);
			}).finally(() => {
				setLoading(false);
			});
		} else {
			setError("Password doesn't match");
		}
	}

	return (
		<div className={cssf(css, "login-popup")}>
			<form className={cssf(css, "login")}>
				<img src={logo} className={cssf(css, "login-logo")}/>

				<h1 className={cssf(css, "login-title text")}>Register your account</h1>
				
				{
					error && 
					<div className={cssf(css, "login-error")}>
						<p className={cssf(css, "login-error-text text")}>{error}</p>
						<i className={cssf(css, "!fa-solid !fa-circle-xmark login-error-cancel")} onClick={() => {
							setError(null);
						}}></i>
					</div>
				}

				{
					success && 
					<div className={cssf(css, "login-success")}>
						<p className={cssf(css, "login-success-text text")}>{success}</p>
						<i className={cssf(css, "!fa-solid !fa-circle-xmark login-success-cancel")} onClick={() => {
							setSuccess(null);
						}}></i>
					</div>
				}
				<div className={cssf(css, "form-group")}>
					<input 
						type="text" 
						autocomplete="none"
						id="firstname" 
						className={cssf(css, `login-input text ${firstname.length > 0 && "active"}`)}
						value={firstname}
						onChange={e => setFirstname(e.target.value)} 
					/>
					<label for="firstname" className={cssf(css, "login-label text")}>
						First Name
					</label>
				</div>
				<div className={cssf(css, "form-group")}>
					<input 
						type="text" 
						autocomplete="none"
						id="lastname" 
						className={cssf(css, `login-input text ${lastname.length > 0 && "active"}`)}
						value={lastname}
						onChange={e => setLastname(e.target.value)} 
					/>
					<label for="lastname" className={cssf(css, "login-label text")}>
						Last Name
					</label>
				</div>
				<div className={cssf(css, "form-group")}>
					<input 
						type="text" 
						autocomplete="none"
						id="username" 
						className={cssf(css, `login-input text ${username.length > 0 && "active"}`)}
						value={username}
						onChange={e => setUsername(e.target.value)} 
					/>
					<label for="username" className={cssf(css, "login-label text")}>
						Username
					</label>
				</div>

				<div className={cssf(css, "form-group")}>
					<input 
						type="password" 
						id="password" 
						className={cssf(css, `login-input text ${password.length > 0 && "active"}`)} 
						value={password}
						onChange={e => setPassword(e.target.value)} 
					/>
					<label for="password" className={cssf(css, "login-label text")}>
						Password: 
					</label>
				</div>

				<div className={cssf(css, "form-group")}>
					<input 
						type="password" 
						id="password" 
						className={cssf(css, `login-input text ${confirmPassword.length > 0 && "active"}`)} 
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)} 
					/>
					<label for="password" className={cssf(css, "login-label text")}>
						Confirm Password: 
					</label>
				</div>
				
				<button type="button" className={cssf(css, `login-submit ${loading ? "submit-loading" : null} text`)} onClick={login}>
					<span>Register</span>
				</button>

				<hr />

				<a href="/login">
					<button type="button" className={cssf(css, `login-submit text mt-3`)}>
						<span>Login</span>
					</button>
				</a>
			</form>
		</div>
	);
}

export default RegisterPopup;