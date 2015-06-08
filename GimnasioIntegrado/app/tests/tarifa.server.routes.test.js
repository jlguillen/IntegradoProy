'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tarifa = mongoose.model('Tarifa'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tarifa;

/**
 * Tarifa routes tests
 */
describe('Tarifa CRUD tests', function() {
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

		// Save a user to the test db and create new Tarifa
		user.save(function() {
			tarifa = {
				name: 'Tarifa Name'
			};

			done();
		});
	});

	it('should be able to save Tarifa instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarifa
				agent.post('/tarifas')
					.send(tarifa)
					.expect(200)
					.end(function(tarifaSaveErr, tarifaSaveRes) {
						// Handle Tarifa save error
						if (tarifaSaveErr) done(tarifaSaveErr);

						// Get a list of Tarifas
						agent.get('/tarifas')
							.end(function(tarifasGetErr, tarifasGetRes) {
								// Handle Tarifa save error
								if (tarifasGetErr) done(tarifasGetErr);

								// Get Tarifas list
								var tarifas = tarifasGetRes.body;

								// Set assertions
								(tarifas[0].user._id).should.equal(userId);
								(tarifas[0].name).should.match('Tarifa Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tarifa instance if not logged in', function(done) {
		agent.post('/tarifas')
			.send(tarifa)
			.expect(401)
			.end(function(tarifaSaveErr, tarifaSaveRes) {
				// Call the assertion callback
				done(tarifaSaveErr);
			});
	});

	it('should not be able to save Tarifa instance if no name is provided', function(done) {
		// Invalidate name field
		tarifa.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarifa
				agent.post('/tarifas')
					.send(tarifa)
					.expect(400)
					.end(function(tarifaSaveErr, tarifaSaveRes) {
						// Set message assertion
						(tarifaSaveRes.body.message).should.match('Please fill Tarifa name');
						
						// Handle Tarifa save error
						done(tarifaSaveErr);
					});
			});
	});

	it('should be able to update Tarifa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarifa
				agent.post('/tarifas')
					.send(tarifa)
					.expect(200)
					.end(function(tarifaSaveErr, tarifaSaveRes) {
						// Handle Tarifa save error
						if (tarifaSaveErr) done(tarifaSaveErr);

						// Update Tarifa name
						tarifa.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tarifa
						agent.put('/tarifas/' + tarifaSaveRes.body._id)
							.send(tarifa)
							.expect(200)
							.end(function(tarifaUpdateErr, tarifaUpdateRes) {
								// Handle Tarifa update error
								if (tarifaUpdateErr) done(tarifaUpdateErr);

								// Set assertions
								(tarifaUpdateRes.body._id).should.equal(tarifaSaveRes.body._id);
								(tarifaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tarifas if not signed in', function(done) {
		// Create new Tarifa model instance
		var tarifaObj = new Tarifa(tarifa);

		// Save the Tarifa
		tarifaObj.save(function() {
			// Request Tarifas
			request(app).get('/tarifas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tarifa if not signed in', function(done) {
		// Create new Tarifa model instance
		var tarifaObj = new Tarifa(tarifa);

		// Save the Tarifa
		tarifaObj.save(function() {
			request(app).get('/tarifas/' + tarifaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tarifa.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tarifa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarifa
				agent.post('/tarifas')
					.send(tarifa)
					.expect(200)
					.end(function(tarifaSaveErr, tarifaSaveRes) {
						// Handle Tarifa save error
						if (tarifaSaveErr) done(tarifaSaveErr);

						// Delete existing Tarifa
						agent.delete('/tarifas/' + tarifaSaveRes.body._id)
							.send(tarifa)
							.expect(200)
							.end(function(tarifaDeleteErr, tarifaDeleteRes) {
								// Handle Tarifa error error
								if (tarifaDeleteErr) done(tarifaDeleteErr);

								// Set assertions
								(tarifaDeleteRes.body._id).should.equal(tarifaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tarifa instance if not signed in', function(done) {
		// Set Tarifa user 
		tarifa.user = user;

		// Create new Tarifa model instance
		var tarifaObj = new Tarifa(tarifa);

		// Save the Tarifa
		tarifaObj.save(function() {
			// Try deleting Tarifa
			request(app).delete('/tarifas/' + tarifaObj._id)
			.expect(401)
			.end(function(tarifaDeleteErr, tarifaDeleteRes) {
				// Set message assertion
				(tarifaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tarifa error error
				done(tarifaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tarifa.remove().exec();
		done();
	});
});