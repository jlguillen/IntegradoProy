'use strict';

(function() {
	// Rutinas Controller Spec
	describe('Rutinas Controller Tests', function() {
		// Initialize global variables
		var RutinasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Rutinas controller.
			RutinasController = $controller('RutinasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rutina object fetched from XHR', inject(function(Rutinas) {
			// Create sample Rutina using the Rutinas service
			var sampleRutina = new Rutinas({
				name: 'New Rutina'
			});

			// Create a sample Rutinas array that includes the new Rutina
			var sampleRutinas = [sampleRutina];

			// Set GET response
			$httpBackend.expectGET('rutinas').respond(sampleRutinas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rutinas).toEqualData(sampleRutinas);
		}));

		it('$scope.findOne() should create an array with one Rutina object fetched from XHR using a rutinaId URL parameter', inject(function(Rutinas) {
			// Define a sample Rutina object
			var sampleRutina = new Rutinas({
				name: 'New Rutina'
			});

			// Set the URL parameter
			$stateParams.rutinaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rutinas\/([0-9a-fA-F]{24})$/).respond(sampleRutina);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rutina).toEqualData(sampleRutina);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rutinas) {
			// Create a sample Rutina object
			var sampleRutinaPostData = new Rutinas({
				name: 'New Rutina'
			});

			// Create a sample Rutina response
			var sampleRutinaResponse = new Rutinas({
				_id: '525cf20451979dea2c000001',
				name: 'New Rutina'
			});

			// Fixture mock form input values
			scope.name = 'New Rutina';

			// Set POST response
			$httpBackend.expectPOST('rutinas', sampleRutinaPostData).respond(sampleRutinaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rutina was created
			expect($location.path()).toBe('/rutinas/' + sampleRutinaResponse._id);
		}));

		it('$scope.update() should update a valid Rutina', inject(function(Rutinas) {
			// Define a sample Rutina put data
			var sampleRutinaPutData = new Rutinas({
				_id: '525cf20451979dea2c000001',
				name: 'New Rutina'
			});

			// Mock Rutina in scope
			scope.rutina = sampleRutinaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rutinas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rutinas/' + sampleRutinaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rutinaId and remove the Rutina from the scope', inject(function(Rutinas) {
			// Create new Rutina object
			var sampleRutina = new Rutinas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rutinas array and include the Rutina
			scope.rutinas = [sampleRutina];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rutinas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRutina);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rutinas.length).toBe(0);
		}));
	});
}());