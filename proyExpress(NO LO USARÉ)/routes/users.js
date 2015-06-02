var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('./models/models')(express, mongoose); //Aquí o en app???
var controlador = require('./controllers/controller');

router.route('/')
  .get(controlador.findAllUsers)
  .post(controlador.addUser);

  // router.route('/users/:id')
  // .get(controlador.findById)
  // .put(controlador.updateTVShow)
  // .delete(controlador.deleteTVShow);

module.exports = router;
