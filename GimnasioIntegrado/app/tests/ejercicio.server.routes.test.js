'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ejercicio = mongoose.model('Ejercicio'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ejercicio;

/**
 * Ejercicio routes tests
 */
describe('Ejercicio CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Ejercicio
		user.save(function() {
			ejercicio = {
				name: 'Ejercicio Name'
			};

			done();
		});
	});

	it('should be able to save Ejercicio instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ejercicio
				agent.post('/ejercicios')
					.send(ejercicio)
					.expect(200)
					.end(function(ejercicioSaveErr, ejercicioSaveRes) {
						// Handle Ejercicio save error
						if (ejercicioSaveErr) done(ejercicioSaveErr);

						// Get a list of Ejercicios
						agent.get('/ejercicios')
							.end(function(ejerciciosGetErr, ejerciciosGetRes) {
								// Handle Ejercicio save error
								if (ejerciciosGetErr) done(ejerciciosGetErr);

								// Get Ejercicios list
								var ejercicios = ejerciciosGetRes.body;

								// Set assertions
								(ejercicios[0].user._id).should.equal(userId);
								(ejercicios[0].name).should.match('Ejercicio Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ejercicio instance if not logged in', function(done) {
		agent.post('/ejercicios')
			.send(ejercicio)
			.expect(401)
			.end(function(ejercicioSaveErr, ejercicioSaveRes) {
				// Call the assertion callback
				done(ejercicioSaveErr);
			});
	});

	it('should not be able to save Ejercicio instance if no name is provided', function(done) {
		// Invalidate name field
		ejercicio.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ejercicio
				agent.post('/ejercicios')
					.send(ejercicio)
					.expect(400)
					.end(function(ejercicioSaveErr, ejercicioSaveRes) {
						// Set message assertion
						(ejercicioSaveRes.body.message).should.match('Please fill Ejercicio name');
						
						// Handle Ejercicio save error
						done(ejercicioSaveErr);
					});
			});
	});

	it('should be able to update Ejercicio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ejercicio
				agent.post('/ejercicios')
					.send(ejercicio)
					.expect(200)
					.end(function(ejercicioSaveErr, ejercicioSaveRes) {
						// Handle Ejercicio save error
						if (ejercicioSaveErr) done(ejercicioSaveErr);

						// Update Ejercicio name
						ejercicio.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ejercicio
						agent.put('/ejercicios/' + ejercicioSaveRes.body._id)
							.send(ejercicio)
							.expect(200)
							.end(function(ejercicioUpdateErr, ejercicioUpdateRes) {
								// Handle Ejercicio update error
								if (ejercicioUpdateErr) done(ejercicioUpdateErr);

								// Set assertions
								(ejercicioUpdateRes.body._id).should.equal(ejercicioSaveRes.body._id);
								(ejercicioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ejercicios if not signed in', function(done) {
		// Create new Ejercicio model instance
		var ejercicioObj = new Ejercicio(ejercicio);

		// Save the Ejercicio
		ejercicioObj.save(function() {
			// Request Ejercicios
			request(app).get('/ejercicios')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ejercicio if not signed in', function(done) {
		// Create new Ejercicio model instance
		var ejercicioObj = new Ejercicio(ejercicio);

		// Save the Ejercicio
		ejercicioObj.save(function() {
			request(app).get('/ejercicios/' + ejercicioObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ejercicio.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ejercicio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ejercicio
				agent.post('/ejercicios')
					.send(ejercicio)
					.expect(200)
					.end(function(ejercicioSaveErr, ejercicioSaveRes) {
						// Handle Ejercicio save error
						if (ejercicioSaveErr) done(ejercicioSaveErr);

						// Delete existing Ejercicio
						agent.delete('/ejercicios/' + ejercicioSaveRes.body._id)
							.send(ejercicio)
							.expect(200)
							.end(function(ejercicioDeleteErr, ejercicioDeleteRes) {
								// Handle Ejercicio error error
								if (ejercicioDeleteErr) done(ejercicioDeleteErr);

								// Set assertions
								(ejercicioDeleteRes.body._id).should.equal(ejercicioSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ejercicio instance if not signed in', function(done) {
		// Set Ejercicio user 
		ejercicio.user = user;

		// Create new Ejercicio model instance
		var ejercicioObj = new Ejercicio(ejercicio);

		// Save the Ejercicio
		ejercicioObj.save(function() {
			// Try deleting Ejercicio
			request(app).delete('/ejercicios/' + ejercicioObj._id)
			.expect(401)
			.end(function(ejercicioDeleteErr, ejercicioDeleteRes) {
				// Set message assertion
				(ejercicioDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ejercicio error error
				done(ejercicioDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ejercicio.remove().exec();
		done();
	});
});