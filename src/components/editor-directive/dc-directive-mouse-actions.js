(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveMouseActions", DrawChemDirectiveMouseActions);

	DrawChemDirectiveMouseActions.$inject = [
    "DrawChemDirectiveFlags",
    "DrawChemDirectiveUtils",
    "DrawChemModStructure",
    "DrawChemCache",
    "DrawChemConst",
    "DCLabel",
		"DCStructure",
		"DCSelection"
  ];

	function DrawChemDirectiveMouseActions(Flags, Utils, ModStructure, Cache, Const, DCLabel, DCStructure, DCSelection) {

		var service = {},
      Label = DCLabel.Label,
			Selection = DCSelection.Selection,
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
			// if content is not empty and (label is selected or structure is selected or delete is selected)
			// otherwise there is no necessity for checking this
			if (!Utils.isContentEmpty() &&
						(
							Flags.selected === "label"
							|| Flags.selected === "removeLabel"
							|| Flags.selected === "customLabel"
							|| Flags.selected === "structure"
						)
					) {
        // if content is not empty
        if ($event.target.nodeName === "tspan") {
          elem = angular.element($event.target).parent();
          mouseFlags.downMouseCoords = [elem.attr("atomx"), elem.attr("atomy")];
        }
        checkIfDownOnAtom();
      }

      function checkIfDownOnAtom() {
				var withinObject = ModStructure.isWithin(Cache.getCurrentStructure(), mouseFlags.downMouseCoords);
        mouseFlags.downAtomCoords = withinObject.absPos;
				mouseFlags.downAtomObject = withinObject.foundAtom;
        if (typeof withinObject.foundAtom !== "undefined") {
          // set flag if atom was found
          mouseFlags.downOnAtom = true;
        }
      }
    }

    service.doOnMouseUp = function ($event, scope, element) {
      var structure, mouseCoords = Utils.innerCoords(element, $event), i;

			// if button other than left was released do nothing
			// if selected flag is empty do nothing
      if ($event.which !== 1 || Flags.selected === "") {
				Utils.resetMouseFlags();
				return undefined;
			}

			if (Flags.selected === "delete") {
				structure = deleteFromStructure();
			} else if (Flags.selected === "select") {
				structure = makeSelection(mouseCoords);
				structure.getStructure().pop();
			} else if (Flags.selected === "moveStructure") {
				structure = moveStructure(mouseCoords);
			} else if (Flags.selected === "arrow") {
				// if arrow was selected
				// if content is empty or atom was not found
				structure = addArrowOnEmptyContent();
			} else if (mouseFlags.downOnAtom && (Flags.selected === "label" || Flags.selected === "customLabel" || Flags.selected === "removeLabel")) {
        // if atom has been found and label is selected
        structure = modifyLabel();
      } else if (mouseFlags.downOnAtom && Flags.selected === "structure") {
        // if atom has been found and structure has been selected
        structure = modifyOnNonEmptyContent(scope, mouseCoords, false);
      } else if (Flags.selected === "structure") {
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

			// checks if mouseup occurred on an atom and modifies the structure accordingly
			function deleteFromStructure() {
				if (!Utils.isContentEmpty()) {
					return Utils.deleteFromStructure(
						Cache.getCurrentStructure(),
						mouseCoords
					);
				}
			}

      function modifyLabel() {
				// copy structure from Cache
        var structure = angular.copy(Cache.getCurrentStructure()),
					// find the atom object in the new structure
          atom = ModStructure.isWithin(structure, mouseFlags.downMouseCoords).foundAtom,
          currentLabel = atom.getLabel();
				// set Label object
				// either predefined or custom
        if (Flags.selected === "label") {
          atom.setLabel(angular.copy(scope.chosenLabel));
        } else if (Flags.selected === "customLabel") {
					Flags.customLabel = typeof Flags.customLabel === "undefined" ? "": Flags.customLabel;
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

				if (Flags.selected === "removeLabel") {
					atom.removeLabel();
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
						arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
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
						newCoords = Utils.subtractVectors(mouseCoords, structure.getOrigin());
						arrow.setOrigin(newCoords);
					}
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// set origin of the Structure object (which may be different from current mouse position)
						arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
					} else {
						// otherwise get default arrow
						arrow = angular.copy(scope.chosenArrow.getDefault());
					}
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
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
						structure = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
						// and set its origin (which may be different from current mouse position)
						structure.setOrigin(mouseFlags.downMouseCoords);
						if (structure.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structure.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: [0, 0],
								coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
							});
						}
					} else {
						// otherwise get default Structure object
						structure = angular.copy(scope.chosenStructure.getDefault());
						// and set its origin
						structure.setOrigin(mouseCoords);
						if (structure.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structure.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: [0, 0],
								coords: [mouseCoords[0] + bond[0], mouseCoords[1] + bond[1]]
							});
						}
					}
				} else {
					// when the content is not empty
					// Structure object already exists,
					// so get it from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// calaculate new coords
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// choose an appropriate Structure object from the StructureCluster object
						structureAux = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
						if (structureAux.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structureAux.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: angular.copy(newCoords),
								coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
							});
						}
					} else {
						// otherwise get default
						structureAux = angular.copy(scope.chosenStructure.getDefault());
						if (structureAux.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structureAux.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: angular.copy(newCoords),
								coords: [mouseCoords[0] + bond[0], mouseCoords[1] + bond[1]]
							});
						}
					}
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

			if (Flags.selected === "select") {
				structure = makeSelection(mouseCoords);
			} else if (Flags.selected === "moveStructure") {
				structure = moveStructure(mouseCoords);
			} else if (Flags.selected === "arrow") {
        // if an atom has not been found but the mouse is still down
				// the content is either empty or the mousedown event occurred somewhere outside of the current Structure object
        structure = addArrowOnEmptyContent();
      } else if (mouseFlags.downOnAtom) {
        // if an atom has been found
        structure = modifyOnNonEmptyContent(scope, mouseCoords, true);
      } else if (Flags.selected === "structure") {
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
					// choose appropriate `Arrow` based on mouse coords
					arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
					// as a reminder: Structure object has origin with an absolute value,
					// but each object in its structures array has origin in relation to this absolute value;
					// first object in this array has therefore always coords [0, 0]
					arrow.setOrigin([0, 0]);
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// choose appropriate arrow from ArrowCluster object
					arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
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
					structure = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
					// set its origin (which may be different from current mouse position)
					structure.setOrigin(mouseFlags.downMouseCoords);
					if (structure.isAromatic()) {
						// if the chosen Structure object is aromatic,
						// then add appropriate flag to the original Structure object
						bond = Const.getBondByDirection(structure.getName()).bond;
						structure.addDecorate("aromatic", {
							fromWhich: angular.copy(newCoords),
							coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
						});
					}
				} else {
					// when the content is not empty, a Structure object already exists,
					// so get it from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// calaculate new coords
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
					// choose an appropriate Structure object from the StructureCluster object
					structureAux = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
					if (structureAux.isAromatic()) {
						// if the chosen Structure object is aromatic,
						// then add appropriate flag to the original Structure object
						bond = Const.getBondByDirection(structureAux.getName()).bond;
						structure.addDecorate("aromatic", {
							fromWhich: angular.copy(newCoords),
							coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
						});
					}
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

		function moveStructure(mouseCoords) {
			var structure, moveDistance;
			if (!Utils.isContentEmpty()) {
				// if the content is non-empty
				structure = angular.copy(Cache.getCurrentStructure());
				moveDistance = Utils.subtractVectors(mouseCoords, mouseFlags.downMouseCoords);
				structure.moveStructureTo("mouse", moveDistance);
			}
			return structure;
		}

		function makeSelection(mouseCoords) {
			var structure, selection, newCoords, width, height;
			if (Utils.isContentEmpty()) {
				// if the content is empty
				// new Structure object has to be created
				structure = new Structure();
				// set origin of the Structure object (which may be different from current mouse position)
				structure.setOrigin(mouseFlags.downMouseCoords);
				selection = new Selection([0, 0], mouseCoords);
			} else {
				// if the content is not empty, a Structure object already exists
				// so get Structure object from Cache
				structure = angular.copy(Cache.getCurrentStructure());
				newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
				selection = new Selection(newCoords, mouseCoords);
			}
			structure.select(selection);
			// add Arrow object to the structures array in the Structure object
			structure.addToStructures(selection);
			// return Structure object
			return structure;
		}
	}
})();
