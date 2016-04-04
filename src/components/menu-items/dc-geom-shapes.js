(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemGeomModStructure", DrawChemGeomModStructure);

	DrawChemGeomModStructure.$inject = [];

	function DrawChemGeomModStructure() {

		var service = {};

    service.todo = function () {

    };

		service.shapes = {
			"dummy": {
				action: service.todo
			}
		};

		return service;
	}
})();
