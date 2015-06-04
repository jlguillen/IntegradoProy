'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rutina Schema
 */
var RutinaSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Introduzca un nombre de rutina',
		trim: true
	},
	objetivo:{
		type: String,
		default: '',
		required: 'Intruduzca el objetivo de la rutina'
	},
	descripcion:{
		type: String,
		default: '',
		required: 'Intruduzca una descripción de la rutina'
	},
	nSemanas:{
		type: Number,
		default: '',
		required: 'Intruduzca el numero de semanas'
	},
	nDias:{
		type: Number,
		default: '',
		required: 'Intruduzca el número de días por semana'
	},
	ejercicios:{
		type: Array,
		default: []
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

mongoose.model('Rutina', RutinaSchema);
