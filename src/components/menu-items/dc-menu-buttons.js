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
    "DrawChemGeomShapes",
    "DrawChemDirectiveFlags"
  ];

	function DrawChemMenuButtons(Structures, Labels, Actions, Edits, Arrows, Shapes, Flags) {

		var service = {};

    service.addButtonsToScope = function (scope) {

      // stores all actions related to Actions, Edit, Arrows, and Shapes menu items
      scope.menu = {
				"Actions": Actions.actions,
				"Edit": Edits.edits,
				"Arrows": Arrows.arrows,
				"Shapes": Shapes.shapes
			};

      // Stores the chosen label.
      scope.chosenLabel;

      // Stores the custom label.
      scope.customLabel = "";

      scope.chooseCustomLabel = function () {
        Flags.selected = "customLabel";
      }

      // stores all labels
      scope.labels = [];

      angular.forEach(Labels.labels, function (label) {
        scope.labels.push({
          name: label.getLabelName(),
          choose: function () {
            scope.chosenLabel = label;
            Flags.selected = "label";
          }
        })
      });

      // Stores the chosen structure.
      scope.chosenStructure;

      // Stores all predefined structures.
      scope.predefinedStructures = [];

      /**
       * Adds all predefined shapes to the scope.
       */
      angular.forEach(Structures.custom, function (custom) {
        var customInstance = custom();
        scope.predefinedStructures.push({
          name: customInstance.name,
          choose: function () {
            scope.chosenStructure = customInstance;
            Flags.selected = "structure";
          }
        });
      });
    }

		return service;
	}
})();
