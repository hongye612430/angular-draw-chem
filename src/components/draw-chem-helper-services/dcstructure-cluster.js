(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);
	
	function DCStructureCluster() {
		
		var service = {};
		
		/**
		* Creates a new StructureCluster object.
		* @class
		* @param {String} name - name of the cluster
		* @param {Structure[]} defs - array of Structure objects belonging to the cluster
		*/
		function StructureCluster(name, defs) {
			this.name = name;
			this.defs = defs;
			this.defaultStructure = defs[0];
		}
		
		StructureCluster.prototype.getDefs = function () {
			return this.defs;
		};
		
		StructureCluster.prototype.getDefault = function () {
			return this.defaultStructure;
		};
		
		service.StructureCluster = StructureCluster;
		
		return service;
	}
})();