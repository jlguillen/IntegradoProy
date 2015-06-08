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
	descripcion: {
		type: String,
		default: '',
		required: 'Introduzca la descripcion del ejercicio'
	},
	nombre: {
		type: String,
		default: '',
		required: 'Introduzca el nombre del ejercicio'
	},
	foto: {
		type: String,
		default: ''
	}
});

mongoose.model('Ejercicio', EjercicioSchema);
