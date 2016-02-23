(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveMenuButtons", DrawChemDirectiveMenuButtons);

	DrawChemDirectiveMenuButtons.$inject = [
    "DrawChemStructures",
    "DrawChemDirectiveActions",
		"DrawChemDirectiveEdits",
    "DrawChemArrows",
    "DrawChemGeomShapes",
    "DrawChemDirectiveFlags"
  ];

	function DrawChemDirectiveMenuButtons(Structures, Actions, Edits, Arrows, Shapes, Flags) {

		var service = {};

    service.addButtonsToScope = function (scope) {
      // stores all actions, e.g. clear, transfer, undo.
      scope.actions = [];

      angular.forEach(Actions.actions, function (action) {
        if (action.name === "close") {
          scope[action.name] = action.action;
        }
        scope.actions.push({
          name: action.name,
					shortcut: action.shortcut,
          action: action.action
        });
      });

      // stores all edit actions, e.g. resize, select, align.
      scope.edits = [];

      angular.forEach(Edits.edits, function (edit) {
        scope.edits.push({
          name: edit.name,
          edit: edit.edit
        });
      });

      // stores all arrows
      scope.arrows = [];

      angular.forEach(Arrows.arrows, function (arrow) {
        scope.arrows.push({
          name: arrow.name,
          arrow: arrow.arrow
        });
      });

      // stores all shapes
      scope.shapes = [];

      angular.forEach(Shapes.shapes, function (shape) {
        scope.shapes.push({
          name: shape.name,
          shape: shape.shape
        });
      });

      // Stores the chosen label.
      scope.chosenLabel;

      // Stores the custom label.
      scope.customLabel = "";

      scope.chooseCustomLabel = function () {
        Flags.selected = "customLabel";
      }

      // stores all labels
      scope.labels = [];

      angular.forEach(Structures.labels, function (label) {
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
