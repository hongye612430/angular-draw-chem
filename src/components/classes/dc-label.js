(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCLabel", DCLabel);

	function DCLabel() {

		var service = {};

		/**
		* Creates a new `Label` object.
		* @class
		* @param {string} label - name of the group/atom symbol
		* @param {number} bonds - maximum number of bonds associated `Atom` object can be connected with
		* @param {string} mode - how the label should be anchored, i.e. left to right ('lr'), right to left ('rl'), etc.
		*/
		function Label(label, bonds, mode) {
			this.labelName = label;
			this.bonds = bonds;
			this.mode = mode;
		}

		/**
		 * Gets name of the group/atom symbol.
		 * @returns {string}
		 */
		Label.prototype.getLabelName = function () {
			return this.labelName;
		};

		/**
		 * Sets name of the group/atom symbol.
		 * @param {string} labelName - name of the group/atom symbol
		 */
		Label.prototype.setLabelName = function (labelName) {
			this.labelName = labelName;
		};

		/**
		 * Gets maximum number of bonds associated with `Atom` object (e.g. label 'O', oxygen, has maximum two bonds).
		 * @returns {number}
		 */
		Label.prototype.getMaxBonds = function () {
			return this.bonds;
		};

		/**
		 * Sets maximum number of bonds.
		 * @param {number} bonds - maximum number of bonds
		 */
		Label.prototype.setMaxBonds = function (bonds) {
			this.bonds = bonds;
		};

		/**
		 * Gets mode of the label, i.e. 'rl' for 'right to left', 'lr' for 'left to right'.
		 * Useful for anchoring of the text tag.
		 * @returns {string}
		 */
		Label.prototype.getMode = function () {
			return this.mode;
		};

		/**
		 * Sets mode of the label.
		 * @param (string) mode - mode to set
		 */
		Label.prototype.setMode = function (mode) {
			this.mode = mode;
		};

		service.Label = Label;

		return service;
	}
})();
