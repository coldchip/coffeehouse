import React, { useState, useEffect, useContext } from 'react';

import fetch from './../fetch.js';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

import logo from "./../assets/img/logo.png";

function LoginPopup(props) {
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		document.title = "CoffeeHouse - Login";
	}, []);

	var login = (e, username, password) => {
		e.preventDefault();

		setError(null);
		setSuccess(null);
		setLoading(true);
		fetch(`/api/v2/sso/login`, {
			method: "POST",
			body: new URLSearchParams({
				username: username,
				password: password
			}).toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then((response) => {
			var {status, body} = response;

			setSuccess("Login success");

			if(window.vuplex) {
				window.vuplex.postMessage({type: "LOGIN_SUCCESS", token: body.token});
			}
		}).catch((response) => {
			var {status, body} = response;

			setError(body.message);
		}).finally(() => {
			setLoading(false);
		});
	}

	return (
		<div className={cssf(css, "login-popup")}>
			<form className={cssf(css, "login")}>
				<img src={logo} className={cssf(css, "login-logo")}/>

				<h1 className={cssf(css, "login-title text")}>Log in to your account</h1>
				
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
				
				<button type="button" className={cssf(css, `login-submit ${loading ? "submit-loading" : null} text`)} onClick={(e) => {
					login(e, "ryan", "123456");
				}}>
					<span>Login as Ryan</span>
				</button>
				<button type="button" className={cssf(css, `login-submit ${loading ? "submit-loading" : null} text`)} onClick={(e) => {
					login(e, "erik", "123456");
				}}>
					<span>Login as Erik</span>
				</button>

				<button type="button" className={cssf(css, `login-submit ${loading ? "submit-loading" : null} text`)} onClick={(e) => {
					login(e, "keatkean", "123456");
				}}>
					<span>Login as Mr. Lee</span>
				</button>
				
				<button type="button" className={cssf(css, `login-submit ${loading ? "submit-loading" : null} text`)} onClick={(e) => {
					login(e, "ivan", "123456");
				}}>
					<span>Login as Ivan</span>
				</button>
			</form>
		</div>
	);
}

export default LoginPopup;