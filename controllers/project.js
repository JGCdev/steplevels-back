//File: controllers/tvshows.js
var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var Project = mongoose.model('Project');
const fs = require("fs")

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

exports.deleteFile = function(req, res) {

	Project.findById(req.body.idProyecto, (err, response) => {
		if (err) res.sendStatus(500);
		const myQuery = { _id : response._id };
		const newFiles = response.archivos.filter(archivo => {
			return archivo.nombre != req.body.nombre
		});
		const newFilesFormatted = {
			archivos: newFiles
		}
		Project.updateOne(myQuery, newFilesFormatted, (error, results) => {
			if (error) {
			  res.status(500).json({
				code: error.code
			  });
			} else if (results) {
			  deleteFile(req.body.nombre);
			  res.status(201).json({
				message: "Archivo borrado!",
			  });
			}
		});      
  
	})

};

exports.downloadFile = function(req, res) {
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

function deleteFile(file) {
	const pathToFile = 'uploads/' + file;
 
	fs.unlink(pathToFile, function(err) {
	  if (err) {
		throw err
	  } else {
		console.log("Successfully deleted the file.")
	  }
	}) 
}
