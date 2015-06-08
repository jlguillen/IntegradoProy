'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tarifa = mongoose.model('Tarifa'),
	_ = require('lodash');

/**
 * Create a Tarifa
 */
exports.create = function(req, res) {
	var tarifa = new Tarifa(req.body);
	tarifa.user = req.user;

	tarifa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tarifa);
		}
	});
};

/**
 * Show the current Tarifa
 */
exports.read = function(req, res) {
	res.jsonp(req.tarifa);
};

/**
 * Update a Tarifa
 */
exports.update = function(req, res) {
	var tarifa = req.tarifa ;

	tarifa = _.extend(tarifa , req.body);

	tarifa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tarifa);
		}
	});
};

/**
 * Delete an Tarifa
 */
exports.delete = function(req, res) {
	var tarifa = req.tarifa ;

	tarifa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tarifa);
		}
	});
};

/**
 * List of Tarifas
 */
exports.list = function(req, res) {
	Tarifa.find().sort('-created').populate('user', 'displayName').exec(function(err, tarifas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tarifas);
		}
	});
};

/**
 * Tarifa middleware
 */
exports.tarifaByID = function(req, res, next, id) {
	Tarifa.findById(id).populate('user', 'displayName').exec(function(err, tarifa) {
		if (err) return next(err);
		if (! tarifa) return next(new Error('Failed to load Tarifa ' + id));
		req.tarifa = tarifa ;
		next();
	});
};

/**
 * Tarifa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles[0] !== 'admin' && req.user.roles[0] !== 'monitor') {
		return res.status(403).send('User is not authorized');
	}
	next();
};
