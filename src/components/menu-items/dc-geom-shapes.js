(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemGeomShapes", DrawChemGeomShapes);

	DrawChemGeomShapes.$inject = [];

	function DrawChemGeomShapes() {

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
