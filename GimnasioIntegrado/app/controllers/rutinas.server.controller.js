'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rutina = mongoose.model('Rutina'),
	_ = require('lodash');

/**
 * Create a Rutina
 */
exports.create = function(req, res) {
	var rutina = new Rutina(req.body);
	rutina.user = req.user;
	rutina.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rutina);
		}
	});
};

/**
 * Show the current Rutina
 */
exports.read = function(req, res) {
	res.jsonp(req.rutina);
};

/**
 * Update a Rutina
 */
exports.update = function(req, res) {
	var rutina = req.rutina ;

	rutina = _.extend(rutina , req.body);

	rutina.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rutina);
		}
	});
};

/**
 * Delete an Rutina
 */
exports.delete = function(req, res) {
	var rutina = req.rutina ;

	rutina.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rutina);
		}
	});
};

/**
 * List of Rutinas
 */
exports.list = function(req, res) {
	Rutina.find().sort('-created').populate('user', 'displayName').exec(function(err, rutinas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rutinas);
		}
	});
};

/**
 * Rutina middleware
 */
exports.rutinaByID = function(req, res, next, id) {
	Rutina.findById(id).populate('user', 'displayName').exec(function(err, rutina) {
		if (err) return next(err);
		if (! rutina) return next(new Error('Failed to load Rutina ' + id));
		req.rutina = rutina ;
		next();
	});
};

/**
 * Rutina authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles[0] !== 'admin' && req.user.roles[0] !== 'monitor') {
		return res.status(403).send('User is not authorized');
	}
	next();
};
