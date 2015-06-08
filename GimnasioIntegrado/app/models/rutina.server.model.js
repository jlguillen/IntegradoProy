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
//El orden lo pongo así para que cuando envíe el mensaje de error vacío del required sea en este orden (inverso)
	nSemanas:{
		type: Number,
		default: '',
		required: 'Introduzca alguna rutina de entrenamiento.'
	},
	nDias:{
		type: Number,
		default: '',
		required: 'Introduzca alguna rutina de entrenamiento.'
	},
	ejercicios:{
		type: Object,
		default: {},
		required: 'Introduzca algún planning de ejercicios'
	},
	descripcion:{
		type: String,
		default: '',
		required: 'Intruduzca una descripción de la rutina'
	},
	objetivo:{
		type: String,
		default: '',
		required: 'Intruduzca el objetivo de la rutina'
	},
	nombre: {
		type: String,
		default: '',
		required: 'Introduzca un nombre de rutina',
		trim: true
	}
});

mongoose.model('Rutina', RutinaSchema);
