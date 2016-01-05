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
		function Atom(coords, bonds, info, next) {
			this.coords = coords;	
			this.bonds = bonds;
			this.info = info;
			this.next = next;
		}
		
		/**
		 * Sets coordinates of the atom.
		 * @param {Number[]} coords - an array with coordinates of the atom
		 */
		Atom.prototype.setCoords = function (coords) {
			this.coords = coords;
		};
		
		/**
		 * Gets additional info.
		 * @returns {String}
		 */
		Atom.prototype.getInfo = function () {
			return this.info;
		}
		
		/**
		 * Sets coordinates of a preceding atom.
		 * @param {Number[]} coords - an array with coordinates of the atom
		 */
		Atom.prototype.setPreceding = function (coords) {
			this.preceding = coords;
		};
		
		/**
		 * Gets coordinates of the atom.
		 * @returns {Number[]|Number}
		 */
		Atom.prototype.getPreceding = function (coord) {
			if (coord === "x") {
				return this.preceding[0];
			} else if (coord === "y") {
				return this.preceding[1];
			} else {
				return this.preceding;
			}
		};
		
		/**
		 * Gets symbol of the next bond.
		 * @returns {String}
		 */
		Atom.prototype.getNext = function () {
			return this.next;
		}
		
		/**
		 * Sets symbol of the next bond.
		 * @param {String} - symbol of the next bond
		 */
		Atom.prototype.setNext = function (symbol) {
			this.next = symbol;
		}
		
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