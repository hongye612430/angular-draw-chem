(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemModStructure", DrawChemModStructure);

	DrawChemModStructure.$inject = [
		"DrawChemConst",
		"DrawChemUtils",
		"DrawChemStructures",
		"DCAtom",
		"DCBond",
		"DCArrow",
		"DCSelection",
		"DCSvg"
	];

	function DrawChemModStructure(Const, Utils, Structures, DCAtom, DCBond, DCArrow, DCSelection, DCSvg) {

		var service = {},
			BOND_LENGTH = Const.BOND_LENGTH,
			BONDS_AUX = Const.BONDS_AUX,
			Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Bond = DCBond.Bond,
			Svg = DCSvg.Svg,
			Selection = DCSelection.Selection;

		/**
		 * Modifies the `Structure` object and returns it.
		 * @param {Structure} base - `Structure` object to be modified,
		 * @param {StructureCluster} mod - `StructureCluster` object containing appropriate `Structure` objects,
		 * @param {number[]} mousePos - position of the mouse when 'onMouseUp' event occurred
		 * @param {number[]|undefined} down - position of the mouse when 'onMouseDown' event occurred
		 * @param {boolean} mouseDownAndMove - true if 'onMouseMove' and 'onMouseDown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (base, mod, mousePos, down, mouseDownAndMove) {
			var vector, firstAtom,
				found = false,
				isInsideCircle,
				origin = base.getOrigin();

			modStructure(base.getStructure(), origin);

			return base;

			/**
			* Recursively looks for an atom to modify.
			* @param {Atom[]|Bond[]} struct - array of atoms or array of bonds,
			* @param {number[]} pos - absolute coordinates of an atom
			*/
			function modStructure(struct, pos) {
				var i, absPos, aux, obj;
				for(i = 0; i < struct.length; i += 1) {

					obj = struct[i];

					if (!(obj instanceof Atom || obj instanceof Bond)) { continue; }

					if (found) { break; }

					if (obj instanceof Atom) {
						firstAtom = struct[i];
						aux = obj;
					} else {
						aux = obj.getAtom();
						if (aux.isOrphan()) { continue; }
					}

					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];

					isInsideCircle = Utils.insideCircle(absPos, mousePos, Const.CIRC_R);

					if (isInsideCircle && !mouseDownAndMove) {
						// if 'mouseup' was within a circle around an atom
						// and if a valid atom has not already been found
						vector = chooseDirectionAutomatically(aux);
						if (vector !== "full atom") {
						  updateAtom(vector, aux, absPos);
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
						updateAtom(vector, aux, absPos);
						//updateDecorate(modStr, absPos);
						found = true;
						return base;
					}

					// if none of the above was true, then continue looking down the structure tree
					modStructure(aux.getBonds(), absPos);
				}

				/**
				* Updates `Atom` object.
				* @param {number[]} vector - indicates direction, in which the change should be made,
				* @param {Atom} atom - `Atom` object that is going to be modified
				*/
				function updateAtom(vector, atom, absPos) {
					var name = mod.getName(), // gets name of the `StructureCluster `object
					  size = mod.getRingSize(), // gets size of the ring (defaults to 0 for non-rings)
						mult = mod.getMult(), // gets multiplicity of the bond (undefined for rings)
						bond, angle, nextAtom, rotVect, foundAtom;
					if (size > 0) {
						/*
						* if we are dealing with a ring
						*/
						angle = mod.getAngle(); // gets angle between bonds inside the ring
						rotVect = Utils.rotVectCCW(vector, angle / 2); // adjust to angle bisector
						// define next `Atom` object
						nextAtom = new Atom(rotVect, [], { in: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
						// attach it to the starting `Atom` object
						atom.addBond(new Bond("single", nextAtom));
						// update `attachedBonds` array
						atom.attachBond("out", { vector: angular.copy(rotVect), multiplicity: 1 });
						// recursively generate the rest of the ring
						Structures.generateRing(nextAtom, size, angle, atom);
					} else {
						/*
						* if we are dealing with a bond
						*/
						// generate `Bond` object in the direction indicated by `vector`
						bond = Structures.generateBond(vector, name, mult);
						// check if an `Atom` object laready exists at this coords
						foundAtom = service.isWithin(
							base,
							Utils.addVectors(absPos, vector)
						).foundAtom;
						if (typeof foundAtom !== "undefined") {
							bond.getAtom().setAsOrphan();
						}
						// attach it to the starting `atom`
						atom.addBond(bond);
						// update `attachedBonds` array
						atom.attachBond("out", { vector: angular.copy(vector), multiplicity: mult });
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
					size = mod.getRingSize(), // check if structure is cyclic
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
					if (size > 0) {
						vect = angular.copy(inBonds[0].vector);
					} else {
					  vect = Utils.rotVectCCW(inBonds[0].vector, Const.ANGLE / 2);
					}
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
		 * Looks for an `Atom` object (or objects if more than one has the specified coords) and deletes it (them).
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
		 * Checks if supplied coordinates are within a circle of an atom.
		 * @param {Structure} structure - a `Structure` object on which search is performed,
		 * @param {number[]} position - set of coordinates against which the search is performed,
		 * @returns {Object}
		 */
		service.isWithin = function (structure, position) {
			var found = false,
				foundObj = {},
				origin = structure.getOrigin();

			check(structure.getStructure(), origin);

			return foundObj;

			function check(struct, pos) {
				var i, absPos, aux, obj;
				for(i = 0; i < struct.length; i += 1) {
					obj = struct[i];
					if (!(obj instanceof Atom || obj instanceof Bond)) { continue; }
					if (obj instanceof Atom) {
						aux = obj;
					} else {
						aux = obj.getAtom();
						if (aux.isOrphan()) { continue; }
					}
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
		};

		return service;
	}
})();
