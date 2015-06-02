'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rutinas = require('../../app/controllers/rutinas.server.controller');

	// Rutinas Routes
	app.route('/rutinas')
		.get(rutinas.list)
		.post(users.requiresLogin, rutinas.create);

	app.route('/rutinas/:rutinaId')
		.get(rutinas.read)
		.put(users.requiresLogin, rutinas.hasAuthorization, rutinas.update)
		.delete(users.requiresLogin, rutinas.hasAuthorization, rutinas.delete);

	// Finish by binding the Rutina middleware
	app.param('rutinaId', rutinas.rutinaByID);
};
