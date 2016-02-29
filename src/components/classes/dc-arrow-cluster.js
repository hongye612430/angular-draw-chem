(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrowCluster", DCArrowCluster);

  DCArrowCluster.$inject = ["DrawChemShapes"];

	function DCArrowCluster(DrawChemShapes) {

		var service = {};

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
			  if(this.defs[i].getDirection() === "E") {
          return this.defs[i];
        }
			}
		}

    ArrowCluster.prototype.getArrow = function (mouseCoords1, mouseCoords2) {
			var i,
				direction = DrawChemShapes.getDirection(mouseCoords1, mouseCoords2);
			for (i = 0; i < this.defs.length; i += 1) {
				if (this.defs[i].getDirection() === direction) {
					return this.defs[i];
				}
			}
		};

		service.ArrowCluster = ArrowCluster;

		return service;
	}
})();
