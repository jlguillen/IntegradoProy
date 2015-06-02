'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var socios = require('../../app/controllers/socios.server.controller');

	// Socios Routes
	app.route('/socios')
		.get(socios.list)
		.post(users.requiresLogin, socios.create);

	app.route('/socios/:socioId')
		.get(socios.read)
		.put(users.requiresLogin, socios.hasAuthorization, socios.update)
		.delete(users.requiresLogin, socios.hasAuthorization, socios.delete);

	// Finish by binding the Socio middleware
	app.param('socioId', socios.socioByID);
};
