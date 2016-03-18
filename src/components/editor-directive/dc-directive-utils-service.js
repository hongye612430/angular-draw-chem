(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveUtils", DrawChemDirectiveUtils);

	DrawChemDirectiveUtils.$inject = [
		"DrawChemShapes",
		"DrawChemCache",
		"DrawChemDirectiveFlags"
	];

	function DrawChemDirectiveUtils(Shapes, Cache, Flags) {

		var service = {};

		/**
		 * Draws the specified structure.
		 * @params {Structure} structure - a Structure object to draw.
		 */
		service.drawStructure = function (structure) {
			var drawn = "";
			drawn = Shapes.draw(structure, "cmpd1");
			Cache.setCurrentSvg(drawn.wrap("full", "g").wrap("full", "svg").elementFull);
			return drawn;
		};

		/**
		 * Sets all boolean values to false and non-boolean to undefined.
		 * @params {Object} flags - an object containing flags (as mix of boolean and non-boolean values)
		 */
		service.resetMouseFlags = function () {
			angular.forEach(Flags.mouseFlags, function (value, key) {
				if (typeof value === "boolean") {
					Flags.mouseFlags[key] = false;
				} else {
					Flags.mouseFlags[key] = undefined;
				}
			});
		};

		/**
		 * Subtracts the coords in the second array from the first array.
		 * @param {Number[]} arr1 - first array
		 * @param {Number[]} arr2 - second array
		 * @returns {Number[]}
		 */
		service.subtractCoords = function (arr1, arr2) {
			return [arr1[0] - arr2[0], arr1[1] - arr2[1]];
		}

		/**
		 * Checks if the canvas is empty.
		 * @returns {Boolean}
		 */
		service.isContentEmpty = function isContentEmpty() {
			return Cache.getCurrentStructure() === null;
		};

		/**
		 * Calculates the coordinates of the mouse pointer during an event.
		 * Takes into account the margin of the enclosing div.
		 * @params {Event} $event - an Event object
		 * @returns {Number[]}
		 */
		service.innerCoords = function (element, $event) {
			var content = element.find("dc-content")[0],
				coords = [
					parseFloat(($event.clientX - content.getBoundingClientRect().left - 2).toFixed(2)),
					parseFloat(($event.clientY - content.getBoundingClientRect().top - 2).toFixed(2))
				];
			return coords;
		};

		/**
		 * Modifies the specified structure by adding a new structure to it.
		 * @params {Structure} structure - a Structure object to modify,
		 * @params {Structure} chosenStructure - a Structure object to add,
		 * @params {Number[]} clickCoords - coordinates of the mouse pointer,
		 * @params {Number[]} downAtomCoords - coordinates of an atom on which 'mousedown' occurred,
		 * @params {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (structure, chosenStructure, mouseCoords, downAtomCoords, mouseDownAndMove) {
			return Shapes.modifyStructure(
				angular.copy(structure),
				angular.copy(chosenStructure),
				mouseCoords,
				downAtomCoords,
				mouseDownAndMove
			);
		};

		/**
		 * Looks for an atom and deletes it.
		 * @params {Structure} structure - a Structure object to modify,
		 * @params {Number[]} mouseCoords - coordinates of the mouse pointer (where 'mouseup occurred')
		 * @returns {Structure}
		 */
		service.deleteFromStructure = function (structure, mouseCoords) {
			return Shapes.deleteFromStructure(
				angular.copy(structure),
				mouseCoords
			);
		};

		return service;
	}
})();
