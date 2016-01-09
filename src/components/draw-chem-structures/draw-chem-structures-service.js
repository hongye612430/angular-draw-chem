(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);
		
	DrawChemStructures.$inject = ["DrawChemConst", "DCStructure", "DCStructureCluster", "DCAtom"];
	
	function DrawChemStructures(DrawChemConst, DCStructure, DCStructureCluster, DCAtom) {

		var service = {},
			benzene,
			Atom = DCAtom.Atom,
			StructureCluster = DCStructureCluster.StructureCluster,
			singleBond,
			BOND_N = DrawChemConst.BOND_N,
			BOND_S = DrawChemConst.BOND_S,
			BOND_W = DrawChemConst.BOND_W,
			BOND_E = DrawChemConst.BOND_E,
			BOND_NE1 = DrawChemConst.BOND_NE1,
			BOND_NE2 = DrawChemConst.BOND_NE2,
			BOND_NW1 = DrawChemConst.BOND_NW1,
			BOND_NW2 = DrawChemConst.BOND_NW2,
			BOND_SE1 = DrawChemConst.BOND_SE1,
			BOND_SE2 = DrawChemConst.BOND_SE2,
			BOND_SW1 = DrawChemConst.BOND_SW1,
			BOND_SW2 = DrawChemConst.BOND_SW2;
			
		service.benzene = function () {
			var name = "benzene",
				defs = [
					new DCStructure.Structure(
						"N",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE1, [
									new Atom(BOND_S, [
										new Atom(BOND_SW2, [
											new Atom(BOND_NW1, [
												new Atom(BOND_N, [], "Z", ["S", "NE2"])
											], "", ["SE1", "N"])
										], "", ["NE2", "NW1"])
									], "", ["N", "SW2"])
								], "", ["NW1", "S"])
							], "", ["SE1", "SW2"])			
						],
						"aromatic"
					)
				],
				cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		service.cyclohexane = function () {
			var name = "cyclohexane",
				defs = [
					new DCStructure.Structure(
						"N",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE1, [
									new Atom(BOND_S, [
										new Atom(BOND_SW2, [
											new Atom(BOND_NW1, [
												new Atom(BOND_N, [], "Z", ["S", "NE2"])
											], "", ["SE1", "N"])
										], "", ["NE2", "NW1"])
									], "", ["N", "SW2"])
								], "", ["NW1", "S"])
							], "", ["SE1", "SW2"])			
						]
					)
				],
				cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		service.singleBond = function () {
			var name = "single-bond",
				defs = [
					new DCStructure.Structure(
						"N",
						[
							new Atom([0, 0], [
								new Atom(BOND_N, [], "", ["S"])
							], "", ["N"])
						]
					),
					new DCStructure.Structure(
						"NE1",
						[
							new Atom([0, 0], [
								new Atom(BOND_NE1, [], "", ["SW1"])
							], "", ["NE1"])
						]
					),
					new DCStructure.Structure(
						"NE2",
						[
							new Atom([0, 0], [
								new Atom(BOND_NE2, [], "", ["SW2"])
							], "", ["NE2"])
						]
					),
					new DCStructure.Structure(
						"E",
						[
							new Atom([0, 0], [
								new Atom(BOND_E, [], "", ["W"])
							], "", ["E"])
						]
					),
					new DCStructure.Structure(
						"SE1",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE1, [], "", ["NW1"])
							], "", ["SE1"])
						]
					),
					new DCStructure.Structure(
						"SE2",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE2, [], "", ["NW2"])
							], "", ["SE2"])
						]
					),
					new DCStructure.Structure(
						"S",
						[
							new Atom([0, 0], [
								new Atom(BOND_S, [], "", ["N"])
							], "", ["S"])
						]
					),
					new DCStructure.Structure(
						"SW1",
						[
							new Atom([0, 0], [
								new Atom(BOND_SW1, [], "", ["NE1"])
							], "", ["SW1"])
						]
					),
					new DCStructure.Structure(
						"SW2",
						[
							new Atom([0, 0], [
								new Atom(BOND_SW2, [], "", ["NE2"])
							], "", ["SW2"])
						]
					),					
					new DCStructure.Structure(
						"W",
						[
							new Atom([0, 0], [
								new Atom(BOND_W, [], "", ["E"])
							], "", ["W"])
						]
					),
					new DCStructure.Structure(
						"NW1",
						[
							new Atom([0, 0], [
								new Atom(BOND_NW1, [], "", ["SE1"])
							], "", ["NW1"])
						]
					),
					new DCStructure.Structure(
						"NW2",
						[
							new Atom([0, 0], [
								new Atom(BOND_NW2, [], "", ["SE2"])
							], "", ["NW2"])
						]
					)
				],
				cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [service.benzene, service.cyclohexane, service.singleBond];
		
		return service;
	}
})();