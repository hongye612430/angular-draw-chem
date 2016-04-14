(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrowCluster", DCArrowCluster);

  DCArrowCluster.$inject = ["DrawChemUtils", "DrawChemConst", "DCArrow"];

	function DCArrowCluster(Utils, Const, DCArrow) {

		var service = {},
		  Arrow = DCArrow.Arrow;

		/**
		* Creates a new `ArrowCluster` object.
		* @class
		* @param {string} name - name of the cluster,
		* @param {Arrow[]} defs - array of `Arrow` objects
		*/
		function ArrowCluster(name, defs) {
			this.name = name;
			this.defs = defs;
			this.defaultStructure = this.getDefault();
		}

		/**
		* Gets default `Arrow` object.
		* @returns {Arrow}
		*/
		ArrowCluster.prototype.getDefault = function () {
      var i;
			for (i = 0; i < this.defs.length; i += 1) {
			  if(Utils.compareVectors(this.defs[i].getRelativeEnd(), Const.BOND_E, 5)) {
          return this.defs[i];
        }
			}
		};

		/**
		* Gets a suitable `Arrow` based on supplied coordinates.
		* @param {number[]} mouseCoords1 - coordinates associated with onMouseDown event,
		* @param {number[]} mouseCoords2 - coordinates associated with onMouseUp event,
		* @returns {Arrow}
		*/
    ArrowCluster.prototype.getArrow = function (mouseCoords1, mouseCoords2) {
			var possibleVectors = [], vector, i;

			if (Utils.insideCircle(mouseCoords1, mouseCoords2, Const.CIRC_R)) {
				return this.defaultStructure;
			}

			for (i = 0; i < this.defs.length; i += 1) {
				possibleVectors.push(this.defs[i].getRelativeEnd());
			}
			vector = Utils.getClosestVector(mouseCoords1, mouseCoords2, possibleVectors);
			return new Arrow(this.name, vector);
		};

		service.ArrowCluster = ArrowCluster;

		return service;
	}
})();
