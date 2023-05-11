const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const sharp = require('sharp');
const express = require('express');
const bodyParser = require("body-parser");
const compression = require('compression');
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
require('dotenv').config()

const ssoRoute = require("./routes/sso");

const random = require("./utils/random");

const queue = require("./queue");

const db = require("./models");
const User = db.user;
const Token = db.token;

var app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));

let count = 0;

app.use((req, res, next) =>  {
	res.header("Server", "ColdChip");
	res.header("ChipDrive-Request-ID", String(count).padStart(16, '0'));
	console.log(`[${chalk.blue(new Date().toUTCString())}] ${chalk.yellow(req.method.padEnd(6))} ${chalk.green(req.path)}`);
	count++;
	next();
});

app.set('x-powered-by', false);

const port = process.env.PORT || 5001;

(async function() {
	console.log(chalk.yellow("ChipDrive Server"));
	try {
		if(!fs.existsSync("database")){
			fs.mkdirSync("database");
		}

		await db.sequelize.authenticate();
		await db.sequelize.sync();

		if(process.env.username && process.env.password) {
			let user = await User.findOrCreate({
				where: {
					username: process.env.username
				},
				defaults: {
					firstname: "ChipDrive",
					lastname: "Admin",
					username: process.env.username,
					password: process.env.password,
					admin: true,
					quota: 1024 * 1024 * 100
				}
			});

			/*
				users can't delete the root folder
			*/

			let drives = ["My Drive #1", "My Drive #2", "My Drive #3", "My Drive #4", "My Drive #5"];

			for(let name of drives) {
				await Node.findOrCreate({
					where: {
						id: md5(user[0].id + name),
						userId: user[0].id
					},
					defaults: {
						type: 2, 
						name: name, 
						id: md5(user[0].id + name), 
						parent: null,
						size: 0,
						root: true,
						userId: user[0].id
					}
				});
			}
		}

		app.use('/api/v2/sso', ssoRoute);

		const compiler = webpack(require("./webpack.config.js"));
		app.use(middleware(compiler, {
			writeToDisk: true
		}));

		mainWorker();
		loginWorker();

		app.listen(port, () =>  {
			if(process.env.NODE_ENV) {
				console.log("Production Mode is Activated");
			}
			console.log(`ChipDrive is running on http://localhost:${port}`);
		});
	} catch(e) {
		console.log(`Unable to start server: ${e.toString()}`);
		process.exit(1);
	}
})();

var image = ["jpg", "png", "jpeg", "bmp", "h264", "gif", "svg"]

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