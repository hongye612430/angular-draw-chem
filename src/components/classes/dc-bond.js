(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCBond", DCBond);

	DCBond.$inject = ["DrawChemUtils", "DrawChemConst"]

	function DCBond(Utils, Const) {

		var service = {},
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
		  BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS;

		/**
		* Creates a new Bond.
		* @class
		* @param {String} type - type of bond, e.g. single, double, triple, wedge, or dash
		* @param {Atom} - an atom at the end of the bond
		*/
		function Bond(type, atom) {
			this.type = type;
			this.atom = atom;
		}

		/**
		 * Sets a bond type.
		 * @param {String} type - type of bond, e.g. single, double, triple, wedge, or dash
		 */
		Bond.prototype.setType = function (type) {
			this.type = type;
		}

		/**
		 * Gets a bond type.
		 * @returns {String}
		 */
		Bond.prototype.getType = function () {
			return this.type;
		}

		/**
		 * Sets an atom at the end of the bond.
		 * @param {Atom} atom - an atom at the end of the bond
		 */
		Bond.prototype.setAtom = function (atom) {
			this.atom = atom;
		}

		/**
		 * Gets an atom at the end of the bond.
		 * @returns {Atom}
		 */
		Bond.prototype.getAtom = function () {
			return this.atom;
		}

		service.Bond = Bond;

		service.calcDoubleBondCoords = function (start, end) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				M1 = Utils.addCoordsNoPrec(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				M2 = Utils.addCoordsNoPrec(start, perpVectCoordsCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
			return ["M", M1, "L", L1, "M", M2, "L", L2];
		};

		service.calcTripleBondCoords = function (start, end) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				M1 = Utils.addCoordsNoPrec(start, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				M2 = Utils.addCoordsNoPrec(start, perpVectCoordsCW, BETWEEN_TRP_BONDS),
				L2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_TRP_BONDS);
			return ["M", M1, "L", L1, "M", start, "L", end, "M", M2, "L", L2];
		};

		service.calcWedgeBondCoords = function (start, end) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
			return ["wedge", "M", start, "L", L1, "L", L2, "Z"];
		};

		service.calcDashBondCoords = function (start, end) {
			var i, max = 7, factor = BETWEEN_DBL_BONDS / max, M, L, currentEnd = start, result = [],
				vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]];

			for (i = max; i > 0; i -= 1) {
				factor = factor + BETWEEN_DBL_BONDS / max;
				currentEnd = [currentEnd[0] + vectCoords[0] / max, currentEnd[1] + vectCoords[1] / max];
				M = Utils.addCoordsNoPrec(currentEnd, perpVectCoordsCCW, factor);
				L = Utils.addCoordsNoPrec(currentEnd, perpVectCoordsCW, factor);
				result = result.concat(["M", M, "L", L]);
			}
			return result;
		};

		return service;
	}
})();
