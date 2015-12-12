(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructure", DCStructure);
	
	function DCStructure() {
		
		var service = {};
		
		/**
		* Creates a new DCStructure.
		* @class
		*/
		function Structure(name, structure) {
			this.name = name;
			this.structure = structure;
		}
		
		service.Structure = Structure;
		
		return service;
	}
})();