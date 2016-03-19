(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrow", DCArrow);

	function DCArrow() {

		var service = {};

		/**
		* Creates a new Arrow.
		* @class
		*/
		function Arrow(type, direction, relativeEnd) {
			this.type = type;
			this.selected = false;
			this.direction = direction;
			this.relativeEnd = relativeEnd;
		}

		Arrow.prototype.select = function () {
			this.selected = true;
		};

		Arrow.prototype.deselect = function () {
			this.selected = false;
		}

		Arrow.prototype.getType = function () {
			return this.type;
		}

		Arrow.prototype.getRelativeEnd = function () {
			return this.relativeEnd;
		}

		Arrow.prototype.getEnd = function (coord) {
			if (coord === "x") {
				return this.end[0];
			} else if (coord === "y") {
				return this.end[1];
			} else {
				return this.end;
			}
		}

		Arrow.prototype.getDirection = function () {
			return this.direction;
		}

		/**
		 * Sets origin of the arrow.
		 * @param {Number[]} coords - an array with coordinates of the beginning coords of the arrow
		 */
		Arrow.prototype.setOrigin = function (origin) {
			this.origin = origin;
			if (typeof this.relativeEnd !== "undefined") {
				this.end = [
					origin[0] + this.relativeEnd[0],
					origin[1] + this.relativeEnd[1],
				];
			}
		};

		/**
		 * Gets origin of the arrow.
		 * @returns {Number[]|Number}
		 */
		Arrow.prototype.getOrigin = function (coord) {
			if (coord === "x") {
				return this.origin[0];
			} else if (coord === "y") {
				return this.origin[1];
			} else {
				return this.origin;
			}
		};

		service.Arrow = Arrow;

		return service;
	}
})();
