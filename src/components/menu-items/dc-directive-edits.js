(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveEdits", DrawChemDirectiveEdits);

	DrawChemDirectiveEdits.$inject = [];

	function DrawChemDirectiveEdits() {

		var service = {};

    service.todo = function () {

    };

		service.edits = {
			"dummy": {
				action: service.todo
			}
		};

		return service;
	}
})();
