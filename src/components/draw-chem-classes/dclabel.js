(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCLabel", DCLabel);
		
	DCLabel.$inject = [];
	
	function DCLabel() {
		
		var service = {};
		
		/**
		* Creates a new Label.
		* @class
		* @param {String} label - a symbol of the atom
		* @param {Number} bonds - a maximum number of bonds this atom should be connected with
		*/
		function Label(label, bonds) {
			this.label = label;	
			this.bonds = bonds;
		}
		
		Label.prototype.getLabel = function () {
			return this.label;
		};
		
		Label.prototype.setLabel = function (label) {
			this.label = label;
		};
		
		Label.prototype.getMaxBonds = function () {
			return this.bonds;
		};
		
		Label.prototype.setMaxBonds = function (bonds) {
			this.bonds = bonds;
		};
		
		service.Label = Label;
		
		return service;
	}
})();