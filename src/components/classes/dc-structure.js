(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructure", DCStructure);

	DCStructure.$inject = ["DCArrow", "DCAtom", "DrawChemUtils"];

	function DCStructure(DCArrow, DCAtom, Utils) {

		var service = {},
			Arrow = DCArrow.Arrow,
			Atom = DCAtom.Atom;

		/**
		* Creates a new Structure.
		* @class
		* @param {String} name - name of the structure
		* @param {Atom[]} structure - an array of atoms
		* @param {Object} decorate - an object with all decorate elements
		*/
		function Structure(name, structure, decorate) {
			this.name = name || "";
			this.structure = structure || [];
			this.transform = [];
			this.origin = [];
			this.selectedAll = false;
			this.decorate = decorate || {};
			this.aromatic = false;
		}

		Structure.prototype.setAromatic = function () {
			this.aromatic = true;
		}

		Structure.prototype.getAromatic = function () {
			return this.aromatic;
		}

		/**
		* Sets all structures in structure array as selected.
		*/
		Structure.prototype.selectAll = function () {
			var i;
			this.selectedAll = true;
			for (i = 0; i < this.structure.length; i += 1) {
				this.structure[i].select();
			}
		};

		/**
		* Deselcts all structures in structure array.
		*/
		Structure.prototype.deselectAll = function () {
			var i;
			this.selectedAll = false;
			for (i = 0; i < this.structure.length; i += 1) {
				this.structure[i].deselect();
			}
		};

		/**
		* Aligns all structures marked as selected to the uppermost point.
		* @param {Number} minY - uppermost point
		*/
		Structure.prototype.alignUp = function (minY) {
			return changeAlignment.call(this, "up", minY);
		};

		/**
		* Aligns all structures marked as selected to the lowermost point.
		* @param {Number} maxY - lowermost point
		*/
		Structure.prototype.alignDown = function (maxY) {
			return changeAlignment.call(this, "down", maxY);
		};

		/**
		* Aligns all structures marked as selected to the rightmost point.
		* @param {Number} maxX - uppermost point
		*/
		Structure.prototype.alignRight = function (maxX) {
			return changeAlignment.call(this, "right", maxX);
		};

		/**
		* Aligns all structures marked as selected to the leftmost point.
		* @param {Number} minX - leftmost point
		*/
		Structure.prototype.alignLeft = function (minX) {
			return changeAlignment.call(this, "left", minX);
		};

		/**
		 * Sets coordinates of the first atom.
		 * @param {Number[]} origin - an array with coordinates
		 */
		Structure.prototype.setOrigin = function (origin) {
			this.origin = origin;
		}

		/**
		 * Gets the coordinates of the first atom.
		 * @returns {Number[]}
		 */
		Structure.prototype.getOrigin = function (coord) {
			if (coord === "x") {
				return this.origin[0];
			} else if (coord === "y") {
				return this.origin[1];
			} else {
				return this.origin;
			}
		}

		/**
		 * Sets the structure array.
		 * @param {Atom[]} content - an array of atoms and their connections
		 */
		Structure.prototype.setStructure = function (structure) {
			this.structure = structure;
		}

		/**
		 * Adds a tree of atoms to the structure array.
		 * @param {Atom} content - an array of atoms and their connections
		 */
		Structure.prototype.addToStructures = function (str) {
			this.structure.push(str);
		}

		/**
		 * Gets the structure array.
		 * @returns {Atom[]|Atom}
		 */
		Structure.prototype.getStructure = function (index) {
			if (arguments.length === 0) {
				return this.structure;
			} else {
				return this.structure[index];
			}
		}

		/**
		 * Gets the name of the structure.
		 * @returns {String}
		 */
		Structure.prototype.getName = function () {
			return this.name;
		}

		/**
		 * Gets a decorate element.
		 * @returns {Object}
		 */
		Structure.prototype.getDecorate = function (decorate) {
			return this.decorate[decorate];
		}

		/**
		 * Calculates all extreme coordinates in structures markes as selected.
		 * @returns {Object}
		 */
		Structure.prototype.findMinMax = function () {
			var minMax = {}, i, struct, currOrig,	absPos, absPosStart, absPosEnd;
			for (i = 0; i < this.structure.length; i += 1) {
				struct = this.structure[i];
				if (!struct.selected) { continue; }
				if (struct instanceof Atom) {
					currOrig = struct.getCoords();
					absPos = Utils.addCoordsNoPrec(this.origin, currOrig);
					checkStructure(absPos, struct);
				} else if (struct instanceof Arrow) {
					absPosStart = Utils.addCoordsNoPrec(this.origin, struct.getOrigin());
					absPosEnd = Utils.addCoordsNoPrec(this.origin, struct.getEnd());
					checkArrow(absPosStart);
					checkArrow(absPosEnd);
				}
			}
			return minMax;

			function checkStructure(absPos, struct) {
				var i, currAbsPos, at;
				updateMinY(absPos, minMax);
				updateMinX(absPos, minMax);
				updateMaxY(absPos, minMax);
				updateMaxX(absPos, minMax);
				for (i = 0; i < struct.getBonds().length; i += 1) {
					at = struct.getBonds(i).getAtom();
					currAbsPos = Utils.addCoordsNoPrec(absPos, at.getCoords());
					checkStructure(currAbsPos, at);
				}
			}

			function checkArrow(absPos) {
				updateMinY(absPos, minMax);
				updateMinX(absPos, minMax);
				updateMaxY(absPos, minMax);
				updateMaxX(absPos, minMax);
			}
		}

		/**
		 * Adds a decorate element.
		 * @param {String} decorate - an element to add to the decorate object
		 */
		Structure.prototype.addDecorate = function (decorate, obj) {
			if (typeof this.decorate[decorate] === "undefined") {
				this.decorate[decorate] = [];
			}
			this.decorate[decorate].push(obj);
		}

		service.Structure = Structure;

		return service;

		/**
		* Iterates over structure array and changes alignment of each selected structure.
		* @param {String} alignment - associated with alignment direction ("up", "down", "left", "right")
		* @param {Number} coord - the most extreme coordinate (e.g. uppermost, rightmost, etc.)
		*/
		function changeAlignment(alignment, coord) {
			var i, changed = false;
			for (i = 0; i < this.structure.length; i += 1) {
				var struct = this.structure[i];
				if (!struct.selected) { continue; }
				changed = true;
				if (struct instanceof Arrow) {
					setArrow.call(this, struct, alignment, coord);
				} else if (struct instanceof Atom) {
					setAtom.call(this, struct, alignment, coord);
				}
			}
			return changed;
		}

		/**
		* Compares absolute position and minY coord. If absPos[1] is lower than minY, it replaces minY.
		* @param {Number[]} absPos - array of coords
		* @param {Object} minMax - object containing minY coord
		*/
		function updateMinY(absPos, minMax) {
			if (typeof minMax.minY === "undefined" || absPos[1] < minMax.minY) {
				minMax.minY = absPos[1];
			}
		}

		/**
		* Compares absolute position and maxY coord. If absPos[1] is bigger than maxY, it replaces maxY.
		* @param {Number[]} absPos - array of coords
		* @param {Object} minMax - object containing maxY coord
		*/
		function updateMaxY(absPos, minMax) {
			if (typeof minMax.maxY === "undefined" || absPos[1] > minMax.maxY) {
				minMax.maxY = absPos[1];
			}
		}

		/**
		* Compares absolute position and maxX coord. If absPos[0] is bigger than maxX, it replaces maxX.
		* @param {Number[]} absPos - array of coords
		* @param {Object} minMax - object containing maxX coord
		*/
		function updateMaxX(absPos, minMax) {
			if (typeof minMax.maxX === "undefined" || absPos[0] > minMax.maxX) {
				minMax.maxX = absPos[0];
			}
		}

		/**
		* Compares absolute position and minX coord. If absPos[0] is lower than minX, it replaces minX.
		* @param {Number[]} absPos - array of coords
		* @param {Object} minMax - object containing minX coord
		*/
		function updateMinX(absPos, minMax) {
			if (typeof minMax.minX === "undefined" || absPos[0] < minMax.minX) {
				minMax.minX = absPos[0];
			}
		}

		/**
		* Changes alignment of an Arrow object.
		* @param {Arrow} arrow - object to align
		* @param {String} alignment - alignment direction
		* @param {Number} coord - the most extreme coord
		*/
		function setArrow(arrow, alignment, coord) {
			var absPosStart = Utils.addCoordsNoPrec(this.origin, arrow.getOrigin()), // absolute coords of arrow start
				absPosEnd = Utils.addCoordsNoPrec(this.origin, arrow.getEnd()), // absolute coords of arrow end
				// object with extreme coords
				minMax = { minX: absPosStart[0], minY: absPosStart[1], maxX: absPosStart[0], maxY: absPosStart[1] },
				d;

			if (alignment === "up") {
				updateMinY(absPosEnd, minMax); // checks if arrow end is not upper than the start
				d = coord - minMax.minY;
				align(arrow, [0, d]); // translates arrow
			} else if (alignment === "down") {
				updateMaxY(absPosEnd, minMax); // checks if arrow end is not upper than the start
				d = coord - minMax.maxY;
				align(arrow, [0, d]); // translates arrow
			} else if (alignment === "left") {
				updateMinX(absPosEnd, minMax); // checks if arrow end is not upper than the start
				d = coord - minMax.minX;
				align(arrow, [d, 0]); // translates arrow
			} else if (alignment === "right") {
				updateMaxX(absPosEnd, minMax); // checks if arrow end is not upper than the start
				d = coord - minMax.maxX;
				align(arrow, [d, 0]); // translates arrow
			}
		}

		/**
		* Changes alignment of an Atom object.
		* @param {Atom} atom - object to align
		* @param {String} alignment - alignment direction
		* @param {Number} coord - the most extreme coord
		*/
		function setAtom(atom, alignment, coord) {
			var currAtOrig = atom.getCoords(), // relative coords of the atom
				absPos = Utils.addCoordsNoPrec(this.origin, currAtOrig), // absolute coords of the first atom
				// object with extreme coords
				minMax = {}, d;

			if (alignment === "up") {
				checkMinY(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.minY;
				updateArom.call(this, [0, d]); // updates coords of aromatic elements
				align(atom, [0, d]); // translates arrow
			} else if (alignment === "down") {
				checkMaxY(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.maxY;
				updateArom.call(this, [0, d]); // updates coords of aromatic elements
				align(atom, [0, d]); // translates arrow
			} else if (alignment === "left") {
				checkMinX(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.minX;
				updateArom.call(this, [d, 0]); // updates coords of aromatic elements
				align(atom, [d, 0]); // translates arrow
			} else if (alignment === "right") {
				checkMaxX(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.maxX;
				updateArom.call(this, [d, 0]); // updates coords of aromatic elements
				align(atom, [d, 0]); // translates arrow
			}

			// recursively searches for the uppermost coords
			function checkMinY(absPos, atom) {
				var i, currAbsPos, at;
				updateMinY(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addCoordsNoPrec(absPos, at.getCoords());
					checkMinY(currAbsPos, at);
				}
			}

			// recursively searches for the lowermost coords
			function checkMaxY(absPos, atom) {
				var i, currAbsPos, at;
				updateMaxY(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addCoordsNoPrec(absPos, at.getCoords());
					checkMaxY(currAbsPos, at);
				}
			}

			// recursively searches for the rightmost coords
			function checkMaxX(absPos, atom) {
				var i, currAbsPos, at;
				updateMaxX(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addCoordsNoPrec(absPos, at.getCoords());
					checkMaxX(currAbsPos, at);
				}
			}

			// recursively searches for the leftmost coords
			function checkMinX(absPos, atom) {
				var i, currAbsPos, at;
				updateMinX(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addCoordsNoPrec(absPos, at.getCoords());
					checkMinX(currAbsPos, at);
				}
			}

			function updateArom(d) {
				angular.forEach(this.decorate.aromatic, function (arom) {
					var equal = Utils.compareFloats(arom.fromWhich[0], atom.getCoords("x"), 3)
						&& Utils.compareFloats(arom.fromWhich[1], atom.getCoords("y"), 3);
					if (equal) {
						arom.fromWhich = Utils.addCoordsNoPrec(arom.fromWhich, d);
						arom.coords = Utils.addCoordsNoPrec(arom.coords, d);
					}
				});
			}
		}

		/**
		* Translates the structure using vector d.
		* @param {Atom|Arrow} obj - object to translate
		* @param {Number} d - array of coords representing a vector
		*/
		function align(obj, d) {
			var coords;
			if (obj instanceof Atom) {
				coords = obj.getCoords();
				obj.setCoords([coords[0] + d[0], coords[1] + d[1]]);
			} else if (obj instanceof Arrow) {
				coords = obj.getOrigin();
				obj.setOrigin([coords[0] + d[0], coords[1] + d[1]]);
			}
		}
	}
})();
