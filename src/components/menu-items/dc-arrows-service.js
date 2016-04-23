(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemArrows", DrawChemArrows);

	DrawChemArrows.$inject = ["DrawChemDirectiveFlags", "DrawChemUtils", "DrawChemConst", "DCArrow", "DCArrowCluster"];

	function DrawChemArrows(Flags, Utils, Const, DCArrow, DCArrowCluster) {

		var service = {},
			BONDS = Const.BONDS,
			Arrow = DCArrow.Arrow,
			ArrowCluster = DCArrowCluster.ArrowCluster;

		service.arrows = {
			"one way arrow": {
				action: createArrowAction("one-way-arrow"),
				id: "one-way-arrow",
				thumbnail: true
			},
			"two way arrow": {
				action: createArrowAction("two-way-arrow"),
				id: "two-way-arrow",
				thumbnail: true
			},
			"equilibrium arrow": {
				action: createArrowAction("equilibrium-arrow"),
				id: "equilibrium-arrow",
				thumbnail: true,
				separate: true
			},
			"resize arrow": {
				action: createResizeAction(),
				id: "resize-arrow"
			}
		};

		return service;

		function createResizeAction() {
			return function (scope) {
				Flags.selected = "resizeArrow";
			}
		}

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
			var startVector = Const.BOND_N, result = [], i,
			  possibleVectors = Utils.calcPossibleVectors(startVector, Const.FREQ);

			possibleVectors.push(startVector);

			for (i = 0; i < possibleVectors.length; i += 1) {
				result.push(new Arrow(type, possibleVectors[i]));
			}
			return result;
		}
	}
})();
