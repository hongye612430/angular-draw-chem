(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemEdits", DrawChemEdits);

	DrawChemEdits.$inject = ["DrawChemCache", "DrawChemDirectiveUtils"];

	function DrawChemEdits(Cache, Utils) {

		var service = {}, minMax;

    service.selectAll = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), shape;
			if (structure !== null) {
				structure.selectAll();
				Cache.addStructure(structure);
				shape = Utils.drawStructure(structure);
				minMax = shape.minMax;
			}
    };

		service.deselectAll = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null) {
				structure.deselectAll();
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}
    };

		service.alignUp = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null && structure.selectedAll) {
				structure.alignUp(minMax.minY);
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}
		};

		service.edits = {
			"select all": {
				action: service.selectAll,
				id: "select-all"
			},
			"deselect all": {
				action: service.deselectAll,
				id: "deselect-all"
			},
			"align up": {
				action: service.alignUp,
				id: "align-up"
			}
		};

		return service;
	}
})();
