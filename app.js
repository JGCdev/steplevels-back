var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    cors            = require("cors"),
    mongoose        = require('mongoose'),
    authorize       = require("./middlewares/auth");
var util = require('util')
var path = require('path')
var fs = require('fs')
var multer = require('multer')({
  dest: 'uploads'
})

const environment = process.env.NODE_ENV || 'production';

// Connection to DB
mongoose.connect("mongodb://localhost:27017/steplevels",{ useUnifiedTopology: true, useNewUrlParser: true}).then( () => {
  console.log('DB Connected!');
}).catch( (err) => {
  console.log(err);
});

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (environment === 'development') {
  app.use(cors());
}

// Import Models and controllers
var userModel    = require('./models/user')(app, mongoose);
var projectModel    = require('./models/project')(app, mongoose);
var UsersCtrl = require('./controllers/user');
var ProjectsCtrl = require('./controllers/project');
var Project = mongoose.model('Project');

// Example Route
var router = express.Router();
router.get('/api/steplevels/', function(req, res) {
  res.send("<h2>Steplevels API Works!</h2>");
});
app.use(router);

// API
var steplevels = express.Router();

// USERS
steplevels.route('/users')
  .get(authorize, UsersCtrl.findAllUsers)
  .post(UsersCtrl.addUser)
  .put(UsersCtrl.updateUser);
  
steplevels.route('/login')
  .post(UsersCtrl.login);

steplevels.route('/users/:id')
  .get(UsersCtrl.findById)
  .delete(authorize, UsersCtrl.deleteUser)

steplevels.route('/users/:email')
  .get(UsersCtrl.findByEmail);

steplevels.route('/projects')
  .get(authorize, ProjectsCtrl.findAllProjects);

steplevels.route('/projects/file/:name')
  .get(authorize, ProjectsCtrl.downloadProject);

steplevels.route('/projects/:id')
  .delete(authorize, ProjectsCtrl.deleteProject)


router.post('/api/steplevels/projects/', [multer.single('file')], function (req, res, next) {
  console.log('entra: ', req.file);
    return storeWithOriginalName(req.file)
      .then(encodeURIComponent)
      .then(encoded => {
          const pr = JSON.parse(req.body.datos);
          const myProject = new Project({
              nombre:       pr.nombre,
              nombreDis:    pr.nombreDis,
              packaging:    pr.packaging,
              material:     pr.material,
              impresor:     pr.impresor,
              tipoarchivo:  pr.tipoArchivo,
              preview:      pr.preview,
              cliente:      pr.cliente,
              clienteNombre: pr.clienteNombre,
              artwork:      pr.artwork,
              fecha:        pr.fecha,
              informe:      pr.informe,
              contacto:     pr.contacto,
              estado:       pr.estado,
              preview: '',
              archivos: [
                {
                  nombre: encoded,
                  preview: '',
                  fechaSubida: new Date(),
                }
              ]
          });

          myProject.save().then((response) => {
            res.status(201).json({
              message: "Project successfully created!",
              result: response
            });
          }).catch(error => {
            res.status(500).json({
              code: error.code
            });
          });
      })
      .catch(next)
  })
  
function storeWithOriginalName (file) {
  var fullNewPath = path.join(file.destination, file.originalname);
  var rename = util.promisify(fs.rename);

  return rename(file.path, fullNewPath)
    .then(() => {
      return file.originalname
    })
}

app.use('/api/steplevels/', steplevels);

// Start server
app.listen(3001, function() {
  console.log("Node server running on http://localhost:3001");
});
