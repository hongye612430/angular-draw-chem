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
			BOND_FOCUS = Const.BOND_FOCUS,
			BONDS_AUX = Const.BONDS_AUX,
			CIRC_R = Const.CIRC_R,
			AROMATIC_R = Const.AROMATIC_R,
			Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Bond = DCBond.Bond,
			Svg = DCSvg.Svg,
			Label = DCLabel.Label,
			Structure = DCStructure.Structure,
			Selection = DCSelection.Selection;

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

			function check(struct, pos, prevAtom) {
				var i, absPos, aux, obj;
				for(i = 0; i < struct.length; i += 1) {
					obj = struct[i];
					if (!(obj instanceof Atom || obj instanceof Bond)) { continue; }
					if (obj instanceof Atom) {
						aux = obj;
						firstAtom = obj;
					} else {
						aux = obj.getAtom();
					}
					absPos = Utils.addVectors(aux.getCoords(), pos);
					if (Utils.insideCircle(absPos, position, CIRC_R)) {
						if (!found) {
							foundObj.foundAtom = aux;
							foundObj.leadingBond = obj instanceof Bond ? obj: undefined;
							foundObj.prevAtom = prevAtom;
							foundObj.absPos = absPos;
							foundObj.firstAtom = firstAtom;
						} else {
						  foundObj.hasDuplicate = true;
						}
						found = true;
					}
					check(aux.getBonds(), absPos, aux);
				}
			}
		};

		/**
		 * Checks if supplied coordinates are within bond's 'focus'.
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

			// iterate over starting `Atom` objects
			function checkAtom(struct, pos) {
				var i, obj, absPos;
				for(i = 0; i < struct.length; i += 1) {
					obj = struct[i];
					if (!(obj instanceof Atom)) { continue; }
					absPos = Utils.addVectors(obj.getCoords(), pos);
					checkBonds(obj, absPos);
				}
			}

			// recursively check `Bond` objects
			function checkBonds(atom, pos) {
				var i, bonds, absPos;
				bonds = atom.getBonds();
				for (i = 0; i < bonds.length; i += 1) {
					absPos = Utils.addVectors(bonds[i].getAtom().getCoords(), pos);
					if (!found && Utils.insideFocus(pos, bonds[i], position, BOND_FOCUS, BOND_LENGTH)) {
						found = true;
						foundObj.foundBond = bonds[i];
						foundObj.startAtom = atom;
						foundObj.endAtomAbsPos = absPos;
					}
					checkBonds(bonds[i].getAtom(), absPos);
				}
			}
		};

		/**
		 * Deletes `Bond` object. Takes care of `Atom` objects connected with it.
		 * @param {Structure} structure - a `Structure` object on which search is performed,
		 * @param {Bond} bond - `Bond` object to remove,
		 * @param {Atom} startAtom - `Atom` object at the beginning of the bond,
		 * @param {number[]} endAtomAbsPos - end `Atom` object's absolute coords
		 */
		service.deleteBond = function (structure, bond, startAtom, endAtomAbsPos) {
			var atom = bond.getAtom(),
			  coords = Utils.subtractVectors(endAtomAbsPos, structure.getOrigin());
			startAtom.deleteBond(bond);
			atom.setCoords(coords);
			structure.addToStructures(atom);
		};

		/**
		 * Deletes `Atom` object. Takes care of `Atom` and `Bond` objects connected with it.
		 * @param {Structure} structure - a `Structure` object on which search is performed,
		 * @param {Atom} atom - `Atom` object to remove,
		 * @param {number[]} absPos - its absolute position,
		 * @param {Bond} leadingBond - `Bond` object leading to that atom,
		 * @param {Atom} leadingAtom - `Atom` object containing that bond
		 */
		service.deleteAtom = function (structure, atom, absPos, leadingBond, leadingAtom, hasDuplicate) {
			var at, coords, outBonds = atom.getBonds(), i, outAtoms = [], struct, duplAtomObject, newStructure = [];

			if (typeof leadingBond !== "undefined") {
				for (i = 0; i < outBonds.length; i += 1) {
					at = outBonds[i].getAtom();
					coords = Utils.addVectors(absPos, at.getCoords());
					at.setCoords(
						Utils.subtractVectors(coords, structure.getOrigin())
					);
					outAtoms.push(at);
				}
				structure.addToStructures(outAtoms);
			  leadingAtom.deleteBond(leadingBond);
			} else {
				struct = structure.getStructure();
				for (i = 0; i < struct.length; i += 1) {
					if (struct[i] !== atom) {
					  newStructure.push(struct[i]);
					} else {
						newStructure = newStructure.concat(
							extractAtoms(struct[i].getBonds(), struct[i].getCoords())
						);
					}
				}
				structure.setStructure(newStructure);
			}

			if (hasDuplicate) {
				duplAtomObject = service.isWithinAtom(structure, absPos);
				service.deleteAtom(
					structure,
					duplAtomObject.foundAtom,
					duplAtomObject.absPos,
					duplAtomObject.leadingBond,
					duplAtomObject.prevAtom,
					duplAtomObject.hasDuplicate
				);
			}

			function extractAtoms(bonds, position) {
				var i, at, coords, atoms = [];
				for (i = 0; i < bonds.length; i += 1) {
					at = bonds[i].getAtom();
					coords = Utils.addVectors(position, at.getCoords());
					at.setCoords(coords);
					atoms.push(at);
				}
				return atoms;
			}
		};

		/**
		 * Moves `Structure` object.
		 * @param {Structure} structure - a `Structure` object to be moved,
		 * @param {number[]} mouseCoords - coordinates of the `mouseup` event,
		 * @param {number[]} mouseCoords - coordinates of the `mousedown` event
		 */
		service.moveStructure = function (structure, mouseCoords, downMouseCoords) {
			var moveDistance;
			if (structure !== null) {
				// if the content is non-empty
				moveDistance = Utils.subtractVectors(mouseCoords, downMouseCoords);
				structure.moveStructureTo("mouse", moveDistance);
			}
		};

		/**
		 * Adds `Label` object to each `Atom` object that has no bonds attached to it.
		 * @param {Structure} structure - a `Structure` object to be labeled
		 */
		service.labelSingleAtoms = function (structure) {
			var i, obj, struct = structure.getStructure(), hasDuplicate, absPos;
			for (i = 0; i < struct.length; i += 1) {
				obj = struct[i];
				if (obj instanceof Atom && !obj.isOrphan() && obj.getBonds().length === 0) {
					absPos = Utils.addVectors(structure.getOrigin(), obj.getCoords());
					hasDuplicate = service.isWithinAtom(structure, absPos).hasDuplicate;
					if (!hasDuplicate) {
						obj.setLabel(new Label("C", 4, "lr"));
						obj.resetAttachedBonds();
					}
				}
			}
		};

		/**
		 * Removes `Label` object.
		 * @param {Atom} atom - chosen `Atom` object
		 */
		service.removeLabel = function (atom) {
			atom.removeLabel();
		};

		/**
		 * Modifies/creates `Label` object.
		 * @param {Atom} atom - chosen `Atom` object,
		 * @param {string} selected - selected flag,
		 * @param {Label} chosenLabel - chosen `Label` object (for predefined labels),
		 * @param {string} customLabel - chosen string for making a custom `Label` object
		 */
		service.modifyLabel = function (atom, selected, chosenLabel, customLabel) {
			var currentLabel = atom.getLabel(), mode;
			// set `Label` object
			// either predefined or custom
			if (selected === "label") {
				atom.setLabel(angular.copy(chosenLabel));
			} else if (selected === "customLabel") {
				customLabel = typeof customLabel === "undefined" ? "": customLabel;
				atom.setLabel(new Label(customLabel, 0));
			}

			atom.changeMode();

			// if `Atom` object already has a label on it
			// then change its direction on mouseup event
			if (typeof currentLabel !== "undefined") {
				if (currentLabel.getMode() === "lr") {
					atom.getLabel().setMode("rl");
				} else if (currentLabel.getMode() === "rl") {
					atom.getLabel().setMode("lr");
				}
			}
		};

		/**
		 * Modifies `Atom` object by adding new `Bond` objects to it.
		 * @param {Structure} structure - `Structure` object,
		 * @param {Atom} atom - chosen `Atom` object,
		 * @param {Atom} firstAtom - first `Atom` object in the tree,
		 * @param {number[]} absPos - absolute position of chosen `Atom`  object,
		 * @param {number[]} mouseCoords - coordinates associated with a mouse event,
		 * @param {StructureCluster} chosenStructure - `StructureCluster` object,
		 * @param {boolean} customLength - if custom length should be used
		 */
		service.modifyAtom = function (structure, atom, firstAtom, absPos, mouseCoords, chosenStructure, customLength) {
			var vector;

			if (Utils.insideCircle(absPos, mouseCoords, CIRC_R)) {
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
				atom.changeMode();
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
					firstInBond = Utils.multVectByScalar(
						Utils.norm(inBonds[0].vector),
						BOND_LENGTH
					);
					firstOutBond = Utils.multVectByScalar(
						Utils.norm(outBonds[0].vector),
						BOND_LENGTH
					);
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
					firstInBond = Utils.multVectByScalar(
						Utils.norm(inBonds[0].vector),
						BOND_LENGTH
					);
					if (size > 0) {
						vect = angular.copy(firstInBond);
					} else {
					  vect = Utils.rotVectCCW(firstInBond, Const.ANGLE / 2);
					}
				} else if (typeof outBonds !== "undefined") {
					firstOutBond = Utils.multVectByScalar(
						Utils.norm(outBonds[0].vector),
						BOND_LENGTH
					);
					vect = Utils.rotVectCCW(firstOutBond, Const.ANGLE);
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

				if (customLength) {
					return Utils.subtractVectors(mouseCoords, absPos);
				}

				if (typeof inBonds !== "undefined" && typeof outBonds !== "undefined") {
					// if both in- and outcoming bonds are defined,
					// get first in- and first outcoming bond,
					firstInBond = Utils.multVectByScalar(
						Utils.norm(inBonds[0].vector),
						BOND_LENGTH
					);
					firstOutBond = Utils.multVectByScalar(
						Utils.norm(outBonds[0].vector),
						BOND_LENGTH
					);
					// find angle between them
					angle = Math.acos(Utils.dotProduct(Utils.norm(firstInBond), Utils.norm(firstOutBond))) * 180 / Math.PI;
					// construct angle bisector
					vect = Utils.rotVectCCW(firstInBond, (180 - angle) / 2);
				} else if (typeof inBonds !== "undefined") {
					vect = Utils.multVectByScalar(
						Utils.norm(inBonds[0].vector),
						BOND_LENGTH
					);
				} else if (typeof outBonds !== "undefined") {
					vect = Utils.multVectByScalar(
						Utils.norm(outBonds[0].vector),
						BOND_LENGTH
					);
				} else {
					// defaults to bond in north direction
					vect = Const.BOND_N;
				}
				// finds all possible bonds, starting with `vect` and rotates it by `Const.FREQ`
				possibleBonds = Utils.calcPossibleVectors(vect, Const.FREQ);
				// returns that vector from `possibleBonds` array,
				// that is closest to the vector made with `down` and `mousePos` coordinates
				return Utils.getClosestVector(absPos, mouseCoords, possibleBonds);
			}
		};

		/**
		 * Modifies `Structure` object by adding new `Arrow` object to its `structure` array.
		 * @param {Structure} structure - `Structure` object,
		 * @param {number[]} mouseCoords - coordinates associated with a mouse event,
		 * @param {number[]} downMouseCoords - coordinates associated with 'mousedown' event,
		 * @param {StructureCluster} chosenArrow - `ArrowCluster` object,
		 */
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
			// add `Arrow` object to the structures array in the Structure object
			structure.addToStructures(arrow);
			return structure;
		};

		/**
		 * Adds new `Selection` object to `structure` array.
		 * @param {Structure} structure - `Structure` object,
		 * @param {number[]} mouseCoords - coordinates associated with a mouse event,
		 * @param {number[]} downMouseCoords - coordinates associated with 'mousedown' event,
		 * @param {Structure}
		 */
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

		/**
		 * Modifies `Bond` object.
		 * @param {Bond} bond - `Bond` object to be modified,
		 * @param {Atom} startAtom - `Atom` object at the beginning of this bond,
		 * @param {StructureCluster} chosenStructure - `StructureCluster` object
		 */
		service.modifyBond = function (bond, startAtom, chosenStructure) {
			var ringSize = chosenStructure.getRingSize(), bondType, newIndex, index,
			  singleBondsAdd = ["single", "double", "triple"],
			  doubleBonds = ["double", "double-left", "double-right"], inverted,
				endAtom = bond.getAtom(), attachedBondIn = [], attachedBondOut = [],
				currentType = bond.getType();
			if (ringSize > 0) {
				// todo
			} else {
				bondType = chosenStructure.getDefault().getStructure(0).getBonds(0).getType();
				if (bondType === "single") {
					index = singleBondsAdd.indexOf(currentType);
					newIndex = index < 0 ? 0: Utils.moveToRight(singleBondsAdd, index, 1);
					bondType = singleBondsAdd[newIndex];
					attachedBondOut = startAtom.getAttachedBonds("out", endAtom.getCoords());
					attachedBondOut.forEach(function (bond) {
						bond.multiplicity = 1;
					});
				} else if (bondType === "double") {
					index = doubleBonds.indexOf(currentType);
					newIndex = index < 0 ? 0: Utils.moveToRight(doubleBonds, index, 1);
					bondType = doubleBonds[newIndex];
				} else if (bondType === "wedge" || bondType === "dash") {
					inverted = currentType.indexOf("inverted") >= 0 || currentType !== bondType;
					bondType = inverted ? bondType: bondType + "-inverted";
				}

				if (bondType === currentType) {
					return false;
				} else {
				  bond.setType(bondType);
					return true;
				}
			}
		};

		/**
		 * Modifies `Structure` object by adding new `Atom` object to its `structure` array.
		 * @param {Structure} structure - `Structure` object,
		 * @param {number[]} mouseCoords - coordinates associated with a mouse event,
		 * @param {number[]} downMouseCoords - coordinates associated with 'mousedown' event,
		 * @param {StructureCluster} chosenStructure - `StructureCluster` object,
		 * @param {boolean} customLength - if custom length should be used
		 */
		service.addStructureOnEmptySpace = function (structure, mouseCoords, downMouseCoords, chosenStructure, customLength) {
			var structureAux, coords, bond;
			if (structure === null) {
				// if the content is empty
				structure = angular.copy(chosenStructure.getStructure(downMouseCoords, mouseCoords));
				// set its origin
				structure.setOrigin(downMouseCoords);
				if (customLength) {
					structure.getStructure(0)
					  .getBonds(0)
						.getAtom()
						.setCoords(
							Utils.subtractVectors(mouseCoords, downMouseCoords)
						);
				}
				if (structure.isAromatic()) {
					// if the chosen Structure object is aromatic,
					// then add appropriate flag to the original Structure object
					bond = Const.getBondByDirection(structure.getName()).bond;
					structure.addDecorate("aromatic", {
						fromWhich: [0, 0],
						coords: Utils.addVectors(downMouseCoords, bond)
					});
				}
			} else {
				// when the content is not empty
				// `Structure` object already exists
				// calaculate new coords
				coords = Utils.subtractVectors(downMouseCoords, structure.getOrigin());
				structureAux = angular.copy(chosenStructure.getStructure(downMouseCoords, mouseCoords));
				if (customLength) {
					structureAux.getStructure(0)
					  .getBonds(0)
						.getAtom()
						.setCoords(
							Utils.subtractVectors(mouseCoords, downMouseCoords)
						);
				}
				if (structureAux.isAromatic()) {
					// if the chosen Structure object is aromatic,
					// then add appropriate flag to the original Structure object
					structure.setAromatic();
					bond = Const.getBondByDirection(structureAux.getName()).bond;
					structure.addDecorate("aromatic", {
						fromWhich: angular.copy(coords),
						coords: Utils.addVectors(downMouseCoords, bond)
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
