(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);

	DCStructureCluster.$inject = ["DrawChemShapes"];

	function DCStructureCluster(DrawChemShapes) {

		var service = {};

		/**
		* Creates a new StructureCluster object.
		* @class
		* @param {String} name - name of the cluster
		* @param {Structure[]} defs - array of Structure objects belonging to the cluster
		*/
		function StructureCluster(name, defs, multiplicity) {
			this.name = name;
			this.defs = defs;
			this.multiplicity = multiplicity;
			this.defaultStructure = defs[0];
		}

		StructureCluster.prototype.getDefs = function () {
			return this.defs;
		};

		StructureCluster.prototype.getBondsMultiplicity = function () {
			return this.multiplicty;
		};

		StructureCluster.prototype.getDefault = function () {
			return this.defaultStructure;
		};

		StructureCluster.prototype.getStructure = function (mouseCoords1, mouseCoords2) {
			var i,
				direction = DrawChemShapes.getDirection(mouseCoords1, mouseCoords2);
			for (i = 0; i < this.defs.length; i += 1) {
				if (this.defs[i].getName() === direction) {
					return this.defs[i];
				}
			}
		};

		service.StructureCluster = StructureCluster;

		return service;
	}
})();
