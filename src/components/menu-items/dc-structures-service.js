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
				ringSize = 6,
				angle = 120,
				defs = service.generateRings(angle, ringSize, "aromatic");

			cluster = new StructureCluster(name, defs, 0, ringSize, angle, true);
			return cluster;
		};

		/**
		 * Generates cyclohexane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclohexane = function () {
			var cluster,
				name = "cyclohexane",
				ringSize = 6,
				angle = 120,
				defs = service.generateRings(angle, ringSize);

			cluster = new StructureCluster(name, defs, 0, ringSize, angle);

			return cluster;
		};

		/**
		 * Generates cyclopentane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclopentane = function () {
			var cluster,
				name = "cyclopentane",
				ringSize = 5,
				angle = 108,
				defs = service.generateRings(angle, ringSize);

			cluster = new StructureCluster(name, defs, 0, ringSize, angle);

			return cluster;
		};

		/**
		 * Generates a cyclopropane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclopropane = function () {
			var cluster,
				name = "cyclopropane",
				defs = service.generateRings(60, 3);

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
				defs = service.generateRings(90, 4);

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
				defs = service.generateRings(128.57, 7);

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
				defs = service.generateRings(135, 8);

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
				defs = service.generateRings(140, 9);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates single bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.singleBond = function () {
			var cluster,
				multiplicity = 1,
				name = "single",
				defs = service.generateBonds(name, multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates double bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.doubleBond = function () {
			var cluster,
				multiplicity = 2,
				name = "double",
				defs = service.generateBonds(name, multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates triple bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.tripleBond = function () {
			var cluster,
				multiplicity = 3,
				name = "triple",
				defs = service.generateBonds(name, multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates wedge bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.wedgeBond = function () {
			var cluster,
				multiplicity = 1,
				name = "wedge",
				defs = service.generateBonds(name, multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates wedge bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.dashBond = function () {
			var cluster,
				multiplicity = 1,
				name = "dash",
				defs = service.generateBonds(name, multiplicity);

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

		/**
		 * Generates single bonds in all defined directions.
		 * @param {String} type - bond type, e.g. 'single', 'double'.
		 * @returns {Structure[]}
		 */
		service.generateBonds = function(type, mult) {
			var i, bond, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				bond = BONDS[i].bond;
				direction = BONDS[i].direction;
				result.push(
					new Structure(
						direction,
						[
							new Atom([0, 0], [service.generateBond(bond, type, mult)],
								{ out: [{ vector: bond, multiplicity: mult }] } )
						]
					)
				);
			}
			return result;
		};

		service.generateBond = function (bond, type, mult) {
			return new Bond(type, new Atom(bond, [], { in: [{ vector: angular.copy(bond), multiplicity: mult }] }));
		};

		/**
		 * Generates a ring in each of the defined direction.
		 * @param {Number} deg - angle in degs between two bonds in the ring,
		 * @param {Number} size - size of the ring,
		 * @param {String} decorate - indicates decorate element (e.g. aromatic ring),
		 * @returns {Structure[]}
		 */
		service.generateRings = function (deg, size, decorate) {
			var i, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				direction = BONDS[i].direction;
				result.push(genRing(direction, deg, size, decorate));
			}

			return result;

			/**
			 * Generates a ring.
			 * @param {String} direction - in which direction the ring will be generated,
			 * @param {Number} deg - angle in degs between two bonds in the ring,
			 * @param {Number} size - size of the ring,
			 * @returns {Structure}
			 */
			function genRing(direction, deg, size, decorate) {
				var firstAtom, nextAtom, structure,
					opposite = Atom.getOppositeDirection(direction),
					bond = Const.getBondByDirection(opposite).bond,
					rotVect = Utils.rotVectCCW(bond, deg / 2);

				firstAtom = new Atom([0, 0], [], { out: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
				nextAtom = new Atom(rotVect, [], { in: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
				firstAtom.addBond(new Bond("single", nextAtom));
				service.generateRing(nextAtom, size, deg, firstAtom);
				structure = new Structure(opposite, [firstAtom]);
				if (decorate === "aromatic") {
					structure.setAromatic();
				}

				return structure;
			}
		};

		/**
		 * Recursively generates atoms in a circular manner.
		 * @param {Atom} atom - atom, to which new atom will be added,
		 * @param {Number} depth - starting/current depth of the structure tree
		 */
		service.generateRing = function(atom, depth, deg, firstAtom) {
			var rotVect = Utils.rotVectCW(atom.getCoords(), 180 - deg),
				newAtom = new Atom(rotVect, []);

			atom.attachBond("out", { vector: angular.copy(rotVect), multiplicity: 1 });
			if (depth === 1) {
				firstAtom.attachBond("in", { vector: angular.copy(atom.getCoords()), multiplicity: 1 });
				return;
			}
			newAtom.attachBond("in", { vector: angular.copy(rotVect), multiplicity: 1 });
			atom.addBond(new Bond("single", newAtom));
			service.generateRing(newAtom, depth - 1, deg, firstAtom);
		};

		return service;

		function createStructureAction(cb) {
			return function (scope) {
				scope.chosenStructure = cb();
				Flags.selected = "structure";
			}
		}
	}
})();
