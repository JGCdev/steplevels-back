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

exports.deleteProject = function(req, res) {
	console.log('Entra delete project: ', req.params.id);
	Project.deleteOne({ _id : req.params.id }, (err, results) => {
		if(err) res.send(500, err.message);
		res.status(200).jsonp(results);
	});
};

exports.downloadProject = function(req, res) {
	console.log('Entra download project: ', req.params.name);
	res.download('uploads/' + req.params.name, function (res, err) {
		if (err) {
		  console.log(err);
		  res.sendStatus(500);
		} else {
			console.log('descargamos');
		}
	});
};
