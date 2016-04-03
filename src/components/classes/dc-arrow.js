(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrow", DCArrow);

	DCArrow.$inject = ["DrawChemUtils", "DrawChemConst"];

	function DCArrow(Utils, Const) {

		var service = {},
		  ARROW_START = Const.ARROW_START,
		  ARROW_SIZE = Const.ARROW_SIZE,
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
		  BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS;

		/**
		* Creates a new `Arrow` object.
		* @class
		* @param {string} type - arrow type (one-way, etc.),
		* @param {number[]} relativeEnd - building vector
		*/
		function Arrow(type, relativeEnd) {
			this.type = type;
			this.selected = false;
			this.relativeEnd = relativeEnd;
		}

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

		/**
		* Calculates data for the svg instructions in `path` element.
		* @param {number[]} start - start coordinates (absolute) of the arrow,
		* @param {number[]} end - end coordinates (absolute) of the arrow,
		* @param {string} type - arrow type (one-way, etc.),
		* @returns {Array}
		*/
		service.calcArrow = function (start, end, type) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCCW = [vectCoords[1], -vectCoords[0]], endMarkerStart, startMarkerStart, M1, M2, L1, L2, L3, L4;
			if (type === "one-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				L1 = Utils.addVectors(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addVectors(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return ["arrow", "M", start, "L", end, "M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z"];
			} else if (type === "two-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				startMarkerStart = [start[0] + vectCoords[0] * (1 - ARROW_START), start[1] + vectCoords[1] * (1 - ARROW_START)];
				L1 = Utils.addVectors(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addVectors(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				L3 = Utils.addVectors(startMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L4 = Utils.addVectors(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return [
					"arrow",
					"M", start, "L", end,
					"M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z",
					"M", startMarkerStart, "L", L3, "L", start, "L", L4, "Z"
				];
			}
			else if (type === "equilibrium-arrow") {
				M1 = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				endMarkerStart = [parseFloat(M1[0]) + vectCoords[0] * ARROW_START, parseFloat(M1[1]) + vectCoords[1] * ARROW_START];
				L2 = Utils.addVectors(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);

				M2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				L3 = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				startMarkerStart = [parseFloat(L3[0]) + vectCoords[0] * (1 - ARROW_START), parseFloat(L3[1]) + vectCoords[1] * (1 - ARROW_START)];
				L4 = Utils.addVectors(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return [
					"arrow-eq",
					"M", M1, "L", L1, "L", L2,
					"M", M2, "L", L3, "L", L4
				];
			}
		}

		return service;
	}
})();
