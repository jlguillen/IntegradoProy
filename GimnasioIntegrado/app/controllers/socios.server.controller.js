'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Socio = mongoose.model('Socio'),
	_ = require('lodash');

/**
 * Create a Socio
 */
exports.create = function(req, res) {
	var socio = new Socio(req.body);
	socio.user = req.user;

	socio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(socio);
		}
	});
};

/**
 * Show the current Socio
 */
exports.read = function(req, res) {
	res.jsonp(req.socio);
};

/**
 * Update a Socio
 */
exports.update = function(req, res) {
	var socio = req.socio ;

	socio = _.extend(socio , req.body);

	socio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(socio);
		}
	});
};

/**
 * Delete an Socio
 */
exports.delete = function(req, res) {
	var socio = req.socio ;

	socio.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(socio);
		}
	});
};

/**
 * List of Socios
 */
exports.list = function(req, res) {
	Socio.find().sort('-created').populate('user', 'displayName').exec(function(err, socios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(socios);
		}
	});
};

/**
 * Socio middleware
 */
exports.socioByID = function(req, res, next, id) {
	Socio.findById(id).populate('user', 'displayName').exec(function(err, socio) {
		if (err) return next(err);
		if (! socio) return next(new Error('Failed to load Socio ' + id));
		req.socio = socio ;
		next();
	});
};

/**
 * Socio authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.socio.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
