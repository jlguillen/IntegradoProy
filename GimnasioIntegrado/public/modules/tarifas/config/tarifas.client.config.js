'use strict';

// Configuring the Articles module
angular.module('tarifas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tarifas', 'tarifas', '/tarifas(/create)?');
		// Menus.addMenuItem('topbar', 'Tarifas', 'tarifas', 'dropdown', '/tarifas(/create)?');
		// Menus.addSubMenuItem('topbar', 'tarifas', 'List Tarifas', 'tarifas');
		// Menus.addSubMenuItem('topbar', 'tarifas', 'New Tarifa', 'tarifas/create');
	}
]);
