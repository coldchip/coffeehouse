var { WebSocketServer } = require('ws');

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

function GameServer(multiplexer) {
	var px;
	var py;
	var pz;

	var dx;
	var dy;
	var dz;

	const server = new WebSocketServer({ server: multiplexer });

	var players = [];

	server.on('connection', (client) => {
		console.log("CLIENT CONNECTED");

		client.x = 0;
		client.y = 0;
		client.z = 0;

		broadcast(server, client, JSON.stringify({
			"type": "OnSpawn"
		}));

		client.on('message', (data) => {

			data = JSON.parse(data);
			data = calibrate(data);

			var x = data.X;
			var y = data.Y;
			var z = data.Z;
			var rx = data.RX;
			var ry = data.RY;
			var rz = data.RZ;

			var udx = data.DX;
			var udy = data.DY;
			var udz = data.DZ;

			var playerUpdate = false;
			var dogUpdate = false;

			if(x != client.x || y != client.y || z != client.z) {
				client.x = x;
				client.y = y;
				client.z = z;
				playerUpdate = true;
			}

			// chain

			if((dx != udx || dy != udy || dz != udz) && playerUpdate === true) {
				dx = udx;
				dy = udy;
				dz = udz;
				dogUpdate = true;
			}

			broadcast(server, client, {
				X: x, Y: y, Z: z,
				RX: rx, RY: ry, RZ: rz,
				DX: dx, DY: dy, DZ: dz,
				UpdateDog: dogUpdate
			});
		});
	});
}

module.exports = GameServer;