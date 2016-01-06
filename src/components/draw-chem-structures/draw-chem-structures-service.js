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
			return {
				name: "benzene",
				getDefault: function () {
					return this.defs[0];
				},
				decorate: "aromatic",
				defs: [
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
				]
			}
		};
		
		service.cyclohexane = function () {
			return {
				name: "cyclohexane",
				getDefault: function () {
					return this.defs[0];
				},
				defs: [
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
				]
			}
		};
		
		service.singleBond = function () {
			return {
				name: "single-bond",
				getDefault: function () {
					return this.defs[0];
				},
				defs: [
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
				]
			}
		};
		
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [service.benzene, service.cyclohexane, service.singleBond];
		
		return service;
	}
})();