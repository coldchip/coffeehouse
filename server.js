/*
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 
sorry for using javascript. sorry for using javascript. sorry for using javascript. 

- ryan
*/

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const sharp = require('sharp');
const history = require("connect-history-api-fallback");
const express = require('express');
const bodyParser = require("body-parser");
const compression = require('compression');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
require('dotenv').config();
const http = require('http');
const gameserver = require("./gameserver");

const ssoRoute = require("./routes/sso");

const random = require("./utils/random");

const queue = require("./queue");

const db = require("./models");
const User = db.user;
const Token = db.token;

/* -------------- MULTIPLEXING ------------- */

// expressjs is the login server that serves web pages
// websockets is the server that handle player movements

// enables expressjs and websockets to work together on the same port
// https://en.wikipedia.org/wiki/Port_(computer_networking)

var app = express();
var server = http.createServer(app);
gameserver(server);

/* ----------------------------------------- */




/* ------ HTTP COMPRESSION & ENCODING ------ */

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));

/* ----------------------------------------- */






/* ---------------- LOGGING ---------------- */
let count = 0;

app.use((req, res, next) =>  {
	res.header("Server", "ColdChip");
	res.header("ChipDrive-Request-ID", String(count).padStart(16, '0'));
	console.log(`[${chalk.blue(new Date().toUTCString())}] ${chalk.yellow(req.method.padEnd(6))} ${chalk.green(req.path)}`);
	count++;
	next();
});

/* ----------------------------------------- */

app.set('x-powered-by', false);

const port = process.env.PORT || 5001;

(async function() {
	console.log(chalk.yellow("Coffeehouse Server"));
	try {
		if(!fs.existsSync("database")){
			fs.mkdirSync("database");
		}

		await db.sequelize.authenticate();
		await db.sequelize.sync();

		await User.findOrCreate({
			where: {
				username: process.env.username
			},
			defaults: {
				firstname: "NYP",
				lastname: "Admin",
				username: "ryan",
				password: "e10adc3949ba59abbe56e057f20f883e",
				admin: true,
				quota: 1024 * 1024 * 100
			}
		});

		app.use('/api/v2/sso', ssoRoute);

		const compiler = webpack(require("./webpack.config.js"));
		app.use(history());
		app.use(middleware(compiler, {
			writeToDisk: true
		}));

		mainWorker();
		loginWorker();

		server.listen(port, () =>  {
			if(process.env.NODE_ENV) {
				console.log("Production Mode is Activated");
			}
			console.log(`CoffeeHouse is running on http://localhost:${port}`);
		});
	} catch(e) {
		console.log(`Unable to start server: ${e.toString()}`);
		process.exit(1);
	}
})();

/* ---------------- QUEUES ---------------- */

// https://www.javatpoint.com/race-condition-in-operating-system#:~:text=The%20Race%20Condition%20usually%20occurs,the%20case%20of%20processes%20also.

async function mainWorker() {
	if(queue.length("main") > 0) {
		console.log(chalk.yellow(`Dequeuing main tasks, ${queue.length("main")} in queue`));
		let task = queue.dequeue("main");
		await task();
	}

	setTimeout(mainWorker, 50);
}

async function loginWorker() {
	if(queue.length("login") > 0) {
		console.log(chalk.yellow(`Dequeuing login tasks, ${queue.length("login")} in queue`));
		let task = queue.dequeue("login");
		await task();
	}

	setTimeout(loginWorker, 5000);
}

/* ----------------------------------------- */