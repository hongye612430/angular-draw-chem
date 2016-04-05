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
		"DCCyclicStructure",
		"DCBondStructure",
		"DrawChemDirectiveFlags"
	];

	function DrawChemStructures(Const, Utils, DCStructure, DCStructureCluster, DCAtom, DCBond, DCCyclicStructure, DCBondStructure, Flags) {

		var service = {},
			Atom = DCAtom.Atom,
			Bond = DCBond.Bond,
			CyclicStructure = DCCyclicStructure.CyclicStructure,
			BondStructure = DCBondStructure.BondStructure,
			Structure = DCStructure.Structure,
			StructureCluster = DCStructureCluster.StructureCluster,
			BONDS = Const.BONDS, cyclicStructures, bondStructures;

		cyclicStructures = [
			new CyclicStructure("cyclopropane", 3, 60),
			new CyclicStructure("cyclobutane", 4, 90),
			new CyclicStructure("cyclopentane", 5, 108),
			new CyclicStructure("cyclohexane", 6, 120),
			new CyclicStructure("benzene", 6, 120, true),
			new CyclicStructure("cycloheptane", 7, 128.57),
			new CyclicStructure("cyclooctane", 8, 135),
			new CyclicStructure("cyclononane", 9, 140)
		];

		bondStructures = [
			new BondStructure("single", 1),
			new BondStructure("wedge", 1),
			new BondStructure("dash", 1),
			new BondStructure("double", 2),
			new BondStructure("triple", 3)
		];

		addCyclicStructures();
		addBondStructures();

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
		 * @param {string} type - bond type, e.g. 'single', 'double',
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

		/**
		* Generates a `Bond` object.
		* @param {number[]} bond - vector associated with this bond,
		* @param {string} type - bond type, e.g. 'single', 'double',
		* @param {number} mult - bond multiplicity,
		* @returns {Bond}
		*/
		service.generateBond = function (bond, type, mult) {
			return new Bond(type, new Atom(bond, [], { in: [{ vector: angular.copy(bond), multiplicity: mult }] }));
		};

		/**
		 * Generates a ring in each of the defined direction.
		 * @param {number} deg - angle in degs between two bonds in the ring,
		 * @param {number} size - size of the ring,
		 * @param {string} decorate - indicates decorate element (e.g. aromatic ring),
		 * @returns {Structure[]}
		 */
		service.generateRings = function (deg, size, aromatic) {
			var i, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				direction = BONDS[i].direction;
				result.push(genRing(direction, deg, size, aromatic));
			}

			return result;

			/**
			 * Generates a ring.
			 * @param {string} direction - in which direction the ring will be generated,
			 * @param {number} deg - angle in degs between two bonds (vectors) in the ring,
			 * @param {number} size - size of the ring,
			 * @returns {Structure}
			 */
			function genRing(direction, deg, size) {
				var firstAtom, nextAtom, structure,
					opposite = Atom.getOppositeDirection(direction),
					bond = Const.getBondByDirection(opposite).bond,
					rotVect = Utils.rotVectCCW(bond, deg / 2);

				firstAtom = new Atom([0, 0], [], { out: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
				nextAtom = new Atom(rotVect, [], { in: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
				firstAtom.addBond(new Bond("single", nextAtom));
				service.generateRing(nextAtom, size, deg, firstAtom);
				structure = new Structure(opposite, [firstAtom]);
				if (aromatic) {
					structure.setAromatic();
				}

				return structure;
			}
		};

		/**
		 * Recursively generates atoms in a circular manner (generates a ring as a result).
		 * @param {Atom} atom - `Atom` object, to which new atom will be added,
		 * @param {number} depth - starting/current depth of the structure tree,
		 * @param {number} deg - angle between bonds (vectors),
		 * @param {Atom} firstAtom - first `Atom` object in this cyclic structure
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

		/**
		* Adds an action associated with a button.
		* @param {Function} cb - a callback fn to invoke after clicking on the button,
		* @returns {Function}
		*/
		function createStructureAction(cb) {
			return function (scope) {
				scope.chosenStructure = cb();
				Flags.selected = "structure";
			}
		}

		/**
		* Defines functions associated with bonds.
		*/
		function addBondStructures() {
			bondStructures.forEach(function (bondStr) {
				var name = bondStr.getName(),
					multiplicity = bondStr.getMultiplicity();
				service[name + "Bond"] = function () {
					var defs = service.generateBonds(name, multiplicity),
					  cluster = new StructureCluster(name, defs, 0, 0, multiplicity);
					return cluster;
				};
			});
		}

		/**
		* Defines functions associated with cyclic structures.
		*/
		function addCyclicStructures() {
			cyclicStructures.forEach(function (cyclic) {
				var name = cyclic.getName(),
				  ringSize = cyclic.getRingSize(),
					angle = cyclic.getAngle(),
					aromatic = cyclic.isAromatic();
				service[name] = function () {
					var defs = service.generateRings(angle, ringSize, aromatic),
						cluster = new StructureCluster(name, defs, ringSize, angle);
					return cluster;
				};
			});
		}
	}
})();
