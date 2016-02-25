(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemEdits", DrawChemEdits);

	DrawChemEdits.$inject = [];

	function DrawChemEdits() {

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
