(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemSvgRenderer", DrawChemSvgRenderer);

  DrawChemSvgRenderer.$inject = [
		"DCSvg",
		"DCBond",
		"DCAtom",
		"DCArrow",
		"DCSelection",
		"DrawChemConst",
		"DrawChemUtils",
		"DrawChemSvgUtils",
		"DrawChemModStructure"
	];

	function DrawChemSvgRenderer(DCSvg, DCBond, DCAtom, DCArrow, DCSelection, Const, Utils, SvgUtils, ModStructure) {

		var service = {},
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
			BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS,
			ARROW_START = Const.ARROW_START,
			ARROW_SIZE = Const.ARROW_SIZE,
			UNDEF_BOND = Const.UNDEF_BOND,
			PUSH = Const.PUSH,
			DBL_BOND_CORR = Const.DBL_BOND_CORR,
		  Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Selection = DCSelection.Selection,
      Svg = DCSvg.Svg;

    /**
		 * Generates the desired output based on given input (`Structure` object).
		 * @param {Structure} input - a `Structure` object containing all information needed to render svg,
		 * @param {string} id - id of the object to be created (will be used inside 'g' element),
     * @returns {Svg}
		 */
		service.draw = function (input, id) {
			var styleBase = Svg.generateStyle("base"),
				styleExpanded = Svg.generateStyle("expanded"),
				output = parseInput(input),
				paths = output.paths,
				circles = output.circles,
				labels = output.labels,
				rects = output.rects,
				minMax = output.minMax,
			  svg = new Svg(
  				styleExpanded + genElements().full,
  				styleBase + genElements().mini,
  				id
			  );

			svg.setMinMax(minMax);

			return svg;

			/**
			 * Generates string from the output array and wraps each line with 'path' element,
			 * each circle with 'circle' element, etc.
			 * @returns {Object}
			 */
			function genElements() {
				var result = { full: "", mini: "" };
				SvgUtils.generateRects(rects, result);
				SvgUtils.generatePaths(paths, result);
				SvgUtils.generateCircles(circles, result);
				SvgUtils.generateLabels(labels, result);
				if (input.isAromatic()) {
					SvgUtils.generateAromatics(input, result);
				}
				return result;
			}

			/**
			* Transforms `Structure` object into a set of svg-suitable set of coordinates and instructions.
			* @param {Structure} input - an input (`Structure`) object,
			* @returns {Object}
			*/
		  function parseInput(input) {
				var output = [], circles = [], labels = [], rects = [],
          i, absPos, absPosStart, absPosEnd, len,
          selection, atom, arrow, obj, push,
					origin = input.getOrigin(),
          minMax = { minX: origin[0], maxX: origin[0], minY: origin[1], maxY: origin[1] },
					circR = Const.CIRC_R;

				for (i = 0; i < input.getStructure().length; i += 1) {
					obj = input.getStructure(i);
					if (obj instanceof Selection) {
						selection = obj;
						absPosStart = Utils.addVectors(origin, selection.getOrigin());
						absPosEnd = selection.getCurrent();
						rects.push(calcRect(absPosStart, absPosEnd));
					} else if (obj instanceof Atom) {
						atom = obj;
						absPos = Utils.addVectors(origin, atom.getCoords());
						SvgUtils.updateLabel(labels, absPos, atom);
						updateMinMax(absPos);
						push = typeof atom.getLabel() !== "undefined";
						len = output.push(["M", absPos]);
						circles.push({
							isSelected: atom.isSelected(),
							hasLabel: atom.hasLabel(),
							isOrphan: atom.isOrphan(),
							circle: [absPos[0], absPos[1], circR]
						});
						connect(absPos, atom.getBonds(), output[len - 1], push);
					} else if (obj instanceof Arrow) {
						arrow = obj;
						absPosStart = Utils.addVectors(origin, arrow.getOrigin());
						absPosEnd = Utils.addVectors(origin, arrow.getEnd());
						updateMinMax(absPosStart);
						updateMinMax(absPosEnd);
						circles.push({ isSelected: arrow.isSelected(), circle: [ absPosStart[0], absPosStart[1], circR ] });
						circles.push({ isSelected: arrow.isSelected(), circle: [ absPosEnd[0], absPosEnd[1], circR ] });
						output.push(calcArrow(absPosStart, absPosEnd, arrow.getType()));
					}
				}

				return {
					paths: SvgUtils.stringifyPaths(output),
					rects: rects,
					circles: circles,
					labels: labels,
					minMax: minMax
				};

				/**
				* Recursively transforms input (with `drawLine` fn), until it finds an object with an empty 'bonds' array.
        * @param {number[]} prevAbsPos - previously used absolute coordinates,
				* @param {Bond[]} bonds - an array of `Bond` objects,
				* @param {string|number[]} currentLine - an array of coordinates with 'M' and 'L' commands,
        * @param {boolean} selected - true if object is marked as selected
				*/
				function connect(prevAbsPos, bonds, currentLine, push) {
					var i, absPos, atom, bondType;
					for (i = 0; i < bonds.length; i += 1) {
						atom = bonds[i].getAtom();
						bondType = bonds[i].getType();
						absPos = [
							prevAbsPos[0] + atom.getCoords("x"),
							prevAbsPos[1] + atom.getCoords("y")
						];
						updateMinMax(absPos);
						SvgUtils.updateLabel(labels, absPos, atom);
						circles.push({
							isSelected: atom.isSelected(),
							hasLabel: atom.hasLabel(),
							isOrphan: atom.isOrphan(),
							circle: [absPos[0], absPos[1], circR]
						});
						if (i === 0) {
							drawLine(prevAbsPos, absPos, bondType, atom, "continue", push);
						} else {
							drawLine(prevAbsPos, absPos, bondType, atom, "begin", push);
						}
					}
				}

        /**
				* Recursively transforms input (with `connect` fn), until it finds an object with an empty 'bonds' array.
        * @param {number[]} prevAbsPos - previously used absolute coordinates,
        * @param {number[]} absPos - currently used absolute coordinates,
				* @param {string} bondType - type of current `Bond` object, e.g. 'single', 'double',
				* @param {Atom} atom - `Atom` object at the end of current `Bond` object,
        * @param {string} mode - indicates if this should continue this line ('continue') or begin a new one ('begin'),
        * @param {boolean} selected - true if object is marked as selected
				*/
				function drawLine(prevAbsPos, absPos, bondType, atom, mode, push) {
					var newLen = output.length, foundAtom,
					  pushVector = Utils.addVectors(
							prevAbsPos,
							Utils.multVectByScalar(atom.getCoords(), PUSH)
						),
						newPush = typeof atom.getLabel() !== "undefined",
						newPushVector = Utils.addVectors(
							prevAbsPos,
							Utils.multVectByScalar(atom.getCoords(), 1 - PUSH)
						);
					if (atom.isOrphan()) {
						foundAtom = ModStructure.isWithin(input, absPos).foundAtom;
						newPush = typeof foundAtom.getLabel() !== "undefined";
					}
					if (bondType === "single") {
						if (mode === "continue") {
							if (push) {
								output[newLen - 1].push("M");
								output[newLen - 1].push(pushVector);
							}
							output[newLen - 1].push("L");
							if (newPush) {
								output[newLen - 1].push(newPushVector);
							} else {
								output[newLen - 1].push(absPos);
							}
						} else if (mode === "begin") {
							output.push(["focus", "M", prevAbsPos, "L", absPos]);
							if (push && newPush) {
								newLen = output.push(["M", pushVector, "L", newPushVector]);
							} else if (push) {
								newLen = output.push(["M", pushVector, "L", absPos]);
							} else if (newPush) {
								newLen = output.push(["M", prevAbsPos, "L", newPushVector]);
							} else {
							  newLen = output.push(["M", prevAbsPos, "L", absPos]);
							}
						}
					} else if (bondType === "double") {
						output.push(calcDoubleBondCoords("middle", prevAbsPos, absPos, push, newPush));
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "double-right") {
						output.push(calcDoubleBondCoords("right", prevAbsPos, absPos, push, newPush));
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "double-left") {
						output.push(calcDoubleBondCoords("left", prevAbsPos, absPos, push, newPush));
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "triple") {
						output.push(calcTripleBondCoords(prevAbsPos, absPos, push, newPush));
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge") {
						output.push(calcWedgeBondCoords(prevAbsPos, absPos, push, newPush));
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash") {
						output.push(calcDashBondCoords(prevAbsPos, absPos, push, newPush));
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "undefined") {
						output.push(calcUndefinedBondCoords(prevAbsPos, absPos, push, newPush));
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
						newLen = output.push(["M", absPos]);
					}
					connect(absPos, atom.getBonds(), output[newLen - 1], newPush);
					if (mode === "continue") {
						output.push(["focus", "M", prevAbsPos, "L", absPos]);
					}
				}

				function updateMinMax(absPos) {
					if (absPos[0] > minMax.maxX) {
						minMax.maxX = absPos[0];
					}
					if (absPos[0] < minMax.minX) {
						minMax.minX = absPos[0];
					}
					if (absPos[1] > minMax.maxY) {
						minMax.maxY = absPos[1];
					}
					if (absPos[1] < minMax.minY) {
						minMax.minY = absPos[1];
					}
				}
			}
		}

		/**
		* Calculates data for the svg instructions in `path` element for arrow.
		* @param {number[]} start - start coordinates (absolute) of the arrow,
		* @param {number[]} end - end coordinates (absolute) of the arrow,
		* @param {string} type - arrow type (one-way, etc.),
		* @returns {Array}
		*/
		function calcArrow(start, end, type) {
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
		function calcDoubleBondCoords(type, start, end, push, newPush) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, PUSH), corr,
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
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
				  doWithManyVectors("add", [M1, M2], aux);
				}
			}
			if (newPush) {
				if (type !== "middle") {
					L1 = Utils.subtractVectors(L1, aux);
					L2 = Utils.subtractVectors(L2, Utils.multVectByScalar(corr, 1.5));
				} else {
				  doWithManyVectors("subtract", [L1, L2], aux);
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
		function calcTripleBondCoords(start, end, push, newPush) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, PUSH),
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				M1 = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				M2 = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_TRP_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_TRP_BONDS);

			if (push) {
				doWithManyVectors("add", [M1, M2, start], aux);
			}
			if (newPush) {
				doWithManyVectors("subtract", [L1, L2, end], aux);
			}

			return ["M", M1, "L", L1, "M", start, "L", end, "M", M2, "L", L2];
		}

		/**
		* Calculates data for the svg instructions in `path` element for wedge bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		function calcWedgeBondCoords(start, end, push, newPush) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, PUSH),
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);

			if (push) { start = Utils.addVectors(start, aux); }

			if (newPush) {
				end = Utils.subtractVectors(end, aux);
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
			}

			return ["wedge", "M", start, "L", L1, "L", L2, "Z"];
		}

		/**
		* Calculates data for the svg instructions in `path` element for dash bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		function calcDashBondCoords(start, end, push, newPush) {
			var i, max = 10, factor = BETWEEN_DBL_BONDS / max, M, L, result = [],
			  vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, PUSH), currentEnd = start,
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]];

			if (push) {
				currentEnd = Utils.addVectors(start, aux);
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 2;
			}

			if (newPush) {
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 2;
			}

			for (i = max; i > 0; i -= 1) {
				factor = factor + BETWEEN_DBL_BONDS / max;
				currentEnd = [currentEnd[0] + vectCoords[0] / max, currentEnd[1] + vectCoords[1] / max];
				M = Utils.addVectors(currentEnd, perpVectCoordsCCW, factor);
				L = Utils.addVectors(currentEnd, perpVectCoordsCW, factor);
				result = result.concat(["M", M, "L", L]);
			}

			return result;
		}

		/**
		* Calculates data for the svg instructions in `path` element for undefined bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		function calcUndefinedBondCoords(start, end, push, newPush) {
			var i, M, L, max = 10, result,
			  vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				aux = Utils.multVectByScalar(vectCoords, PUSH),
				subEnd = Utils.addVectors(start, vectCoords, 1 / max),
				c1 = Utils.addVectors(start, perpVectCoordsCW, UNDEF_BOND),
				c2 = Utils.addVectors(subEnd, perpVectCoordsCW, UNDEF_BOND);

			if (push) {
				start = Utils.addVectors(start, aux);
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 2;
				subEnd = Utils.addVectors(start, vectCoords, 1 / max);
				c1 = Utils.addVectors(start, perpVectCoordsCW, UNDEF_BOND),
				c2 = Utils.addVectors(subEnd, perpVectCoordsCW, UNDEF_BOND);
			}

			if (newPush) {
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 2;
				subEnd = Utils.addVectors(start, vectCoords, 1 / max);
				c1 = Utils.addVectors(start, perpVectCoordsCW, UNDEF_BOND),
				c2 = Utils.addVectors(subEnd, perpVectCoordsCW, UNDEF_BOND);
			}

			result = ["M", start, "C", c1, ",", c2, ",", subEnd];

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
		function calcRect(absPosStart, absPosEnd) {
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

		function doWithManyVectors(what, vectors, u) {
			var aux;
			vectors.forEach(function (v) {
				if (what === "add") {
					aux = Utils.addVectors(v, u);
					v[0] = aux[0];
					v[1] = aux[1];
				} else if (what === "subtract") {
					aux = Utils.subtractVectors(v, u);
					v[0] = aux[0];
					v[1] = aux[1];
				}
			});
		}

		return service;
	}
})();