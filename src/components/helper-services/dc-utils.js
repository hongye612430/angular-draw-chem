(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemUtils", DrawChemUtils);

	DrawChemUtils.$inject = [];

	function DrawChemUtils() {

		var service = {};

    service.addCoords = function(coords1, coords2, factor) {
			return typeof factor === "undefined" ?
				[(coords1[0] + coords2[0]).toFixed(2), (coords1[1] + coords2[1]).toFixed(2)]:
				[(coords1[0] + factor * coords2[0]).toFixed(2), (coords1[1] + factor * coords2[1]).toFixed(2)];
		}

		service.addCoordsNoPrec = function(coords1, coords2, factor) {
			return typeof factor === "undefined" ?
				[coords1[0] + coords2[0], coords1[1] + coords2[1]]:
				[coords1[0] + factor * coords2[0], coords1[1] + factor * coords2[1]];
		}

		service.isNumeric = function(obj) {
			return obj - parseFloat(obj) >= 0;
		}

		service.isSmallLetter = function(obj) {
			return obj >= "a" && obj <= "z";
		}

		service.compareFloats = function(float1, float2, prec) {
			return float1.toFixed(prec) === float2.toFixed(prec);
		}

		service.invertLabel = function(str) {
			var i, match = str.match(/[A-Z][a-z\d]*/g), output = "";
			if (match === null) { return str; }
			for (i = match.length - 1; i >= 0; i -= 1) {
				output += match[i];
			}
			return output;
		}

		/**
		 * Subtracts the coords in the second array from the first array.
		 * @param {Number[]} arr1 - first array
		 * @param {Number[]} arr2 - second array
		 * @returns {Number[]}
		 */
		service.subtractCoords = function (arr1, arr2) {
			return [arr1[0] - arr2[0], arr1[1] - arr2[1]];
		}

		return service;
	}
})();
