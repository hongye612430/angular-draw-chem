(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCAtom", DCAtom);

	DCAtom.$inject = ["DrawChemConst", "DrawChemUtils"];

	function DCAtom(Const, Utils) {

		var service = {};

		/**
		* Creates a new `Atom` object.
		* @class
		* @param {number[]} coords - an array with coordinates of the atom,
		* @param {Bond[]} bonds - an array of bonds coming out of the atom,
		* @param {Object} attachedBonds - directions of all bonds coming out or coming in as object: { in: [{ vector: `number[]`, multiplicity: `number` }], out: [same] }
		*/
		function Atom(coords, bonds, attachedBonds) {
			this.coords = coords;
			this.bonds = bonds;
			this.attachedBonds = attachedBonds || {};
			this.label;
		}

		/**
		* Checks if this `Atom` object is marked as selected.
		* @returns {boolean}
		*/
		Atom.prototype.isSelected = function () {
			return !!this.selected;
		};

		/**
		* Marks `Atom` object as selected.
		*/
		Atom.prototype.select = function () {
			this.selected = true;
		};

		/**
		* Marks `Atom` object as orphan.
		*/
		Atom.prototype.setAsOrphan = function () {
			this.orphan = true;
		};

		/**
		* Checks if this `Atom` object is marked as orphan.
		*/
		Atom.prototype.isOrphan = function () {
			return !!this.orphan;
		};

		/**
		* Unmarks selection.
		*/
		Atom.prototype.deselect = function () {
			this.selected = false;
		};

		/**
		 * Calculates direction of an opposite bond.
		 * @param {string} direction - direction of the bond
		 * @returns {string}
		 */
		Atom.getOppositeDirection = function (direction) {
			var DIRS = Const.DIRECTIONS,
			  index = DIRS.indexOf(direction),
			  movedIndex = Utils.moveToRight(DIRS, index, DIRS.length / 2);
			return DIRS[movedIndex];
		};

		/**
		 * Adds a bond to the attachedBonds array.
		 * @param {string} type - type of the bond, i.e. 'in' or 'out',
		 * @param {object} bond - bond defined as { vector: `number[]`, multiplicity: `number` }
		 */
		Atom.prototype.attachBond = function (type, bond) {
			if (typeof this.attachedBonds[type] === "undefined") {
				// initiates array if it does not exist
				this.attachedBonds[type] = [];
			}
			this.attachedBonds[type].push(bond);
		};

		/**
		 * Sets coordinates of the atom.
		 * @param {number[]} coords - an array with coordinates of the atom
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
		 * Gets all attached bonds.
		 * @param {string} type - type of the bond, 'in' or 'out'
		 * @returns {object|object[]} - returns an object if `type` is not supplied, an array of objects if `type` is supplied
		 */
		Atom.prototype.getAttachedBonds = function (type) {
			if (typeof type === "undefined") {
				// returns an object holding both 'in' and 'out' properties
				return this.attachedBonds;
			}
			return this.attachedBonds[type];
		};

		/**
		 * Sets `Label` object.
		 * @param {Label} label - a `Label` object
		 */
		Atom.prototype.setLabel = function (label) {
			this.label = label;
		};

		/**
		 * Gets` Label` object.
		 * @returns {Label}
		 */
		Atom.prototype.getLabel = function () {
			return this.label;
		};

		/**
		 * Gets an array of all `Bonds` objects coming out of this `Atom` object.
		 * @param {number} index - an index of desired `Bond` object
		 * @returns {Bond[]|Bond} - returns an array of `Bonds` if index is not supplied, a `Bond` object at specifed index otherwise
		 */
		Atom.prototype.getBonds = function (index) {
			if (typeof index === "undefined") {
				return this.bonds;
			} else {
				return this.bonds[index];
			}
		};

		/**
		 * Sets an array of `Bond' objects coming out of this `Atom` object.
		 * @param {Bond[]} bonds - array of `Bond` objects
		 */
		Atom.prototype.setBonds = function (bonds) {
			this.bonds = bonds;
		};

		/**
		 * Adds a new `Bond` object to the array.
		 * @param {Bond} bond - a new `Bond` object to be added to this `Atom` object
		 */
		Atom.prototype.addBond = function (bond) {
			this.bonds.push(bond);
		};

		/**
		 * Adds new `Bond` objects to the array.
		 * @param {Bond[]} bonds - an array of `Bond` objects to be added
		 */
		Atom.prototype.addBonds = function (bonds) {
			bonds.forEach(function (bond) {
				this.bonds.push(bond);
			}, this);
		};

		service.Atom = Atom;

		return service;
	}
})();
