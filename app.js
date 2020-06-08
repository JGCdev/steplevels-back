var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    cors            = require("cors"),
    mongoose        = require('mongoose'),
    authorize       = require("./middlewares/auth");

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
var models    = require('./models/user')(app, mongoose);
var UsersCtrl = require('./controllers/user');

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
  .post(UsersCtrl.addUser);

steplevels.route('/login')
  .post(UsersCtrl.login);

steplevels.route('/users/:id')
  .get(UsersCtrl.findById)
  .delete(authorize, UsersCtrl.deleteUser)

steplevels.route('/users/:email')
  .get(UsersCtrl.findByEmail);

app.use('/api/steplevels/', steplevels);

// Start server
app.listen(3001, function() {
  console.log("Node server running on http://localhost:3001");
});
