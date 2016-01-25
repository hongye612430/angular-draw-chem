(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveUtils", DrawChemDirectiveUtils);
	
	DrawChemDirectiveUtils.$inject = [
		"DrawChemShapes",
		"DrawChemCache"
	];
	
	function DrawChemDirectiveUtils(DrawChemShapes, DrawChemCache) {
		
		var service = {};
		
		/**
		 * Draws the specified structure.
		 * @params {Structure} structure - a Structure object to draw.
		 */
		service.drawStructure = function (structure) {
			var drawn = "";					
			drawn = DrawChemShapes.draw(structure, "cmpd1");
			DrawChemCache.setCurrentSvg(drawn.wrap("full", "g").wrap("full", "svg").elementFull);
		};
		
		/**
		 * Sets all boolean values to false and non-boolean to undefined.
		 * @params {Object} flags - an object containing flags (as mix of boolean and non-boolean values)
		 */
		service.resetMouseFlags = function (flags) {
			angular.forEach(flags, function (value, key) {
				if (typeof value === "boolean") {
					flags[key] = false;
				} else {
					flags[key] = undefined;
				}
			});
		};
		
		/**
		 * Checks if the canvas is empty.
		 * @returns {Boolean}
		 */
		service.isContentEmpty = function isContentEmpty() {
			return DrawChemCache.getCurrentStructure() === null;
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
		 * @params {Number[]} clickCoords - coordinates of the mouse pointer
		 * @params {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (structure, chosenStructure, mouseCoords, downAtomCoords, mouseDownAndMove) {
			return DrawChemShapes.modifyStructure(
				angular.copy(structure),
				angular.copy(chosenStructure),
				mouseCoords,
				downAtomCoords,
				mouseDownAndMove
			);
		};
		
		return service;
	}
})();