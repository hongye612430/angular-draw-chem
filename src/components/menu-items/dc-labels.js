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
				action: createLabelAction("O", 2),
				id: "oxygen"
			},
			"sulfur": {
				action: createLabelAction("S", 2),
				id: "sulfur"
			},
			"phosphorus": {
				action: createLabelAction("P", 3),
				id: "phosphorus"
			},
			"nitrogen": {
				action: createLabelAction("N", 3),
				id: "nitrogen"
			},
			"carbon": {
				action: createLabelAction("C", 4),
				id: "carbon"
			},
			"fluorine": {
				action: createLabelAction("F", 1),
				id: "fluorine"
			},
			"chlorine": {
				action: createLabelAction("Cl", 1),
				id: "chlorine"
			},
			"bromine": {
				action: createLabelAction("Br", 1),
				id: "bromine"
			},
			"iodine": {
				action: createLabelAction("I", 1),
				id: "iodine"
			},
			"hydrogen": {
				action: createLabelAction("H", 1),
				id: "hydrogen"
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
