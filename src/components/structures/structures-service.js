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
				structure: [
					{
						coords: [0, 0],
						bonds: [
							{
								coords: [parseFloat((LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
								bonds: [
									{
										coords: [0, LEN],
										bonds: [
											{
												coords: [parseFloat(-(LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
												bonds: [
													{
														coords: [parseFloat(-(LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat(-(LEN / 2).toFixed(2))],
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
								coords: [parseFloat(-(LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
								bonds: []
							}
						]
					}
				]
			},
			{
				name: "single bond",
				structure: [
					{
						coords: [0, 0],
						bonds: [
							{
								coords: [parseFloat((LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
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