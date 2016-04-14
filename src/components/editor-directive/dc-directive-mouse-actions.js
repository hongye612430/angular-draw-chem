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

	function DrawChemDirectiveMouseActions(Flags, DirUtils, ModStructure, Cache, Const, DCLabel, DCStructure, DCSelection) {

		var service = {},
      Label = DCLabel.Label,
			Selection = DCSelection.Selection,
			Structure = DCStructure.Structure,
      mouseFlags = Flags.mouseFlags,
			currWorkingStructure = null;

    service.doOnMouseDown = function ($event, scope, element) {
      var elem, structure;
			// if button other than left was used
      if ($event.which !== 1) { return; }
			// set mouse coords
      mouseFlags.downMouseCoords = DirUtils.innerCoords(element, $event);
			// set flag
      mouseFlags.mouseDown = true;
			// get current working structure (copy it from Cache)
			currWorkingStructure = angular.copy(Cache.getCurrentStructure());

			// check if the event occurred on an atom
			// if content is not empty and (label is selected or structure is selected or delete is selected)
			// otherwise there is no necessity for checking this
			if (currWorkingStructure !== null && DirUtils.performSearch(["label", "removeLabel", "customLabel", "structure"])) {
        // if content is not empty
				// check if label was clicked
				// if so, replace mouseCoords with coords of an underlying atom
        if ($event.target.nodeName === "tspan") {
          elem = angular.element($event.target).parent();
          mouseFlags.downMouseCoords = [elem.attr("atomx"), elem.attr("atomy")];
        }
        checkIfDownOnAtom(); // checks if mouseCoords are within an atom
				if (!mouseFlags.downOnAtom) {
					// if mouseCoords are not within an atom,
					// then check if they are within a bond
					checkIfDownOnBond();
				}
				if (!mouseFlags.downOnAtom && !mouseFlags.downOnBond) {
					mouseFlags.downOnNothing = true;
				}
      }

      function checkIfDownOnAtom() {
				var withinObject = ModStructure.isWithinAtom(currWorkingStructure, mouseFlags.downMouseCoords);
        if (typeof withinObject.foundAtom !== "undefined") {
          // set flags if atom was found
          mouseFlags.downOnAtom = true;
					mouseFlags.downAtomObject = withinObject.foundAtom;
					mouseFlags.downAtomCoords = withinObject.absPos;
					mouseFlags.downAtomFirst = withinObject.firstAtom;
        }
      }

			function checkIfDownOnBond() {
				var withinObject = ModStructure.isWithinBond(currWorkingStructure, mouseFlags.downMouseCoords);
        if (typeof withinObject.foundBond !== "undefined") {
					// set flags if bond was found
          mouseFlags.downOnBond = true;
					mouseFlags.downBondObject = withinObject.foundBond;
        }
      }
    }

    service.doOnMouseUp = function ($event, scope, element) {
      var mouseCoords = DirUtils.innerCoords(element, $event), drawn;

			// if button other than left was released do nothing
			// or if selected flag is empty do nothing
      if ($event.which !== 1 || Flags.selected === "") {
				DirUtils.resetMouseFlags();
				return;
			}

			if (Flags.selected === "delete") {
				// if delete was selected
				ModStructure.deleteFromStructure(currWorkingStructure, mouseCoords);
			} else if (Flags.selected === "select") {
				// if selection tool was selected
				ModStructure.makeSelection(currWorkingStructure, mouseCoords, mouseFlags.downMouseCoords);
				// remove `Selection` object afterwards
				currWorkingStructure.getStructure().pop();
			} else if (Flags.selected === "moveStructure") {
				// if `move` tool was selected
				ModStructure.moveStructure(currWorkingStructure, mouseCoords, mouseFlags.downMouseCoords);
			} else if (Flags.selected === "arrow") {
				// if arrow was selected,
				// and click was done on empty space
				currWorkingStructure = ModStructure.addArrowOnEmptySpace(
					currWorkingStructure,
					mouseCoords,
					mouseFlags.downMouseCoords,
					scope.chosenArrow
				);
			} else if (mouseFlags.downOnAtom && DirUtils.performSearch(["label", "removeLabel", "customLabel"])) {
        // if atom has been found and label is selected
        ModStructure.modifyLabel(
					mouseFlags.downAtomObject,
					Flags.selected,
					scope.chosenLabel,
					Flags.customLabel
				);
      } else if (mouseFlags.downOnAtom && Flags.selected === "structure") {
        // if atom has been found and structure has been selected
        ModStructure.modifyAtom(
					currWorkingStructure,
					mouseFlags.downAtomObject,
					mouseFlags.downAtomFirst,
					mouseFlags.downAtomCoords,
					mouseCoords,
					scope.chosenStructure
				);
      } else if (mouseFlags.downOnBond && Flags.selected === "structure") {
        // if atom has been found and structure has been selected
        ModStructure.modifyBond(mouseFlags.downBondObject, scope.chosenStructure);
      } else if (Flags.selected === "structure") {
				// if content is empty or atom was not found
        currWorkingStructure = ModStructure.addStructureOnEmptySpace(
					currWorkingStructure,
					scope.chosenStructure,
					mouseCoords,
					mouseFlags.downMouseCoords
				);
      }

      if (currWorkingStructure !== null) {
        // if the structure has been successfully set to something
				// then add it to Cache and draw it
        Cache.addStructure(angular.copy(currWorkingStructure));
				drawn = DirUtils.drawStructure(currWorkingStructure);
				Cache.setCurrentSvg(drawn.wrap("full", "g").wrap("full", "svg").elementFull);
      }
			// reset mouse flags afterwards
      DirUtils.resetMouseFlags();
    };

    service.doOnMouseMove = function ($event, scope, element) {
      var mouseCoords = DirUtils.innerCoords(element, $event), drawn, frozenStructure, frozenAtomObj = {};

      if (!mouseFlags.mouseDown || DirUtils.performSearch(["label", "labelCustom", ""])) {
				// if mousedown event did not occur, then do nothing
        // if label is selected or nothing is selected, then also do nothing
        return;
      }

			frozenStructure = angular.copy(currWorkingStructure);
			if (frozenStructure !== null) {
				frozenAtomObj = ModStructure.isWithinAtom(frozenStructure, mouseFlags.downMouseCoords);
			}

			if (Flags.selected === "select") {
				// if selection tool was selected
				ModStructure.makeSelection(frozenStructure, mouseCoords, mouseFlags.downMouseCoords);
			} else if (Flags.selected === "moveStructure") {
				// if `move` tool was selected
				ModStructure.moveStructure(frozenStructure, mouseCoords, mouseFlags.downMouseCoords);
			} else if (Flags.selected === "arrow") {
				// the content is either empty or the mousedown event occurred somewhere outside of the current `Structure` object
				frozenStructure = ModStructure.addArrowOnEmptySpace(
					frozenStructure,
					mouseCoords,
					mouseFlags.downMouseCoords,
					scope.chosenArrow
				);
      } else if (typeof frozenAtomObj.foundAtom !== "undefined") {
				// if atom has been found and structure has been selected
        ModStructure.modifyAtom(
					frozenStructure,
					frozenAtomObj.foundAtom,
					frozenAtomObj.firstAtom,
					frozenAtomObj.absPos,
					mouseCoords,
					scope.chosenStructure
				);
      } else if (Flags.selected === "structure") {
				// if content is empty or atom was not found
        frozenStructure = ModStructure.addStructureOnEmptySpace(
					frozenStructure,
					scope.chosenStructure,
					mouseCoords,
					mouseFlags.downMouseCoords
				);
      }

			if (frozenStructure !== null) {
				drawn = DirUtils.drawStructure(angular.copy(frozenStructure));
				Cache.setCurrentSvg(drawn.wrap("full", "g").wrap("full", "svg").elementFull);
			}
    }

		return service;
	}
})();
