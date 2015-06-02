var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');

// Connection to DB
mongoose.connect('mongodb://localhost/proyecto_integrado', function(err, res) {
  if(err) throw err;
  console.log('Conectado a la BBDD');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
// var models     = require('./models/tvshow')(app, mongoose);
// var TVShowCtrl = require('./controllers/tvshows');
// var routes = require('./routes/index');
// var users = require('./routes/users');
// app.use('/', routes);
// app.use('/users', users);

var models     = require('./routes/models/models')(app, mongoose);
var contr = require('./routes/controllers/controller');

// // Example Route
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Hello world!");
});
app.use(router);

// API routes
var users = express.Router();

users.route('/users')
  .get(contr.findAllUsers)
  .post(contr.addUser);

app.use('/api', users);

// Start server
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});
