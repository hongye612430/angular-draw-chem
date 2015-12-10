(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);
		
	DrawChemStructures.$inject = ["DrawChemShapes"];
	
	function DrawChemStructures(DrawChemShapes) {
		
		var service = {}, LEN = DrawChemShapes.BOND_LENGTH;
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [
			{
				name: "benzene",
				decorate: {
					shape: "circle",
					r: 0.6 * LEN
				},
				structure: [
					{
						coords: [0, 0],
						bonds: [
							{
								coords: [(LEN * Math.sqrt(3) / 2).toFixed(2), (LEN / 2).toFixed(2)],
								bonds: [
									{
										coords: [0, LEN],
										bonds: [
											{
												coords: [-(LEN * Math.sqrt(3) / 2).toFixed(2), (LEN / 2).toFixed(2)],
												bonds: [
													{
														coords: [-(LEN * Math.sqrt(3) / 2).toFixed(2), -(LEN / 2).toFixed(2)],
														bonds: [
															{
																coords: [0, -LEN],
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
								coords: [-(LEN * Math.sqrt(3) / 2).toFixed(2), (LEN / 2).toFixed(2)],
								bonds: []
							}
						]
					}
				]
			}
		];
		
		return service;
	}
})();