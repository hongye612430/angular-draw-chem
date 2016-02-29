(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemLabels", DrawChemLabels);

	DrawChemLabels.$inject = ["DCLabel", "DrawChemDirectiveFlags"];

	function DrawChemLabels(DCLabel, Flags) {

		var service = {},
      Label = DCLabel.Label;

		/**
		 * An array of Label objects containing all predefined labels.
		 */
		service.labels = {
			"oxygen": {
				action: createLabelAction("O", 2)
			},
			"sulfur": {
				action: createLabelAction("S", 2)
			},
			"phosphorus": {
				action: createLabelAction("P", 3)
			},
			"nitrogen": {
				action: createLabelAction("N", 3)
			},
			"carbon": {
				action: createLabelAction("C", 4)
			},
			"fluorine": {
				action: createLabelAction("F", 1)
			},
			"chlorine": {
				action: createLabelAction("Cl", 1)
			},
			"bromine": {
				action: createLabelAction("Br", 1)
			},
			"iodine": {
				action: createLabelAction("I", 1)
			},
			"hydrogen": {
				action: createLabelAction("H", 1)
			}
		};

		return service;

		function createLabelAction(label, hydrogens) {
			return function (scope) {
				scope.chosenLabel = new Label(label, hydrogens);
				Flags.selected = "label";
			}
		}
	}
})();
