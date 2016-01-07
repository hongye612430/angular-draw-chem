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
			BOND_NE = DrawChemConst.BOND_NE,
			BOND_NW = DrawChemConst.BOND_NW,
			BOND_SE = DrawChemConst.BOND_SE,
			BOND_SW = DrawChemConst.BOND_SW;
			
		service.benzene = function () {
			var name = "benzene",
				defs = [
					new DCStructure.Structure(
						"N",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE, [
									new Atom(BOND_S, [
										new Atom(BOND_SW, [
											new Atom(BOND_NW, [
												new Atom(BOND_N, [], "Z", "NW")
											], "", "SW")
										], "", "S")
									], "", "SE")
								], "", "NE")
							], "", "N")					
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
								new Atom(BOND_SE, [
									new Atom(BOND_S, [
										new Atom(BOND_SW, [
											new Atom(BOND_NW, [
												new Atom(BOND_N, [], "Z", "NW")
											], "", "SW")
										], "", "S")
									], "", "SE")
								], "", "NE")
							], "", "N")					
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
								new Atom(BOND_N, [], "", "NE")
							], "", "SW")
						]
					),
					new DCStructure.Structure(
						"NE",
						[
							new Atom([0, 0], [
								new Atom(BOND_NE, [], "", "SE")
							], "", "NW")
						]
					),
					new DCStructure.Structure(
						"E",
						[
							new Atom([0, 0], [
								new Atom(BOND_E, [], "", "SE")
							], "", "NW")
						]
					),
					new DCStructure.Structure(
						"SE",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE, [], "", "NE")
							], "", "SW")
						]
					),
					new DCStructure.Structure(
						"S",
						[
							new Atom([0, 0], [
								new Atom(BOND_S, [], "", "SW")
							], "", "NE")
						]
					),
					new DCStructure.Structure(
						"SW",
						[
							new Atom([0, 0], [
								new Atom(BOND_SW, [], "", "NW")
							], "", "SE")
						]
					),
					new DCStructure.Structure(
						"W",
						[
							new Atom([0, 0], [
								new Atom(BOND_W, [], "", "SW")
							], "", "NE")
						]
					),
					new DCStructure.Structure(
						"NW",
						[
							new Atom([0, 0], [
								new Atom(BOND_NW, [], "", "SW")
							], "", "SE")
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