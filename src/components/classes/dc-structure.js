(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructure", DCStructure);

	DCStructure.$inject = ["DCArrow", "DCAtom"];

	function DCStructure(DCArrow, DCAtom) {

		var service = {},
			Arrow = DCArrow.Arrow,
			Atom = DCAtom.Atom;

		/**
		* Creates a new Structure.
		* @class
		* @param {String} name - name of the structure
		* @param {Atom[]} structure - an array of atoms
		*/
		function Structure(name, structure, decorate) {
			this.name = name || "";
			this.structure = structure || [];
			this.transform = [];
			this.origin = [];
			this.selectedAll = false;
			this.decorate = decorate || {};
		}

		Structure.prototype.selectAll = function () {
			var i;
			this.selectedAll = true;
			for (i = 0; i < this.structure.length; i += 1) {
				this.structure[i].select();
			}
		};

		Structure.prototype.deselectAll = function () {
			var i;
			this.selectedAll = false;
			for (i = 0; i < this.structure.length; i += 1) {
				this.structure[i].deselect();
			}
		};

		Structure.prototype.alignUp = function (minY) {
			changeAlignment.call(this, "up", minY);
		};

		function setArrow(arrow, alignment, coord) {
			var absPosStart = addCoordsNoPrec(this.origin, arrow.getOrigin()),
				absPosEnd = addCoordsNoPrec(this.origin, arrow.getEnd()),
				minMax = { minX: absPosStart[0], minY: absPosStart[1], maxX: 0, maxY: 0 };

			if (alignment === "up") {
				updateMinY(absPosEnd, minMax);
				alignUp();
			}

			function alignUp() {
				var d = coord - minMax.minY;
				arrow.setOrigin([
					arrow.getOrigin("x"),
					arrow.getOrigin("y") + d
				]);
			}
		}

		function setAtom(atom, alignment, coord) {
			var currAtOrig = atom.getCoords(),
				absPos = addCoordsNoPrec(this.origin, currAtOrig),
				minMax = { minX: absPos[0], minY: absPos[1], maxX: 0, maxY: 0 };

			if (alignment === "up") {
				checkMinY(absPos, atom);
				alignUp();
			}

			function alignUp() {
				var d = coord - minMax.minY;
				atom.setCoords([
					currAtOrig[0],
					currAtOrig[1] + d
				]);
			}

			function checkMinY(absPos, atom) {
				var i, currAbsPos, at;
				updateMinY(absPos, minMax);
				for (i = 0; i < atom.getBonds().length; i += 1) {
					at = atom.getBonds(i).getAtom();
					currAbsPos = addCoordsNoPrec(absPos, at.getCoords());
					checkMinY(currAbsPos, at);
				}
			}
		}

		function addCoordsNoPrec(coords1, coords2, factor) {
			return typeof factor === "undefined" ?
				[coords1[0] + coords2[0], coords1[1] + coords2[1]]:
				[coords1[0] + factor * coords2[0], coords1[1] + factor * coords2[1]];
		}

		function updateMinY(absPos, minMax) {
			if (absPos[1] < minMax.minY) {
				minMax.minY = absPos[1];
			}
		}

		function changeAlignment(alignment, coord) {
			var i;
			for (i = 0; i < this.structure.length; i += 1) {
				var struct = this.structure[i];
				if (struct instanceof Arrow) {
					setArrow.call(this, struct, alignment, coord);
				} else if (struct instanceof Atom) {
					setAtom.call(this, struct, alignment, coord);
				}
			}
		}

		/**
		 * Sets coordinates of the first atom.
		 * @param {Number[]} origin - an array with coordinates
		 */
		Structure.prototype.setOrigin = function (origin) {
			this.origin = origin;
			angular.forEach(this.decorate, function (value, key) {
				value.forEach(function (element) {
					element[0] += origin[0];
					element[1] += origin[1];
				});
			});
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
		 * Gets the decorate element.
		 * @returns {Object}
		 */
		Structure.prototype.getDecorate = function (decorate) {
			return this.decorate[decorate];
		}

		/**
		 * Sets the decorate element.
		 * @param {String} decorate - an element to add to the array
		 */
		Structure.prototype.addDecorate = function (decorate, coords) {
			if (typeof this.decorate[decorate] === "undefined") {
				this.decorate[decorate] = [];
			}
			this.decorate[decorate].push(coords);
		}

		service.Structure = Structure;

		return service;
	}
})();
