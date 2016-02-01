var express = require('express');
var app = express();
var http = require('http').Server(app);

// any random port. Eventually, we should move this to a config file
var port = 45340;

var bodyParser = require('body-parser');
var cors = require('cors');

var fs = require('fs');

var Character = require('./character.js').Character;

var actions = require('./action-types.js');

app.use(bodyParser.json({'type': '*/*'}));
app.use(cors());


var classes = {};
classes.Character = Character;


var gameData = inflateObjects(JSON.parse(fs.readFileSync('game_data.json')));

app.get('/actions', function(req, res) {
	res.send(JSON.stringify(getActions(), objSerializer));
});

app.post('/act', function(req, res) {
	var action = req.body;
	var char = gameData.characters.PC;
	if (action.type == 'attack') {
		var target = gameData.characters[action.target];
		if (target) {
			var result = char.attack(target);
			var enemyResult = doEnemyTurn();
			res.send(JSON.stringify([result, enemyResult]));
		} else {
			var enemyResult = doEnemyTurn();
			res.send(JSON.stringify(["no result, due to non-existent target", enemyResult]));
		}
	} else {
		res.status(400);
		res.send("unsupported action type");
	}
});

app.get('/state', function(req, res) {
	res.send(JSON.stringify(gameData, objSerializer));
});



function inflateObjects(data) {
	if (typeof data == 'object') {
		for (var key in data) {
			data[key] = inflateObjects(data[key]);
		}
		if (data.is) {
			var newObj = new classes[data.is]();
			for (var key in data) {
				if (key !== 'is') {
					newObj[key] = data[key];
				}
			}
			data = newObj;
		}
	}
	return data;
}

function doEnemyTurn() {
	return gameData.characters.enemy.attack(gameData.characters.PC);
}

function getActions() {
	// we only support 1 attack action per turn
	return [new actions.Standard()];
}

function objSerializer(key, val) {
	var obj = this[key];
	if (obj !== null && typeof obj == 'object' && obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') {
		var newObj = {};
		newObj.is = obj.constructor.name;
		for (var k in obj) {
			newObj[k] = obj[k];
		}
		return newObj;
	}
	return val;
}

http.listen(port, function() {
	console.log("Listening on port " + port);
});
