'use strict';

(function() {
	// Socios Controller Spec
	describe('Socios Controller Tests', function() {
		// Initialize global variables
		var SociosController,
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

			// Initialize the Socios controller.
			SociosController = $controller('SociosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Socio object fetched from XHR', inject(function(Socios) {
			// Create sample Socio using the Socios service
			var sampleSocio = new Socios({
				name: 'New Socio'
			});

			// Create a sample Socios array that includes the new Socio
			var sampleSocios = [sampleSocio];

			// Set GET response
			$httpBackend.expectGET('socios').respond(sampleSocios);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.socios).toEqualData(sampleSocios);
		}));

		it('$scope.findOne() should create an array with one Socio object fetched from XHR using a socioId URL parameter', inject(function(Socios) {
			// Define a sample Socio object
			var sampleSocio = new Socios({
				name: 'New Socio'
			});

			// Set the URL parameter
			$stateParams.socioId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/socios\/([0-9a-fA-F]{24})$/).respond(sampleSocio);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.socio).toEqualData(sampleSocio);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Socios) {
			// Create a sample Socio object
			var sampleSocioPostData = new Socios({
				name: 'New Socio'
			});

			// Create a sample Socio response
			var sampleSocioResponse = new Socios({
				_id: '525cf20451979dea2c000001',
				name: 'New Socio'
			});

			// Fixture mock form input values
			scope.name = 'New Socio';

			// Set POST response
			$httpBackend.expectPOST('socios', sampleSocioPostData).respond(sampleSocioResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Socio was created
			expect($location.path()).toBe('/socios/' + sampleSocioResponse._id);
		}));

		it('$scope.update() should update a valid Socio', inject(function(Socios) {
			// Define a sample Socio put data
			var sampleSocioPutData = new Socios({
				_id: '525cf20451979dea2c000001',
				name: 'New Socio'
			});

			// Mock Socio in scope
			scope.socio = sampleSocioPutData;

			// Set PUT response
			$httpBackend.expectPUT(/socios\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/socios/' + sampleSocioPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid socioId and remove the Socio from the scope', inject(function(Socios) {
			// Create new Socio object
			var sampleSocio = new Socios({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Socios array and include the Socio
			scope.socios = [sampleSocio];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/socios\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSocio);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.socios.length).toBe(0);
		}));
	});
}());