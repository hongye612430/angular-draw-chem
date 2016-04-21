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

		/**
		 * Calculates multiplicity.
		 * @returns {number}
		 */
		Bond.prototype.calcMultiplicity = function () {
			if (checkType(this.type, ["single", "wedge", "dash", "undefined"])) {
				return 1;
			} else if (checkType(this.type, ["double"])) {
				return 2;
			} else if (checkType(this.type, ["triple"])) {
				return 3;
			}

			function checkType (t, types) {
				var found = false;
				types.forEach(function (type) {
					if (t.indexOf(type) >= 0) {
						found = true;
					}
				});
				return found;
			};
		}

		service.Bond = Bond;

		return service;
	}
})();
