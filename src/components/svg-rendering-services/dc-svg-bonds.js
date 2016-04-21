(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemSvgBonds", DrawChemSvgBonds);

  DrawChemSvgBonds.$inject = [
		"DrawChemConst",
		"DrawChemUtils"
	];

	function DrawChemSvgBonds(Const, Utils) {

		var service = {},
		  BOND_LENGTH = Const.BOND_LENGTH,
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
			BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS,
			ARROW_START = Const.ARROW_START,
			ARROW_SIZE = Const.ARROW_SIZE,
			UNDEF_BOND = Const.UNDEF_BOND,
			PUSH = Const.PUSH,
			DBL_BOND_CORR = Const.DBL_BOND_CORR;

		/**
		* Calculates data for the svg instructions in `path` element for arrow.
		* @param {number[]} start - start coordinates (absolute) of the arrow,
		* @param {number[]} end - end coordinates (absolute) of the arrow,
		* @param {string} type - arrow type (one-way, etc.),
		* @returns {Array}
		*/
		service.calcArrow = function (start, end, type) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCCW = [vectCoords[1], -vectCoords[0]],
				endMarkerStart, startMarkerStart, M1, M2, L1, L2, L3, L4;
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

		/**
		* Calculates data for the svg instructions in `path` element for double bond.
		* @param {string} type - type of the bond ('middle', 'left', 'right'),
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		service.calcDoubleBondCoords = function (type, start, end, push, newPush) {
			var vectCoords = Utils.subtractVectors(end, start),
			  vectCoords = Utils.multVectByScalar(
					Utils.norm(vectCoords),
					BOND_LENGTH
				),
			  aux = Utils.multVectByScalar(vectCoords, PUSH), corr,
				perpVectCoordsCCW = Utils.getPerpVectorCCW(vectCoords),
				perpVectCoordsCW = Utils.getPerpVectorCW(vectCoords),
				M1 = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				M2 = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);

			if (type === "right") {
				M2 = Utils.addVectors(start, perpVectCoordsCW, 2 * BETWEEN_DBL_BONDS);
				L2 = Utils.addVectors(end, perpVectCoordsCW, 2 * BETWEEN_DBL_BONDS);
			} else if (type === "left") {
				M2 = Utils.addVectors(start, perpVectCoordsCCW, 2 * BETWEEN_DBL_BONDS);
				L2 = Utils.addVectors(end, perpVectCoordsCCW, 2 * BETWEEN_DBL_BONDS);
			}

			if (type !== "middle") {
				M1 = angular.copy(start);
				L1 = angular.copy(end);
				vectCoords = [L2[0] - M2[0], L2[1] - M2[1]];
				corr = Utils.multVectByScalar(vectCoords, DBL_BOND_CORR);
				M2 = Utils.addVectors(M2, corr);
				L2 = Utils.subtractVectors(L2, corr);
			}

			if (push) {
				if (type !== "middle") {
					M1 = Utils.addVectors(M1, aux);
					M2 = Utils.addVectors(M2, Utils.multVectByScalar(corr, 1.5));
				} else {
				  Utils.doWithManyVectors("add", [M1, M2], aux);
				}
			}
			if (newPush) {
				if (type !== "middle") {
					L1 = Utils.subtractVectors(L1, aux);
					L2 = Utils.subtractVectors(L2, Utils.multVectByScalar(corr, 1.5));
				} else {
				  Utils.doWithManyVectors("subtract", [L1, L2], aux);
				}
			}

			return ["M", M1, "L", L1, "M", M2, "L", L2];
		}

		/**
		* Calculates data for the svg instructions in `path` element for triple bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		service.calcTripleBondCoords = function (start, end, push, newPush) {
			var vectCoords = Utils.subtractVectors(end, start),
			  vectCoords = Utils.multVectByScalar(
				  Utils.norm(vectCoords),
				  BOND_LENGTH
			  ),
			  aux = Utils.multVectByScalar(vectCoords, PUSH),
				perpVectCoordsCCW = Utils.getPerpVectorCCW(vectCoords),
				perpVectCoordsCW = Utils.getPerpVectorCW(vectCoords),
				M1 = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				M2 = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_TRP_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_TRP_BONDS);

			if (push) {
				Utils.doWithManyVectors("add", [M1, M2, start], aux);
			}
			if (newPush) {
				Utils.doWithManyVectors("subtract", [L1, L2, end], aux);
			}

			return ["M", M1, "L", L1, "M", start, "L", end, "M", M2, "L", L2];
		}

		/**
		* Calculates data for the svg instructions in `path` element for wedge bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
    * @param {string} inverted - equals 'inverted' if inverted bond should be returned,
		* @returns {Array}
		*/
		service.calcWedgeBondCoords = function (start, end, push, newPush, inverted) {
			var vectCoords = Utils.subtractVectors(end, start),
			  vectCoords = Utils.multVectByScalar(
				  Utils.norm(vectCoords),
				  BOND_LENGTH
			  ),
			  aux = Utils.multVectByScalar(vectCoords, PUSH),
				perpVectCoordsCCW = Utils.getPerpVectorCCW(vectCoords),
				perpVectCoordsCW = Utils.getPerpVectorCW(vectCoords),
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
        L1inv = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS),
        L2inv = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_DBL_BONDS);

			if (push) {
        start = Utils.addVectors(start, aux);
				L1inv = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
  			L2inv = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_DBL_BONDS);
      }

			if (newPush) {
  			end = Utils.subtractVectors(end, aux);
  			L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
  			L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
			}

			return inverted === "inverted" ?
        ["wedge", "M", L1inv, "L", L2inv, "L", end, "Z"]:
        ["wedge", "M", start, "L", L1, "L", L2, "Z"];
		}

		/**
		* Calculates data for the svg instructions in `path` element for dash bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
    * @param {string} inverted - equals 'inverted' if inverted bond should be returned,
		* @returns {Array}
		*/
		service.calcDashBondCoords = function (start, end, push, newPush, inverted) {
			var i, M, Minv, L, Linv,
			  vectCoords = Utils.subtractVectors(end, start),
				normVector = Utils.multVectByScalar(
				  Utils.norm(vectCoords),
				  BOND_LENGTH
			  ),
				maxInit = 10 * Utils.getLength(vectCoords) / BOND_LENGTH, max = maxInit,
				factor = BETWEEN_DBL_BONDS / max, factorInv = BETWEEN_DBL_BONDS,
				currentEnd = start,
				perpVectCoordsCCW = Utils.getPerpVectorCCW(normVector),
				perpVectCoordsCW = Utils.getPerpVectorCW(normVector),
        result, resultInv,
				aux = Utils.multVectByScalar(normVector, PUSH);

			if (push) {
				currentEnd = Utils.addVectors(start, aux);
				vectCoords = Utils.subtractVectors(vectCoords, aux);
        max -= 0.2 * maxInit;
			}

			if (newPush) {
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 0.2 * maxInit;
			}

      result = [
        "M", Utils.addVectors(currentEnd, perpVectCoordsCCW, factor),
        "L", Utils.addVectors(currentEnd, perpVectCoordsCW, factor)
      ];

      resultInv = [
        "M", Utils.addVectors(currentEnd, perpVectCoordsCCW, factorInv),
        "L", Utils.addVectors(currentEnd, perpVectCoordsCW, factorInv)
      ];

			max = parseFloat(max.toFixed(0));

			for (i = max; i > 0; i -= 1) {
				factor = factor + BETWEEN_DBL_BONDS / max;
        factorInv = factorInv - BETWEEN_DBL_BONDS / max;
				currentEnd = Utils.addVectors(currentEnd, vectCoords, 1 / max);
				M = Utils.addVectors(currentEnd, perpVectCoordsCCW, factor);
        Minv = Utils.addVectors(currentEnd, perpVectCoordsCCW, factorInv);
				L = Utils.addVectors(currentEnd, perpVectCoordsCW, factor);
        Linv = Utils.addVectors(currentEnd, perpVectCoordsCW, factorInv);
				result = result.concat(["M", M, "L", L]);
        resultInv = resultInv.concat(["M", Minv, "L", Linv]);
			}

			return inverted === "inverted" ? resultInv: result;
		}

		/**
		* Calculates data for the svg instructions in `path` element for undefined bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		service.calcUndefinedBondCoords = function (start, end, push, newPush) {
			var i, M, L, result, maxInit, max, subEnd, c1, c2,
			  vectCoords = Utils.subtractVectors(end, start),
				normVector = Utils.multVectByScalar(
				  Utils.norm(vectCoords),
				  BOND_LENGTH
			  ),
				perpVectCoordsCCW = Utils.getPerpVectorCCW(normVector),
				perpVectCoordsCW = Utils.getPerpVectorCW(normVector),
				aux = Utils.multVectByScalar(normVector, PUSH);

			maxInit = 10 * Utils.getLength(vectCoords) / BOND_LENGTH;
			maxInit = parseFloat(maxInit.toFixed(0));
			if (maxInit % 2 !== 0) { maxInit += 1; }
			max = maxInit;
			subEnd = Utils.addVectors(start, vectCoords, 1 / max);
			c1 = Utils.addVectors(start, perpVectCoordsCW, UNDEF_BOND);
			c2 = Utils.addVectors(subEnd, perpVectCoordsCW, UNDEF_BOND);

			if (push) {
				start = Utils.addVectors(start, aux);
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 0.2 * maxInit;
				if (max % 2 !== 0) { max += 1; }
				subEnd = Utils.addVectors(start, vectCoords, 1 / max);
				c1 = Utils.addVectors(start, perpVectCoordsCW, UNDEF_BOND),
				c2 = Utils.addVectors(subEnd, perpVectCoordsCW, UNDEF_BOND);
			}

			if (newPush) {
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 0.2 * maxInit;
				if (max % 2 !== 0) { max += 1; }
				subEnd = Utils.addVectors(start, vectCoords, 1 / max);
				c1 = Utils.addVectors(start, perpVectCoordsCW, UNDEF_BOND),
				c2 = Utils.addVectors(subEnd, perpVectCoordsCW, UNDEF_BOND);
			}

			result = ["M", start, "C", c1, ",", c2, ",", subEnd];

			max = parseFloat(max.toFixed(0));

			for (i = max - 1; i > 0; i -= 1) {
				subEnd = Utils.addVectors(subEnd, vectCoords, 1 / max);
				if (i % 2 === 0) {
					c2 = Utils.addVectors(subEnd, perpVectCoordsCW, UNDEF_BOND);
				} else {
					c2 = Utils.addVectors(subEnd, perpVectCoordsCCW, UNDEF_BOND);
				}
				result = result.concat(["S", c2, ",", subEnd]);
			}

			return result;
		}

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
		}

		return service;
	}
})();
