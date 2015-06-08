'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Socio Schema
 */
var SocioSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'El nombre del socio es imprescindible',
		trim: true
	},
	apellidos: {
		type: String,
		default: '',
		required: 'Los apellidos del socio son imprescindibles',
		trim: true
	},
	dni: {
		type: String,
		default: '',
		required: 'El DNI es imprescindible'
	},
	direccion: {
		type: String,
		default: '',
		trim: true
	},
	mail: {
		type: String,
		default: '',
		trim: true
	},
	password:{
		type: String,
		default: ''
	},
	telefono:{
		type: String,
		default: ''
	},
	rutina:{
		type: Schema.ObjectId,
		ref: 'Rutina'
	},
	tarifa:{
		type: Object,
		default: {}
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

});

mongoose.model('Socio', SocioSchema);
