(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemEdits", DrawChemEdits);

	DrawChemEdits.$inject = [];

	function DrawChemEdits() {

		var service = {};

    service.selectAll = function () {

    };

		service.edits = {
			"select all": {
				action: service.selectAll
			}
		};

		return service;
	}
})();
