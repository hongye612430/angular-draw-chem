(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);
		
	DrawChemStructures.$inject = ["DrawChemConst", "DCStructure", "DCAtom"];
	
	function DrawChemStructures(DrawChemConst, DCStructure, DCAtom) {
		
		var service = {},
			benzene,
			Atom = DCAtom.Atom,
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
			return new DCStructure.Structure(
				"benzene",
				[
					new Atom([0, 0], [
						new Atom(BOND_SE, [
							new Atom(BOND_S, [
								new Atom(BOND_SW, [
									new Atom(BOND_NW, [
										new Atom(BOND_N, [])
									])
								])
							])
						]),
						new Atom(BOND_SW, [])
					])					
				]
			);
		};
		
		service.singleBond = function () {
			return new DCStructure.Structure(
				"single-bond",
				[
					new Atom([0, 0], [
						new Atom(BOND_N, [])
					])
				]
			);
		};
		
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [service.benzene, service.singleBond];
		
		return service;
	}
})();