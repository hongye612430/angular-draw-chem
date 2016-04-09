(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrow", DCArrow);

	function DCArrow() {

		var service = {};

		/**
		* Creates a new `Arrow` object.
		* @class
		* @param {string} type - arrow type (one-way, etc.),
		* @param {number[]} relativeEnd - building vector
		*/
		function Arrow(type, relativeEnd) {
			this.type = type;
			this.relativeEnd = relativeEnd;
		}

		/**
		* Checks if this `Arrow` object is marked as selected.
		* @returns {boolean}
		*/
		Arrow.prototype.isSelected = function () {
			return !!this.selected;
		};

		/**
		* Marks this `Arrow` object as selected.
		*/
		Arrow.prototype.select = function () {
			this.selected = true;
		};

		/**
		* Unmarks selection of this `Arrow`.
		*/
		Arrow.prototype.deselect = function () {
			this.selected = false;
		};

		/**
		* Gets type of this `Arrow` object.
		* @returns {string}
		*/
		Arrow.prototype.getType = function () {
			return this.type;
		};

		/**
		* Gets relative end (vector) of this `Arrow` object.
		* @returns {number[]}
		*/
		Arrow.prototype.getRelativeEnd = function () {
			return this.relativeEnd;
		};

		/**
		* Gets end coordinates of this `Arrow` object in relation to its origin.
		* @param {string} coord - which coord to return ('x' or 'y'),
		* @returns {number|number[]}
		*/
		Arrow.prototype.getEnd = function (coord) {
			if (coord === "x") {
				return this.end[0];
			} else if (coord === "y") {
				return this.end[1];
			} else {
				return this.end;
			}
		};

		/**
		 * Sets origin of this `Arrow` object.
		 * @param {number[]} origin - beginning coords of the arrow
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
		 * Adds a vector to the origin.
		 * @param {number[]} v - vector
		 */
		Arrow.prototype.addToCoords = function (v) {
			this.origin[0] += v[0];
			this.origin[1] += v[1];
		};

		/**
		* Gets start coordinates of this `Arrow` object.
		* @param {string} coord - which coord to return ('x' or 'y'),
		* @returns {number|number[]}
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

		/**
		 * Updates end coordinates of this `Arrow` object (in relation to its origin).
		 */
		Arrow.prototype.updateEnd = function () {
			if (typeof this.relativeEnd !== "undefined") {
				this.end = [
					this.origin[0] + this.relativeEnd[0],
					this.origin[1] + this.relativeEnd[1],
				];
			}
		};

		service.Arrow = Arrow;

		return service;
	}
})();
