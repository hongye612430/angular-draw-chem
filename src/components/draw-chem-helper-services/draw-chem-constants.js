(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemConst", DrawChemConst);
	
	function DrawChemConst() {
		
		var service = {};
		
		service.SET_BOND_LENGTH;
		
		service.setBondLength = function (length) {
			service.SET_BOND_LENGTH = length;
			init();
		}
		
		init();
		
		function init() {
			// the default bond length
			service.BOND_LENGTH = service.SET_BOND_LENGTH || 20;
			
			// proportion of the bond width to bond length
			// 0.04 corresponds to the ACS settings in ChemDraw, according to
			// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
			service.WIDTH_TO_LENGTH = 0.04;
			
			// the default bond width
			service.BOND_WIDTH = parseFloat((service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2));
			
			// the default r of a circle around an atom
			service.CIRC_R = service.BOND_LENGTH * 0.12;
			
			// bond in north direction
			service.BOND_N = [0, -service.BOND_LENGTH];
			// bond in south direction
			service.BOND_S = [0, service.BOND_LENGTH];
			// bond in east direction
			service.BOND_E = [parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), 0];
			// bond in west direction
			service.BOND_W = [-parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), 0];
			// bond in north-east direction (first clock-wise)
			service.BOND_NE1 = [service.BOND_LENGTH / 2, -parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))],
			// bond in north-east direction (second clock-wise)
			service.BOND_NE2 = [parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), -service.BOND_LENGTH / 2];
			// bond in south-east direction (first clock-wise)
			service.BOND_SE1 = [parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), service.BOND_LENGTH / 2],
			// bond in south-east direction (second clock-wise)
			service.BOND_SE2 = [service.BOND_LENGTH / 2, parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))];
			// bond in south-west direction (first clock-wise)
			service.BOND_SW1 = [-service.BOND_LENGTH / 2, parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))];
			// bond in south-west direction (second clock-wise)
			service.BOND_SW2 = [-parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), service.BOND_LENGTH / 2];
			// bond in north-west direction (first clock-wise)
			service.BOND_NW1 = [-parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), -service.BOND_LENGTH / 2];
			// bond in north-west direction (second clock-wise)	
			service.BOND_NW2 = [-service.BOND_LENGTH / 2, -parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))];					
			// bonds as array
			service.BONDS = [
				{ direction: "N", bond: service.BOND_N },
				{ direction: "S", bond: service.BOND_S },
				{ direction: "E", bond: service.BOND_E },
				{ direction: "W", bond: service.BOND_W },
				{ direction: "NE1", bond: service.BOND_NE1 },
				{ direction: "NE2", bond: service.BOND_NE2 },
				{ direction: "NW1", bond: service.BOND_NW1 },
				{ direction: "NW2", bond: service.BOND_NW2 },
				{ direction: "SE1", bond: service.BOND_SE1 },
				{ direction: "SE2", bond: service.BOND_SE2 },
				{ direction: "SW1", bond: service.BOND_SW1 },
				{ direction: "SW2", bond: service.BOND_SW2 }
			];	
		}		
		
		return service;		
	}		
})();