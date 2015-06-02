//File: routes/controllers/controller.js
var mongoose = require('mongoose');
var User = mongoose.model('user'); //Cargo el modelo específico

//GET - Devuelvo todos los usuarios (MAS TARDE HABRÁ QUE FILTRAR POR ROL)
exports.findAllUsers = function(req, res) {
  User.find(function(err, users) {
    if(err) res.send(500, err.message);
    console.log('GET /users');
		res.status(200).jsonp(users);
	});
};

//POST - Inserta un nuevo user
exports.addUser = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var user = new User({ //el User de arriba del todo
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    edad: req.body.edad,
    login: req.body.login,
    password: req.body.password,
    direcion: req.body.direccion,
    mail: req.body.mail,
    rol: req.body.rol
	});

	user.save(function(err, user) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(user);
	});
};
