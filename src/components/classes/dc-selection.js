(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCSelection", DCSelection);

	function DCSelection() {

		var service = {};

		/**
		* Creates a new Selection.
		* @class
		* @param {Number[]} origin - coords of the origin relative to the absolute position of the 'parent' Structure object
		* @param {Number[]} current - current absolute position of the mouse
		*/
		function Selection(origin, current) {
			this.origin = origin;
			this.current = current;
			this.quarter = 4;
		}

		/**
		 * Gets origin.
		 * @returns {Number[]}
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
		 * Sets origin.
		 * @param {Number[]} - origin of the element
		 */
		Selection.prototype.setOrigin = function (origin) {
			this.origin = origin;
		};

		/**
		 * Gets current mouse position.
		 * @returns {Number[]}
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
		 * @param {Number[]} - current mouse position.
		 */
		Selection.prototype.setCurrent = function (current) {
		  this.current = current;
		};

		/**
		 * Returns in which quarter is the rect (mouseDown coords as the beginning of the coordinate system).
		 * @returns {Number}
		 */
		Selection.prototype.getQuarter = function () {
			return this.quarter;
		};

		/**
		 * Sets in which quarter is the rect (mouseDown coords as the beginning of the coordinate system).
		 * @returns {Boolean}
		 */
		Selection.prototype.setQuarter = function (quarter) {
			this.quarter = quarter;
		};

		service.Selection = Selection;

		return service;
	}
})();
