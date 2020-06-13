//File: controllers/tvshows.js
var mongoose = require('mongoose');
var User = mongoose.model('User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.addProject = function(req, res) {
	console.log(req.body);
	console.log(req);
	res.status(500).send("Error creating user");
};


