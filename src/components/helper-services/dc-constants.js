(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemConst", DrawChemConst);

	DrawChemConst.$inject = ["DrawChemUtils"];

	function DrawChemConst(Utils) {

		var service = {};

		service.SET_BOND_LENGTH;

		/**
		* Sets length of the bond and then initializes other constants.
		* For use at config step.
		* @param {number} length - length of the bond
		*/
		service.setBondLength = function (length) {
			service.SET_BOND_LENGTH = length;
			init(); // initialize all constants
		}

		// initialize all constants
		init();

		/**
		* Initializes all constants.
		*/
		function init() {

			// the default bond length
			service.BOND_LENGTH = service.SET_BOND_LENGTH || 20;

			// proportion of the bond width to bond length
			// 0.04 corresponds to the ACS settings in ChemDraw, according to
			// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
			service.WIDTH_TO_LENGTH = 0.04;

			// angle between possible bonds when adding a new bond (in degrees)
			service.FREQ = 15;

			// 'push' factor is related to bonds starting/ending on an atom with a label
			// (it has to start/end outside of the label)
			service.PUSH = 0.25;

			// default angle between two bonds (in degrees)
			service.ANGLE = 120;

			// maximum number of bonds at one atom
			service.MAX_BONDS = 10;

			// default r of an aromatic circle
			service.AROMATIC_R = service.BOND_LENGTH * 0.45;

			// default distance between two parallel bonds in double bonds (as a percent of the bond length);
			service.BETWEEN_DBL_BONDS = 0.065;

			// factor for Bezier curve in 'undefined' bond
			service.UNDEF_BOND = 1.5 * service.BETWEEN_DBL_BONDS;

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
			service.DIRECTIONS = [
				"N", "NE1", "NE2", "NE3", "NE4", "NE5",
				"E", "SE1", "SE2", "SE3", "SE4", "SE5",
				"S", "SW1", "SW2", "SW3", "SW4", "SW5",
				"W", "NW1", "NW2", "NW3", "NW4", "NW5"
			];

			// bonds + their directions
			service.BONDS = [];

			// adds all bonds to `service`, e.g. `service.BOND_N`
			generateBonds();

			/**
			* Returns a bond vector associated with a direction.
			* @param {string} direction - direction of the bond
			* @returns {number[]}
			*/
			service.getBondByDirection = function (direction) {
				var i;
				for (i = 0; i < service.BONDS.length; i += 1) {
					if (service.BONDS[i].direction === direction) {
						return service.BONDS[i];
					}
				}
			};

			// adds all bonds to `service`, e.g. `service.BOND_N`
			// then to `service.BONDS` array
			function generateBonds() {
				var vector = [0, -service.BOND_LENGTH]; // starting vector, north direction
				service.DIRECTIONS.forEach(function (direction) {
					var name = "BOND_" + direction;
					service[name] = vector; // add vector to `service`
					service.BONDS.push({ direction: direction, bond: vector }); // add bond to `BONDS` array
					vector = Utils.rotVectCW(vector, service.FREQ); // rotate vector by default angle
				});
			}
		}

		return service;
	}
})();
