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
	descripction:{
		type: String,
		default: '',
		required: 'Intruduzca una descripción de la rutina'
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
