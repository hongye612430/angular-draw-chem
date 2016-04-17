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
		"DCSvg",
		"DCLabel",
		"DCStructure"
	];

	function DrawChemModStructure(Const, Utils, Structures, DCAtom, DCBond, DCArrow, DCSelection, DCSvg, DCLabel, DCStructure) {

		var service = {},
			BOND_LENGTH = Const.BOND_LENGTH,
			BONDS_AUX = Const.BONDS_AUX,
			Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Bond = DCBond.Bond,
			Svg = DCSvg.Svg,
			Label = DCLabel.Label,
			Structure = DCStructure.Structure,
			Selection = DCSelection.Selection;

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
		service.isWithinAtom = function (structure, position) {
			var found = false,
				foundObj = {}, firstAtom,
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
						firstAtom = obj;
					} else {
						aux = obj.getAtom();
						if (aux.isOrphan()) { continue; }
					}
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					if (!found && Utils.insideCircle(absPos, position, Const.CIRC_R)) {
						found = true;
						foundObj.foundAtom = aux;
						foundObj.absPos = absPos;
						foundObj.firstAtom = firstAtom;
					} else {
					  check(aux.getBonds(), absPos);
					}
				}
			}
		};

		/**
		 * Checks if supplied coordinates are within bond 'focus'.
		 * @param {Structure} structure - a `Structure` object on which search is performed,
		 * @param {number[]} position - set of coordinates against which the search is performed,
		 * @returns {Object}
		 */
		service.isWithinBond = function (structure, position) {
			var found = false,
				foundObj = {},
				origin = structure.getOrigin();

			checkAtom(structure.getStructure(), origin);

			return foundObj;

			function checkAtom(struct, pos) {
				var i, obj, absPos;
				for(i = 0; i < struct.length; i += 1) {
					obj = struct[i];
					if (!(obj instanceof Atom)) { continue; }
					absPos = Utils.addVectors(obj.getCoords(), pos);
					checkBonds(obj, absPos);
				}
			}

			function checkBonds(atom, pos) {
				var i, bonds, absPos;
				bonds = atom.getBonds();
				for (i = 0; i < bonds.length; i += 1) {
					if (!found && Utils.insideFocus(pos, bonds[i], position, Const.BOND_FOCUS)) {
						found = true;
						foundObj.foundBond = bonds[i];
					}
					absPos = Utils.addVectors(bonds[i].getAtom().getCoords(), pos);
					checkBonds(bonds[i].getAtom(), absPos);
				}
			}
		};

		service.moveStructure = function (structure, mouseCoords, downMouseCoords) {
			var moveDistance;
			if (structure !== null) {
				// if the content is non-empty
				moveDistance = Utils.subtractVectors(mouseCoords, downMouseCoords);
				structure.moveStructureTo("mouse", moveDistance);
			}
		};

		service.modifyLabel = function (atom, selected, chosenLabel, customLabel) {
			var currentLabel = atom.getLabel(), mode,
			  inBonds = atom.getAttachedBonds("in"),
			  outBonds = atom.getAttachedBonds("out");
			// set `Label` object
			// either predefined or custom
			if (selected === "label") {
				atom.setLabel(angular.copy(chosenLabel));
			} else if (selected === "customLabel") {
				customLabel = typeof customLabel === "undefined" ? "": customLabel;
				atom.setLabel(new Label(customLabel, 0));
			}

			if (typeof atom.getLabel() !== "undefined") {
				// if mode is not known (if there was previously no label)
				// try to guess which one should it be
				mode = getTextDirection();
				atom.getLabel().setMode(mode);
			}

			// if `Atom` object already has a label on it
			// then change its direction on mouseup event
			if (typeof currentLabel !== "undefined") {
				if (currentLabel.getMode() === "lr") {
					atom.getLabel().setMode("rl");
				} else if (currentLabel.getMode() === "rl") {
					atom.getLabel().setMode("lr");
				}
			}
			if (selected === "removeLabel") {
				atom.removeLabel();
			}

			function getTextDirection() {
				var countE = 0, countW = 0;
				if (typeof inBonds !== "undefined") {
					inBonds.forEach(function (bond) {
						if (bond.vector[0] > 0) {
							countE += 1;
						} else {
							countW += 1;
						}
					});
				}
				if (typeof outBonds !== "undefined") {
					outBonds.forEach(function (bond) {
						if (bond.vector[0] < 0) {
							countE += 1;
						} else {
							countW += 1;
						}
					});
				}
				return countE > countW ? "lr": "rl";
			}
		};

		service.modifyAtom = function (structure, atom, firstAtom, absPos, mouseCoords, chosenStructure) {
			var vector;

			if (Utils.insideCircle(absPos, mouseCoords, Const.CIRC_R)) {
				vector = chooseDirectionAutomatically();
			} else {
				vector = chooseDirectionManually();
			}

			updateAtom(vector);
			updateArom(vector);

			/**
			* Updates `Atom` object.
			* @param {number[]} vector - indicates direction, in which the change should be made
			*/
			function updateAtom(vector) {
				var name = chosenStructure.getName(), // gets name of the `StructureCluster `object
					size = chosenStructure.getRingSize(), // gets size of the ring (defaults to 0 for non-rings)
					mult = chosenStructure.getMult(), // gets multiplicity of the bond
					bond, angle, nextAtom, rotVect, foundAtom;
				if (size > 0) {
					/*
					* if we are dealing with a ring
					*/
					angle = chosenStructure.getAngle(); // gets angle between bonds inside the ring
					rotVect = Utils.rotVectCCW(vector, angle / 2); // adjust to angle bisector
					// define next `Atom` object
					nextAtom = new Atom(rotVect, [], { in: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
					// attach it to the starting `Atom` object
					atom.addBond(new Bond("single", nextAtom));
					// update `attachedBonds` array
					atom.attachBond("out", { vector: angular.copy(rotVect), multiplicity: 1 });
					// recursively generate the rest of the ring
					Structures.generateRing(nextAtom, size, angle, atom, chosenStructure.getMult(), 2, chosenStructure.isAromatic());
				} else {
					/*
					* if we are dealing with a bond
					*/
					// generate `Bond` object in the direction indicated by `vector`
					bond = Structures.generateBond(vector, name, mult);
					// check if an `Atom` object laready exists at this coords
					foundAtom = service.isWithinAtom(
						structure,
						Utils.addVectors(absPos, vector)
					).foundAtom;
					if (typeof foundAtom !== "undefined") {
						bond.getAtom().setAsOrphan();
						foundAtom.attachBond("in", { vector: vector, multiplicity: mult })
					}
					// attach it to the starting `atom`
					atom.addBond(bond);
					// update `attachedBonds` array
					atom.attachBond("out", { vector: angular.copy(vector), multiplicity: mult });
				}
			}

			/**
			 * Updates decorate elements (e.g. aromatic rings) in the structure.
			 * @param {number[]} vector - indicates direction, in which the change should be made
			 */
			function updateArom(vector) {
				if (chosenStructure.isAromatic() && typeof firstAtom !== "undefined") {
					structure.setAromatic();
					structure.addDecorate("aromatic", {
						fromWhich: firstAtom.getCoords(),
						coords: [vector[0] + absPos[0], vector[1] + absPos[1]]
					});
				}
		  }

			/**
			 * Automatically decides in which direction the next bond is going to be.
			 * @returns {number[]}
			 */
			function chooseDirectionAutomatically() {
				var inBonds = atom.getAttachedBonds("in"), // attached incoming bonds
				  outBonds = atom.getAttachedBonds("out"), // attached outcoming bonds
					size = chosenStructure.getRingSize(), // check if structure is cyclic
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
				return Utils.checkAttachedBonds(vect, atom, Const.FREQ, Const.MAX_BONDS);
			}

			/**
			 * Lets the user decide in which direction the next bond is going to be.
			 * Enables rotating the bond around an atom (by a degree defined in Constants).
			 * @returns {number[]}
			 */
			function chooseDirectionManually() {
				var inBonds = atom.getAttachedBonds("in"), // attached incoming bonds
				  outBonds = atom.getAttachedBonds("out"), // attached outcoming bonds
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
				return Utils.getClosestVector(absPos, mouseCoords, possibleBonds);
			}
		};

		service.addArrowOnEmptySpace = function (structure, mouseCoords, downMouseCoords, chosenArrow) {
			var arrow, coords;
			if (structure === null) {
				// if the content is empty
				// new `Structure` object has to be created
				structure = new Structure();
				// if mousemove event didn't occur, assume mouse coords from (mouseup) event
				structure.setOrigin(downMouseCoords);
				// get default arrow
				arrow = angular.copy(chosenArrow.getArrow(downMouseCoords, mouseCoords));
				arrow.setOrigin([0, 0]);
			} else {
				// if the content is not empty, a `Structure` object already exists
				arrow = angular.copy(chosenArrow.getArrow(downMouseCoords, mouseCoords));
				// calculate and set coords
				coords = Utils.subtractVectors(downMouseCoords, structure.getOrigin());
				arrow.setOrigin(coords);
			}
			// add Arrow object to the structures array in the Structure object
			structure.addToStructures(arrow);
			return structure;
		};

		service.makeSelection = function(structure, mouseCoords, downMouseCoords) {
			var selection, coords;
			if (structure === null) {
				// if the content is empty
				// new Structure object has to be created
				structure = new Structure();
				// set origin of the `Structure` object
				structure.setOrigin(downMouseCoords);
				selection = new Selection([0, 0], mouseCoords);
			} else {
				// if the content is not empty, a `Structure` object already exists
				coords = Utils.subtractVectors(downMouseCoords, structure.getOrigin());
				selection = new Selection(coords, mouseCoords);
			}
			// change selection of already existing `Atom` and `Arrow` objects
			structure.select(selection);
			// add `Selection` object
			structure.addToStructures(selection);
			return structure;
		};

		service.modifyBond = function (bond, chosenStructure) {
			var ringSize = chosenStructure.getRingSize(), bondType, newIndex, index,
			  doubleBonds = ["double", "double-left", "double-right"],
				currentType = bond.getType();
			if (ringSize > 0) {
				// todo
			} else {
				bondType = chosenStructure.getDefault().getStructure(0).getBonds(0).getType();
				if (bondType === "double") {
					index = doubleBonds.indexOf(currentType);
					newIndex = index < 0 ? 0: Utils.moveToRight(doubleBonds, index, 1);
					bondType = doubleBonds[newIndex];
				} else {

				}
				bond.setType(bondType);
			}
		};

		service.addStructureOnEmptySpace = function (structure, chosenStructure, mouseCoords, downMouseCoords) {
			var structureAux, coords, bond;
			if (structure === null) {
				// if the content is empty
				structure = angular.copy(chosenStructure.getStructure(downMouseCoords, mouseCoords));
				// and set its origin
				structure.setOrigin(downMouseCoords);
				if (structure.isAromatic()) {
					// if the chosen Structure object is aromatic,
					// then add appropriate flag to the original Structure object
					bond = Const.getBondByDirection(structure.getName()).bond;
					structure.addDecorate("aromatic", {
						fromWhich: [0, 0],
						coords: [downMouseCoords[0] + bond[0], downMouseCoords[1] + bond[1]]
					});
				}
			} else {
				// when the content is not empty
				// `Structure` object already exists
				// calaculate new coords
				coords = Utils.subtractVectors(downMouseCoords, structure.getOrigin());
				// otherwise get default
				structureAux = angular.copy(chosenStructure.getStructure(downMouseCoords, mouseCoords));
				if (structureAux.isAromatic()) {
					// if the chosen Structure object is aromatic,
					// then add appropriate flag to the original Structure object
					structure.setAromatic();
					bond = Const.getBondByDirection(structureAux.getName()).bond;
					structure.addDecorate("aromatic", {
						fromWhich: angular.copy(coords),
						coords: [downMouseCoords[0] + bond[0], downMouseCoords[1] + bond[1]]
					});
				}
				// extract the first object from structures array and set its origin
				structureAux.getStructure(0).setCoords(coords);
				// add to the original `Structure` object
				structure.addToStructures(structureAux.getStructure(0));
			}
			return structure;
		};

		return service;
	}
})();
