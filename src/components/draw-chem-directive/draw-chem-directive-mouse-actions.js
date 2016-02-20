(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveMouseActions", DrawChemDirectiveMouseActions);

	DrawChemDirectiveMouseActions.$inject = [
    "DrawChemDirectiveFlags",
    "DrawChemDirectiveUtils",
    "DrawChemShapes",
    "DrawChemCache",
    "DrawChemConst",
    "DCLabel"
  ];

	function DrawChemDirectiveMouseActions(Flags, Utils, Shapes, Cache, Const, DCLabel) {

		var service = {},
      Label = DCLabel.Label,
      mouseFlags = Flags.mouseFlags;

    service.doOnMouseDown = function ($event, scope, element) {
      var elem;
      if ($event.which !== 1) {
        // if button other than left was pushed
        return undefined;
      }
      mouseFlags.downMouseCoords = Utils.innerCoords(element, $event);
      mouseFlags.mouseDown = true;
      if (!Utils.isContentEmpty()) {
        // if content is not empty
        if ($event.target.nodeName === "tspan") {
          elem = angular.element($event.target).parent();
          mouseFlags.downMouseCoords = [elem.attr("atomx"), elem.attr("atomy")];
        }
        checkIfDownOnAtom();
      }

      function checkIfDownOnAtom() {
        mouseFlags.downAtomCoords =
          Shapes.isWithin(
            Cache.getCurrentStructure(),
            mouseFlags.downMouseCoords
          ).absPos;
        if (typeof mouseFlags.downAtomCoords !== "undefined") {
          // set flag if atom was Flags.selected
          mouseFlags.downOnAtom = true;
        }
      }
    }

    service.doOnMouseUp = function ($event, scope, element) {
      var structure, mouseCoords = Utils.innerCoords(element, $event);

      if ($event.which !== 1) {
        // if button other than left was released
        return undefined;
      }

      if (mouseFlags.downOnAtom && (Flags.selected === "label" || Flags.selected === "customLabel")) {
        // if atom has been Flags.selected and 'change label' button is Flags.selected
        structure = modifyLabel();
      } else if (mouseFlags.downOnAtom && Flags.selected === "structure") {
        // if atom has been Flags.selected and any of the structure buttons has been clicked
        structure = Utils.modifyStructure(
          Cache.getCurrentStructure(),
          scope.chosenStructure,
          mouseCoords,
          mouseFlags.downAtomCoords
        );
      } else {
        structure = drawOnEmptySpace();
      }

      if (typeof structure !== "undefined") {
        // if the structure has been successfully set to something
        Cache.addStructure(structure);
        Utils.drawStructure(structure);
      }

      Utils.resetMouseFlags();

      function modifyLabel() {
        var structure = angular.copy(Cache.getCurrentStructure()),
          atom = Shapes.isWithin(structure, mouseFlags.downMouseCoords).foundAtom,
          currentLabel = atom.getLabel();
        if (Flags.selected === "label") {
          atom.setLabel(angular.copy(scope.chosenLabel));
        } else if (Flags.selected === "customLabel") {
          atom.setLabel(new Label(scope.customLabel, 0, "lr"));
        }

        if (typeof currentLabel !== "undefined") {
          if (currentLabel.getMode() === "lr") {
            atom.getLabel().setMode("rl");
          } else if (currentLabel.getMode() === "rl") {
            atom.getLabel().setMode("lr");
          }
        }

        return structure;
      }

      function drawOnEmptySpace() {
        var structure, structureAux, newCoords, bond;
        if (Utils.isContentEmpty()) {
          if (mouseFlags.movedOnEmpty) {
            structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
            structure.setOrigin(mouseFlags.downMouseCoords);
          } else {
            structure = angular.copy(scope.chosenStructure.getDefault());
            structure.setOrigin(mouseCoords);
          }
        } else {
          if (mouseFlags.movedOnEmpty) {
            structureAux = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
          } else {
            structureAux = angular.copy(scope.chosenStructure.getDefault());
          }
          structure = angular.copy(Cache.getCurrentStructure());
          newCoords = Utils.subtractCoords(mouseCoords, structure.getOrigin());
          structureAux
            .getStructure(0)
            .setCoords(newCoords);
          if (typeof structureAux.getDecorate("aromatic") !== "undefined") {
            bond = Const.getBondByDirection(structureAux.getName()).bond;
            structure.addDecorate("aromatic", [mouseCoords[0] + bond[0], mouseCoords[1] + bond[1]]);
          }
          structure.addToStructures(structureAux.getStructure(0));
        }
        return structure;
      }
    }

    service.doOnMouseMove = function ($event, scope, element) {
      var mouseCoords = Utils.innerCoords(element, $event), structure;

      if (Flags.selected !== "structure") {
        // if no structure has been chosen
        // then do nothing
        return undefined;
      }

      if (mouseFlags.downOnAtom) {
        // if an atom has been chosen
        structure = modifyOnNonEmptyContent();
        Utils.drawStructure(structure);
      } else if (mouseFlags.mouseDown) {
        // if mouse button is pushed outside of the structure
        structure = modifyOnEmptyContent();
        Utils.drawStructure(structure);
      }

      function modifyOnNonEmptyContent() {
        var frozenCurrentStructure = Cache.getCurrentStructure();
        return Utils.modifyStructure(
          frozenCurrentStructure,
          scope.chosenStructure,
          mouseCoords,
          mouseFlags.downAtomCoords,
          true
        );
      }

      function modifyOnEmptyContent() {
        var struct = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
        struct.setOrigin(mouseFlags.downMouseCoords);
        mouseFlags.movedOnEmpty = true;
        return struct;
      }
    }

		return service;
	}
})();
