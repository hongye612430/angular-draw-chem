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
		 * Updates end of the arrow.
		 */
		Arrow.prototype.updateEnd = function () {
			if (typeof this.relativeEnd !== "undefined") {
				this.end = [
					this.origin[0] + this.relativeEnd[0],
					this.origin[1] + this.relativeEnd[1],
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

		service.calcArrow = function (start, end, type) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCCW = [vectCoords[1], -vectCoords[0]], endMarkerStart, startMarkerStart, M1, M2, L1, L2, L3, L4;
			if (type === "one-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				L1 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return ["arrow", "M", start, "L", end, "M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z"];
			} else if (type === "two-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				startMarkerStart = [start[0] + vectCoords[0] * (1 - ARROW_START), start[1] + vectCoords[1] * (1 - ARROW_START)];
				L1 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				L3 = Utils.addCoordsNoPrec(startMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L4 = Utils.addCoordsNoPrec(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return [
					"arrow",
					"M", start, "L", end,
					"M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z",
					"M", startMarkerStart, "L", L3, "L", start, "L", L4, "Z"
				];
			}
			else if (type === "equilibrium-arrow") {
				M1 = Utils.addCoordsNoPrec(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				endMarkerStart = [parseFloat(M1[0]) + vectCoords[0] * ARROW_START, parseFloat(M1[1]) + vectCoords[1] * ARROW_START];
				L2 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);

				M2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				L3 = Utils.addCoordsNoPrec(start, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				startMarkerStart = [parseFloat(L3[0]) + vectCoords[0] * (1 - ARROW_START), parseFloat(L3[1]) + vectCoords[1] * (1 - ARROW_START)];
				L4 = Utils.addCoordsNoPrec(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
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
