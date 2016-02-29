(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemArrows", DrawChemArrows);

	DrawChemArrows.$inject = ["DrawChemDirectiveFlags", "DrawChemConst", "DCArrow", "DCArrowCluster"];

	function DrawChemArrows(Flags, Const, DCArrow, DCArrowCluster) {

		var service = {},
			BONDS = Const.BONDS,
			Arrow = DCArrow.Arrow,
			ArrowCluster = DCArrowCluster.ArrowCluster;

		service.arrows = {
			"one-way-arrow": {
				action: createArrowAction("one-way-arrow"),
				thumbnail: true
			},
			"two-way-arrow": {
				action: createArrowAction("two-way-arrow"),
				thumbnail: true
			},
			"equilibrium-arrow": {
				action: createArrowAction("equilibrium-arrow"),
				thumbnail: true
			}
		};

		return service;

		function createArrowAction(name) {
			return function (scope) {
				scope.chosenArrow = generateCluster();
				Flags.selected = "arrow";
			}

			function generateCluster() {
				var defs = generateArrows(name),
					cluster = new ArrowCluster(name, defs);
				return cluster;
			}
		}

		function generateArrows(type) {
			var i, direction, bond, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				direction = BONDS[i].direction;
				bond = BONDS[i].bond;
				result.push(new Arrow(type, direction, bond));
			}
			return result;
		}
	}
})();
