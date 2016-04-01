(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemConst", DrawChemConst);

	DrawChemConst.$inject = ["DrawChemUtils"];

	function DrawChemConst(Utils) {

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

			// angle between possible bonds when adding a new bond (in degrees)
			service.FREQ = 15;

			// default angle between two bonds (in degrees)
			service.ANGLE = 120;

			// maximum number of bonds at one atom
			service.MAX_BONDS = 10;

			// default r of an aromatic circle
			service.AROMATIC_R = service.BOND_LENGTH * 0.45;

			// default distance between two parallel bonds in double bonds (as a percent of the bond length);
			service.BETWEEN_DBL_BONDS = 0.065;

			// default distance between two furthest bonds in triple bonds (as a percent of the bond length);
			service.BETWEEN_TRP_BONDS = 0.1;

			// default arrow size (as a percent of the bond length);
			service.ARROW_SIZE = 0.065;

			// default starting point of the arrow head (as a percent of the bond length);
			service.ARROW_START = 0.85;

			// default bond width
			service.BOND_WIDTH = (service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2);

			// default r of a circle around an atom
			service.CIRC_R = service.BOND_LENGTH * 0.12;

			// default directions, clock-wise
			service.DIRECTIONS = ["N", "NE1", "NE2", "E", "SE1", "SE2", "S", "SW1", "SW2", "W", "NW1", "NW2"];

			// bonds + their directions
			service.BONDS = [];

			generateBonds();

			service.getBondByDirection = function (direction) {
				var i;
				for (i = 0; i < service.BONDS.length; i += 1) {
					if (service.BONDS[i].direction === direction) {
						return service.BONDS[i];
					}
				}
			};

			function generateBonds() {
				var vector = [0, -service.BOND_LENGTH];
				service.DIRECTIONS.forEach(function (direction) {
					var name = "BOND_" + direction;
					service[name] = vector;
					service.BONDS.push({ direction: direction, bond: vector });
					vector = Utils.rotVectCW(vector, 30);
				});
			}
		}

		return service;
	}
})();
