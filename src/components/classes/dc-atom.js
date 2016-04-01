(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCAtom", DCAtom);

	DCAtom.$inject = ["DrawChemConst", "DrawChemUtils"];

	function DCAtom(Const, Utils) {

		var service = {};

		/**
		* Creates a new Atom.
		* @class
		* @param {Number[]} coords - an array with coordinates of the atom
		* @param {Bond[]} - an array of bonds coming out of the atom
		* @param {String[]} - directions of all bonds coming out or coming in
		*/
		function Atom(coords, bonds, attachedBonds) {
			this.coords = coords;
			this.bonds = bonds;
			this.attachedBonds = attachedBonds || {};
			this.next = "";
			this.selected = false;
			this.label;
		}

		Atom.prototype.select = function () {
			this.selected = true;
		};

		Atom.prototype.deselect = function () {
			this.selected = false;
		};

		/**
		 * Calculates direction of an opposite bond.
		 * @param {String} direction - direction of a bond
		 */
		Atom.getOppositeDirection = function (direction) {
			var DIRS = Const.DIRECTIONS,
			  index = DIRS.indexOf(direction),
			  movedIndex = Utils.moveToRight(DIRS, index, DIRS.length / 2);
			return DIRS[movedIndex];
		};

		/**
		 * Adds a bond to the attachedBonds array.
		 * @param {String} bond - direction of a bond
		 */
		Atom.prototype.attachBond = function (type, bond) {
			if (typeof this.attachedBonds[type] === "undefined") {
				this.attachedBonds[type] = [];
			}
			this.attachedBonds[type].push(bond);
		};

		/**
		 * Sets coordinates of the atom.
		 * @param {Number[]} coords - an array with coordinates of the atom
		 */
		Atom.prototype.setCoords = function (coords) {
			this.coords = coords;
		};

		/**
		 * Gets attached bonds.
		 * @returns {String[]}
		 */
		Atom.prototype.getAttachedBonds = function (type) {
			if (typeof type === "undefined") {
				return this.attachedBonds;
			}
			return this.attachedBonds[type];
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
		 * Sets Label object.
		 * @param {Label} label - a Label object
		 */
		Atom.prototype.setLabel = function (label) {
			this.label = label;
		}

		/**
		 * Gets Label object.
		 * @returns {Label}
		 */
		Atom.prototype.getLabel = function () {
			return this.label;
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
		 * @returns {Bond[]|Bond}
		 */
		Atom.prototype.getBonds = function (index) {
			if (arguments.length === 0) {
				return this.bonds;
			} else {
				return this.bonds[index];
			}
		}

		/**
		 * Sets an array of bonds
		 * @param {Bond[]} bonds - array of Bond objects
		 */
		Atom.prototype.setBonds = function (bonds) {
			this.bonds = bonds;
		}

		/**
		 * Adds a new atom to the bonds array.
		 * @param {Atom} atom - a new Atom object to be added
		 */
		Atom.prototype.addBond = function (bond) {
			this.bonds.push(bond);
		}

		/**
		 * Adds new bonds.
		 * @param {Bond[]} bonds - an array of bonds to be added
		 */
		Atom.prototype.addBonds = function (bonds) {
			bonds.forEach(function (bond) {
				this.bonds.push(bond);
			}, this);
		}

		service.Atom = Atom;

		return service;
	}
})();
