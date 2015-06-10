'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Socio = mongoose.model('Socio');

/**
 * REGISTRO
 */
exports.signup = function(req, res) {
	var user = new User(req.body);
	var message = null;

	user.provider = 'local';

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
				// 1.registro el user
				//hecho, pa eso estoy aqui dentro...

			// 2.registro el cliente
			// console.log(req.body);

			var jsonCreateCliente = {
				'nombre': req.body.nombre,
				'apellidos': req.body.apellidos,
				'dni': req.body.dni,
				'mail': req.body.mail
			};

			var socio = new Socio(jsonCreateCliente);

			socio.save(function(err){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}else{
					// 3.me traigo el id del socio recien creado

					Socio.findOne(jsonCreateCliente).exec(function(err, socio) {
						if (err){
							console.log(err);
						}
						if (! socio){
							console.log('Error consulta socio recién registrado');
						}else{
							console.log(socio._id);

							// 4.le meto el id al user(con otro save(update))
							user.idSocio = socio._id;

							user.save(function(){
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									user.password = undefined;
									user.salt = undefined;
								}

							});
						}
					});
				}

			});
		}
	});
};

/**
 * Inicia sesión después de verificar por passport
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Desconectar
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};
