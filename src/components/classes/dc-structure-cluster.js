(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);

	DCStructureCluster.$inject = [];

	function DCStructureCluster() {

		var service = {};

		/**
		* Creates a new StructureCluster object.
		* @class
		* @param {String} name - name of the cluster
		* @param {Structure[]} defs - array of Structure objects belonging to the cluster
		*/
		function StructureCluster(name, defs, multiplicity, ringSize, angle) {
			this.name = name;
			this.defs = defs;
			this.ringSize = ringSize || 0;
			this.angle = angle;
			this.multiplicity = multiplicity;
			this.defaultStructure = defs[0];
		}

		StructureCluster.prototype.getDefs = function () {
			return this.defs;
		};

		StructureCluster.prototype.getName = function () {
			return this.name;
		};

		StructureCluster.prototype.getMult = function () {
			return this.multiplicity;
		};

		StructureCluster.prototype.getRingSize = function () {
			return this.ringSize;
		};

		StructureCluster.prototype.getAngle = function () {
			return this.angle;
		};

		StructureCluster.prototype.getDefault = function () {
			return this.defaultStructure;
		};

		service.StructureCluster = StructureCluster;

		return service;
	}
})();
