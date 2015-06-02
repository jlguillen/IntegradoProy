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
	name: {
		type: String,
		default: '',
		required: 'Please fill Rutina name',
		trim: true
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