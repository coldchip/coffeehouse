var { WebSocketServer } = require('ws');
const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const db = require("./models");
const User = db.user;
const Token = db.token;

class Player {
	constructor(connection, token, username) {
		this.connection = connection;
		this.token = token;
		this.username = username;
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
	}
}

function calibrate(data) {
	data.Y  -= 0.8;
	data.RY -= 180.0;
	return data;
}

function broadcast(server, except, data) {
	server.clients.forEach((client) => {
		if (client !== except) {
			client.send(JSON.stringify(data));
		}
	});
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function onSetPos(player, x, y, z) {
	player.x = x;
	player.y = y;
	player.z = z;
	player.connection.send(JSON.stringify({
		Type: "OnSetPos",
		X: player.x,
		Y: player.y,
		Z: player.z
	}));
}

var players = [];

router.get('/prank', async (req, res) => {

	if(players.length > 0) {
		onSetPos(players[0], players[0].x, players[0].y + 10, players[0].z);
		res.status(200).json({
			success: true
		});
	} else {
			res.status(404).json({
			success: false
		});
	}
});

function GameServer(multiplexer) {
	const server = new WebSocketServer({ server: multiplexer });

	setInterval(() => {
		let printTable = [];

		for(let player of players) {
			let row = Object.assign({}, player);
			row.token = "***REDACTED***";
			row.x = parseFloat(row.x.toFixed(4));
			row.y = parseFloat(row.y.toFixed(4));
			row.z = parseFloat(row.z.toFixed(4));
			printTable.push(row);
		}
		console.log(`Players online: ${chalk.blue(players.length)}`);
		console.table(printTable);
	}, 1000);

	server.on('connection', (client) => {
		console.log("CLIENT CONNECTED");

		client.on('close', (data) => {
			for(let player of players) {
				if(player.connection === client) {
					removeItemOnce(players, player);
					broadcast(server, client, {
						Type: "OnRemove",
						Token: player.token
					});
				}
			}
		});

		client.on('message', (data) => {
			try {
				data = JSON.parse(data);
				if(data.Type == "OnAuth") {
					Token.findOne({
						where: {
							id: data.Token
						},
						include: [{
							model: User
						}]
					}).then((result) => {
						var username = result.user.username;
						var p = new Player(client, data.Token, username);

						for(let player of players) {
							p.connection.send(JSON.stringify({
								Type: "OnSpawn",
								Token: player.token,
								Username: player.username
							}));
						}

						players.push(p);

						broadcast(server, client, {
							Type: "OnSpawn",
							Token: p.token,
							Username: username
						});
					}).catch(() => {
						//console.log("hacker detected");
					});
				}
				if(data.Type == "OnMove") {
					for(let player of players) {
						if(player.connection === client) {
							data = calibrate(data);

							var x = data.X;
							var y = data.Y;
							var z = data.Z;
							var rx = data.RX;
							var ry = data.RY;
							var rz = data.RZ;

							player.x = x;
							player.y = y;
							player.z = z;

							broadcast(server, client, {
								Type: "OnMove",
								X: x, Y: y, Z: z,
								RX: rx, RY: ry, RZ: rz,
								Token: data.Token
							});
						}
					}
				}
			} catch(e) {}
		});
	});
}

module.exports = {GameServer, GameServerRoute: router};