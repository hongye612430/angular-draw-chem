(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCLabel", DCLabel);
	
	function DCLabel() {
		
		var service = {};
		
		/**
		* Creates a new Label.
		* @class
		* @param {String} label - a symbol of the atom
		* @param {Number} bonds - a maximum number of bonds this atom should be connected with
		*/
		function Label(label, bonds, mode) {
			this.labelName = label;			
			this.bonds = bonds;
			this.mode = mode;
		}
		
		/**
		 * Gets label name.
		 * @returns {String}
		 */
		Label.prototype.getLabelName = function () {
			return this.labelName;
		};
		
		/**
		 * Sets label name.
		 * @param {String} labelName - name of the label
		 */
		Label.prototype.setLabelName = function (labelName) {
			this.labelName = labelName;
		};
		
		
		/**
		 * Get maximum number of bonds related to this label. E.g. label 'O', oxygen, has maximum two bonds.
		 * @returns {Number}
		 */
		Label.prototype.getMaxBonds = function () {
			return this.bonds;
		};
		
		/**
		 * Sets maximum number of bonds.
		 * @param {Number} bonds - maximum number of bonds
		 */
		Label.prototype.setMaxBonds = function (bonds) {
			this.bonds = bonds;
		};
		
		/**
		 * Gets mode of the label, i.e. 'rl' for 'right to left', 'lr' for 'left to right'. Useful for anchoring of the text tag.
		 * @returns {String}
		 */
		Label.prototype.getMode = function () {
			return this.mode;
		};
		
		/**
		 * Sets mode of the label.
		 * @param (String) mode - mode to set
		 */
		Label.prototype.setMode = function (mode) {
			this.mode = mode;
		};
		
		service.Label = Label;
		
		return service;
	}
})();