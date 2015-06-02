'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Socio = mongoose.model('Socio'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, socio;

/**
 * Socio routes tests
 */
describe('Socio CRUD tests', function() {
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

		// Save a user to the test db and create new Socio
		user.save(function() {
			socio = {
				name: 'Socio Name'
			};

			done();
		});
	});

	it('should be able to save Socio instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Socio
				agent.post('/socios')
					.send(socio)
					.expect(200)
					.end(function(socioSaveErr, socioSaveRes) {
						// Handle Socio save error
						if (socioSaveErr) done(socioSaveErr);

						// Get a list of Socios
						agent.get('/socios')
							.end(function(sociosGetErr, sociosGetRes) {
								// Handle Socio save error
								if (sociosGetErr) done(sociosGetErr);

								// Get Socios list
								var socios = sociosGetRes.body;

								// Set assertions
								(socios[0].user._id).should.equal(userId);
								(socios[0].name).should.match('Socio Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Socio instance if not logged in', function(done) {
		agent.post('/socios')
			.send(socio)
			.expect(401)
			.end(function(socioSaveErr, socioSaveRes) {
				// Call the assertion callback
				done(socioSaveErr);
			});
	});

	it('should not be able to save Socio instance if no name is provided', function(done) {
		// Invalidate name field
		socio.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Socio
				agent.post('/socios')
					.send(socio)
					.expect(400)
					.end(function(socioSaveErr, socioSaveRes) {
						// Set message assertion
						(socioSaveRes.body.message).should.match('Please fill Socio name');
						
						// Handle Socio save error
						done(socioSaveErr);
					});
			});
	});

	it('should be able to update Socio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Socio
				agent.post('/socios')
					.send(socio)
					.expect(200)
					.end(function(socioSaveErr, socioSaveRes) {
						// Handle Socio save error
						if (socioSaveErr) done(socioSaveErr);

						// Update Socio name
						socio.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Socio
						agent.put('/socios/' + socioSaveRes.body._id)
							.send(socio)
							.expect(200)
							.end(function(socioUpdateErr, socioUpdateRes) {
								// Handle Socio update error
								if (socioUpdateErr) done(socioUpdateErr);

								// Set assertions
								(socioUpdateRes.body._id).should.equal(socioSaveRes.body._id);
								(socioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Socios if not signed in', function(done) {
		// Create new Socio model instance
		var socioObj = new Socio(socio);

		// Save the Socio
		socioObj.save(function() {
			// Request Socios
			request(app).get('/socios')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Socio if not signed in', function(done) {
		// Create new Socio model instance
		var socioObj = new Socio(socio);

		// Save the Socio
		socioObj.save(function() {
			request(app).get('/socios/' + socioObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', socio.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Socio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Socio
				agent.post('/socios')
					.send(socio)
					.expect(200)
					.end(function(socioSaveErr, socioSaveRes) {
						// Handle Socio save error
						if (socioSaveErr) done(socioSaveErr);

						// Delete existing Socio
						agent.delete('/socios/' + socioSaveRes.body._id)
							.send(socio)
							.expect(200)
							.end(function(socioDeleteErr, socioDeleteRes) {
								// Handle Socio error error
								if (socioDeleteErr) done(socioDeleteErr);

								// Set assertions
								(socioDeleteRes.body._id).should.equal(socioSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Socio instance if not signed in', function(done) {
		// Set Socio user 
		socio.user = user;

		// Create new Socio model instance
		var socioObj = new Socio(socio);

		// Save the Socio
		socioObj.save(function() {
			// Try deleting Socio
			request(app).delete('/socios/' + socioObj._id)
			.expect(401)
			.end(function(socioDeleteErr, socioDeleteRes) {
				// Set message assertion
				(socioDeleteRes.body.message).should.match('User is not logged in');

				// Handle Socio error error
				done(socioDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Socio.remove().exec();
		done();
	});
});