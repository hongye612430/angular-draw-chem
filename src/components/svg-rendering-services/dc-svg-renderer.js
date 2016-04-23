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
		"DCTextArea",
		"DrawChemConst",
		"DrawChemUtils",
		"DrawChemSvgUtils",
		"DrawChemSvgBonds",
		"DrawChemModStructure"
	];

	function DrawChemSvgRenderer(DCSvg, DCBond, DCAtom, DCArrow, DCSelection, DCTextArea, Const, Utils, SvgUtils, SvgBonds, ModStructure) {

		var service = {},
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
			BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS,
			BOND_LENGTH = Const.BOND_LENGTH,
			ARROW_START = Const.ARROW_START,
			ARROW_SIZE = Const.ARROW_SIZE,
			UNDEF_BOND = Const.UNDEF_BOND,
			PUSH = Const.PUSH,
			DBL_BOND_CORR = Const.DBL_BOND_CORR,
		  Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Selection = DCSelection.Selection,
			TextArea = DCTextArea.TextArea,
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
				bondFocus = output.bondFocus,
				textAreas = output.textAreas,
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
				SvgUtils.generateBondFocus(bondFocus, result);
				SvgUtils.generateCircles(circles, result);
				SvgUtils.generateLabels(labels, result);
				SvgUtils.generateTextAreas(textAreas, result);
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
				var output = [], circles = [], labels = [], rects = [], bondFocus = [], textAreas = [],
          i, absPos, absPosStart, absPosEnd, len,
          selection, atom, arrow, textArea, obj, push,
					origin = input.getOrigin(),
          minMax = { minX: origin[0], maxX: origin[0], minY: origin[1], maxY: origin[1] },
					circR = Const.CIRC_R;

				for (i = 0; i < input.getStructure().length; i += 1) {
					obj = input.getStructure(i);
					if (obj instanceof Selection) {
						selection = obj;
						absPosStart = Utils.addVectors(origin, selection.getOrigin());
						absPosEnd = selection.getCurrent();
						rects.push(SvgBonds.calcRect(absPosStart, absPosEnd));
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
					} else if (obj instanceof TextArea) {
						textArea = obj;
						absPos = Utils.addVectors(origin, textArea.getOrigin());
						SvgUtils.updateTextArea(textAreas, absPos, textArea);
						updateMinMax(absPos);
					} else if (obj instanceof Arrow) {
						arrow = obj;
						absPosStart = Utils.addVectors(origin, arrow.getOrigin());
						absPosEnd = Utils.addVectors(origin, arrow.getEnd());
						updateMinMax(absPosStart);
						updateMinMax(absPosEnd);
						SvgUtils.updateBondFocus(bondFocus, absPosStart, absPosEnd);
						circles.push({ isSelected: arrow.isSelected(), circle: [ absPosStart[0], absPosStart[1], circR ] });
						circles.push({ isSelected: arrow.isSelected(), circle: [ absPosEnd[0], absPosEnd[1], circR ] });
						output.push(
							SvgBonds.calcArrow(absPosStart, absPosEnd, arrow.getType())
						);
					}
				}

				return {
					paths: SvgUtils.stringifyPaths(output),
					rects: rects,
					circles: circles,
					labels: labels,
					bondFocus: bondFocus,
					textAreas: textAreas,
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
						SvgUtils.updateBondFocus(bondFocus, prevAbsPos, absPos, push, typeof atom.getLabel() !== "undefined");
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
					  vectCoords = Utils.subtractVectors(absPos, prevAbsPos),
					  bondVectorNorm = Utils.multVectByScalar(
							Utils.norm(vectCoords),
							BOND_LENGTH
						),
					  pushVector = Utils.addVectors(
							prevAbsPos,
							Utils.multVectByScalar(bondVectorNorm, PUSH)
						),
						newPush = typeof atom.getLabel() !== "undefined",
						newPushVector = Utils.subtractVectors(
							absPos,
							Utils.multVectByScalar(bondVectorNorm, PUSH)
						);
					if (atom.isOrphan()) {
						foundAtom = ModStructure.isWithinAtom(input, absPos).foundAtom;
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
						output.push(
							SvgBonds.calcDoubleBondCoords("middle", prevAbsPos, absPos, push, newPush)
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "double-right") {
						output.push(
							SvgBonds.calcDoubleBondCoords("right", prevAbsPos, absPos, push, newPush)
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "double-left") {
						output.push(
							SvgBonds.calcDoubleBondCoords("left", prevAbsPos, absPos, push, newPush)
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "triple") {
						output.push(
							SvgBonds.calcTripleBondCoords(prevAbsPos, absPos, push, newPush)
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge") {
						output.push(
							SvgBonds.calcWedgeBondCoords(prevAbsPos, absPos, push, newPush)
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge-inverted") {
						output.push(
							SvgBonds.calcWedgeBondCoords(prevAbsPos, absPos, push, newPush, "inverted")
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash") {
						output.push(
							SvgBonds.calcDashBondCoords(prevAbsPos, absPos, push, newPush)
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash-inverted") {
						output.push(
							SvgBonds.calcDashBondCoords(prevAbsPos, absPos, push, newPush, "inverted")
						);
						newLen = output.push(["M", absPos]);
					} else if (bondType === "undefined") {
						output.push(
							SvgBonds.calcUndefinedBondCoords(prevAbsPos, absPos, push, newPush)
						);
						newLen = output.push(["M", absPos]);
					}
					connect(absPos, atom.getBonds(), output[newLen - 1], newPush);
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
		};

		return service;
	}
})();
