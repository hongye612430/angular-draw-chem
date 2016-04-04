(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructure", DCStructure);

	DCStructure.$inject = ["DCArrow", "DCAtom", "DCSelection", "DrawChemUtils"];

	function DCStructure(DCArrow, DCAtom, DCSelection, Utils) {

		var service = {},
			Arrow = DCArrow.Arrow,
			Selection = DCSelection.Selection,
			Atom = DCAtom.Atom;

		/**
		* Creates a new `Structure` object.
		* @class
		* @param {string} name - name of the structure
		* @param {Atom[]} structure - an array of atoms
		* @param {Object} decorate - an object with all decorate elements
		*/
		function Structure(name, structure, decorate) {
			this.name = name || "";
			this.structure = structure || [];
			this.origin = [];
			this.selectedAll = false;
			this.decorate = decorate || {};
			this.aromatic = false;
		}

		/**
		* Marks structure as aromatic.
		*/
		Structure.prototype.setAromatic = function () {
			this.aromatic = true;
		};

		/**
		* Checks if structure is aromatic.
		* @returns {boolean}
		*/
		Structure.prototype.isAromatic = function () {
			return this.aromatic;
		}

		/**
		* Moves all structures marked as selected in a supplied `direction` by a `distance` vector.
		* @param {string} direction - 'up', 'down', 'left', 'right' (for keyboard arrows), and 'mouse' for mouse,
		* @param {number[]} distance - vector
		*/
		Structure.prototype.moveStructureTo = function (direction, distance) {
			var origin, i, current;
			// iterates over all structures in 'structure' array (atoms, arrows, etc.)
			for (i = 0; i < this.structure.length; i += 1) {
				current = this.structure[i];
				// if not selected then ignore it
				if (!current.selected) { continue; }
				if (current instanceof Atom) {
					// if atom get coords and move
					origin = current.getCoords();
					move(origin, distance, direction, this, current);
				} else if (current instanceof Arrow) {
					// if arrow get coords and move
					origin = current.getOrigin();
					move(origin, distance, direction);
					// update end coords
					current.updateEnd();
				}
			}

			/**
			* Updates coordinates of an object marked as selected and its aromatics (if any exists).
			* @param {number[]} origin - origin of the object,
			* @param {number[]} distance - vector,
			* @param {string} direction - 'up', 'down', etc. for keyboard arrows, and 'mouse' for mouse,
			* @param {Object} bind - `this` context,
			* @param {Arrow|Atom} current - currently active selected object
			*/
			function move(origin, distance, direction, bind, current) {
				// by default moves by 5 (applies to keyboard moves)
				var distance = distance || 5;

				// changes coords according to chosen mode ('up', 'left', 'right', and 'down' for keyboard or 'mouse' for mouse moves)
				// updates aromatics if any exists
				if (direction === "left") {
					if (typeof bind !== "undefined") {
						updateArom.call(bind, [-distance, 0], current);
					}
					origin[0] -= distance;
				} else if (direction === "right") {
					if (typeof bind !== "undefined") {
						updateArom.call(bind, [distance, 0], current);
					}
					origin[0] += distance;
				} else if (direction === "up") {
					if (typeof bind !== "undefined") {
						updateArom.call(bind, [0, -distance], current);
					}
					origin[1] -= distance;
				} else if (direction === "down") {
					if (typeof bind !== "undefined") {
						updateArom.call(bind, [0, distance], current);
					}
					origin[1] += distance;
				} else if (direction === "mouse") {
					if (typeof bind !== "undefined") {
						updateArom.call(bind, distance, current);
					}
					origin[0] += distance[0];
					origin[1] += distance[1];
				}
			}
		};

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
		* Looks at the Selection object and sets structures in structure array as selected if they are inside the selection rectangle.
		* @param {Selection} selection - Selection object
		*/
		Structure.prototype.select = function (selection) {
			var i, struct, isInside;
			for (i = 0; i < this.structure.length; i += 1) {
				struct = this.structure[i];
				if (struct instanceof Arrow) {
					isInside = isArrowInsideRect.call(this, struct, selection);
					if (isInside) { struct.select(); }
				} else if (struct instanceof Atom) {
					isInside = isAtomInsideRect.call(this, struct, selection);
					if (isInside) { struct.select(); }
				}
			}
		};

		/**
		* Deletes all structures in structure array marked as selected.
		*/
		Structure.prototype.deleteSelected = function () {
			var i, j, newStructure = [], newArom, current, equal, arom;
			// iterates over all structures in 'structure' array (atoms, arrows, etc.)
			for (i = 0; i < this.structure.length; i += 1) {
				current = this.structure[i];
				if (!current.selected) {
					// if is not selected, then add to new array
					// if not selected, it won't be included
					newStructure.push(current);
				} else if (current instanceof Atom && this.aromatic) {
					newArom = [];
					// iterate over aromatics array
					for (j = 0; j < this.decorate.aromatic.length; j += 1) {
						arom = this.decorate.aromatic[j];
						// if structure associated with current atom has any aromatics
						// then it won't be included in new 'aromatic' array
						equal = Utils.compareFloats(arom.fromWhich[0], current.getCoords("x"), 3)
							&& Utils.compareFloats(arom.fromWhich[1], current.getCoords("y"), 3);
						if (!equal) { newArom.push(arom); }
					}
					this.decorate.aromatic = newArom;
				}
			}
			this.structure = newStructure;
		};

		/**
		* Deselects all structures in structure array.
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
		* @param {number} minY - uppermost point
		* @returns {boolean} - if the position was changed
		*/
		Structure.prototype.alignUp = function (minY) {
			return changeAlignment.call(this, "up", minY);
		};

		/**
		* Aligns all structures marked as selected to the lowermost point.
		* @param {number} maxY - lowermost point
		* @returns {boolean} - if the position was changed
		*/
		Structure.prototype.alignDown = function (maxY) {
			return changeAlignment.call(this, "down", maxY);
		};

		/**
		* Aligns all structures marked as selected to the rightmost point.
		* @param {number} maxX - uppermost point
		* @returns {boolean} - if the position was changed
		*/
		Structure.prototype.alignRight = function (maxX) {
			return changeAlignment.call(this, "right", maxX);
		};

		/**
		* Aligns all structures marked as selected to the leftmost point.
		* @param {number} minX - leftmost point
		* @returns {boolean} - if the position was changed
		*/
		Structure.prototype.alignLeft = function (minX) {
			return changeAlignment.call(this, "left", minX);
		};

		/**
		 * Sets coordinates of this `Structure` object.
		 * @param {number[]} origin - an array with coordinates
		 */
		Structure.prototype.setOrigin = function (origin) {
			this.origin = origin;
		};

		/**
		 * Gets coordinates of this `Structure` object.
		 * @returns {number[]}
		 */
		Structure.prototype.getOrigin = function (coord) {
			if (coord === "x") {
				return this.origin[0];
			} else if (coord === "y") {
				return this.origin[1];
			} else {
				return this.origin;
			}
		};

		/**
		 * Sets the structure array.
		 * @param {Atom[]} content - an array of atoms and their connections
		 */
		Structure.prototype.setStructure = function (structure) {
			this.structure = structure;
		};

		/**
		 * Adds a tree of atoms to the structure array.
		 * @param {Atom} content - an array of atoms and their connections
		 */
		Structure.prototype.addToStructures = function (str) {
			this.structure.push(str);
		};

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
		};

		/**
		 * Gets the name of the structure.
		 * @returns {string}
		 */
		Structure.prototype.getName = function () {
			return this.name;
		};

		/**
		 * Gets a decorate element.
		 * @returns {Object}
		 */
		Structure.prototype.getDecorate = function (decorate) {
			return this.decorate[decorate];
		};

		/**
		 * Sets a decorate element.
		 * @returns {Object}
		 */
		Structure.prototype.setDecorate = function (decorate, array) {
			this.decorate[decorate] = array;
		};

		/**
		 * Calculates all extreme coordinates of structures in structure array that are marked as selected.
		 * @param {Atom|Arrow} structure - structure object, i.e. Atom or Arrow object
		 * @returns {Object}
		 */
		Structure.prototype.findMinMax = function (struct) {
			var minMax = {}, i;
			// iterate over all structure in array
			if (typeof struct === "undefined") {
				for (i = 0; i < this.structure.length; i += 1) {
					struct = this.structure[i];
					if (!struct.selected) { continue; } // continue if not selected
					checkStructObj.call(this, struct);
				}
			} else {
				checkStructObj.call(this, struct);
			}

			return minMax;

			function checkStructObj(struct) {
				var currOrig,	absPos, absPosStart, absPosEnd;
				if (struct instanceof Atom) { // if struct is an Atom object
					currOrig = struct.getCoords(); // get relative coords of the first atom in structure
					absPos = Utils.addVectors(this.origin, currOrig); // calculate its absolute position
					checkStructure(absPos, struct); // recursively check all atoms in this structure
				} else if (struct instanceof Arrow) { // if struct is an Arrow object
					absPosStart = Utils.addVectors(this.origin, struct.getOrigin()); // calculate absolute coords of the beginning of the arrow
					absPosEnd = Utils.addVectors(this.origin, struct.getEnd()); // calculate absolute coords of the end of the arrow
					checkArrow(absPosStart); // check coords of the beginning of the arrow
					checkArrow(absPosEnd); // check coords of the end of the arrow
				}
			}

			// recursively checks all atoms in structure array,
			// looks for extreme coords, and updates minMax object
			function checkStructure(absPos, struct) {
				var i, currAbsPos, at;
				updateMinY(absPos, minMax);
				updateMinX(absPos, minMax);
				updateMaxY(absPos, minMax);
				updateMaxX(absPos, minMax);
				for (i = 0; i < struct.getBonds().length; i += 1) {
					at = struct.getBonds(i).getAtom();
					currAbsPos = Utils.addVectors(absPos, at.getCoords());
					checkStructure(currAbsPos, at);
				}
			}

			// updates minMax object
			function checkArrow(absPos) {
				updateMinY(absPos, minMax);
				updateMinX(absPos, minMax);
				updateMaxY(absPos, minMax);
				updateMaxX(absPos, minMax);
			}
		};

		/**
		 * Adds a decorate element (usually all aromatics).
		 * @param {Object} obj - an element to add to the decorate object,
		 *												has two fields: 'fromWhich' (holds relative coords of the first atom in structure containing this decorate element)
		 *												and 'coords' (holds absolute position of the element - usually aromatic ring)
		 */
		Structure.prototype.addDecorate = function (decorate, obj) {
			if (typeof this.decorate[decorate] === "undefined") {
				this.decorate[decorate] = [];
			}
			this.decorate[decorate].push(obj);
		};

		service.Structure = Structure;

		return service;

		/**
		* Checks if Arrow object is inside the selection rectangle.
		* @param {Arrow} arrow - Arrow object
		* @param {Selection} selection - Selection object
		* @returns {boolean}
		*/
		function isArrowInsideRect(arrow, selection) {
			var minMax = Structure.prototype.findMinMax.call(this, arrow);
			return isInsideRectY.call(this, selection, minMax.minY)
				&& isInsideRectY.call(this, selection, minMax.maxY)
				&& isInsideRectX.call(this, selection, minMax.minX)
				&& isInsideRectX.call(this, selection, minMax.maxX);
		}

		/**
		* Checks if Atom object is inside the selection rectangle.
		* @param {Atom} arrow - Atom object
		* @param {Selection} selection - Selection object
		* @returns {boolean}
		*/
		function isAtomInsideRect(atom, selection) {
			var minMax = Structure.prototype.findMinMax.call(this, atom);
			return isInsideRectY.call(this, selection, minMax.minY)
				&& isInsideRectY.call(this, selection, minMax.maxY)
				&& isInsideRectX.call(this, selection, minMax.minX)
				&& isInsideRectX.call(this, selection, minMax.maxX);
		}

		/**
		* Checks if coord is inside the selection rectangle.
		* @param {Selection} selection - Selection object
		* @param {number} coord - a coordinate to be checked
		* @returns {boolean}
		*/
		function isInsideRectY(selection, coord) {
			var origin = Utils.addVectors(this.origin, selection.getOrigin()),
				end = selection.getCurrent(),
				quadrant = Utils.getQuadrant(origin, end);

			if (quadrant === 1 || quadrant === 2) {
				return coord <= origin[1] && coord >= end[1];
			} else if (quadrant === 3 || quadrant === 4) {
				return coord >= origin[1] && coord <= end[1];
			}
		}

		/**
		* Checks if coord is inside the selection rectangle.
		* @param {Selection} selection - Selection object
		* @param {number} coord - a coordinate to be checked
		* @returns {boolean}
		*/
		function isInsideRectX(selection, coord) {
			var origin = Utils.addVectors(this.origin, selection.getOrigin()),
				end = selection.getCurrent(),
				quadrant = Utils.getQuadrant(origin, end);

			if (quadrant === 1 || quadrant === 4) {
				return coord >= origin[0] && coord <= end[0];
			} else if (quadrant === 2 || quadrant === 3) {
				return coord <= origin[0] && coord >= end[0];
			}
		}

		/**
		* Iterates over structure array and changes alignment of each selected structure.
		* @param {string} alignment - associated with alignment direction ("up", "down", "left", "right")
		* @param {number} coord - the most extreme coordinate (e.g. uppermost, rightmost, etc.)
		* @returns {boolean} true if position of any structure was changed
		*/
		function changeAlignment(alignment, coord) {
			var i, changed = false;
			for (i = 0; i < this.structure.length; i += 1) {
				var struct = this.structure[i], aux;
				if (!struct.selected) { continue; } // continue if not marked as selected
				if (struct instanceof Arrow) {
					aux = setArrow.call(this, struct, alignment, coord);
					changed = changed ? true: aux;
				} else if (struct instanceof Atom) {
					aux = setAtom.call(this, struct, alignment, coord);
					changed = changed ? true: aux;
				}
			}
			return changed;
		}

		/**
		* Compares absolute position and minY coord. If absPos[1] is lower than minY, it replaces minY.
		* @param {number[]} absPos - array of coords
		* @param {Object} minMax - object containing minY coord
		*/
		function updateMinY(absPos, minMax) {
			if (typeof minMax.minY === "undefined" || absPos[1] < minMax.minY) {
				minMax.minY = absPos[1];
			}
		}

		/**
		* Compares absolute position and maxY coord. If absPos[1] is bigger than maxY, it replaces maxY.
		* @param {number[]} absPos - array of coords
		* @param {Object} minMax - object containing maxY coord
		*/
		function updateMaxY(absPos, minMax) {
			if (typeof minMax.maxY === "undefined" || absPos[1] > minMax.maxY) {
				minMax.maxY = absPos[1];
			}
		}

		/**
		* Compares absolute position and maxX coord. If absPos[0] is bigger than maxX, it replaces maxX.
		* @param {number[]} absPos - array of coords
		* @param {Object} minMax - object containing maxX coord
		*/
		function updateMaxX(absPos, minMax) {
			if (typeof minMax.maxX === "undefined" || absPos[0] > minMax.maxX) {
				minMax.maxX = absPos[0];
			}
		}

		/**
		* Compares absolute position and minX coord. If absPos[0] is lower than minX, it replaces minX.
		* @param {number[]} absPos - array of coords
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
		* @param {string} alignment - alignment direction
		* @param {number} coord - the most extreme coord
		*/
		function setArrow(arrow, alignment, coord) {
			var absPosStart = Utils.addVectors(this.origin, arrow.getOrigin()), // absolute coords of arrow start
				absPosEnd = Utils.addVectors(this.origin, arrow.getEnd()), // absolute coords of arrow end
				// object with extreme coords
				minMax = { minX: absPosStart[0], minY: absPosStart[1], maxX: absPosStart[0], maxY: absPosStart[1] },
				d;

			if (alignment === "up") {
				updateMinY(absPosEnd, minMax); // checks if arrow end is not upper than the start
				d = coord - minMax.minY;
				align(arrow, [0, d]); // translates arrow
			} else if (alignment === "down") {
				updateMaxY(absPosEnd, minMax); // checks if arrow end is not lower than the start
				d = coord - minMax.maxY;
				align(arrow, [0, d]); // translates arrow
			} else if (alignment === "left") {
				updateMinX(absPosEnd, minMax); // checks if arrow end is not more to the left than the start
				d = coord - minMax.minX;
				align(arrow, [d, 0]); // translates arrow
			} else if (alignment === "right") {
				updateMaxX(absPosEnd, minMax); // checks if arrow end is not more to the right than the start
				d = coord - minMax.maxX;
				align(arrow, [d, 0]); // translates arrow
			}

			// if d is equal to 0 (approx. to five decimal places), then return false
			// which means that nothing changed, true otherwise
			return !Utils.compareFloats(d, 0, 5);
		}

		/**
		* Changes alignment of an Atom object.
		* @param {Atom} atom - object to align
		* @param {string} alignment - alignment direction
		* @param {number} coord - the most extreme coord
		*/
		function setAtom(atom, alignment, coord) {
			var currAtOrig = atom.getCoords(), // relative coords of the atom
				absPos = Utils.addVectors(this.origin, currAtOrig), // absolute coords of the first atom
				// object with extreme coords
				minMax = {}, d;

			if (alignment === "up") {
				checkMinY(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.minY;
				updateArom.call(this, [0, d], atom); // updates coords of aromatic elements
				align(atom, [0, d]); // translates arrow
			} else if (alignment === "down") {
				checkMaxY(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.maxY;
				updateArom.call(this, [0, d], atom); // updates coords of aromatic elements
				align(atom, [0, d]); // translates arrow
			} else if (alignment === "left") {
				checkMinX(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.minX;
				updateArom.call(this, [d, 0], atom); // updates coords of aromatic elements
				align(atom, [d, 0]); // translates arrow
			} else if (alignment === "right") {
				checkMaxX(absPos, atom); // searches the whole structure for the uppermost atom
				d = coord - minMax.maxX;
				updateArom.call(this, [d, 0], atom); // updates coords of aromatic elements
				align(atom, [d, 0]); // translates arrow
			}
			// if d is equal to 0 (approx. to five decimal places), then return false
			// which means that nothing changed, true otherwise
			return !Utils.compareFloats(d, 0, 5);

			// recursively searches for the uppermost coords
			function checkMinY(absPos, atom) {
				var i, currAbsPos, at;
				updateMinY(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addVectors(absPos, at.getCoords());
					checkMinY(currAbsPos, at);
				}
			}

			// recursively searches for the lowermost coords
			function checkMaxY(absPos, atom) {
				var i, currAbsPos, at;
				updateMaxY(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addVectors(absPos, at.getCoords());
					checkMaxY(currAbsPos, at);
				}
			}

			// recursively searches for the rightmost coords
			function checkMaxX(absPos, atom) {
				var i, currAbsPos, at;
				updateMaxX(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addVectors(absPos, at.getCoords());
					checkMaxX(currAbsPos, at);
				}
			}

			// recursively searches for the leftmost coords
			function checkMinX(absPos, atom) {
				var i, currAbsPos, at;
				updateMinX(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = Utils.addVectors(absPos, at.getCoords());
					checkMinX(currAbsPos, at);
				}
			}
		}

		// updates coords of aromatics if any exists
		function updateArom(d, atom) {
			angular.forEach(this.decorate.aromatic, function (arom) {
				var equal = Utils.compareFloats(arom.fromWhich[0], atom.getCoords("x"), 3)
					&& Utils.compareFloats(arom.fromWhich[1], atom.getCoords("y"), 3);
				if (equal) {
					arom.fromWhich = Utils.addVectors(arom.fromWhich, d);
					arom.coords = Utils.addVectors(arom.coords, d);
				}
			});
		}

		/**
		* Translates the structure using vector d.
		* @param {Atom|Arrow} obj - object to translate
		* @param {number} d - array of coords representing a vector
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
