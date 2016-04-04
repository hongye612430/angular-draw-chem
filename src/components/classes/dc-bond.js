(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCBond", DCBond);

	function DCBond() {

		var service = {};

		/**
		* Creates a new Bond.
		* @class
		* @param {String} type - type of bond, e.g. single, double, triple, wedge, or dash
		* @param {Atom} - an atom at the end of the bond
		*/
		function Bond(type, atom) {
			this.type = type;
			this.atom = atom;
		}

		/**
		 * Sets a bond type.
		 * @param {String} type - type of bond, e.g. single, double, triple, wedge, or dash
		 */
		Bond.prototype.setType = function (type) {
			this.type = type;
		}

		/**
		 * Gets a bond type.
		 * @returns {String}
		 */
		Bond.prototype.getType = function () {
			return this.type;
		}

		/**
		 * Sets an atom at the end of the bond.
		 * @param {Atom} atom - an atom at the end of the bond
		 */
		Bond.prototype.setAtom = function (atom) {
			this.atom = atom;
		}

		/**
		 * Gets an atom at the end of the bond.
		 * @returns {Atom}
		 */
		Bond.prototype.getAtom = function () {
			return this.atom;
		}

		service.Bond = Bond;

		return service;
	}
})();
