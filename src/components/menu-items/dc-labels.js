(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemLabels", DrawChemLabels);

	DrawChemLabels.$inject = ["DCLabel"];

	function DrawChemLabels(DCLabel) {

		var service = {},
      Label = DCLabel.Label;

		/**
		 * An array of Label objects containing all predefined labels.
		 */
		service.labels = [
			new Label("O", 2),
			new Label("S", 2),
			new Label("P", 3),
			new Label("N", 3),
			new Label("C", 4),
			new Label("F", 1),
			new Label("Cl", 1),
			new Label("Br", 1),
			new Label("I", 1),
			new Label("H", 1)
		];

		return service;
	}
})();
