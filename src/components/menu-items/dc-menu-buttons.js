(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemMenuButtons", DrawChemMenuButtons);

	DrawChemMenuButtons.$inject = [
    "DrawChemStructures",
		"DrawChemLabels",
    "DrawChemActions",
		"DrawChemEdits",
    "DrawChemArrows",
    "DrawChemGeomModStructure",
    "DrawChemDirectiveFlags"
  ];

	function DrawChemMenuButtons(Structures, Labels, Actions, Edits, Arrows, ModStructure, Flags) {

		var service = {};

    service.addButtonsToScope = function (scope) {
			var menu = {
				"Actions": {
					actions: Actions.actions
				},
				"Edit": {
					actions: Edits.edits
				},
				"Arrows": {
					actions: Arrows.arrows
				},
				"ModStructure": {
					actions: ModStructure.shapes
				},
				"Structures": {
					actions: Structures.structures
				},
				"Labels": {
					actions: Labels.labels
				}
			}

			scope.menu = {};

      // stores all actions related to Actions, Edit, Arrows, and ModStructure menu items
      angular.forEach(menu, function (item, name) {
				scope.menu[name] = {
					actions: item.actions,
					scope: scope
				}
			});

      scope.chooseCustomLabel = function (text) {
				Flags.customLabel = text;
        Flags.selected = "customLabel";
      }
    }

		return service;
	}
})();
