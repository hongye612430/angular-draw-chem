(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemGeomShapes", DrawChemGeomShapes);

	DrawChemGeomShapes.$inject = [];

	function DrawChemGeomShapes() {

		var service = {};

    service.todo = function () {

    };

		service.shapes = [
			{ name: "dummy", edit: service.todo },
		];

		return service;
	}
})();
