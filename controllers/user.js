//File: controllers/tvshows.js
var mongoose = require('mongoose');
var User = mongoose.model('User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.findById = function(req, res) {
	// console.log('buscamos user con id: ', req.params.id);
	User.findById(req.params.id, function(err, user) {
		if(err) return res.status(500).send(err.message);
		// console.log('GET /encuestas/' + req.params.id);
		res.status(200).jsonp(user);
	});
};

exports.findByEmail = function(req, res) {
	User.find({email: req.params.email}, function(err, user) {
		if(err) return res.status(500).send(err.message);
		// console.log('GET /usuarios/encuestas/' + req.params.email);
		res.status(200).jsonp(user);
	});
};

exports.addUser = function(req, res) {
	console.log('Entra pet: ', req.body);
	if (req.body.nombre && req.body.telefono && req.body.email && req.body.pass) {
		bcrypt.hash(req.body.pass, 10).then((hash) => {
			const user = new User({
				nombre: 		req.body.nombre,
				apellidos:  	req.body.apellidos,
				empresa: 		req.body.empresa,
				email:  		req.body.email,
				direccion:  	req.body.direccion,
				telefono:  		req.body.telefono,
				fechaIngreso:   req.body.fechaIngreso,
				pass: 		    hash,
				admin: 			req.body.admin
			});
			user.save().then((response) => {
				res.status(201).json({
					message: "User successfully created!",
					result: response
				});
			}).catch(error => {
				res.status(500).json({
					code: error.code
				});
			});
		});

	} else {
		res.status(500).send("Error creating user");
	}
	
};


exports.login = function(req, res) {

	let getUser;
	User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.pass, user.pass);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        if (getUser !== null && getUser !== undefined) {
            let jwtToken = jwt.sign(
                {
                    email: getUser.email,
                    userId: getUser._id
                }, 
                "|1FE1sT0Os|-|0Rt",  
                {
                    expiresIn: "1h"
                }
            );
            res.status(200).json({
                token: jwtToken,
                expiresIn: 3600,
                _id: getUser._id
            });
        }
    })

};

//GET 
exports.findAllUsers = function(req, res) {
	User.find(function(err, users) {
    	if(err) res.send(500, err.message);
		res.status(200).jsonp(users);
	});
};

//GET 
exports.deleteUser = function(req, res) {
	console.log('Entra delete: ', req.params.id);
	User.deleteOne({ _id : req.params.id }, (err, results) => {
		if(err) res.send(500, err.message);
		res.status(200).jsonp(results);
	});
};
