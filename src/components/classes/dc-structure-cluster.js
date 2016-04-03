(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);

	DCStructureCluster.$inject = ["DrawChemUtils", "DrawChemConst"];

	function DCStructureCluster(Utils, Const) {

		var service = {};

		/**
		* Creates a new StructureCluster object.
		* @class
		* @param {String} name - name of the cluster
		* @param {Structure[]} defs - array of Structure objects belonging to the cluster
		*/
		function StructureCluster(name, defs, ringSize, angle) {
			this.name = name;
			this.defs = defs;
			this.ringSize = ringSize || 0;
			this.angle = angle;
			this.defaultStructure = defs[0];
		}

		StructureCluster.prototype.getDefs = function () {
			return this.defs;
		};

		StructureCluster.prototype.getName = function () {
			return this.name;
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

		StructureCluster.prototype.getStructure = function (mouseCoords1, mouseCoords2) {
			var i, possibleVectors = [], vector, bond;
			for (i = 0; i < Const.BONDS.length; i += 1) {
				possibleVectors.push(Const.BONDS[i].bond);
			}
			vector = Utils.getClosestVector(mouseCoords1, mouseCoords2, possibleVectors);
			for (i = 0; i < this.defs.length; i += 1) {
				bond = Const.getBondByDirection(this.defs[i].getName()).bond;
				if (Utils.compareVectors(bond, vector, 5)) {
					return this.defs[i];
				}
			}
		};

		service.StructureCluster = StructureCluster;

		return service;
	}
})();
