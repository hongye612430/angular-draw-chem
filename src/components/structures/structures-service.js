(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);
	
	function DrawChemStructures() {
		
		var service = {};
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [
			{
				name: "benzene",
				structure: [
					{
						coords: [100, 100],
						bonds: [
							{
								coords: [200, 100], bonds: []
							},
							{
								coords: [100, 200], bonds: []
							},
							{
								coords: [50, 50], bonds: []
							}
						]
					}
				]
			}
		];
		
		return service;
	}
})();