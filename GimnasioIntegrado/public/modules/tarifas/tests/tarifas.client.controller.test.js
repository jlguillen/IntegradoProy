'use strict';

(function() {
	// Tarifas Controller Spec
	describe('Tarifas Controller Tests', function() {
		// Initialize global variables
		var TarifasController,
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

			// Initialize the Tarifas controller.
			TarifasController = $controller('TarifasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tarifa object fetched from XHR', inject(function(Tarifas) {
			// Create sample Tarifa using the Tarifas service
			var sampleTarifa = new Tarifas({
				name: 'New Tarifa'
			});

			// Create a sample Tarifas array that includes the new Tarifa
			var sampleTarifas = [sampleTarifa];

			// Set GET response
			$httpBackend.expectGET('tarifas').respond(sampleTarifas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tarifas).toEqualData(sampleTarifas);
		}));

		it('$scope.findOne() should create an array with one Tarifa object fetched from XHR using a tarifaId URL parameter', inject(function(Tarifas) {
			// Define a sample Tarifa object
			var sampleTarifa = new Tarifas({
				name: 'New Tarifa'
			});

			// Set the URL parameter
			$stateParams.tarifaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tarifas\/([0-9a-fA-F]{24})$/).respond(sampleTarifa);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tarifa).toEqualData(sampleTarifa);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tarifas) {
			// Create a sample Tarifa object
			var sampleTarifaPostData = new Tarifas({
				name: 'New Tarifa'
			});

			// Create a sample Tarifa response
			var sampleTarifaResponse = new Tarifas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tarifa'
			});

			// Fixture mock form input values
			scope.name = 'New Tarifa';

			// Set POST response
			$httpBackend.expectPOST('tarifas', sampleTarifaPostData).respond(sampleTarifaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tarifa was created
			expect($location.path()).toBe('/tarifas/' + sampleTarifaResponse._id);
		}));

		it('$scope.update() should update a valid Tarifa', inject(function(Tarifas) {
			// Define a sample Tarifa put data
			var sampleTarifaPutData = new Tarifas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tarifa'
			});

			// Mock Tarifa in scope
			scope.tarifa = sampleTarifaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tarifas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tarifas/' + sampleTarifaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tarifaId and remove the Tarifa from the scope', inject(function(Tarifas) {
			// Create new Tarifa object
			var sampleTarifa = new Tarifas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tarifas array and include the Tarifa
			scope.tarifas = [sampleTarifa];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tarifas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTarifa);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tarifas.length).toBe(0);
		}));
	});
}());