(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemUtils", DrawChemUtils);

	function DrawChemUtils() {

		var service = {};

		/**
		* Calculates which quadrant two sets of coordinates create.
		* @param {number[]} origin - first set of coords ('beginning' of the coords system),
		* @param {number[]} end - second set of coords,
		* @returns {number}
		*/
		service.getQuadrant = function (origin, end) {
			var x = end[0] - origin[0], y = end[1] - origin[1];
			if (x > 0 && y < 0) {
				return 1;
			} else if (x < 0 && y < 0) {
				return 2;
			} else if (x < 0 && y > 0) {
				return 3;
			} else {
				return 4;
			}
		};

		/**
		* Adds two vectors. Optionally multiplies the second vector by a factor. Returns a new array.
		* @param {number[]} v1 - first vector,
		* @param {number[]} v2 - second vector,
		* @param {number} factor - multiplies second vector by a factor (optional),
		* @returns {number[]}
		*/
		service.addVectors = function(v1, v2, factor) {
			return typeof factor === "undefined" ?
				[v1[0] + v2[0], v1[1] + v2[1]]:
				[v1[0] + factor * v2[0], v1[1] + factor * v2[1]];
		};

		/**
		* Multiplies a vector by a scalar.
		* @param {number[]} v - vector,
		* @param {number} scalar - scalar,
		* @returns {number[]}
		*/
		service.multVectByScalar = function (v, scalar) {
			return [v[0] * scalar, v[1] * scalar];
		};

		/**
		 * Compares two vectors. Returns false if at least one of them is undefined or if any pair of the coordinates is not equal.
		 * Returns true if they are equal.
		 * @param {number[]} v1 - first vector,
		 * @param {number[]} v2 - second vector,
		 * @param {number} prec - precision,
		 * @returns {boolean}
		 */
		service.compareVectors = function(v1, v2, prec) {
			if (typeof v1 === "undefined" || typeof v2 === "undefined") {
				return false;
			}
			return v1[0].toFixed(prec) === v2[0].toFixed(prec) && v1[1].toFixed(prec) === v2[1].toFixed(prec);
		};

		/**
		* Checks if value is numeric.
		* @param {*} obj - a value to check
		* @returns {boolean}
		*/
		service.isNumeric = function(obj) {
			return obj - parseFloat(obj) >= 0;
		};

		/**
		* Checks if string is a small letter.
		* @param {string} str - a value to check
		* @returns {boolean}
		*/
		service.isSmallLetter = function(str) {
			if (str.length > 1) {
				return false;
			}
			return str >= "a" && str <= "z";
		};

		/**
		* Compares two floats to n decimal places, where n is indicated by `prec` parameter.
		* @param {number} prec - precision (number of decimal places)
		* @returns {boolean}
		*/
		service.compareFloats = function(float1, float2, prec) {
			return float1.toFixed(prec) === float2.toFixed(prec);
		};

		/**
		* Inverts a chemical group, e.g. makes 'BnO' from 'OBn' or 'NCS' from 'SCN'.
		* @param {string} - a group to invert
		* @returns {string}
		*/
		service.invertGroup = function(str) {
			var i, match, output = "";
			if (typeof str === "undefined") {
				match = "";
			} else {
				match = str.match(/[A-Z][a-z\d]*/g);
			}
			if (match === null) { return str; }
			for (i = match.length - 1; i >= 0; i -= 1) {
				output += match[i];
			}
			return output;
		};

		/**
		* Moves index of an array to the beginning by n, where n is defined by parameter `d`.
		* Jumps to the end if negative index would be returned. This way, the array can be used circularly.
		* @param {Array} array - an array,
		* @param {number} index - a starting index,
		* @param {number} d - how far the index should be moved,
		* @returns {number}
		*/
		service.moveToLeft = function(array, index, d) {
			if (index - d < 0) {
				return index - d + array.length;
			}
			return index - d;
		};

		/**
		* Moves index of an array to the end by n, where n is defined by parameter `d`.
		* Jumps to the beginning if an index would be returned that exceeds length of the array - 1.
		* This way, the array can be used circularly.
		* @param {Array} array - an array,
		* @param {number} index - a starting index,
		* @param {number} d - how far the index should be moved,
		* @returns {number}
		*/
		service.moveToRight = function(array, index, d) {
			if (index + d > array.length - 1) {
				return index + d - array.length;
			}
			return index + d;
		};

		/**
		* Calculates all possible bonds (vectors) by starting from a supplied `vector` and rotating it by an angle defined as `freq` parameter.
		* @param {number[]} vector - starting vector,
		* @param {number} freq - angle in degrees,
		* @returns {Array}
		*/
		service.calcPossibleVectors = function (vector, freq) {
			var possibleVectors = [], i;
			for (i = 0; i < 360 / freq; i += 1) {
				vector = service.rotVectCW(vector, freq);
				possibleVectors.push(vector);
			}
			return possibleVectors;
		};

		/**
		* Calculates the closest bond (vector) in `possibleVectors` array to vector starting at `down` coords and ending at `mousePos` coords.
		* @param {number[]} down - first set of coordinates,
		* @param {number[]} mousePos - second set of coordinates,
		* @param {Array} possibleVectors - an array of bonds (vectors),
		* @returns {number[]}
		*/
		service.getClosestVector = function (down, mousePos, possibleVectors) {
			var vector = [mousePos[0] - down[0], mousePos[1] - down[1]], angle, i, currVector, minAngle = Math.PI, minIndex = 0, structure;
			for (i = 0; i < possibleVectors.length; i += 1) {
				currVector = possibleVectors[i];
				angle = Math.acos(service.dotProduct(service.norm(currVector), service.norm(vector)));
				if (Math.abs(angle) < minAngle) {
					minAngle = Math.abs(angle);
					minIndex = i;
				}
			}
			return possibleVectors[minIndex];
		};

		/**
		* Checks if a bond (vector) exists in an `attachedBonds` array in an `Atom` object.
		* If so, this bond is rotated by an angle and the check is repeated, until free space is found.
		* If `attachedBonds` array already contains max number of bonds, 'full atom' flag is returned.
		* @param {number[]} vector - vector to check,
		* @param {Atom} atom - atom object,
		* @param {number} freq - angle,
		* @param {number} maxBonds - max number of bonds (vectors) permitted,
		* @returns {number|string}
		*/
		service.checkAttachedBonds = function (vector, atom, freq, maxBonds) {
			var inBonds = atom.getAttachedBonds("in") || [],
			  outBonds = atom.getAttachedBonds("out") || [];

			if (inBonds.length + outBonds.length >= maxBonds) {
				// if already max bonds
				return "full atom";
			}

			checkVector(vector);

			return vector;

			/**
			* Recursively checks if this vector already exists.
			* @param {number[]} vect - vector to check
			*/
			function checkVector(vect) {
				checkBonds(inBonds, "in");
				checkBonds(outBonds, "out");

				/**
				* Recursively checks if this vector already exists.
				* @param {object[]} bonds - vectors to check
				* @param {string} type - type of bonds, either 'in' or 'out'
				*/
				function checkBonds(bonds, type) {
					var i, currentVect;
					for (i = 0; i < bonds.length; i += 1) {
						// if the vector to compare is incoming, it has to be rotated by 180 degs
						currentVect = type === "in" ? service.rotVectCW(bonds[i].vector, 180): bonds[i].vector;
						if (service.compareVectors(currentVect, vect, 5)) {
							// if compared vectors are equals, the starting vectors has to be rotated by `freq`
							// and check has to be repeated (on both arrays, 'in' and 'out')
							vector = service.rotVectCW(vect, freq);
							checkVector(vector);
						}
					}
				}
			}
		};

		/**
		* Calculates dot product of two vectors.
		* @param {number[]} v1 - first vector,
		* @param {number[]} v2 - second vector,
		* @returns {number[]}
		*/
		service.dotProduct = function (v1, v2) {
			return v1[0] * v2[0] + v1[1] * v2[1];
		};

		/**
		* Normalizes a vector.
		* @param {number[]} v - vector to normalize,
		* @returns {number[]}
		*/
		service.norm = function (v) {
			var len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
			return [v[0] / len, v[1] / len];
		};

		/**
		* Rotates a vector counter clock-wise (with y axis pointing down and x axis pointing right).
		* @param {number[]} vect - vector to rotate,
		* @param {number} deg - an angle in degrees,
		* @returns {number[]}
		*/
		service.rotVectCCW = function (vect, deg) {
			var rads = deg * (Math.PI / 180),
				rotX = vect[0] * Math.cos(rads) + vect[1] * Math.sin(rads),
				rotY = vect[1] * Math.cos(rads) - vect[0] * Math.sin(rads);
			return [rotX, rotY];
		};

		/**
		* Rotates a vector clock-wise (with y axis pointing down and x axis pointing right).
		* @param {number[]} vect - vector to rotate,
		* @param {number} deg - an angle in degrees,
		* @returns {number[]}
		*/
		service.rotVectCW = function (vect, deg) {
			var rads = deg * (Math.PI / 180),
				rotX = vect[0] * Math.cos(rads) - vect[1] * Math.sin(rads),
				rotY = vect[0] * Math.sin(rads) + vect[1] * Math.cos(rads);
			return [rotX, rotY];
		};

		/**
		 * Checks if a point is inside an area delimited by a circle.
		 * @param {number[]} center - coordinates of the center of a circle,
		 * @param {number[]} point - coordinates of a point to be validated,
		 * @param {number} r - r of the circle,
		 * @returns {boolean}
		 */
		service.insideCircle = function (center, point, r) {
			var dist = Math.sqrt(Math.pow(point[0] - center[0], 2) + Math.pow(point[1] - center[1], 2));
			return dist <= r;
		};

		service.insideFocus = function (startAbsPos, bond, mousePos, tolerance) {
			var endAtom = bond.getAtom(),
			  endAbsPos = Utils.addVectors(startAbsPos, endAtom.getCoords());

		};

		/**
		 * Subtracts second vector from first vectors.
		 * @param {number[]} v1 - first vector,
		 * @param {number[]} v2 - second vector
		 * @returns {Number[]}
		 */
		service.subtractVectors = function (v1, v2) {
			return [v1[0] - v2[0], v1[1] - v2[1]];
		};

		return service;
	}
})();
