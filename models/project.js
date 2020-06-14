exports = module.exports = function(app, mongoose) {

	var projectSchema = new mongoose.Schema({
		nombre: 		{ type: String },
		nombreDis: { type: String },
		packaging: { type: String },
		material: { type: String },
		impresor: { type: String },
		tipoArchivo: { type: String },
		fecha: { type: String },
		cliente: { type: String },
		clienteNombre: { type: String },
		artwork: { type: String },
		informe: { type: String },
		contacto: { type: String },
		estado: { type: String },
		archivos: { type: Array },
		preview: { type: String },
	});

	mongoose.model('Project', projectSchema);

};
