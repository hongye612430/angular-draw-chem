(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemConst", DrawChemConst);
	
	function DrawChemConst() {
		
		var service = {};
		
		// the default bond length
		service.BOND_LENGTH = 20;
		
		// proportion of the bond width to bond length
		// 0.041 corresponds to the ACS settings in ChemDraw, according to
		// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
		service.WIDTH_TO_LENGTH = 0.04;
		
		// the default bond width
		service.BOND_WIDTH = parseFloat((service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2));
		
		return service;		
	}		
})();