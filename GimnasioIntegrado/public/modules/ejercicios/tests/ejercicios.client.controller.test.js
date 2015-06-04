'use strict';

(function() {
	// Ejercicios Controller Spec
	describe('Ejercicios Controller Tests', function() {
		// Initialize global variables
		var EjerciciosController,
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

			// Initialize the Ejercicios controller.
			EjerciciosController = $controller('EjerciciosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ejercicio object fetched from XHR', inject(function(Ejercicios) {
			// Create sample Ejercicio using the Ejercicios service
			var sampleEjercicio = new Ejercicios({
				name: 'New Ejercicio'
			});

			// Create a sample Ejercicios array that includes the new Ejercicio
			var sampleEjercicios = [sampleEjercicio];

			// Set GET response
			$httpBackend.expectGET('ejercicios').respond(sampleEjercicios);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ejercicios).toEqualData(sampleEjercicios);
		}));

		it('$scope.findOne() should create an array with one Ejercicio object fetched from XHR using a ejercicioId URL parameter', inject(function(Ejercicios) {
			// Define a sample Ejercicio object
			var sampleEjercicio = new Ejercicios({
				name: 'New Ejercicio'
			});

			// Set the URL parameter
			$stateParams.ejercicioId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ejercicios\/([0-9a-fA-F]{24})$/).respond(sampleEjercicio);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ejercicio).toEqualData(sampleEjercicio);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ejercicios) {
			// Create a sample Ejercicio object
			var sampleEjercicioPostData = new Ejercicios({
				name: 'New Ejercicio'
			});

			// Create a sample Ejercicio response
			var sampleEjercicioResponse = new Ejercicios({
				_id: '525cf20451979dea2c000001',
				name: 'New Ejercicio'
			});

			// Fixture mock form input values
			scope.name = 'New Ejercicio';

			// Set POST response
			$httpBackend.expectPOST('ejercicios', sampleEjercicioPostData).respond(sampleEjercicioResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ejercicio was created
			expect($location.path()).toBe('/ejercicios/' + sampleEjercicioResponse._id);
		}));

		it('$scope.update() should update a valid Ejercicio', inject(function(Ejercicios) {
			// Define a sample Ejercicio put data
			var sampleEjercicioPutData = new Ejercicios({
				_id: '525cf20451979dea2c000001',
				name: 'New Ejercicio'
			});

			// Mock Ejercicio in scope
			scope.ejercicio = sampleEjercicioPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ejercicios\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ejercicios/' + sampleEjercicioPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ejercicioId and remove the Ejercicio from the scope', inject(function(Ejercicios) {
			// Create new Ejercicio object
			var sampleEjercicio = new Ejercicios({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ejercicios array and include the Ejercicio
			scope.ejercicios = [sampleEjercicio];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ejercicios\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEjercicio);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ejercicios.length).toBe(0);
		}));
	});
}());