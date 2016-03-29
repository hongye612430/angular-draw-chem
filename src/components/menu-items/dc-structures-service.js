(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);

	DrawChemStructures.$inject = [
		"DrawChemConst",
		"DrawChemUtils",
		"DCStructure",
		"DCStructureCluster",
		"DCAtom",
		"DCBond",
		"DrawChemDirectiveFlags"
	];

	function DrawChemStructures(Const, Utils, DCStructure, DCStructureCluster, DCAtom, DCBond, Flags) {

		var service = {},
			Atom = DCAtom.Atom,
			Bond = DCBond.Bond,
			Structure = DCStructure.Structure,
			StructureCluster = DCStructureCluster.StructureCluster,
			BONDS = Const.BONDS;

		/**
		 * Generates benzene structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.benzene = function () {
			var cluster,
				name = "benzene",
				defs = generateRings(120, 6, "aromatic");

			cluster = new StructureCluster(name, defs);
			return cluster;
		};

		/**
		 * Generates cyclohexane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclohexane = function () {
			var cluster,
				name = "cyclohexane",
				defs = generateRings(120, 6);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates cyclopentane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclopentane = function () {
			var cluster,
				name = "cyclopentane",
				defs = generateRings(108, 5);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclopropane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclopropane = function () {
			var cluster,
				name = "cyclopropane",
				defs = generateRings(60, 3);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclobutane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclobutane = function () {
			var cluster,
				name = "cyclobutane",
				defs = generateRings(90, 4);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cycloheptane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cycloheptane = function () {
			var cluster,
				name = "cycloheptane",
				defs = generateRings(128.57, 7);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclooctane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclooctane = function () {
			var cluster,
				name = "cyclooctane",
				defs = generateRings(135, 8);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclononane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclononane = function () {
			var cluster,
				name = "cyclononane",
				defs = generateRings(140, 9);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates single bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.singleBond = function () {
			var cluster,
				multiplicity = "single",
				name = "single-bond",
				defs = generateBonds("single", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates double bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.doubleBond = function () {
			var cluster,
				multiplicity = "double",
				name = "double-bond",
				defs = generateBonds("double", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates triple bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.tripleBond = function () {
			var cluster,
				multiplicity = "triple",
				name = "triple-bond",
				defs = generateBonds("triple", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates wedge bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.wedgeBond = function () {
			var cluster,
				multiplicity = "single",
				name = "wedge-bond",
				defs = generateBonds("wedge", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates wedge bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.dashBond = function () {
			var cluster,
				multiplicity = "single",
				name = "dash-bond",
				defs = generateBonds("dash", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Stores all predefined structures.
		 */
		service.structures = {
			"cyclopropane": {
				action: createStructureAction(service.cyclopropane),
				id: "cyclopropane",
				thumbnail: true
			},
			"cyclobutane": {
				action: createStructureAction(service.cyclobutane),
				id: "cyclobutane",
				thumbnail: true
			},
			"benzene": {
				action: createStructureAction(service.benzene),
				id: "benzene",
				thumbnail: true
			},
			"cyclohexane": {
				action: createStructureAction(service.cyclohexane),
				id: "cyclohexane",
				thumbnail: true
			},
			"cyclopentane": {
				action: createStructureAction(service.cyclopentane),
				id: "cyclopentane",
				thumbnail: true
			},
			"cycloheptane": {
				action: createStructureAction(service.cycloheptane),
				id: "cycloheptane",
				thumbnail: true
			},
			"cyclooctane": {
				action: createStructureAction(service.cyclooctane),
				id: "cyclooctane",
				thumbnail: true
			},
			"cyclononane": {
				action: createStructureAction(service.cyclononane),
				id: "cyclononane",
				thumbnail: true
			},
			"single bond": {
				action: createStructureAction(service.singleBond),
				id: "single-bond",
				thumbnail: true
			},
			"wedge bond": {
				action: createStructureAction(service.wedgeBond),
				id: "wedge-bond",
				thumbnail: true
			},
			"dash bond": {
				action: createStructureAction(service.dashBond),
				id: "dash-bond",
				thumbnail: true
			},
			"double bond": {
				action: createStructureAction(service.doubleBond),
				id: "double-bond",
				thumbnail: true
			},
			"triple bond": {
				action: createStructureAction(service.tripleBond),
				id: "triple-bond",
				thumbnail: true
			}
		};

		return service;

		function createStructureAction(cb) {
			return function (scope) {
				scope.chosenStructure = cb();
				Flags.selected = "structure";
			}
		}

		/**
		 * Generates a ring in each of the defined direction.
		 * @param {Number} deg - angle in degs between two bonds in the ring,
		 * @param {Number} size - size of the ring,
		 * @param {String} decorate - indicates decorate element (e.g. aromatic ring),
		 * @returns {Structure[]}
		 */
		function generateRings(deg, size, decorate) {
			var i, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				direction = BONDS[i].direction;
				result.push(genRing(direction, deg, size));
			}

			return result;

			/**
			 * Generates a ring.
			 * @param {String} direction - in which direction the ring will be generated,
			 * @param {Number} deg - angle in degs between two bonds in the ring,
			 * @param {Number} size - size of the ring,
			 * @returns {Structure}
			 */
			function genRing(direction, deg, size) {
				var firstAtom, nextAtom, structure,
					opposite = Atom.getOppositeDirection(direction),
					bond = Const.getBondByDirection(opposite).bond,
					rotVect = Utils.rotVectCCW(bond, deg / 2);

				firstAtom = new Atom([0, 0], [], "", []);
				nextAtom = new Atom(rotVect, [], "", []);
				firstAtom.addBond(new Bond("single", nextAtom));
				genAtoms(nextAtom, size);
				structure = new Structure(opposite, [firstAtom]);
				if (decorate === "aromatic") {
					structure.setAromatic();
				}

				return structure;

				/**
				 * Recursively generates atoms.
				 * @param {Atom} prevAtom - previous atom (the one to which new atom will be added),
				 * @param {Number} depth - current depth of the structure tree
				 */
				function genAtoms(prevAtom, depth) {
					var rotVect = Utils.rotVectCW(prevAtom.getCoords(), 180 - deg),
					  newAtom = new Atom(rotVect, [], "", []);
					if (depth === 1) { return undefined; }
					prevAtom.addBond(new Bond("single", newAtom));
					genAtoms(newAtom, depth - 1);
				}
			}
		}

		/**
		 * Generates single bonds in all defined directions.
		 * @param {String} type - bond type, e.g. 'single', 'double'.
		 * @returns {Structure[]}
		 */
		function generateBonds(type, multiplicity) {
			var i, bond, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				bond = BONDS[i].bond;
				direction = BONDS[i].direction;
				result.push(
					new Structure(
						direction,
						[
							new Atom([0, 0], [
								new Bond(type, new Atom(bond, [], "", [{ direction: Atom.getOppositeDirection(direction), type: multiplicity }]))
							], "")
						]
					)
				);
			}

			return result;
		}
	}
})();
