(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);
		
	DrawChemStructures.$inject = ["DrawChemConst", "DCStructure"];
	
	function DrawChemStructures(DrawChemConst, DCStructure) {
		
		var service = {},
			benzene,
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
					{
						coords: [0, 0],
						bonds: [
							{
								coords: BOND_SE,
								bonds: [
									{
										coords: BOND_S,
										bonds: [
											{
												coords: BOND_SW,
												bonds: [
													{
														coords: BOND_NW,
														bonds: [
															{
																coords: BOND_N,
																bonds: []
															}
														]
													}
												]
											}
										]
									}
								]
							},
							{
								coords: BOND_SW,
								bonds: []
							}
						]
					}
				]
			);
		};
		
		service.singleBond = function () {
			return new DCStructure.Structure(
				"single bond",
				[
					{
						coords: [0, 0],
						bonds: [
							{
								coords: BOND_NW,
								bonds: []
							}
						]
					}
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