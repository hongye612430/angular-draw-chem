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

			var calcBond, calcBondAux1, calcBondAux2, calcBondAux3;

			// the default bond length
			service.BOND_LENGTH = service.SET_BOND_LENGTH || 20;

			calcBond = parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2));
			calcBondAux1 = parseFloat((service.BOND_LENGTH * Math.sin(Math.PI / 12)).toFixed(2));
			calcBondAux2 = parseFloat((service.BOND_LENGTH * Math.cos(Math.PI / 12)).toFixed(2));
			calcBondAux3 = parseFloat((service.BOND_LENGTH * Math.sin(Math.PI / 4)).toFixed(2));

			// proportion of the bond width to bond length
			// 0.04 corresponds to the ACS settings in ChemDraw, according to
			// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
			service.WIDTH_TO_LENGTH = 0.04;

			// angle between possible bonds when adding a new bond (in degrees)
			service.FREQ = 15;

			// default angle between two bonds (in degrees)
			service.ANGLE = 120;

			// the default r of an aromatic circle
			service.AROMATIC_R = service.BOND_LENGTH * 0.45;

			// the default distance between two parallel bonds in double bonds (as a percent of the bond length);
			service.BETWEEN_DBL_BONDS = 0.065;

			// the default distance between two furthest bonds in triple bonds (as a percent of the bond length);
			service.BETWEEN_TRP_BONDS = 0.1;

			// the default arrow size (as a percent of the bond length);
			service.ARROW_SIZE = 0.065;

			// the default strating point of the arrow head (as a percent of the bond length);
			service.ARROW_START = 0.85;

			// the default bond width
			service.BOND_WIDTH = (service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2);

			// the default r of a circle around an atom
			service.CIRC_R = service.BOND_LENGTH * 0.12;

			// all bonds (starting from bond in north direction, going clock-wise), every 15 deg
			service.BOND_N = [0, -service.BOND_LENGTH];
			service.BOND_N_NE1 = [calcBondAux1, -calcBondAux2];
			service.BOND_NE1 = [service.BOND_LENGTH / 2, -calcBond];
			service.BOND_NE1_NE2 = [calcBondAux3, -calcBondAux3];
			service.BOND_NE2 = [calcBond, -service.BOND_LENGTH / 2];
			service.BOND_NE2_E = [calcBondAux2, -calcBondAux1];
			service.BOND_E = [service.BOND_LENGTH, 0];
			service.BOND_E_SE1 = [calcBondAux2, calcBondAux1];
			service.BOND_SE1 = [calcBond, service.BOND_LENGTH / 2],
			service.BOND_SE1_SE2 = [calcBondAux3, calcBondAux3];
			service.BOND_SE2 = [service.BOND_LENGTH / 2, calcBond];
			service.BOND_SE2_S = [calcBondAux1, calcBondAux2];
			service.BOND_S = [0, service.BOND_LENGTH];
			service.BOND_S_SW1 = [-calcBondAux1, calcBondAux2];
			service.BOND_SW1 = [-service.BOND_LENGTH / 2, calcBond];
			service.BOND_SW1_SW2 = [-calcBondAux3, calcBondAux3];
			service.BOND_SW2 = [-calcBond, service.BOND_LENGTH / 2];
			service.BOND_SW2_W = [-calcBondAux2, calcBondAux1];
			service.BOND_W = [-service.BOND_LENGTH, 0];
			service.BOND_W_NW1 = [-calcBondAux2, -calcBondAux1];
			service.BOND_NW1 = [-calcBond, -service.BOND_LENGTH / 2];
			service.BOND_NW1_NW2 = [-calcBondAux3, -calcBondAux3];
			service.BOND_NW2 = [-service.BOND_LENGTH / 2, -calcBond];
			service.BOND_NW2_N = [-calcBondAux1, -calcBondAux2];

			// bonds as array
			service.BONDS = [
				{ direction: "N", bond: service.BOND_N },
				{ direction: "NE1", bond: service.BOND_NE1 },
				{ direction: "NE2", bond: service.BOND_NE2 },
				{ direction: "E", bond: service.BOND_E },
				{ direction: "SE1", bond: service.BOND_SE1 },
				{ direction: "SE2", bond: service.BOND_SE2 },
				{ direction: "S", bond: service.BOND_S },
				{ direction: "SW1", bond: service.BOND_SW1 },
				{ direction: "SW2", bond: service.BOND_SW2 },
				{ direction: "W", bond: service.BOND_W },
				{ direction: "NW1", bond: service.BOND_NW1 },
				{ direction: "NW2", bond: service.BOND_NW2 }
			];

			service.BONDS_AUX = [
				{ direction: "N_NE1", bond: service.BOND_N_NE1 },
				{ direction: "NE1_NE2", bond: service.BOND_NE1_NE2 },
				{ direction: "NE2_E", bond: service.BOND_NE2_E },
				{ direction: "E_SE1", bond: service.BOND_E_SE1 },
				{ direction: "SE1_SE2", bond: service.BOND_SE1_SE2 },
				{ direction: "SE2_S", bond: service.BOND_SE2_S },
				{ direction: "S_SW1", bond: service.BOND_S_SW1 },
				{ direction: "SW1_SW2", bond: service.BOND_SW1_SW2 },
				{ direction: "SW2_W", bond: service.BOND_SW2_W },
				{ direction: "W_NW1", bond: service.BOND_W_NW1 },
				{ direction: "NW1_NW2", bond: service.BOND_NW1_NW2 },
				{ direction: "NW2_N", bond: service.BOND_NW2_N }
			];

			service.getBondByDirection = function (direction) {
				var i;
				for (i = 0; i < service.BONDS.length; i += 1) {
					if (service.BONDS[i].direction === direction) {
						return service.BONDS[i];
					}
				}
			}
		}

		return service;
	}
})();
