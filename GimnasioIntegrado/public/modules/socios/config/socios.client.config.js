'use strict';

// Configuring the Articles module
angular.module('socios').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Socios', 'socios', 'dropdown', '/socios(/create)?');
		Menus.addSubMenuItem('topbar', 'socios', 'List Socios', 'socios');
		Menus.addSubMenuItem('topbar', 'socios', 'New Socio', 'socios/create');
	}
]);