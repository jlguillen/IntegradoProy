'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Rutina = mongoose.model('Rutina'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, rutina;

/**
 * Rutina routes tests
 */
describe('Rutina CRUD tests', function() {
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

		// Save a user to the test db and create new Rutina
		user.save(function() {
			rutina = {
				name: 'Rutina Name'
			};

			done();
		});
	});

	it('should be able to save Rutina instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rutina
				agent.post('/rutinas')
					.send(rutina)
					.expect(200)
					.end(function(rutinaSaveErr, rutinaSaveRes) {
						// Handle Rutina save error
						if (rutinaSaveErr) done(rutinaSaveErr);

						// Get a list of Rutinas
						agent.get('/rutinas')
							.end(function(rutinasGetErr, rutinasGetRes) {
								// Handle Rutina save error
								if (rutinasGetErr) done(rutinasGetErr);

								// Get Rutinas list
								var rutinas = rutinasGetRes.body;

								// Set assertions
								(rutinas[0].user._id).should.equal(userId);
								(rutinas[0].name).should.match('Rutina Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Rutina instance if not logged in', function(done) {
		agent.post('/rutinas')
			.send(rutina)
			.expect(401)
			.end(function(rutinaSaveErr, rutinaSaveRes) {
				// Call the assertion callback
				done(rutinaSaveErr);
			});
	});

	it('should not be able to save Rutina instance if no name is provided', function(done) {
		// Invalidate name field
		rutina.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rutina
				agent.post('/rutinas')
					.send(rutina)
					.expect(400)
					.end(function(rutinaSaveErr, rutinaSaveRes) {
						// Set message assertion
						(rutinaSaveRes.body.message).should.match('Please fill Rutina name');
						
						// Handle Rutina save error
						done(rutinaSaveErr);
					});
			});
	});

	it('should be able to update Rutina instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rutina
				agent.post('/rutinas')
					.send(rutina)
					.expect(200)
					.end(function(rutinaSaveErr, rutinaSaveRes) {
						// Handle Rutina save error
						if (rutinaSaveErr) done(rutinaSaveErr);

						// Update Rutina name
						rutina.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Rutina
						agent.put('/rutinas/' + rutinaSaveRes.body._id)
							.send(rutina)
							.expect(200)
							.end(function(rutinaUpdateErr, rutinaUpdateRes) {
								// Handle Rutina update error
								if (rutinaUpdateErr) done(rutinaUpdateErr);

								// Set assertions
								(rutinaUpdateRes.body._id).should.equal(rutinaSaveRes.body._id);
								(rutinaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rutinas if not signed in', function(done) {
		// Create new Rutina model instance
		var rutinaObj = new Rutina(rutina);

		// Save the Rutina
		rutinaObj.save(function() {
			// Request Rutinas
			request(app).get('/rutinas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Rutina if not signed in', function(done) {
		// Create new Rutina model instance
		var rutinaObj = new Rutina(rutina);

		// Save the Rutina
		rutinaObj.save(function() {
			request(app).get('/rutinas/' + rutinaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', rutina.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Rutina instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rutina
				agent.post('/rutinas')
					.send(rutina)
					.expect(200)
					.end(function(rutinaSaveErr, rutinaSaveRes) {
						// Handle Rutina save error
						if (rutinaSaveErr) done(rutinaSaveErr);

						// Delete existing Rutina
						agent.delete('/rutinas/' + rutinaSaveRes.body._id)
							.send(rutina)
							.expect(200)
							.end(function(rutinaDeleteErr, rutinaDeleteRes) {
								// Handle Rutina error error
								if (rutinaDeleteErr) done(rutinaDeleteErr);

								// Set assertions
								(rutinaDeleteRes.body._id).should.equal(rutinaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Rutina instance if not signed in', function(done) {
		// Set Rutina user 
		rutina.user = user;

		// Create new Rutina model instance
		var rutinaObj = new Rutina(rutina);

		// Save the Rutina
		rutinaObj.save(function() {
			// Try deleting Rutina
			request(app).delete('/rutinas/' + rutinaObj._id)
			.expect(401)
			.end(function(rutinaDeleteErr, rutinaDeleteRes) {
				// Set message assertion
				(rutinaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Rutina error error
				done(rutinaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Rutina.remove().exec();
		done();
	});
});