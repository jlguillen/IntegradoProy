'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tarifa Schema
 */
var TarifaSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Introduzca un nombre a la tarifa'
	},
	descripcion:{
		type: String,
		default: '',
		required: 'Introduzca una descripción a la tarifa'
	},
	precio:{
		type: Number,
		required: 'Introduzca un precio a la tarifa',
	},
	duracion:{ //En meses
		type: Number,
		required: 'Introduzca una duración a la tarifa',
	}
	// hoy.setMonth(hoy.getMonth()+3);
});

mongoose.model('Tarifa', TarifaSchema);
