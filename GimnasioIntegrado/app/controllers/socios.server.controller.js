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
 * Listar socios paginando:
 */
exports.list = function(req, res) {
	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;
	var filter = {
		filters: {
			mandatory: {
				contains: req.query.filter
			}
		}

	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}else {
			sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};

	Socio
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, socios) {
				if (err) {
					return res.send(400, {
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
 * Autorización para manipular socios: Pongo necesidad de permiso de admin o monitor
 */
exports.hasAuthorization = function(req, res, next) {
	//pongo la autorización de borrado por el rol
	if (req.user.roles[0] !== 'admin' && req.user.roles[0] !== 'monitor') {
		return res.status(403).send('User is not authorized');
	}
	next();
};
