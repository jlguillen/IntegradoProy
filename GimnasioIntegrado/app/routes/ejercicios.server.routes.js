'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ejercicios = require('../../app/controllers/ejercicios.server.controller');

	// Ejercicios Routes
	app.route('/ejercicios')
		.get(ejercicios.list)
		.post(users.requiresLogin, ejercicios.create);

	app.route('/ejercicios/:ejercicioId')
		.get(ejercicios.read)
		.put(users.requiresLogin, ejercicios.hasAuthorization, ejercicios.update)
		.delete(users.requiresLogin, ejercicios.hasAuthorization, ejercicios.delete);

	// Finish by binding the Ejercicio middleware
	app.param('ejercicioId', ejercicios.ejercicioByID);
};
