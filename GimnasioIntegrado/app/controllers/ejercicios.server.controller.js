'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ejercicio = mongoose.model('Ejercicio'),
	_ = require('lodash');

/**
 * Create a Ejercicio
 */
exports.create = function(req, res) {
	var ejercicio = new Ejercicio(req.body);
	ejercicio.user = req.user;

	ejercicio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ejercicio);
		}
	});
};

/**
 * Show the current Ejercicio
 */
exports.read = function(req, res) {
	res.jsonp(req.ejercicio);
};

/**
 * Update a Ejercicio
 */
exports.update = function(req, res) {
	var ejercicio = req.ejercicio ;

	ejercicio = _.extend(ejercicio , req.body);

	ejercicio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ejercicio);
		}
	});
};

/**
 * Delete an Ejercicio
 */
exports.delete = function(req, res) {
	var ejercicio = req.ejercicio ;

	ejercicio.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ejercicio);
		}
	});
};

/**
 * List of Ejercicios
 */
exports.list = function(req, res) { 
	Ejercicio.find().sort('-created').populate('user', 'displayName').exec(function(err, ejercicios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ejercicios);
		}
	});
};

/**
 * Ejercicio middleware
 */
exports.ejercicioByID = function(req, res, next, id) { 
	Ejercicio.findById(id).populate('user', 'displayName').exec(function(err, ejercicio) {
		if (err) return next(err);
		if (! ejercicio) return next(new Error('Failed to load Ejercicio ' + id));
		req.ejercicio = ejercicio ;
		next();
	});
};

/**
 * Ejercicio authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ejercicio.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
