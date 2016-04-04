(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCSelection", DCSelection);

	DCSelection.$inject = ["DrawChemUtils"]

	function DCSelection(Utils) {

		var service = {};

		/**
		* Creates a new `Selection` object.
		* @class
		* @param {number[]} origin - coords of the origin (relative to the absolute position of the 'parent' `Structure` object)
		* @param {number[]} current - current absolute position of the mouse
		*/
		function Selection(origin, current) {
			this.origin = origin;
			this.current = current;
		}

		/**
		 * Gets origin of this `Selection` object.
		 * @param {string} coord - which coord to return ('x' or 'y')
		 * @returns {number|number[]}
		 */
		Selection.prototype.getOrigin = function (coord) {
			if (coord === "x") {
				return this.origin[0];
			} else if (coord === "y") {
				return this.origin[1];
			} else {
				return this.origin;
			}
		};

		/**
		 * Sets origin of this `Selection` object.
		 * @param {number[]} origin - origin of this `Selection` object
		 */
		Selection.prototype.setOrigin = function (origin) {
			this.origin = origin;
		};

		/**
		 * Gets current mouse position.
		 * @param {string} coord - which coord to return ('x' or 'y')
		 * @returns {number[]}
		 */
		Selection.prototype.getCurrent = function (coord) {
			if (coord === "x") {
				return this.current[0];
			} else if (coord === "y") {
				return this.current[1];
			} else {
				return this.current;
			}
		};

    /**
		 * Sets current mouse position.
		 * @param {number[]} - current mouse position.
		 */
		Selection.prototype.setCurrent = function (current) {
		  this.current = current;
		};

		service.Selection = Selection;

		/**
		* Calculates rectangle attributes (x, y, width, and height).
		* @param {number[]} absPosStart - absolute coordinates associated with onMouseDown event,
		* @param {number[]} absPosEnd - absolute coordinates associated with onMouseUp event,
		* @returns {Object}
		*/
		service.calcRect = function (absPosStart, absPosEnd) {
			var startX, startY, width, height,
			  quadrant = Utils.getQuadrant(absPosStart, absPosEnd);

			if (quadrant === 1) {
				startX = absPosStart[0];
				startY = absPosEnd[1];
				width = absPosEnd[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quadrant === 2) {
				startX = absPosEnd[0];
				startY = absPosEnd[1];
				width = absPosStart[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quadrant === 3) {
				startX = absPosEnd[0];
				startY = absPosStart[1];
				width = absPosStart[0] - startX;
				height = absPosEnd[1] - startY;
			} else if (quadrant === 4) {
				startX = absPosStart[0];
				startY = absPosStart[1];
				width = absPosEnd[0] - startX;
				height = absPosEnd[1] - startY;
			}
			if (width < 0) {
				width = 0;
			}
			if (height < 0) {
				height = 0;
			}
			return { class: "selection", rect: [startX, startY, width, height] };
		};

		return service;
	}
})();
