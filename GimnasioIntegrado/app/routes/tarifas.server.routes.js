'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tarifas = require('../../app/controllers/tarifas.server.controller');

	// Tarifas Routes
	app.route('/tarifas')
		.get(tarifas.list)
		.post(users.requiresLogin, tarifas.create);

	app.route('/tarifas/:tarifaId')
		.get(tarifas.read)
		.put(users.requiresLogin, tarifas.hasAuthorization, tarifas.update)
		.delete(users.requiresLogin, tarifas.hasAuthorization, tarifas.delete);

	// Finish by binding the Tarifa middleware
	app.param('tarifaId', tarifas.tarifaByID);
};
