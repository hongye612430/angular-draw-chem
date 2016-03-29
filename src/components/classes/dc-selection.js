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

		service.calcRect = function (quarter, absPosStart, absPosEnd) {
			var startX, startY, width, height;
			if (quarter === 1) {
				startX = absPosStart[0];
				startY = absPosEnd[1];
				width = absPosEnd[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quarter === 2) {
				startX = absPosEnd[0];
				startY = absPosEnd[1];
				width = absPosStart[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quarter === 3) {
				startX = absPosEnd[0];
				startY = absPosStart[1];
				width = absPosStart[0] - startX;
				height = absPosEnd[1] - startY;
			} else if (quarter === 4) {
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
