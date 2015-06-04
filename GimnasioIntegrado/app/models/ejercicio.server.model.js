'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ejercicio Schema
 */
var EjercicioSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Introduzca el nombre del ejercicio'
	},
	descripcion: {
		type: String,
		default: '',
		required: 'Introduzca la descripcion del ejercicio'
	},
	foto: {
		type: String,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Ejercicio', EjercicioSchema);
