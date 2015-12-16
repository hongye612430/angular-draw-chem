(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCAtom", DCAtom);
	
	function DCAtom() {
		
		var service = {};
		
		/**
		* Creates a new Atom.
		* @class
		* @param {Number[]} - an array with coordinates of the atom
		* @param {Atom[]} - an array of atoms this atom is connected with
		*/
		function Atom(coords, bonds) {
			this.coords = coords;	
			this.bonds = bonds;
		}
		
		/**
		 * Sets coordinates of the atom.
		 * @param {Number[]} coords - an array with coordinates of the atom
		 */
		Atom.prototype.setCoords = function (coords) {
			this.coords = coords;
		};
		
		/**
		 * Gets coordinates of the atom.
		 * @returns {Number[]|Number}
		 */
		Atom.prototype.getCoords = function (coord) {
			if (coord === "x") {
				return this.coords[0];
			} else if (coord === "y") {
				return this.coords[1];
			} else {
				return this.coords;
			}
		};
		
		/**
		 * Gets an array of all atoms this atom is connected with
		 * @returns {Atom[]|Atom}
		 */
		Atom.prototype.getBonds = function (index) {
			if (arguments.length === 0) {
				return this.bonds;
			} else {
				return this.bonds[index];	
			}			
		}
		
		/**
		 * Adds a new atom to the bonds array.
		 * @param {Atom} atom - a new Atom object to be added
		 */
		Atom.prototype.addBond = function (atom) {
			this.bonds.push(atom);
		}
		
		/**
		 * Adds new bonds.
		 * @param {Atom[]} bonds - an array of bonds to be added
		 */
		Atom.prototype.addBonds = function (bonds) {
			bonds.forEach(function (atom) {
				this.bonds.push(atom);
			}, this);
		}
		
		service.Atom = Atom;
		
		return service;
	}
})();