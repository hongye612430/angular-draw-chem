(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveEdits", DrawChemDirectiveEdits);

	DrawChemDirectiveEdits.$inject = [];

	function DrawChemDirectiveEdits() {

		var service = {};

    service.todo = function () {

    };

		service.edits = [
			{ name: "dummy", edit: service.todo },
		];

		return service;
	}
})();
