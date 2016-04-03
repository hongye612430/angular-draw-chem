(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrowCluster", DCArrowCluster);

  DCArrowCluster.$inject = ["DrawChemUtils", "DrawChemConst", "DCArrow"];

	function DCArrowCluster(Utils, Const, DCArrow) {

		var service = {},
		  Arrow = DCArrow.Arrow;

		/**
		* Creates a new ArrowCluster.
		* @class
		*/
		function ArrowCluster(name, defs) {
			this.name = name;
			this.defs = defs;
		}

		ArrowCluster.prototype.getDefault = function () {
      var i;
			for (i = 0; i < this.defs.length; i += 1) {
			  if(Utils.compareVectors(this.defs[i].getRelativeEnd(), Const.BOND_E, 5)) {
          return this.defs[i];
        }
			}
		}

    ArrowCluster.prototype.getArrow = function (mouseCoords1, mouseCoords2) {
			var possibleVectors = [], vector, i;
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
