(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveUtils", DrawChemDirectiveUtils);

	DrawChemDirectiveUtils.$inject = [
		"DrawChemModStructure",
		"DrawChemSvgRenderer",
		"DrawChemCache",
		"DrawChemDirectiveFlags"
	];

	function DrawChemDirectiveUtils(ModStructure, SvgRenderer, Cache, Flags) {

		var service = {};

		/**
		 * Draws the specified structure.
		 * @param {Structure} structure - a Structure object to draw.
		 */
		service.drawStructure = function (structure) {
			return SvgRenderer.draw(structure, "cmpd1");			
		};

		/**
		 * Sets all boolean values to false and non-boolean to undefined.
		 * @param {Object} flags - an object containing flags (as mix of boolean and non-boolean values)
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
		service.subtractVectors = function (arr1, arr2) {
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

		service.performSearch = function (validSelected) {
			var result = false;
			validSelected.forEach(function (selected) {
				if (selected === Flags.selected) { result = true; }
			});
			return result;
		};

		return service;
	}
})();
