//File: controllers/tvshows.js
var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var Project = mongoose.model('Project');


//GET 
exports.findAllProjects = function(req, res) {
	Project.find(function(err, projects) {
    	if(err) res.send(500, err.message);
		res.status(200).jsonp(projects);
	});
};