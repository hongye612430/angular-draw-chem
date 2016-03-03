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
    "DCLabel",
		"DCStructure"
  ];

	function DrawChemDirectiveMouseActions(Flags, Utils, Shapes, Cache, Const, DCLabel, DCStructure) {

		var service = {},
      Label = DCLabel.Label,
			Structure = DCStructure.Structure,
      mouseFlags = Flags.mouseFlags;

    service.doOnMouseDown = function ($event, scope, element) {
      var elem;
			// if button other than left was used
      if ($event.which !== 1) { return undefined; }
			// set mouse coords
      mouseFlags.downMouseCoords = Utils.innerCoords(element, $event);
			// set flag
      mouseFlags.mouseDown = true;

			// check if the event occurred on an atom
			// if content is not empty and (label is selected or structure is selected)
			// otherwise there is no necessity for checking this
			if (!Utils.isContentEmpty() && (Flags.selected === "label" || Flags.selected === "customLabel" || Flags.selected === "structure")) {
        // if content is not empty
        if ($event.target.nodeName === "tspan") {
          elem = angular.element($event.target).parent();
          mouseFlags.downMouseCoords = [elem.attr("atomx"), elem.attr("atomy")];
        }
        checkIfDownOnAtom();
      }

      function checkIfDownOnAtom() {
				var withinObject = Shapes.isWithin(Cache.getCurrentStructure(), mouseFlags.downMouseCoords);
        mouseFlags.downAtomCoords = withinObject.absPos;
				mouseFlags.downAtomObject = withinObject.foundAtom;
        if (typeof withinObject.foundAtom !== "undefined") {
          // set flag if atom was found
          mouseFlags.downOnAtom = true;
        }
      }
    }

    service.doOnMouseUp = function ($event, scope, element) {
      var structure, mouseCoords = Utils.innerCoords(element, $event);

			// if button other than left was released do nothing
			// if selected flag is empty do nothing
      if ($event.which !== 1 || Flags.selected === "") {
				Utils.resetMouseFlags();
				return undefined;
			}

			if (Flags.selected === "arrow") {
				// if arrow was selected
				// if content is empty or atom was not found
				structure = addArrowOnEmptyContent();
			} else if (mouseFlags.downOnAtom && (Flags.selected === "label" || Flags.selected === "customLabel")) {
        // if atom has been found and label is selected
        structure = modifyLabel();
      } else if (mouseFlags.downOnAtom && Flags.selected === "structure") {
        // if atom has been found and structure has been selected
        structure = modifyOnNonEmptyContent(scope, mouseCoords, false);
      } else {
				// if content is empty or atom was not found
        structure = addStructureOnEmptyContent();
      }

      if (typeof structure !== "undefined") {
        // if the structure has been successfully set to something
				// then add it to Cache and draw it
        Cache.addStructure(structure);
        Utils.drawStructure(structure);
      }
			// reset mouse flags at the end
      Utils.resetMouseFlags();

      function modifyLabel() {
				// copy structure from Cache
        var structure = angular.copy(Cache.getCurrentStructure()),
					// find the atom object in the new structure
          atom = Shapes.isWithin(structure, mouseFlags.downMouseCoords).foundAtom,
          currentLabel = atom.getLabel();
				// set Label object
				// either predefined or custom
        if (Flags.selected === "label") {
          atom.setLabel(angular.copy(scope.chosenLabel));
        } else if (Flags.selected === "customLabel") {
          atom.setLabel(new Label(Flags.customLabel, 0));
        }

				// if atom object already has a label on it
				// then change its direction on mouseup event
        if (typeof currentLabel !== "undefined") {
          if (currentLabel.getMode() === "lr") {
            atom.getLabel().setMode("rl");
          } else if (currentLabel.getMode() === "rl") {
            atom.getLabel().setMode("lr");
          }
        }
        return structure;
      }

			function addArrowOnEmptyContent() {
				var structure, arrow, newCoords;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					// new Structure object has to be created
					structure = new Structure();
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// set origin of the Structure object (which may be different from current mouse position)
						structure.setOrigin(mouseFlags.downMouseCoords);
						// choose appropriate arrow from ArrowCluster object
						arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
						// as a reminder: Structure object has origin with an absolute value,
						// but each object in its structures array has origin in relation to this absolute value;
						// first object in this array has therefore always coords [0, 0]
						arrow.setOrigin([0, 0]);
					} else {
						// if mousemove event didn't occur, assume mouse coords from this (mouseup) event
						structure.setOrigin(mouseCoords);
						// get default arrow
						arrow = angular.copy(scope.chosenArrow.getDefault());
						// calculate and set coords
						newCoords = Utils.subtractCoords(mouseCoords, structure.getOrigin());
						arrow.setOrigin(newCoords);
					}
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// set origin of the Structure object (which may be different from current mouse position)
						arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
					} else {
						// otherwise get default arrow
						arrow = angular.copy(scope.chosenArrow.getDefault());
					}
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					// calculate and set coords
					arrow.setOrigin(newCoords);
				}
				// add Arrow object to the structures array in the Structure object
				structure.addToStructures(arrow);
				// return Structure object
				return structure;
			}

			function addStructureOnEmptyContent() {
				var structure, structureAux, newCoords, bond;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// choose an appropriate Structure object from the StructureCluster object
						structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
						// and set its origin (which may be different from current mouse position)
						structure.setOrigin(mouseFlags.downMouseCoords);
					} else {
						// otherwise get default Structure object
						structure = angular.copy(scope.chosenStructure.getDefault());
						// and set its origin
						structure.setOrigin(mouseCoords);
					}
				} else {
					// when the content is not empty
					// Structure object already exists,
					// so get it from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// choose an appropriate Structure object from the StructureCluster object
						structureAux = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
						if (typeof structureAux.getDecorate("aromatic") !== "undefined") {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structureAux.getName()).bond;
							structure.addDecorate("aromatic", [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]);
						}
					} else {
						// otherwise get default
						structureAux = angular.copy(scope.chosenStructure.getDefault());
						if (typeof structureAux.getDecorate("aromatic") !== "undefined") {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structureAux.getName()).bond;
							structure.addDecorate("aromatic", [mouseCoords[0] + bond[0], mouseCoords[1] + bond[1]]);
						}
					}
					// calaculate new coords
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					// extract the first object from structures array and set its origin
					structureAux.getStructure(0).setCoords(newCoords);
					// add to the original Structure object
					structure.addToStructures(structureAux.getStructure(0));
				}
				return structure;
			}
    }

    service.doOnMouseMove = function ($event, scope, element) {
      var mouseCoords = Utils.innerCoords(element, $event), structure;

      if (!mouseFlags.mouseDown || Flags.selected === "label" || Flags.selected === "labelCustom" || Flags.selected === "") {
				// if mousedown event did not occur, then do nothing
        // if label is selected or nothing is selected, then also do nothing
        return undefined;
      }

      if (mouseFlags.downOnAtom) {
        // if an atom has been found
        structure = modifyOnNonEmptyContent(scope, mouseCoords, true);
      } else if (mouseFlags.mouseDown && Flags.selected === "arrow") {
        // if an atom has not been found but the mouse is still down
				// the content is either empty or the mousedown event occurred somewhere outside of the current Structure object
        structure = addArrowOnEmptyContent();
      } else if (mouseFlags.mouseDown && Flags.selected === "structure") {
        // if an atom has not been found but the mouse is still down
				// the content is either empty or the mousedown event occurred somewhere outside of the current Structure object
        structure = addStructureOnEmptyContent();
      }

			if (typeof structure !== "undefined") {
				// if the structure has been successfully set to something
				// then draw it
				Utils.drawStructure(structure);
			}

			function addArrowOnEmptyContent() {
				var structure, arrow, newCoords;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					// new Structure object has to be created
					structure = new Structure();
					// set origin of the Structure object (which may be different from current mouse position)
					structure.setOrigin(mouseFlags.downMouseCoords);
					// choose appropriate arrow from ArrowCluster object
					arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
					// as a reminder: Structure object has origin with an absolute value,
					// but each object in its structures array has origin in relation to this absolute value;
					// first object in this array has therefore always coords [0, 0]
					arrow.setOrigin([0, 0]);
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// choose appropriate arrow from ArrowCluster object
					arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					// calculate and set coords
					arrow.setOrigin(newCoords);
				}
				// add Arrow object to the structures array in the Structure object
				structure.addToStructures(arrow);
				mouseFlags.movedOnEmpty = true;
				// return Structure object
				return structure;
			}

			function addStructureOnEmptyContent() {
				var structure, structureAux, newCoords, bond;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
					// set its origin (which may be different from current mouse position)
					structure.setOrigin(mouseFlags.downMouseCoords);
				} else {
					// when the content is not empty, a Structure object already exists,
					// so get it from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// choose an appropriate Structure object from the StructureCluster object
					structureAux = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
					if (typeof structureAux.getDecorate("aromatic") !== "undefined") {
						// if the chosen Structure object is aromatic,
						// then add appropriate flag to the original Structure object
						bond = Const.getBondByDirection(structureAux.getName()).bond;
						structure.addDecorate("aromatic", [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]);
					}
					// calaculate new coords
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					// extract the first object from structures array and set its origin
					structureAux.getStructure(0).setCoords(newCoords);
					// add to the original Structure object
					structure.addToStructures(structureAux.getStructure(0));
				}
				mouseFlags.movedOnEmpty = true;
				return structure;
			}
    }

		return service;

		function modifyOnNonEmptyContent(scope, mouseCoords, move) {
			return Utils.modifyStructure(
				Cache.getCurrentStructure(),
				scope.chosenStructure,
				mouseCoords,
				mouseFlags.downAtomCoords,
				move
			);
		}
	}
})();