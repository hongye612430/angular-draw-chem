(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemArrows", DrawChemArrows);

	DrawChemArrows.$inject = [];

	function DrawChemArrows() {

		var service = {};

    service.todo = function () {

    };

		service.arrows = [
			{ name: "dummy", edit: service.todo },
		];

		return service;
	}
})();
