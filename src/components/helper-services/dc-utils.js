(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemUtils", DrawChemUtils);

	DrawChemUtils.$inject = ["DrawChemConst"];

	function DrawChemUtils(Const) {

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

		/**
		 * Compares coordinates in two arrays. Returns false if at least one of them is undefined or if any pair of the coordinates is inequal.
		 * Returns true if they are equal.
		 * @param {Number[]} arr1 - an array of coordinates,
		 * @param {Number[]} arr2 - an array of coordinates,
		 * @param {Number} prec - precision,
		 * @returns {Boolean}
		 */
		service.compareCoords = function(arr1, arr2, prec) {
			if (typeof arr1 === "undefined" || typeof arr2 === "undefined") {
				return false;
			}
			return arr1[0].toFixed(prec) === arr2[0].toFixed(prec) && arr1[1].toFixed(prec) === arr2[1].toFixed(prec);
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

		service.invertGroup = function(str) {
			var i, match = str.match(/[A-Z][a-z\d]*/g), output = "";
			if (match === null) { return str; }
			for (i = match.length - 1; i >= 0; i -= 1) {
				output += match[i];
			}
			return output;
		}

		// this way, the array can be used circularly
		service.moveToLeft = function(array, index, d) {
			if (index - d < 0) {
				return index - d + array.length;
			}
			return index - d;
		}

		// this way, the array can be used circularly
		service.moveToRight = function(array, index, d) {
			if (index + d > array.length - 1) {
				return index + d - array.length;
			}
			return index + d;
		}

		service.calcPossibleBonds = function (vector, freq) {
			var possibleBonds = [], i;
			for (i = 0; i < 360 / freq; i += 1) {
				vector = service.rotVectCW(vector, freq);
				possibleBonds.push(vector);
			}
			return possibleBonds;
		};

		service.getClosestBond = function (down, mousePos, possibleBonds) {
			var vector = [mousePos[0] - down[0], mousePos[1] - down[1]], angle, i, currVector, minAngle = Math.PI, minIndex = 0, structure;
			for (i = 0; i < possibleBonds.length; i += 1) {
				currVector = possibleBonds[i];
				angle = Math.acos(service.dotProduct(service.norm(currVector), service.norm(vector)));
				if (Math.abs(angle) < minAngle) {
					minAngle = Math.abs(angle);
					minIndex = i;
				}
			}
			return possibleBonds[minIndex];
		};

		service.checkAttachedBonds = function (vector, atom, freq) {
			var inBonds = atom.getAttachedBonds("in") || [],
			  outBonds = atom.getAttachedBonds("out") || [];

			return checkVector(vector);

			function checkVector(vector) {
				var done = true;
				checkBonds(inBonds);
				checkBonds(outBonds);

				if (done) { return vector; }

				function checkBonds(bonds) {
					var i;
					for (i = 0; i < bonds.length; i += 1) {
						if (service.compareCoords(bonds[i].vector, vector, 5)) {
							vector = service.rotVectCW(vector, freq);
							done = false;
							checkVector(vector);
						}
					}
				}
			}
		};

		service.dotProduct = function (v1, v2) {
			return v1[0] * v2[0] + v1[1] * v2[1];
		};

		service.norm = function (v) {
			var len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
			return [v[0] / len, v[1] / len];
		};

		// rotates a vector counter clock-wise
		service.rotVectCCW = function (vect, deg) {
			var rads = deg * (Math.PI / 180),
				rotX = vect[0] * Math.cos(rads) + vect[1] * Math.sin(rads),
				rotY = vect[1] * Math.cos(rads) - vect[0] * Math.sin(rads);
			return [rotX, rotY];
		}

		// rotates a vector clock-wise
		service.rotVectCW = function (vect, deg) {
			var rads = deg * (Math.PI / 180),
				rotX = vect[0] * Math.cos(rads) - vect[1] * Math.sin(rads),
				rotY = vect[0] * Math.sin(rads) + vect[1] * Math.cos(rads);
			return [rotX, rotY];
		}

		/**
		 * Checks if a point is inside an area delimited by a circle.
		 * @param {Number[]} center - coordinates of the center of a circle
		 * @param {Number[]} point - coordinates of a point to be validated
		 * @returns {Boolean}
		 */
		service.insideCircle = function (center, point, tolerance) {
			var tolerance = tolerance || Const.CIRC_R;
			return Math.abs(center[0] - point[0]) < tolerance && Math.abs(center[1] - point[1]) < tolerance;
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
