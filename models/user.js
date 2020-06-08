exports = module.exports = function(app, mongoose) {

	var userSchema = new mongoose.Schema({
		nombre: 		{ type: String },
		apellidos: 	{ type: String },
		direccion: 	{ type: String },
		empresa:  	{ type: String },
		email: 	{ type: String, unique: true },
		telefono: {type: String},
		pass: 	{ type: String },
		fechaIngreso: { type: Date },
		admin: { type: Boolean}
	});

	mongoose.model('User', userSchema);

};
