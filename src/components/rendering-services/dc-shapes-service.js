(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemShapes", DrawChemShapes);

	DrawChemShapes.$inject = [
		"DCShape",
		"DrawChemConst",
		"DrawChemUtils",
		"DrawChemGenElements",
		"DrawChemStructures",
		"DCAtom",
		"DCBond",
		"DCArrow",
		"DCSelection"
	];

	function DrawChemShapes(DCShape, Const, Utils, GenElements, Structures, DCAtom, DCBond, DCArrow, DCSelection) {

		var service = {},
			BOND_LENGTH = Const.BOND_LENGTH,
			BONDS_AUX = Const.BONDS_AUX,
			Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Bond = DCBond.Bond,
			Selection = DCSelection.Selection;

		/**
		 * Modifies the structure.
		 * @param {Structure} base - structure to be modified,
		 * @param {StructureCluster} mod - StructureCluster containing appropriate Structure objects,
		 * @param {Number[]} mousePos - position of the mouse when 'mouseup' event occurred
		 * @param {Number[]|undefined} down - position of the mouse when 'mousedown' event occurred
		 * @param {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (base, mod, mousePos, down, mouseDownAndMove) {
			var firstAtom, vector,
				found = false,
				isInsideCircle,
				origin = base.getOrigin();

			modStructure(base.getStructure(), origin);

			return base;

			/**
			* Recursively looks for an atom to modify.
			* @param {Atom[]|Bond[]} struct - array of atoms or array of bonds,
			* @param {Number[]} pos - absolute coordinates of an atom
			*/
			function modStructure(struct, pos) {
				var i, absPos, aux;
				for(i = 0; i < struct.length; i += 1) {
					if (struct[i] instanceof Arrow) {
						continue;
					}

					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();

					if (struct[i] instanceof Atom) { firstAtom = struct[i]; } // remember first atom in each structure

					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];

					if (found) { break; }

					isInsideCircle = Utils.insideCircle(absPos, mousePos, Const.CIRC_R);

					if (isInsideCircle && !mouseDownAndMove) {
						// if 'mouseup' was within a circle around an atom
						// and if a valid atom has not already been found
						vector = chooseDirectionAutomatically(aux);
						if (vector !== "full atom") {
						  updateAtom(vector, aux);
						}
						//updateDecorate(modStr, absPos);
						found = true;
						return base;
					}

					if (!isInsideCircle && Utils.compareVectors(down, absPos, 5)) {
						// if 'mousedown' was within a circle around an atom
						// but 'mouseup' was not
						// and if a valid atom has not already been found
						vector = chooseDirectionManually(aux);
						updateAtom(vector, aux);
						//updateDecorate(modStr, absPos);
						found = true;
						return base;
					}

					// if none of the above was true, then continue looking down the structure tree
					modStructure(aux.getBonds(), absPos);
				}

				/**
				* Updates atom.
				* @param {number[]} vector - indicates direction, in which the change should be made,
				* @param {Atom} atom - Atom object that is going to be modified
				*/
				function updateAtom(vector, atom) {
					var name = mod.getName(), // gets name of the `StructureCluster `object
					  size = mod.getRingSize(), // gets size of the ring (defaults to 0 for non-rings)
						bond, angle, nextAtom, rotVect;
					if (size > 1) {
						// if we are dealing with a ring
						angle = mod.getAngle(); // gets angle between bonds inside the ring
						rotVect = Utils.rotVectCCW(vector, angle / 2); // adjust to angle bisector
						// define next `Atom` object
						nextAtom = new Atom(rotVect, [], { in: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
						// attach it to the starting `atom`
						atom.addBond(new Bond("single", nextAtom));
						// update `attachedBonds` arrays
						atom.attachBond("out", { vector: angular.copy(rotVect), multiplicity: 1 });
						// recursively generate the rest
						Structures.generateRing(nextAtom, size, angle, atom);
					} else {
						// if we are dealing with a bond,
						// generate `Bond` object in the direction indicated by `vector`
						bond = Structures.generateBond(vector, name, 1);
						// attach it to the starting `atom`
						atom.addBond(bond);
						// update `attachedBonds` arrays
						atom.attachBond("out", { vector: angular.copy(vector), multiplicity: 1 });
					}
				}

				/**
				 * Updates decorate elements (e.g. aromatic rings) in the structure.
				 * @param {Structure} modStr - Structure object which may contain decorate elements
				 * @param {Number[]} abs - absolute coordinates
				 */
				function updateDecorate(modStr, abs) {
					var coords;
					if (modStr !== null && modStr.isAromatic() && typeof firstAtom !== "undefined") {
						coords = Const.getBondByDirection(modStr.getName()).bond;
						return base.addDecorate("aromatic", {
							fromWhich: firstAtom.getCoords(),
							coords: [coords[0] + abs[0], coords[1] + abs[1]]
						});
					}
				}
			}

			/**
			 * Lets the user decide in which direction the next bond is going to be.
			 * Enables rotating the bond around an atom (by a degree defined in Constants).
			 * @param {Atom} current - currently active Atom object
			 * @returns {number[]}
			 */
			function chooseDirectionManually(current) {
				var inBonds = current.getAttachedBonds("in"), // attached incoming bonds
				  outBonds = current.getAttachedBonds("out"), // attached outcoming bonds
					possibleBonds, firstInBond, firstOutBond, angle, vect;

				if (typeof inBonds !== "undefined" && typeof outBonds !== "undefined") {
					// if both in- and outcoming bonds are defined,
					// get first in- and first outcoming bond,
					firstInBond = inBonds[0].vector;
					firstOutBond = outBonds[0].vector;
					// find angle between them
					angle = Math.acos(Utils.dotProduct(Utils.norm(firstInBond), Utils.norm(firstOutBond))) * 180 / Math.PI;
					// construct angle bisector
					vect = Utils.rotVectCCW(firstInBond, (180 - angle) / 2);
				} else if (typeof inBonds !== "undefined") {
					vect = inBonds[0].vector;
				} else if (typeof outBonds !== "undefined") {
					vect = outBonds[0].vector;
				} else {
					// defaults to bond in north direction
					vect = Const.BOND_N;
				}
				// finds all possible bonds, starting with `vect` and rotating it every `Const.FREQ`
				possibleBonds = Utils.calcPossibleVectors(vect, Const.FREQ);
				// returns that vector from `possibleBonds` array,
				// that is closest to the vector made with `down` and `mousePos` coordinates
				return Utils.getClosestVector(down, mousePos, possibleBonds);
			}

			/**
			 * Automatically decides in which direction the next bond is going to be.
			 * @param {Atom} current - currently active Atom object
			 * @returns {number[]}
			 */
			function chooseDirectionAutomatically(current) {
				var inBonds = current.getAttachedBonds("in"), // attached incoming bonds
				  outBonds = current.getAttachedBonds("out"), // attached outcoming bonds
					possibleBonds, firstInBond, firstOutBond, angle, vect, vectAux;

				if (typeof inBonds !== "undefined" && typeof outBonds !== "undefined") {
					// if both in- and outcoming bonds are defined,
					// get first in- and first outcoming bond,
					firstInBond = inBonds[0].vector;
					firstOutBond = outBonds[0].vector;
					// find angle between them
					angle = Math.acos(Utils.dotProduct(Utils.norm(firstInBond), Utils.norm(firstOutBond))) * 180 / Math.PI;
					// construct angle bisector
					vectAux = Utils.rotVectCCW(firstInBond, (180 - angle) / 2);
					if (Utils.compareVectors(vectAux, firstOutBond, 5)) {
						vect = Utils.rotVectCW(firstInBond, (180 - angle) / 2);
					} else {
						vect = vectAux;
					}
				} else if (typeof inBonds !== "undefined") {
					vect = Utils.rotVectCCW(inBonds[0].vector, Const.ANGLE / 2);
				} else if (typeof outBonds !== "undefined") {
					vect = Utils.rotVectCCW(outBonds[0].vector, Const.ANGLE);
				} else {
					// defaults to bond in north direction
					vect = Const.BOND_N;
				}
				// recursively checks if this bond is already attached,
				// if so, rotates it by `Const.FREQ` clockwise
				return Utils.checkAttachedBonds(vect, current, Const.FREQ, Const.MAX_BONDS);
			}
		}

		/**
		 * Looks for an atom Object (or Objects if more than one has the specified coords) and deletes it.
		 * Attaches items in its 'bonds' array directly to 'structure' array in Structure object.
		 * @params {Structure} structure - a Structure object to modify,
		 * @params {Number[]} mouseCoords - coordinates of the mouse pointer (where 'mouseup occurred')
		 * @returns {Structure}
		 */
		service.deleteFromStructure = function (structure, mouseCoords) {
			var origin = structure.getOrigin(), newAtomArray = [], aux = [], aromaticArr, newAromaticArr;

			// recursievly look for an atom to delete
			check(structure.getStructure(), origin);

			// applies new coords to the found atom Objects
			angular.forEach(newAtomArray, function (ob) {
				var obj = ob.obj;
				if (obj instanceof Arrow) {
					obj.setOrigin(ob.coords);
				} else if (obj instanceof Atom) {
					obj.setCoords(ob.coords);
				}
				aux.push(obj);
			});

			if (structure.isAromatic()) {
				// if is aromatic
				aromaticArr = structure.getDecorate("aromatic");
				newAromaticArr = [];
				angular.forEach(aromaticArr, function (arom) {
					if (!Utils.insideCircle(arom.coords, mouseCoords, Const.AROMATIC_R)) {
						newAromaticArr.push(arom);
					}
				});
				structure.setDecorate("aromatic", newAromaticArr);
			}

			structure.setStructure(aux);

			return structure;

			/**
			* Recursively looks for atom Objects to delete.
			* @param {Atom|Bond|Arrow} struct - 'structure' array or 'bonds' array,
			* @param {Number[]} pos - current absolute position,
			* @param {Atom} prevAtom - preceding atom Object (makes sense when iterating over 'bonds' array)
			*/
			function check(struct, pos, prevAtom) {
				var i, absPos, current, newBondArray = [], absPosStart, absPosEnd;
				for(i = 0; i < struct.length; i += 1) {
					current = struct[i];
					if (current instanceof Arrow) {
						// current Object is arrow
						absPosStart = [current.getOrigin("x") + pos[0], current.getOrigin("y") + pos[1]];
						absPosEnd = [current.getEnd("x") + pos[0], current.getEnd("y") + pos[1]];
						if (!(Utils.insideCircle(absPosStart, mouseCoords, Const.CIRC_R) || Utils.insideCircle(absPosEnd, mouseCoords, Const.CIRC_R))) {
							// if this arrow was NOT chosen then don't apply any changes
							// omit it otherwise
							newAtomArray.push({ obj: current, coords: current.getOrigin() });
						}
					} else if (current instanceof Atom) {
						// current Object is atom
						absPos = [current.getCoords("x") + pos[0], current.getCoords("y") + pos[1]];
						if (Utils.insideCircle(absPos, mouseCoords, Const.CIRC_R)) {
							// if this atom was chosen then apply changes
							changeArray(absPos, current);
						} else {
							// don't change anything otherwise
							newAtomArray.push({ obj: current, coords: current.getCoords() });
						}
						check(current.getBonds(), absPos, current);
					} else if (current instanceof Bond) {
						// current Object is bond
						absPos = [current.getAtom().getCoords("x") + pos[0], current.getAtom().getCoords("y") + pos[1]];
						if (Utils.insideCircle(absPos, mouseCoords, Const.CIRC_R)) {
							// if atom at the end of this bond was chosen then apply changes
							changeArray(absPos, current.getAtom());
						} else {
							// don't change anything otherwise
							newBondArray.push(current);
						}
						check(current.getAtom().getBonds(), absPos, current.getAtom());
					}
				}

				// when finished iterating over 'bonds' array
				// set an array of all bond Objects that were NOT chosen
				// otherwise prevAtom is undefined
				if (typeof prevAtom !== "undefined") { prevAtom.setBonds(newBondArray); }

				// extracts atom Objects from the 'bonds' array of the deleted atom Object
				// adds them to 'newAtomArray' array and sets their new coords
				function changeArray(absPos, atom) {
					var i, newCoords, newAbsPos, at;
					for (i = 0; i < atom.getBonds().length; i += 1) {
						at = atom.getBonds(i).getAtom();
						newAbsPos = [at.getCoords("x") + absPos[0], at.getCoords("y") + absPos[1]];
						newCoords = Utils.subtractVectors(newAbsPos, origin);
						newAtomArray.push({ obj: at, coords: newCoords });
					}
				}
			}
		}

		/**
		 * Checks if the mouse pointer is within a circle of an atom.
		 * @param {Structure} structure - a Structure object on which search is performed
		 * @param {Number[]} position - set of coordinates against which the search is performed
		 * @returns {Atom}
		 */
		service.isWithin = function (structure, position) {
			var found = false,
				foundObj = {},
				origin = structure.getOrigin();

			check(structure.getStructure(), origin);

			return foundObj;

			function check(struct, pos) {
				var i, absPos, aux;
				for(i = 0; i < struct.length; i += 1) {
					if (struct[i] instanceof Arrow) {
						continue;
					}
					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					if (!found && Utils.insideCircle(absPos, position, Const.CIRC_R)) {
						found = true;
						foundObj.foundAtom = aux;
						foundObj.absPos = absPos;
					} else {
					  check(aux.getBonds(), absPos);
					}
				}
			}
		}

		/**
		 * Generates the desired output based on given input.
		 * @param {Structure} input - a Structure object containing all information needed to render the shape
		 * @param {String} id - id of the object to be created (will be used inside 'g' tag and in 'use' tag)
		 */
		service.draw = function (input, id) {
			var shape,
				output = parseInput(input),
				paths = output.paths,
				circles = output.circles,
				labels = output.labels,
				rects = output.rects,
				minMax = output.minMax;
			shape = new DCShape.Shape(genElements().full, genElements().mini, id);
			shape.elementFull = shape.generateStyle("expanded") + shape.elementFull;
			shape.elementMini = shape.generateStyle("base") + shape.elementMini;
			shape.setMinMax(minMax);
			return shape;

			/**
			 * Generates a string from the output array and wraps each line with 'path' tags, each circle with 'circle' tags,
			 * and each decorate element with suitable tags.
			 */
			function genElements() {
				var result = { full: "", mini: "" };

				GenElements.generateRects(rects, result);
				GenElements.generatePaths(paths, result);
				GenElements.generateCircles(circles, result);
				GenElements.generateLabels(labels, result);

				if (input.isAromatic()) {
					GenElements.generateAromatics(input, result);
				}

				return result;
			}

			/**
			* Translates the input into an svg-suitable set of coordinates.
			* @param {Structure} input - an input object
			* @returns {Object}
			*/
		  function parseInput(input) {
				var output = [], circles = [], labels = [], rects = [], i, absPos, absPosStart, absPosEnd, len, selection, atom, arrow, obj,
					origin = input.getOrigin(), minMax = { minX: origin[0], maxX: origin[0], minY: origin[1], maxY: origin[1] },
					circR = Const.CIRC_R, width, height, quarter, startX, startY;

				for (i = 0; i < input.getStructure().length; i += 1) {
					obj = input.getStructure(i);
					if (obj instanceof Selection) {
						selection = obj;
						absPosStart = Utils.addVectors(origin, selection.getOrigin());
						absPosEnd = selection.getCurrent();
						quarter = selection.getQuarter();
						rects.push(DCSelection.calcRect(quarter, absPosStart, absPosEnd));
					} else if (obj instanceof Atom) {
						atom = obj;
						absPos = Utils.addVectors(origin, atom.getCoords());
						updateLabel(absPos, atom);
						updateMinMax(absPos);
						len = output.push(["M", absPos]);
						circles.push({ selected: atom.selected, circle: [absPos[0], absPos[1], circR] });
						connect(absPos, atom.getBonds(), output[len - 1], atom.selected);
					} else if (obj instanceof Arrow) {
						arrow = obj;
						absPosStart = Utils.addVectors(origin, arrow.getOrigin());
						absPosEnd = Utils.addVectors(origin, arrow.getEnd());
						updateMinMax(absPosStart);
						updateMinMax(absPosEnd);
						circles.push({ selected: arrow.selected, circle: [ absPosStart[0], absPosStart[1], circR ] });
						circles.push({ selected: arrow.selected, circle: [ absPosEnd[0], absPosEnd[1], circR ] });
						output.push(DCArrow.calcArrow(absPosStart, absPosEnd, arrow.getType()));
					}
				}

				return {
					paths: GenElements.stringifyPaths(output),
					rects: rects,
					circles: circles,
					labels: labels,
					minMax: minMax
				};

				/**
				* Recursively translates the input, until it finds an element with an empty 'bonds' array.
				* @param {Bond[]} bonds - an array of Bond objects
				* @param {String|Number[]} - an array of coordinates with 'M' and 'L' commands
				*/
				function connect(prevAbsPos, bonds, currentLine, selected) {
					var i, absPos, atom, bondType;
					for (i = 0; i < bonds.length; i += 1) {
						atom = bonds[i].getAtom();
						bondType = bonds[i].getType();
						absPos = [
							prevAbsPos[0] + atom.getCoords("x"),
							prevAbsPos[1] + atom.getCoords("y")
						];
						updateMinMax(absPos);
						updateLabel(absPos, atom);
						circles.push({ selected: selected, circle: [absPos[0], absPos[1], circR] });
						if (i === 0) {
							drawLine(prevAbsPos, absPos, bondType, atom, "continue", selected);
						} else {
							drawLine(prevAbsPos, absPos, bondType, atom, "begin", selected);
						}
					}
				}

				function drawLine(prevAbsPos, absPos, bondType, atom, mode, selected) {
					var newLen = output.length;
					if (bondType === "single") {
						if (mode === "continue") {
							output[newLen - 1].push("L");
							output[newLen - 1].push(absPos);
						} else if (mode === "begin") {
							newLen = output.push(["M", prevAbsPos, "L", absPos]);
						}
					} else if (bondType === "double") {
						output.push(DCBond.calcDoubleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "triple") {
						output.push(DCBond.calcTripleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge") {
						output.push(DCBond.calcWedgeBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash") {
						output.push(DCBond.calcDashBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					}
					connect(absPos, atom.getBonds(), output[newLen - 1], selected);
				}

				function updateLabel(absPos, atom) {
					var label = atom.getLabel(), labelObj;
					if (typeof label !== "undefined") {
						labelObj = genLabelInfo();
						labels.push(labelObj);
					}

					function genLabelInfo() {
						var bondsRemained = label.getMaxBonds() - calcBondsIn(atom.getAttachedBonds()) - calcBondsOut(atom.getBonds()),
							labelNameObj = { name: label.getLabelName() };

						addHydrogens();

						return {
							length: labelNameObj.name.length,
							label: labelNameObj.name,
							mode: label.getMode(),
							atomX: absPos[0],
							atomY: absPos[1],
							labelX: absPos[0] + labelNameObj.correctX,
							labelY: absPos[1] + 0.09 * BOND_LENGTH,
							width: DCShape.fontSize * labelNameObj.name.length,
							height: DCShape.fontSize
						};

						function calcBondsIn(bonds) {
							var i, type, result = 0;
							for (i = 0; i < bonds.length; i += 1) {
								type = bonds[i].type;
								switch (type) {
									case "single": result += 1; break;
									case "double": result += 2; break;
									case "triple": result += 3; break;
								}
							}
							return result;
						}

						function calcBondsOut(bonds) {
							var i, type, result = 0;
							for (i = 0; i < bonds.length; i += 1) {
								type = bonds[i].getType();
								switch (type) {
									case "single": result += 1; break;
									case "wedge": result += 1; break;
									case "dash": result += 1; break;
									case "double": result += 2; break;
									case "triple": result += 3; break;
								}
							}
							return result;
						}

						function addHydrogens() {
							var i, mode = label.getMode(), hydrogens = 0;
							for (i = 0; i < bondsRemained; i += 1) {
								hydrogens += 1;
							}

							labelNameObj.hydrogens = hydrogens;

							if (typeof mode === "undefined") {
								// if mode is not known (if there was previously no label)
								// try to guess which one should it be
								mode = getTextDirection();
								label.setMode(mode);
							}

							if (hydrogens > 0) {
								// only happens for predefined labels
								// custom labels can't have implicit hydrogens
								hydrogensAboveZero();
							} else {
								hydrogensZeroOrLess();
							}

							labelNameObj.correctX = calcCorrect() * BOND_LENGTH;

							function hydrogensAboveZero() {
								if (mode === "rl") {
									labelNameObj.name = hydrogens === 1 ?
										 "H" + labelNameObj.name: "H" + hydrogens + labelNameObj.name;
								} else if (mode === "lr") {
									labelNameObj.name = hydrogens === 1 ?
										labelNameObj.name + "H": labelNameObj.name + "H" + hydrogens;
								}
							}

							function hydrogensZeroOrLess() {
								if (mode === "rl") {
									labelNameObj.name = Utils.invertGroup(labelNameObj.name);
								}
							}

							function getTextDirection() {
								var countE = 0;
								atom.getAttachedBonds().forEach(function (direction) {
									countE = direction.direction.indexOf("E") < 0 ? countE: countE + 1;
								});
								return countE > 0 ? "rl": "lr";
							}

							function calcCorrect() {
								if (mode === "rl") {
									return 0.175;
								} else if (mode === "lr") {
									return -0.175;
								} else if (mode === "tb") {

								} else if (mode === "bt") {

								}
							}
						}
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

		return service;
	}
})();
