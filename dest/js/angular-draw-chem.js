(function () {
	"use strict";
	angular.module("mmAngularDrawChem", ["ngSanitize", "ui.bootstrap"])
		.config(["$sanitizeProvider", function ($sanitizeProvider) {
			$sanitizeProvider.enableSvg();
		}]);
})();
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

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrow", DCArrow);

	DCArrow.$inject = ["DrawChemUtils", "DrawChemConst"];

	function DCArrow(Utils, Const) {

		var service = {},
		  ARROW_START = Const.ARROW_START,
		  ARROW_SIZE = Const.ARROW_SIZE,
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
		  BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS;

		/**
		* Creates a new Arrow.
		* @class
		*/
		function Arrow(type, direction, relativeEnd) {
			this.type = type;
			this.selected = false;
			this.direction = direction;
			this.relativeEnd = relativeEnd;
		}

		Arrow.prototype.select = function () {
			this.selected = true;
		};

		Arrow.prototype.deselect = function () {
			this.selected = false;
		}

		Arrow.prototype.getType = function () {
			return this.type;
		}

		Arrow.prototype.getRelativeEnd = function () {
			return this.relativeEnd;
		}

		Arrow.prototype.getEnd = function (coord) {
			if (coord === "x") {
				return this.end[0];
			} else if (coord === "y") {
				return this.end[1];
			} else {
				return this.end;
			}
		}

		Arrow.prototype.getDirection = function () {
			return this.direction;
		}

		/**
		 * Sets origin of the arrow.
		 * @param {Number[]} coords - an array with coordinates of the beginning coords of the arrow
		 */
		Arrow.prototype.setOrigin = function (origin) {
			this.origin = origin;
			if (typeof this.relativeEnd !== "undefined") {
				this.end = [
					origin[0] + this.relativeEnd[0],
					origin[1] + this.relativeEnd[1],
				];
			}
		};

		/**
		 * Updates end of the arrow.
		 */
		Arrow.prototype.updateEnd = function () {
			if (typeof this.relativeEnd !== "undefined") {
				this.end = [
					this.origin[0] + this.relativeEnd[0],
					this.origin[1] + this.relativeEnd[1],
				];
			}
		};

		/**
		 * Gets origin of the arrow.
		 * @returns {Number[]|Number}
		 */
		Arrow.prototype.getOrigin = function (coord) {
			if (coord === "x") {
				return this.origin[0];
			} else if (coord === "y") {
				return this.origin[1];
			} else {
				return this.origin;
			}
		};

		service.Arrow = Arrow;

		service.calcArrow = function (start, end, type) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCCW = [vectCoords[1], -vectCoords[0]], endMarkerStart, startMarkerStart, M1, M2, L1, L2, L3, L4;
			if (type === "one-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				L1 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return ["arrow", "M", start, "L", end, "M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z"];
			} else if (type === "two-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				startMarkerStart = [start[0] + vectCoords[0] * (1 - ARROW_START), start[1] + vectCoords[1] * (1 - ARROW_START)];
				L1 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				L3 = Utils.addCoordsNoPrec(startMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L4 = Utils.addCoordsNoPrec(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return [
					"arrow",
					"M", start, "L", end,
					"M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z",
					"M", startMarkerStart, "L", L3, "L", start, "L", L4, "Z"
				];
			}
			else if (type === "equilibrium-arrow") {
				M1 = Utils.addCoordsNoPrec(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				endMarkerStart = [parseFloat(M1[0]) + vectCoords[0] * ARROW_START, parseFloat(M1[1]) + vectCoords[1] * ARROW_START];
				L2 = Utils.addCoordsNoPrec(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);

				M2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				L3 = Utils.addCoordsNoPrec(start, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				startMarkerStart = [parseFloat(L3[0]) + vectCoords[0] * (1 - ARROW_START), parseFloat(L3[1]) + vectCoords[1] * (1 - ARROW_START)];
				L4 = Utils.addCoordsNoPrec(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return [
					"arrow-eq",
					"M", M1, "L", L1, "L", L2,
					"M", M2, "L", L3, "L", L4
				];
			}
		}

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCAtom", DCAtom);

	DCAtom.$inject = ["DrawChemConst"];

	function DCAtom(DrawChemConst) {

		var service = {};

		/**
		* Creates a new Atom.
		* @class
		* @param {Number[]} coords - an array with coordinates of the atom
		* @param {Bond[]} - an array of bonds coming out of the atom
		* @param {String} - additional info (not used yet...)
		* @param {String[]} - directions of all bonds coming out or coming in
		*/
		function Atom(coords, bonds, info, attachedBonds) {
			this.coords = coords;
			this.bonds = bonds;
			this.info = info;
			this.attachedBonds = attachedBonds || [];
			this.next = "";
			this.selected = false;
			this.label;
			this.calculateNext();
		}

		Atom.prototype.select = function () {
			this.selected = true;
		};

		Atom.prototype.deselect = function () {
			this.selected = false;
		};

		/**
		 * Calculates direction of an opposite bond.
		 * @param {String} direction - direction of a bond
		 */
		Atom.getOppositeDirection = function (direction) {
			switch (direction) {
				case "N":
					return "S";
				case "NE1":
					return "SW1";
				case "NE2":
					return "SW2";
				case "E":
					return "W";
				case "SE1":
					return "NW1";
				case "SE2":
					return "NW2";
				case "S":
					return "N";
				case "SW1":
					return "NE1";
				case "SW2":
					return "NE2";
				case "W":
					return "E";
				case "NW1":
					return "SE1";
				case "NW2":
					return "SE2";
			}
		}

		/**
		 * Adds a bond to the attachedBonds array.
		 * @param {String} bond - direction of a bond
		 */
		Atom.prototype.attachBond = function (bond) {
			this.attachedBonds.push(bond);
		};

		/**
		 * Calculates direction of the bond that should be attached next.
		 */
		Atom.prototype.calculateNext = function () {
			if (this.attachedBonds.length === 1) {
				this.next = checkIfLenOne.call(this);
			} else if (this.attachedBonds.length === 2) {
				this.next = checkIfLenTwo.call(this);
			} else if (this.attachedBonds.length > 2 && this.attachedBonds.length < 12) {
				this.next = check.call(this);
			} else if (this.attachedBonds.length >= 12) {
				this.next = "max";
			} else {
				this.next = "";
			}

			function checkIfLenOne() {
				var str = this.attachedBonds[0].direction;
				switch (str) {
					case "N":
						return "SE1";
					case "NE1":
						return "SE2";
					case "NE2":
						return "S";
					case "E":
						return "SW1";
					case "SE1":
						return "SW2";
					case "SE2":
						return "W";
					case "S":
						return "NW1";
					case "SW1":
						return "NW2";
					case "SW2":
						return "N";
					case "W":
						return "NE1";
					case "NW1":
						return "NE2";
					case "NW2":
						return "E";
				}
			}

			function checkIfLenTwo() {
				if (contains.call(this, "N", "SE1")) {
					return "SW2";
				} else if (contains.call(this, "NE1", "SE2")) {
					return "W";
				} else if (contains.call(this, "NE2", "S")) {
					return "NW1";
				} else if (contains.call(this, "E", "SW1")) {
					return "NW2";
				} else if (contains.call(this, "SE1", "SW2")) {
					return "N";
				} else if (contains.call(this, "SE2", "W")) {
					return "NE1";
				} else if (contains.call(this, "S", "NW1")) {
					return "NE2";
				} else if (contains.call(this, "SW1", "NW2")) {
					return "E";
				} else if (contains.call(this, "SW2", "N")) {
					return "SE1";
				} else if (contains.call(this, "W", "NE1")) {
					return "SE2";
				} else if (contains.call(this, "NW1", "NE2")) {
					return "S";
				} else if (contains.call(this, "NW2", "E")) {
					return "SW1";
				} else {
					check.call(this);
				}

				function contains(d1, d2) {
					return (this.attachedBonds[0].direction === d1 && this.attachedBonds[1].direction === d2) ||
						(this.attachedBonds[0].direction === d2 && this.attachedBonds[1].direction === d1);
				}
			}

			function check() {
				var i, j, bonds = DrawChemConst.BONDS, current, found;
				for(i = 0; i < bonds.length; i += 1) {
					current = bonds[i].direction;
					found = "";
					for (j = 0; j < this.attachedBonds.length; j += 1) {
						if (this.attachedBonds[j].direction === current) {
							found = current;
						}
					}
					if (found === "") {
						return current;
					}
				}
			}
		};

		/**
		 * Sets coordinates of the atom.
		 * @param {Number[]} coords - an array with coordinates of the atom
		 */
		Atom.prototype.setCoords = function (coords) {
			this.coords = coords;
		};

		/**
		 * Gets additional info.
		 * @returns {String}
		 */
		Atom.prototype.getInfo = function () {
			return this.info;
		}

		/**
		 * Gets attached bonds.
		 * @returns {String[]}
		 */
		Atom.prototype.getAttachedBonds = function () {
			return this.attachedBonds;
		}

		/**
		 * Sets coordinates of a preceding atom.
		 * @param {Number[]} coords - an array with coordinates of the atom
		 */
		Atom.prototype.setPreceding = function (coords) {
			this.preceding = coords;
		};

		/**
		 * Gets coordinates of the atom.
		 * @returns {Number[]|Number}
		 */
		Atom.prototype.getPreceding = function (coord) {
			if (coord === "x") {
				return this.preceding[0];
			} else if (coord === "y") {
				return this.preceding[1];
			} else {
				return this.preceding;
			}
		};

		/**
		 * Gets symbol of the next bond.
		 * @returns {String}
		 */
		Atom.prototype.getNext = function () {
			return this.next;
		}

		/**
		 * Sets Label object.
		 * @param {Label} label - a Label object
		 */
		Atom.prototype.setLabel = function (label) {
			this.label = label;
		}

		/**
		 * Gets Label object.
		 * @returns {Label}
		 */
		Atom.prototype.getLabel = function () {
			return this.label;
		}

		/**
		 * Sets symbol of the next bond.
		 * @param {String} - symbol of the next bond
		 */
		Atom.prototype.setNext = function (symbol) {
			this.next = symbol;
		}

		/**
		 * Gets coordinates of the atom.
		 * @returns {Number[]|Number}
		 */
		Atom.prototype.getCoords = function (coord) {
			if (coord === "x") {
				return this.coords[0];
			} else if (coord === "y") {
				return this.coords[1];
			} else {
				return this.coords;
			}
		};

		/**
		 * Gets an array of all atoms this atom is connected with
		 * @returns {Bond[]|Bond}
		 */
		Atom.prototype.getBonds = function (index) {
			if (arguments.length === 0) {
				return this.bonds;
			} else {
				return this.bonds[index];
			}
		}

		/**
		 * Sets an array of bonds
		 * @param {Bond[]} bonds - array of Bond objects
		 */
		Atom.prototype.setBonds = function (bonds) {
			this.bonds = bonds;
		}

		/**
		 * Adds a new atom to the bonds array.
		 * @param {Atom} atom - a new Atom object to be added
		 */
		Atom.prototype.addBond = function (bond) {
			this.bonds.push(bond);
		}

		/**
		 * Adds new bonds.
		 * @param {Bond[]} bonds - an array of bonds to be added
		 */
		Atom.prototype.addBonds = function (bonds) {
			bonds.forEach(function (bond) {
				this.bonds.push(bond);
			}, this);
		}

		service.Atom = Atom;

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCBond", DCBond);

	DCBond.$inject = ["DrawChemUtils", "DrawChemConst"]

	function DCBond(Utils, Const) {

		var service = {},
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
		  BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS;

		/**
		* Creates a new Bond.
		* @class
		* @param {String} type - type of bond, e.g. single, double, triple, wedge, or dash
		* @param {Atom} - an atom at the end of the bond
		*/
		function Bond(type, atom) {
			this.type = type;
			this.atom = atom;
		}

		/**
		 * Sets a bond type.
		 * @param {String} type - type of bond, e.g. single, double, triple, wedge, or dash
		 */
		Bond.prototype.setType = function (type) {
			this.type = type;
		}

		/**
		 * Gets a bond type.
		 * @returns {String}
		 */
		Bond.prototype.getType = function () {
			return this.type;
		}

		/**
		 * Sets an atom at the end of the bond.
		 * @param {Atom} atom - an atom at the end of the bond
		 */
		Bond.prototype.setAtom = function (atom) {
			this.atom = atom;
		}

		/**
		 * Gets an atom at the end of the bond.
		 * @returns {Atom}
		 */
		Bond.prototype.getAtom = function () {
			return this.atom;
		}

		service.Bond = Bond;

		service.calcDoubleBondCoords = function (start, end) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				M1 = Utils.addCoordsNoPrec(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				M2 = Utils.addCoordsNoPrec(start, perpVectCoordsCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
			return ["M", M1, "L", L1, "M", M2, "L", L2];
		};

		service.calcTripleBondCoords = function (start, end) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				M1 = Utils.addCoordsNoPrec(start, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				M2 = Utils.addCoordsNoPrec(start, perpVectCoordsCW, BETWEEN_TRP_BONDS),
				L2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_TRP_BONDS);
			return ["M", M1, "L", L1, "M", start, "L", end, "M", M2, "L", L2];
		};

		service.calcWedgeBondCoords = function (start, end) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				L1 = Utils.addCoordsNoPrec(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addCoordsNoPrec(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
			return ["wedge", "M", start, "L", L1, "L", L2, "Z"];
		};

		service.calcDashBondCoords = function (start, end) {
			var i, max = 7, factor = BETWEEN_DBL_BONDS / max, M, L, currentEnd = start, result = [],
				vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]];

			for (i = max; i > 0; i -= 1) {
				factor = factor + BETWEEN_DBL_BONDS / max;
				currentEnd = [currentEnd[0] + vectCoords[0] / max, currentEnd[1] + vectCoords[1] / max];
				M = Utils.addCoordsNoPrec(currentEnd, perpVectCoordsCCW, factor);
				L = Utils.addCoordsNoPrec(currentEnd, perpVectCoordsCW, factor);
				result = result.concat(["M", M, "L", L]);
			}
			return result;
		};

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCLabel", DCLabel);
	
	function DCLabel() {
		
		var service = {};
		
		/**
		* Creates a new Label.
		* @class
		* @param {String} label - a symbol of the atom
		* @param {Number} bonds - a maximum number of bonds this atom should be connected with
		*/
		function Label(label, bonds, mode) {
			this.labelName = label;			
			this.bonds = bonds;
			this.mode = mode;
		}
		
		/**
		 * Gets label name.
		 * @returns {String}
		 */
		Label.prototype.getLabelName = function () {
			return this.labelName;
		};
		
		/**
		 * Sets label name.
		 * @param {String} labelName - name of the label
		 */
		Label.prototype.setLabelName = function (labelName) {
			this.labelName = labelName;
		};
		
		
		/**
		 * Get maximum number of bonds related to this label. E.g. label 'O', oxygen, has maximum two bonds.
		 * @returns {Number}
		 */
		Label.prototype.getMaxBonds = function () {
			return this.bonds;
		};
		
		/**
		 * Sets maximum number of bonds.
		 * @param {Number} bonds - maximum number of bonds
		 */
		Label.prototype.setMaxBonds = function (bonds) {
			this.bonds = bonds;
		};
		
		/**
		 * Gets mode of the label, i.e. 'rl' for 'right to left', 'lr' for 'left to right'. Useful for anchoring of the text tag.
		 * @returns {String}
		 */
		Label.prototype.getMode = function () {
			return this.mode;
		};
		
		/**
		 * Sets mode of the label.
		 * @param (String) mode - mode to set
		 */
		Label.prototype.setMode = function (mode) {
			this.mode = mode;
		};
		
		service.Label = Label;
		
		return service;
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCSelection", DCSelection);

	function DCSelection() {

		var service = {};

		/**
		* Creates a new Selection.
		* @class
		* @param {Number[]} origin - coords of the origin relative to the absolute position of the 'parent' Structure object
		* @param {Number[]} current - current absolute position of the mouse
		*/
		function Selection(origin, current) {
			this.origin = origin;
			this.current = current;
			this.quarter = 4;
		}

		/**
		 * Gets origin.
		 * @returns {Number[]}
		 */
		Selection.prototype.getOrigin = function (coord) {
			if (coord === "x") {
				return this.origin[0];
			} else if (coord === "y") {
				return this.origin[1];
			} else {
				return this.origin;
			}
		};

		/**
		 * Sets origin.
		 * @param {Number[]} - origin of the element
		 */
		Selection.prototype.setOrigin = function (origin) {
			this.origin = origin;
		};

		/**
		 * Gets current mouse position.
		 * @returns {Number[]}
		 */
		Selection.prototype.getCurrent = function (coord) {
			if (coord === "x") {
				return this.current[0];
			} else if (coord === "y") {
				return this.current[1];
			} else {
				return this.current;
			}
		};

    /**
		 * Sets current mouse position.
		 * @param {Number[]} - current mouse position.
		 */
		Selection.prototype.setCurrent = function (current) {
		  this.current = current;
		};

		/**
		 * Returns in which quarter is the rect (mouseDown coords as the beginning of the coordinate system).
		 * @returns {Number}
		 */
		Selection.prototype.getQuarter = function () {
			return this.quarter;
		};

		/**
		 * Sets in which quarter is the rect (mouseDown coords as the beginning of the coordinate system).
		 * @returns {Boolean}
		 */
		Selection.prototype.setQuarter = function (quarter) {
			this.quarter = quarter;
		};

		service.Selection = Selection;

		service.calcRect = function (quarter, absPosStart, absPosEnd) {
			var startX, startY, width, height;
			if (quarter === 1) {
				startX = absPosStart[0];
				startY = absPosEnd[1];
				width = absPosEnd[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quarter === 2) {
				startX = absPosEnd[0];
				startY = absPosEnd[1];
				width = absPosStart[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quarter === 3) {
				startX = absPosEnd[0];
				startY = absPosStart[1];
				width = absPosStart[0] - startX;
				height = absPosEnd[1] - startY;
			} else if (quarter === 4) {
				startX = absPosStart[0];
				startY = absPosStart[1];
				width = absPosEnd[0] - startX;
				height = absPosEnd[1] - startY;
			}
			if (width < 0) {
				width = 0;
			}
			if (height < 0) {
				height = 0;
			}
			return { class: "selection", rect: [startX, startY, width, height] };
		};

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCShape", DCShape);

	DCShape.$inject = ["DrawChemConst"];

	function DCShape(DrawChemConst) {

		var service = {};

		service.fontSize = 18;
		service.subFontSize = 14;
		service.font = "Arial";

		/**
		 * Creates a new Shape. This helper class has methods
		 * for wrapping an svg element (e.g. path) with other elements (e.g. g, defs).
		 * @class
		 * @param {String} elementFull - an svg element for editing
		 * @param {String} elementMini - an svg element for displaying outside of the editor
		 * @param {String} id - an id of the element
		 */
		function Shape(elementFull, elementMini, id) {
			this.elementFull = elementFull;
			this.elementMini = elementMini;
			this.id = id;
			this.scale = 1;
			this.transformAttr = "";
			this.style = {
				expanded: {
					"circle.atom:hover": {
						"opacity": "0.3",
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					},
					"circle.arom:hover": {
						"opacity": "0.3",
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
						"fill": "black"
					},
					"text:hover": {
						"opacity": "0.3"
					},
					"circle.atom": {
						"opacity": "0",
					},
					"circle.edit": {
						"stroke": "black",
						"fill": "none"
					},
					"rect.selection": {
						"stroke": "black",
						"stroke-dasharray": "10 5",
						"fill": "none"
					}
				},
				base: {
					"path": {
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
						"fill": "none"
					},
					"path.wedge": {
						"fill": "black"
					},
					"path.arrow": {
						"fill": "black"
					},
					"path.arrow-eq": {
						"fill": "none"
					},
					"circle.arom": {
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
						"fill": "none"
					},
					"circle.tr-arom": {
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
						"fill": "none"
					},
					"text": {
						"font-family": service.font,
						"cursor": "default",
						"font-size": service.fontSize + "px"
					},
					"tspan.sub": {
						"font-size": service.subFontSize + "px"
					},
					"polygon.text": {
						"fill": "white"
					}
				}
			};
		}

		/**
		 * Sets an array of extreme coords (minX, maxX, minY, maxY).
		 * @param {Number[]} minMax - array of coords
		 */
		Shape.prototype.setMinMax = function (minMax) {
			this.minMax = minMax;
		}

		/**
		 * Wraps an instance of Shape with a custom tag.
		 * @param {string} el - name of the tag, if this param equals 'g', then id attribute is automatically added
		 * @param {Object} attr - attribute of the tag
		 * @param {string} attr.key - name of the attribute
		 * @param {string} attr.val - value of the attribute
		 */
		Shape.prototype.wrap = function (which, el, attr) {
			var customAttr = {}, tagOpen;

			if (el === "g" && !attr) {
				attr = customAttr;
				attr.id = this.id;
			}
			if (attr) {
				tagOpen = "<" + el + " ";
				angular.forEach(attr, function (val, key) {
					tagOpen += key + "='" + val + "' ";
				});
				if (which === "full") {
					this.elementFull = tagOpen + ">" + this.elementFull + "</" + el + ">";
				} else if (which === "mini") {
					this.elementMini = tagOpen + ">" + this.elementMini + "</" + el + ">";
				}
			} else {
				if (which === "full") {
					this.elementFull = "<" + el + ">" + this.elementFull + "</" + el + ">";
				} else if (which === "mini") {
					this.elementMini = "<" + el + ">" + this.elementMini + "</" + el + ">";
				}
			}
			return this;
		};

		/**
		 * Generates style tag with all info about the style enclosed.
		 * @param {String} which - 'expanded' for the whole css, 'base' for css needed to render the molecule (without circles on hover, etc.)
		 */
		Shape.prototype.generateStyle = function (which) {
			var attr = "<style type=\"text/css\">";

			if (which === "expanded") {
				which = { base: this.style.base, expanded: this.style.expanded };
			} else if (which === "base") {
				which = { base: this.style.base, expanded: {} };
			}

			angular.forEach(which, function (value, key) {
				angular.forEach(value, function (value, key) {
					attr += key + "{";
					angular.forEach(value, function (value, key) {
						attr += key + ":" + value + ";";
					});
					attr += "}"
				});
			});
			return attr + "</style>";
		}

		service.Shape = Shape;

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);

	DCStructureCluster.$inject = ["DrawChemShapes"];

	function DCStructureCluster(DrawChemShapes) {

		var service = {};

		/**
		* Creates a new StructureCluster object.
		* @class
		* @param {String} name - name of the cluster
		* @param {Structure[]} defs - array of Structure objects belonging to the cluster
		*/
		function StructureCluster(name, defs, multiplicity) {
			this.name = name;
			this.defs = defs;
			this.multiplicity = multiplicity;
			this.defaultStructure = defs[0];
		}

		StructureCluster.prototype.getDefs = function () {
			return this.defs;
		};

		StructureCluster.prototype.getBondsMultiplicity = function () {
			return this.multiplicty;
		};

		StructureCluster.prototype.getDefault = function () {
			return this.defaultStructure;
		};

		StructureCluster.prototype.getStructure = function (mouseCoords1, mouseCoords2) {
			var i,
				direction = DrawChemShapes.getDirection(mouseCoords1, mouseCoords2);
			for (i = 0; i < this.defs.length; i += 1) {
				if (this.defs[i].getName() === direction) {
					return this.defs[i];
				}
			}
		};

		service.StructureCluster = StructureCluster;

		return service;
	}
})();

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
		* Creates a new Structure.
		* @class
		* @param {String} name - name of the structure
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
		}

		/**
		* Checks if structure is aromatic.
		* @returns {Boolean}
		*/
		Structure.prototype.isAromatic = function () {
			return this.aromatic;
		}

		/**
		* Moves all structures marked as selected in a direction.
		* @param {}
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
		* @param {Number} minY - uppermost point
		* @returns {Boolean} - if the position was changed
		*/
		Structure.prototype.alignUp = function (minY) {
			return changeAlignment.call(this, "up", minY);
		};

		/**
		* Aligns all structures marked as selected to the lowermost point.
		* @param {Number} maxY - lowermost point
		* @returns {Boolean} - if the position was changed
		*/
		Structure.prototype.alignDown = function (maxY) {
			return changeAlignment.call(this, "down", maxY);
		};

		/**
		* Aligns all structures marked as selected to the rightmost point.
		* @param {Number} maxX - uppermost point
		* @returns {Boolean} - if the position was changed
		*/
		Structure.prototype.alignRight = function (maxX) {
			return changeAlignment.call(this, "right", maxX);
		};

		/**
		* Aligns all structures marked as selected to the leftmost point.
		* @param {Number} minX - leftmost point
		* @returns {Boolean} - if the position was changed
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
		 * Sets a decorate element.
		 * @returns {Object}
		 */
		Structure.prototype.setDecorate = function (decorate, array) {
			this.decorate[decorate] = array;
		}

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
					absPos = Utils.addCoordsNoPrec(this.origin, currOrig); // calculate its absolute position
					checkStructure(absPos, struct); // recursively check all atoms in this structure
				} else if (struct instanceof Arrow) { // if struct is an Arrow object
					absPosStart = Utils.addCoordsNoPrec(this.origin, struct.getOrigin()); // calculate absolute coords of the beginning of the arrow
					absPosEnd = Utils.addCoordsNoPrec(this.origin, struct.getEnd()); // calculate absolute coords of the end of the arrow
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
					currAbsPos = Utils.addCoordsNoPrec(absPos, at.getCoords());
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
		}

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
		}

		service.Structure = Structure;

		return service;

		/**
		* Checks if Arrow object is inside the selection rectangle.
		* @param {Arrow} arrow - Arrow object
		* @param {Selection} selection - Selection object
		* @returns {Boolean}
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
		* @returns {Boolean}
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
		* @param {Number} coord - a coordinate to be checked
		* @returns {Boolean}
		*/
		function isInsideRectY(selection, coord) {
			var origin = Utils.addCoordsNoPrec(this.origin, selection.getOrigin()),
				end = selection.getCurrent(),
				quarter = selection.getQuarter();

			if (quarter === 1 || quarter === 2) {
				return coord <= origin[1] && coord >= end[1];
			} else if (quarter === 3 || quarter === 4) {
				return coord >= origin[1] && coord <= end[1];
			}
		}

		/**
		* Checks if coord is inside the selection rectangle.
		* @param {Selection} selection - Selection object
		* @param {Number} coord - a coordinate to be checked
		* @returns {Boolean}
		*/
		function isInsideRectX(selection, coord) {
			var origin = Utils.addCoordsNoPrec(this.origin, selection.getOrigin()),
				end = selection.getCurrent(),
				quarter = selection.getQuarter();

			if (quarter === 1 || quarter === 4) {
				return coord >= origin[0] && coord <= end[0];
			} else if (quarter === 2 || quarter === 3) {
				return coord <= origin[0] && coord >= end[0];
			}
		}

		/**
		* Iterates over structure array and changes alignment of each selected structure.
		* @param {String} alignment - associated with alignment direction ("up", "down", "left", "right")
		* @param {Number} coord - the most extreme coordinate (e.g. uppermost, rightmost, etc.)
		* @returns {Boolean} true if position of any structure was changed
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
		}

		// updates coords of aromatics if any exists
		function updateArom(d, atom) {
			angular.forEach(this.decorate.aromatic, function (arom) {
				var equal = Utils.compareFloats(arom.fromWhich[0], atom.getCoords("x"), 3)
					&& Utils.compareFloats(arom.fromWhich[1], atom.getCoords("y"), 3);
				if (equal) {
					arom.fromWhich = Utils.addCoordsNoPrec(arom.fromWhich, d);
					arom.coords = Utils.addCoordsNoPrec(arom.coords, d);
				}
			});
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

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveFlags", DrawChemDirectiveFlags);

	DrawChemDirectiveFlags.$inject = [];

	function DrawChemDirectiveFlags() {

		var service = {};

    service.mouseFlags = {
      downAtomCoords: undefined,
			downAtomObject: undefined,
      downMouseCoords: undefined,
      movedOnEmpty: false,
      mouseDown: false,
      downOnAtom: false
    };

		service.customLabel = "";

		service.focused = false;

    service.selected = "";

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveMouseActions", DrawChemDirectiveMouseActions);

	DrawChemDirectiveMouseActions.$inject = [
    "DrawChemDirectiveFlags",
    "DrawChemDirectiveUtils",
    "DrawChemShapes",
    "DrawChemCache",
    "DrawChemConst",
    "DCLabel",
		"DCStructure",
		"DCSelection"
  ];

	function DrawChemDirectiveMouseActions(Flags, Utils, Shapes, Cache, Const, DCLabel, DCStructure, DCSelection) {

		var service = {},
      Label = DCLabel.Label,
			Selection = DCSelection.Selection,
			Structure = DCStructure.Structure,
      mouseFlags = Flags.mouseFlags;

    service.doOnMouseDown = function ($event, scope, element) {
      var elem;
			// if button other than left was used
      if ($event.which !== 1) { return undefined; }
			// set mouse coords
      mouseFlags.downMouseCoords = Utils.innerCoords(element, $event);
			// set flag
      mouseFlags.mouseDown = true;

			// check if the event occurred on an atom
			// if content is not empty and (label is selected or structure is selected or delete is selected)
			// otherwise there is no necessity for checking this
			if (!Utils.isContentEmpty() &&
						(
							Flags.selected === "label"
							|| Flags.selected === "customLabel"
							|| Flags.selected === "structure"
						)
					) {
        // if content is not empty
        if ($event.target.nodeName === "tspan") {
          elem = angular.element($event.target).parent();
          mouseFlags.downMouseCoords = [elem.attr("atomx"), elem.attr("atomy")];
        }
        checkIfDownOnAtom();
      }

      function checkIfDownOnAtom() {
				var withinObject = Shapes.isWithin(Cache.getCurrentStructure(), mouseFlags.downMouseCoords);
        mouseFlags.downAtomCoords = withinObject.absPos;
				mouseFlags.downAtomObject = withinObject.foundAtom;
        if (typeof withinObject.foundAtom !== "undefined") {
          // set flag if atom was found
          mouseFlags.downOnAtom = true;
        }
      }
    }

    service.doOnMouseUp = function ($event, scope, element) {
      var structure, mouseCoords = Utils.innerCoords(element, $event), i;

			// if button other than left was released do nothing
			// if selected flag is empty do nothing
      if ($event.which !== 1 || Flags.selected === "") {
				Utils.resetMouseFlags();
				return undefined;
			}

			if (Flags.selected === "delete") {
				structure = deleteFromStructure();
			} else if (Flags.selected === "select") {
				structure = makeSelection(mouseCoords);
				structure.getStructure().pop();
			} else if (Flags.selected === "moveStructure") {
				structure = moveStructure(mouseCoords);
			} else if (Flags.selected === "arrow") {
				// if arrow was selected
				// if content is empty or atom was not found
				structure = addArrowOnEmptyContent();
			} else if (mouseFlags.downOnAtom && (Flags.selected === "label" || Flags.selected === "customLabel")) {
        // if atom has been found and label is selected
        structure = modifyLabel();
      } else if (mouseFlags.downOnAtom && Flags.selected === "structure") {
        // if atom has been found and structure has been selected
        structure = modifyOnNonEmptyContent(scope, mouseCoords, false);
      } else {
				// if content is empty or atom was not found
        structure = addStructureOnEmptyContent();
      }

      if (typeof structure !== "undefined") {
        // if the structure has been successfully set to something
				// then add it to Cache and draw it
        Cache.addStructure(structure);
        Utils.drawStructure(structure);
      }
			// reset mouse flags at the end
      Utils.resetMouseFlags();

			// checks if mouseup occurred on an atom and modifies the structure accordingly
			function deleteFromStructure() {
				if (!Utils.isContentEmpty()) {
					return Utils.deleteFromStructure(
						Cache.getCurrentStructure(),
						mouseCoords
					);
				}
			}

      function modifyLabel() {
				// copy structure from Cache
        var structure = angular.copy(Cache.getCurrentStructure()),
					// find the atom object in the new structure
          atom = Shapes.isWithin(structure, mouseFlags.downMouseCoords).foundAtom,
          currentLabel = atom.getLabel();
				// set Label object
				// either predefined or custom
        if (Flags.selected === "label") {
          atom.setLabel(angular.copy(scope.chosenLabel));
        } else if (Flags.selected === "customLabel") {
          atom.setLabel(new Label(Flags.customLabel, 0));
        }

				// if atom object already has a label on it
				// then change its direction on mouseup event
        if (typeof currentLabel !== "undefined") {
          if (currentLabel.getMode() === "lr") {
            atom.getLabel().setMode("rl");
          } else if (currentLabel.getMode() === "rl") {
            atom.getLabel().setMode("lr");
          }
        }
        return structure;
      }

			function addArrowOnEmptyContent() {
				var structure, arrow, newCoords;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					// new Structure object has to be created
					structure = new Structure();
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// set origin of the Structure object (which may be different from current mouse position)
						structure.setOrigin(mouseFlags.downMouseCoords);
						// choose appropriate arrow from ArrowCluster object
						arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
						// as a reminder: Structure object has origin with an absolute value,
						// but each object in its structures array has origin in relation to this absolute value;
						// first object in this array has therefore always coords [0, 0]
						arrow.setOrigin([0, 0]);
					} else {
						// if mousemove event didn't occur, assume mouse coords from this (mouseup) event
						structure.setOrigin(mouseCoords);
						// get default arrow
						arrow = angular.copy(scope.chosenArrow.getDefault());
						// calculate and set coords
						newCoords = Utils.subtractCoords(mouseCoords, structure.getOrigin());
						arrow.setOrigin(newCoords);
					}
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// set origin of the Structure object (which may be different from current mouse position)
						arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
					} else {
						// otherwise get default arrow
						arrow = angular.copy(scope.chosenArrow.getDefault());
					}
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					// calculate and set coords
					arrow.setOrigin(newCoords);
				}
				// add Arrow object to the structures array in the Structure object
				structure.addToStructures(arrow);
				// return Structure object
				return structure;
			}

			function addStructureOnEmptyContent() {
				var structure, structureAux, newCoords, bond;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// choose an appropriate Structure object from the StructureCluster object
						structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
						// and set its origin (which may be different from current mouse position)
						structure.setOrigin(mouseFlags.downMouseCoords);
						if (structure.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structure.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: [0, 0],
								coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
							});
						}
					} else {
						// otherwise get default Structure object
						structure = angular.copy(scope.chosenStructure.getDefault());
						// and set its origin
						structure.setOrigin(mouseCoords);
						if (structure.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structure.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: [0, 0],
								coords: [mouseCoords[0] + bond[0], mouseCoords[1] + bond[1]]
							});
						}
					}
				} else {
					// when the content is not empty
					// Structure object already exists,
					// so get it from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// calaculate new coords
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// choose an appropriate Structure object from the StructureCluster object
						structureAux = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
						if (structureAux.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structureAux.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: angular.copy(newCoords),
								coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
							});
						}
					} else {
						// otherwise get default
						structureAux = angular.copy(scope.chosenStructure.getDefault());
						if (structureAux.isAromatic()) {
							// if the chosen Structure object is aromatic,
							// then add appropriate flag to the original Structure object
							bond = Const.getBondByDirection(structureAux.getName()).bond;
							structure.addDecorate("aromatic", {
								fromWhich: angular.copy(newCoords),
								coords: [mouseCoords[0] + bond[0], mouseCoords[1] + bond[1]]
							});
						}
					}
					// extract the first object from structures array and set its origin
					structureAux.getStructure(0).setCoords(newCoords);
					// add to the original Structure object
					structure.addToStructures(structureAux.getStructure(0));
				}
				return structure;
			}
    }

    service.doOnMouseMove = function ($event, scope, element) {
      var mouseCoords = Utils.innerCoords(element, $event), structure;

      if (!mouseFlags.mouseDown || Flags.selected === "label" || Flags.selected === "labelCustom" || Flags.selected === "") {
				// if mousedown event did not occur, then do nothing
        // if label is selected or nothing is selected, then also do nothing
        return undefined;
      }

			if (Flags.selected === "select") {
				structure = makeSelection(mouseCoords);
			} else if (Flags.selected === "moveStructure") {
				structure = moveStructure(mouseCoords);
			} else if (Flags.selected === "arrow") {
        // if an atom has not been found but the mouse is still down
				// the content is either empty or the mousedown event occurred somewhere outside of the current Structure object
        structure = addArrowOnEmptyContent();
      } else if (mouseFlags.downOnAtom) {
        // if an atom has been found
        structure = modifyOnNonEmptyContent(scope, mouseCoords, true);
      } else if (Flags.selected === "structure") {
        // if an atom has not been found but the mouse is still down
				// the content is either empty or the mousedown event occurred somewhere outside of the current Structure object
        structure = addStructureOnEmptyContent();
      }

			if (typeof structure !== "undefined") {
				// if the structure has been successfully set to something
				// then draw it
				Utils.drawStructure(structure);
			}

			function addArrowOnEmptyContent() {
				var structure, arrow, newCoords;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					// new Structure object has to be created
					structure = new Structure();
					// set origin of the Structure object (which may be different from current mouse position)
					structure.setOrigin(mouseFlags.downMouseCoords);
					// choose appropriate arrow from ArrowCluster object
					arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
					// as a reminder: Structure object has origin with an absolute value,
					// but each object in its structures array has origin in relation to this absolute value;
					// first object in this array has therefore always coords [0, 0]
					arrow.setOrigin([0, 0]);
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// choose appropriate arrow from ArrowCluster object
					arrow = angular.copy(scope.chosenArrow.getArrow(mouseCoords, mouseFlags.downMouseCoords));
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					// calculate and set coords
					arrow.setOrigin(newCoords);
				}
				// add Arrow object to the structures array in the Structure object
				structure.addToStructures(arrow);
				mouseFlags.movedOnEmpty = true;
				// return Structure object
				return structure;
			}

			function addStructureOnEmptyContent() {
				var structure, structureAux, newCoords, bond;
				if (Utils.isContentEmpty()) {
					// if the content is empty
					structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
					// set its origin (which may be different from current mouse position)
					structure.setOrigin(mouseFlags.downMouseCoords);
					if (structure.isAromatic()) {
						// if the chosen Structure object is aromatic,
						// then add appropriate flag to the original Structure object
						bond = Const.getBondByDirection(structure.getName()).bond;
						structure.addDecorate("aromatic", {
							fromWhich: angular.copy(newCoords),
							coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
						});
					}
				} else {
					// when the content is not empty, a Structure object already exists,
					// so get it from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// calaculate new coords
					newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
					// choose an appropriate Structure object from the StructureCluster object
					structureAux = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
					if (structureAux.isAromatic()) {
						// if the chosen Structure object is aromatic,
						// then add appropriate flag to the original Structure object
						bond = Const.getBondByDirection(structureAux.getName()).bond;
						structure.addDecorate("aromatic", {
							fromWhich: angular.copy(newCoords),
							coords: [mouseFlags.downMouseCoords[0] + bond[0], mouseFlags.downMouseCoords[1] + bond[1]]
						});
					}
					// extract the first object from structures array and set its origin
					structureAux.getStructure(0).setCoords(newCoords);
					// add to the original Structure object
					structure.addToStructures(structureAux.getStructure(0));
				}
				mouseFlags.movedOnEmpty = true;
				return structure;
			}
    }

		return service;

		function modifyOnNonEmptyContent(scope, mouseCoords, move) {
			return Utils.modifyStructure(
				Cache.getCurrentStructure(),
				scope.chosenStructure,
				mouseCoords,
				mouseFlags.downAtomCoords,
				move
			);
		}

		function moveStructure(mouseCoords) {
			var structure, moveDistance;
			if (!Utils.isContentEmpty()) {
				// if the content is non-empty
				structure = angular.copy(Cache.getCurrentStructure());
				moveDistance = Utils.subtractCoords(mouseCoords, mouseFlags.downMouseCoords);
				structure.moveStructureTo("mouse", moveDistance);
			}
			return structure;
		}

		function makeSelection(mouseCoords) {
			var structure, selection, newCoords, width, height;
			if (Utils.isContentEmpty()) {
				// if the content is empty
				// new Structure object has to be created
				structure = new Structure();
				// set origin of the Structure object (which may be different from current mouse position)
				structure.setOrigin(mouseFlags.downMouseCoords);
				selection = new Selection([0, 0], mouseCoords);
			} else {
				// if the content is not empty, a Structure object already exists
				// so get Structure object from Cache
				structure = angular.copy(Cache.getCurrentStructure());
				newCoords = Utils.subtractCoords(mouseFlags.downMouseCoords, structure.getOrigin());
				selection = new Selection(newCoords, mouseCoords);
			}
			// checks to which 'quarter' the selection rect belongs (downMouseCoords as the beginning of the coordinate system)
			width = mouseCoords[0] - mouseFlags.downMouseCoords[0];
			height = mouseCoords[1] - mouseFlags.downMouseCoords[1];
			if (width > 0 && height < 0) { selection.setQuarter(1); }
			if (width < 0 && height < 0) { selection.setQuarter(2); }
			if (width < 0 && height > 0) { selection.setQuarter(3); }
			structure.select(selection);
			// add Arrow object to the structures array in the Structure object
			structure.addToStructures(selection);
			// return Structure object
			return structure;
		}
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveUtils", DrawChemDirectiveUtils);

	DrawChemDirectiveUtils.$inject = [
		"DrawChemShapes",
		"DrawChemCache",
		"DrawChemDirectiveFlags"
	];

	function DrawChemDirectiveUtils(Shapes, Cache, Flags) {

		var service = {};

		/**
		 * Draws the specified structure.
		 * @params {Structure} structure - a Structure object to draw.
		 */
		service.drawStructure = function (structure) {
			var drawn = "";
			drawn = Shapes.draw(structure, "cmpd1");
			Cache.setCurrentSvg(drawn.wrap("full", "g").wrap("full", "svg").elementFull);
			return drawn;
		};

		/**
		 * Sets all boolean values to false and non-boolean to undefined.
		 * @params {Object} flags - an object containing flags (as mix of boolean and non-boolean values)
		 */
		service.resetMouseFlags = function () {
			angular.forEach(Flags.mouseFlags, function (value, key) {
				if (typeof value === "boolean") {
					Flags.mouseFlags[key] = false;
				} else {
					Flags.mouseFlags[key] = undefined;
				}
			});
		};

		/**
		 * Subtracts the coords in the second array from the first array.
		 * @param {Number[]} arr1 - first array
		 * @param {Number[]} arr2 - second array
		 * @returns {Number[]}
		 */
		service.subtractCoords = function (arr1, arr2) {
			return [arr1[0] - arr2[0], arr1[1] - arr2[1]];
		}

		/**
		 * Checks if the canvas is empty.
		 * @returns {Boolean}
		 */
		service.isContentEmpty = function isContentEmpty() {
			return Cache.getCurrentStructure() === null;
		};

		/**
		 * Calculates the coordinates of the mouse pointer during an event.
		 * Takes into account the margin of the enclosing div.
		 * @params {Event} $event - an Event object
		 * @returns {Number[]}
		 */
		service.innerCoords = function (element, $event) {
			var content = element.find("dc-content")[0],
				coords = [
					parseFloat(($event.clientX - content.getBoundingClientRect().left - 2).toFixed(2)),
					parseFloat(($event.clientY - content.getBoundingClientRect().top - 2).toFixed(2))
				];
			return coords;
		};

		/**
		 * Modifies the specified structure by adding a new structure to it.
		 * @params {Structure} structure - a Structure object to modify,
		 * @params {Structure} chosenStructure - a Structure object to add,
		 * @params {Number[]} clickCoords - coordinates of the mouse pointer,
		 * @params {Number[]} downAtomCoords - coordinates of an atom on which 'mousedown' occurred,
		 * @params {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (structure, chosenStructure, mouseCoords, downAtomCoords, mouseDownAndMove) {
			return Shapes.modifyStructure(
				angular.copy(structure),
				angular.copy(chosenStructure),
				mouseCoords,
				downAtomCoords,
				mouseDownAndMove
			);
		};

		/**
		 * Looks for an atom and deletes it.
		 * @params {Structure} structure - a Structure object to modify,
		 * @params {Number[]} mouseCoords - coordinates of the mouse pointer (where 'mouseup occurred')
		 * @returns {Structure}
		 */
		service.deleteFromStructure = function (structure, mouseCoords) {
			return Shapes.deleteFromStructure(
				angular.copy(structure),
				mouseCoords
			);
		};

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);

	DrawChemEditor.$inject = [
		"DrawChemPaths",
		"DrawChemCache",
		"DrawChemDirectiveFlags",
		"DrawChemDirectiveUtils",
		"DrawChemDirectiveMouseActions",
		"DrawChemMenuButtons",
		"$sce"
	];

	function DrawChemEditor(Paths, Cache, Flags, Utils, MouseActions, MenuButtons, $sce) {
		return {
			template: "<div ng-include=\"getEditorUrl()\"></div>",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				scope.getEditorUrl = function () {
					var editorHtml = attrs.dcModal === "" ? "draw-chem-editor-modal.html": "draw-chem-editor.html";
					return Paths.getPath() + editorHtml;
				};

				scope.pathToSvg = Paths.getPathToSvg();

				// Sets width and height of the dialog box based on corresponding attributes.
				scope.dialogStyle = {};

				if (attrs.width) {
					scope.dialogStyle.width = attrs.width;
				}
				if (attrs.height) {
					scope.dialogStyle.height = attrs.height;
				}

				scope.setFocus = function () {
					Flags.focused = true;
				};

				scope.unsetFocus = function () {
					Flags.focused = false;
				};

				// Returns content which will be bound in the dialog box.
				scope.content = function () {
					var svg = $sce.trustAsHtml(Cache.getCurrentSvg());
					return svg;
				};

				// Adds all buttons to the scope
				MenuButtons.addButtonsToScope(scope);

				/***** Mouse Events *****/
				scope.doOnMouseDown = function ($event) {
					try {
						MouseActions.doOnMouseDown($event, scope, element);
					} catch (e) {
						console.log(e);
					}
				};

				scope.doOnMouseUp = function ($event) {
					try {
						MouseActions.doOnMouseUp($event, scope, element);
					} catch (e) {
						console.log(e);
					}
				};

				scope.doOnMouseMove = function ($event) {
					try {
						MouseActions.doOnMouseMove($event, scope, element);
					} catch (e) {
						console.log(e);
					}
				};
			}
		}
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemCache", DrawChemCache);

	function DrawChemCache() {

		var service = {},
			namedStructures = {},
			cachedStructures = [{ structure: null, svg: "" }],
			structurePointer = 0,
			maxCapacity = 10;

		service.addStructure = function (structure) {
			if (structurePointer < cachedStructures.length - 1) {
				cachedStructures = cachedStructures.slice(0, structurePointer + 1);
			}
			cachedStructures.push({structure: structure, svg: ""});

			if (cachedStructures.length > 10) {
				cachedStructures.shift();
			}

			service.moveRightInStructures();
		};

		service.getCurrentPosition = function () {
			return structurePointer;
		}

		service.getStructureLength = function () {
			return cachedStructures.length;
		};

		service.getCurrentStructure = function () {
			return cachedStructures[structurePointer].structure;
		};

		service.getCurrentSvg = function () {
			return cachedStructures[structurePointer].svg;
		};

		service.setCurrentSvg = function (svg) {
			cachedStructures[structurePointer].svg = svg;
		};

		service.moveLeftInStructures = function () {
			if (structurePointer > 0) {
				structurePointer -= 1;
			}
		};

		service.moveRightInStructures = function () {
			if (structurePointer < cachedStructures.length - 1) {
				structurePointer += 1;
			}
		}

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemConst", DrawChemConst);

	function DrawChemConst() {

		var service = {};

		service.SET_BOND_LENGTH;

		service.setBondLength = function (length) {
			service.SET_BOND_LENGTH = length;
			init();
		}

		init();

		function init() {

			var calcBond, calcBondAux1, calcBondAux2, calcBondAux3;

			// the default bond length
			service.BOND_LENGTH = service.SET_BOND_LENGTH || 20;

			calcBond = parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2));
			calcBondAux1 = parseFloat((service.BOND_LENGTH * Math.sin(Math.PI / 12)).toFixed(2));
			calcBondAux2 = parseFloat((service.BOND_LENGTH * Math.cos(Math.PI / 12)).toFixed(2));
			calcBondAux3 = parseFloat((service.BOND_LENGTH * Math.sin(Math.PI / 4)).toFixed(2));

			// proportion of the bond width to bond length
			// 0.04 corresponds to the ACS settings in ChemDraw, according to
			// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
			service.WIDTH_TO_LENGTH = 0.04;

			// the default r of an aromatic circle
			service.AROMATIC_R = service.BOND_LENGTH * 0.45;

			// the default distance between two parallel bonds in double bonds (as a percent of the bond length);
			service.BETWEEN_DBL_BONDS = 0.065;

			// the default distance between two furthest bonds in triple bonds (as a percent of the bond length);
			service.BETWEEN_TRP_BONDS = 0.1;

			// the default arrow size (as a percent of the bond length);
			service.ARROW_SIZE = 0.065;

			// the default strating point of the arrow head (as a percent of the bond length);
			service.ARROW_START = 0.85;

			// the default bond width
			service.BOND_WIDTH = (service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2);

			// the default r of a circle around an atom
			service.CIRC_R = service.BOND_LENGTH * 0.12;

			// all bonds (starting from bond in north direction, going clock-wise), every 15 deg
			service.BOND_N = [0, -service.BOND_LENGTH];
			service.BOND_N_NE1 = [calcBondAux1, -calcBondAux2];
			service.BOND_NE1 = [service.BOND_LENGTH / 2, -calcBond];
			service.BOND_NE1_NE2 = [calcBondAux3, -calcBondAux3];
			service.BOND_NE2 = [calcBond, -service.BOND_LENGTH / 2];
			service.BOND_NE2_E = [calcBondAux2, -calcBondAux1];
			service.BOND_E = [service.BOND_LENGTH, 0];
			service.BOND_E_SE1 = [calcBondAux2, calcBondAux1];
			service.BOND_SE1 = [calcBond, service.BOND_LENGTH / 2],
			service.BOND_SE1_SE2 = [calcBondAux3, calcBondAux3];
			service.BOND_SE2 = [service.BOND_LENGTH / 2, calcBond];
			service.BOND_SE2_S = [calcBondAux1, calcBondAux2];
			service.BOND_S = [0, service.BOND_LENGTH];
			service.BOND_S_SW1 = [-calcBondAux1, calcBondAux2];
			service.BOND_SW1 = [-service.BOND_LENGTH / 2, calcBond];
			service.BOND_SW1_SW2 = [-calcBondAux3, calcBondAux3];
			service.BOND_SW2 = [-calcBond, service.BOND_LENGTH / 2];
			service.BOND_SW2_W = [-calcBondAux2, calcBondAux1];
			service.BOND_W = [-service.BOND_LENGTH, 0];
			service.BOND_W_NW1 = [-calcBondAux2, -calcBondAux1];
			service.BOND_NW1 = [-calcBond, -service.BOND_LENGTH / 2];
			service.BOND_NW1_NW2 = [-calcBondAux3, -calcBondAux3];
			service.BOND_NW2 = [-service.BOND_LENGTH / 2, -calcBond];
			service.BOND_NW2_N = [-calcBondAux1, -calcBondAux2];

			// bonds as array
			service.BONDS = [
				{ direction: "N", bond: service.BOND_N },
				{ direction: "NE1", bond: service.BOND_NE1 },
				{ direction: "NE2", bond: service.BOND_NE2 },
				{ direction: "E", bond: service.BOND_E },
				{ direction: "SE1", bond: service.BOND_SE1 },
				{ direction: "SE2", bond: service.BOND_SE2 },
				{ direction: "S", bond: service.BOND_S },
				{ direction: "SW1", bond: service.BOND_SW1 },
				{ direction: "SW2", bond: service.BOND_SW2 },
				{ direction: "W", bond: service.BOND_W },
				{ direction: "NW1", bond: service.BOND_NW1 },
				{ direction: "NW2", bond: service.BOND_NW2 }
			];

			service.BONDS_AUX = [
				{ direction: "N_NE1", bond: service.BOND_N_NE1 },
				{ direction: "NE1_NE2", bond: service.BOND_NE1_NE2 },
				{ direction: "NE2_E", bond: service.BOND_NE2_E },
				{ direction: "E_SE1", bond: service.BOND_E_SE1 },
				{ direction: "SE1_SE2", bond: service.BOND_SE1_SE2 },
				{ direction: "SE2_S", bond: service.BOND_SE2_S },
				{ direction: "S_SW1", bond: service.BOND_S_SW1 },
				{ direction: "SW1_SW2", bond: service.BOND_SW1_SW2 },
				{ direction: "SW2_W", bond: service.BOND_SW2_W },
				{ direction: "W_NW1", bond: service.BOND_W_NW1 },
				{ direction: "NW1_NW2", bond: service.BOND_NW1_NW2 },
				{ direction: "NW2_N", bond: service.BOND_NW2_N }
			];

			service.getBondByDirection = function (direction) {
				var i;
				for (i = 0; i < service.BONDS.length; i += 1) {
					if (service.BONDS[i].direction === direction) {
						return service.BONDS[i];
					}
				}
			}
		}

		return service;
	}
})();

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

(function () {
  "use strict";
  angular.module("mmAngularDrawChem")
    .directive("dcShortcuts", DcShortcuts);

  DcShortcuts.$inject = [
    "DrawChem",
    "DrawChemKeyShortcuts",
    "DrawChemDirectiveFlags",
    "$rootScope"
  ];

  function DcShortcuts(DrawChem, Shortcuts, Flags, $rootScope) {
    return {
      restrict: "A",
      link: function (scope, element) {

        element.bind("keydown", function ($event) {
          if (DrawChem.showEditor() && (!Flags.focused || $event.ctrlKey)) {
            // should prevent default only if editor is shown and
            // either custom label field is NOT focused
            // or ctrl/shift key is involved
            $event.preventDefault();
            Shortcuts.down($event.keyCode);
          }
        });

        element.bind("keyup", function ($event) {
          if (DrawChem.showEditor() && (!Flags.focused || $event.ctrlKey)) {
            // should prevent default only if editor is shown and
            // either custom label field is NOT focused
            // or ctrl/shift key is involved
            $event.preventDefault();
            Shortcuts.released($event.keyCode);
            $rootScope.$digest();
          }
        });

        function ctrlOrShift($event) {
          return $event.ctrlKey || $event.shiftKey;
        }
      }
    }
  }
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemKeyShortcuts", DrawChemKeyShortcuts);

	DrawChemKeyShortcuts.$inject = ["DrawChemActions", "DrawChemEdits"];

	function DrawChemKeyShortcuts(Actions, Edits, Moves) {

		var keysPredefined = {
				16: "shift",
        17: "ctrl",
				37: "leftarrow",
				38: "uparrow",
				39: "rightarrow",
				40: "downarrow",
				46: "del",
				65: "a",
        68: "d",
        69: "e",
        70: "f",
        81: "q",
				82: "r",
				83: "s",
        84: "t",
				87: "w",
        90: "z"
      },
      keyCombination = {},
      service = {};

		angular.forEach(Actions.actions, function (action) {
			if (typeof action.shortcut !== "undefined") {
				registerShortcut(action.shortcut, action.action);
			}
		});

		angular.forEach(Edits.edits, function (edit) {
			if (typeof edit.shortcut !== "undefined") {
				if (edit.shortcut === "arrows") {
					registerShortcut("leftarrow", edit.shortcutBind.left);
					registerShortcut("uparrow", edit.shortcutBind.up);
					registerShortcut("rightarrow", edit.shortcutBind.right);
					registerShortcut("downarrow", edit.shortcutBind.down);
				} else {
					registerShortcut(edit.shortcut, edit.action);
				}
			}
		});

    service.down = function (keyCode) {
      setKey(keyCode, true);
    }

    service.released = function (keyCode) {
      fireEvent();
      setKey(keyCode, false);
    }

		return service;

    function registerShortcut(combination, cb) {
      var i,
        keys,
        currentCombination = { cb: cb, keys: {} };

			if (combination.indexOf(" + ") >= 0) {
				keys = combination.split(" + ");
				for (i = 0; i < keys.length; i += 1) {
	        currentCombination.keys[keys[i]] = false;
	      }
			} else {
				keys = combination;
				currentCombination.keys[keys] = false;
			}

      keyCombination[combination] = currentCombination;
    }

    function setKey(keyCode, type) {
      var keyInvolved = keysPredefined[keyCode];
      if (typeof keyInvolved !== "undefined") {
        angular.forEach(keyCombination, function (value, key) {
          if (typeof value.keys[keyInvolved] !== "undefined") {
            value.keys[keyInvolved] = type;
          }
        });
      }
    }

    function fireEvent(keyCode) {
      angular.forEach(keyCombination, function (value, key) {
        if(allWereDown(value.keys)) {
          value.cb();
        }
      });

      function allWereDown(keys) {
        var result = typeof keys !== "undefined";
        angular.forEach(keys, function (value, key) {
          if (!value) { result = false; }
        });
        return result;
      }
    }
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemActions", DrawChemActions);

	DrawChemActions.$inject = [
		"DrawChemCache",
		"DrawChem",
		"DrawChemShapes",
		"DrawChemDirectiveUtils"
	];

	function DrawChemActions(DrawChemCache, DrawChem, DrawChemShapes, DrawChemDirUtils) {

		var service = {};

		/**
		 * Reverses the recent 'undo' action.
		 */
		service.forward = function () {
			DrawChemCache.moveRightInStructures();
			if (DrawChemCache.getCurrentStructure() === null) {
				DrawChem.clearContent();
			} else {
				DrawChemDirUtils.drawStructure(DrawChemCache.getCurrentStructure());
			}
		};

		/**
		 * Closes the editor.
		 */
		service.close = function () {
			DrawChem.closeEditor();
		};

		/**
		 * Clears the content.
		 */
		service.clear = function () {
			DrawChemCache.addStructure(null);
			DrawChemCache.setCurrentSvg("");
		};

		/**
		 * Undoes a change associated with the recent 'mouseup' event.
		 */
		service.undo = function () {
			DrawChemCache.moveLeftInStructures();
			if (DrawChemCache.getCurrentStructure() === null) {
				DrawChem.clearContent();
			} else {
				DrawChemDirUtils.drawStructure(DrawChemCache.getCurrentStructure());
			}
		};

		/**
		 * Transfers the content.
		 */
		service.transfer = function () {
			var structure = DrawChemCache.getCurrentStructure(),
				shape, attr, content = "";

			if (structure !== null) {
				shape = DrawChemShapes.draw(structure, "transfer");
				attr = {
					"viewBox": (shape.minMax.minX - 20).toFixed(2) + " " +
						(shape.minMax.minY - 20).toFixed(2) + " " +
						(shape.minMax.maxX - shape.minMax.minX + 40).toFixed(2) + " " +
						(shape.minMax.maxY - shape.minMax.minY + 40).toFixed(2),
					"height": "100%",
					"width": "100%",
					"xmlns": "http://www.w3.org/2000/svg",
					"xmlns:xlink": "http://www.w3.org/1999/xlink"
				};
				content = shape.wrap("mini", "g").wrap("mini", "svg", attr).elementMini;
			}
			DrawChem.setContent(content);
			DrawChem.setStructure(structure);
			DrawChem.transferContent();
		};

		service.actions = {
				"undo": {
					shortcut: "ctrl + z",
					id: "undo",
					action: service.undo
				},
				"forward": {
					shortcut: "ctrl + f",
					id: "forward",
					action: service.forward
				},
				"transfer": {
					shortcut: "ctrl + t",
					id: "transfer",
					action: service.transfer
				},
				"clear": {
					shortcut: "ctrl + e",
					id: "clear",
					action: service.clear
				},
				"close": {
					shortcut: "ctrl + q",
					id: "close",
					action: service.close
				}
		};

		return service;
	}
})();

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

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemEdits", DrawChemEdits);

	DrawChemEdits.$inject = ["DrawChemCache", "DrawChemDirectiveUtils", "DrawChemDirectiveFlags"];

	function DrawChemEdits(Cache, Utils, Flags) {

		var service = {};

		/**
		* Deletes all structures marked as selected.
		*/
    service.deleteFromStructure = function () {
			Flags.selected = "delete";
    };

		/**
		* Deletes all structures marked as selected.
		*/
    service.deleteSelected = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null) {
				structure.deleteSelected();
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}
    };

		/**
		* Marks all structures as selected.
		*/
    service.select = function () {
			service.deselectAll();
			Flags.selected = "select";
    };

		/**
		* Marks all structures as selected.
		*/
    service.selectAll = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null) {
				structure.selectAll();
				Cache.addStructure(structure);
			  Utils.drawStructure(structure);
			}
    };

		/**
		* Deselects all structures.
		*/
		service.deselectAll = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null) {
				structure.deselectAll();
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}
    };

		/**
		* Aligns all structures to the uppermost point.
		*/
		service.alignUp = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignUp(minMax.minY);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Aligns all structures to the lowermost point.
		*/
		service.alignDown = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignDown(minMax.maxY);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Aligns all structures to the rightmost point.
		*/
		service.alignRight = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignRight(minMax.maxX);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Aligns all structures to the rightmost point.
		*/
		service.alignLeft = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignLeft(minMax.minX);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Moves structure.
		*/
    service.moveStructure = function () {
			Flags.selected = "moveStructure";
			return {
				left: moveStructureTo("left"),
				up: moveStructureTo("up"),
				right: moveStructureTo("right"),
				down: moveStructureTo("down")
			};

			function moveStructureTo(dir) {
				return function () {
					var structure = angular.copy(Cache.getCurrentStructure());
					if (structure !== null) {
						structure.moveStructureTo(dir);
						Cache.addStructure(structure);
						Utils.drawStructure(structure);
					}
				};
			}
    };

		service.edits = {
			"move": {
				action: service.moveStructure,
				id: "move",
				shortcut: "arrows",
				shortcutBind: {
					left: service.moveStructure().left,
					up: service.moveStructure().up,
					right: service.moveStructure().right,
					down: service.moveStructure().down
				}
			},
			"select": {
				action: service.select,
				id: "select",
				shortcut: "shift + s"
			},
			"select all": {
				action: service.selectAll,
				id: "select-all",
				shortcut: "shift + a"
			},
			"deselect all": {
				action: service.deselectAll,
				id: "deselect-all",
				shortcut: "shift + d"
			},
			"align up": {
				action: service.alignUp,
				id: "align-up",
				shortcut: "shift + q"
			},
			"align down": {
				action: service.alignDown,
				id: "align-down",
				shortcut: "shift + w"
			},
			"align right": {
				action: service.alignRight,
				id: "align-right",
				shortcut: "shift + r"
			},
			"align left": {
				action: service.alignLeft,
				id: "align-left",
				shortcut: "shift + e"
			},
			"delete selected": {
				action: service.deleteSelected,
				id: "delete-selected",
				shortcut: "del"
			},
			"delete": {
				action: service.deleteFromStructure,
				id: "delete",
			}
		};

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemGeomShapes", DrawChemGeomShapes);

	DrawChemGeomShapes.$inject = [];

	function DrawChemGeomShapes() {

		var service = {};

    service.todo = function () {

    };

		service.shapes = {
			"dummy": {
				action: service.todo
			}
		};

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemLabels", DrawChemLabels);

	DrawChemLabels.$inject = ["DCLabel", "DrawChemDirectiveFlags"];

	function DrawChemLabels(DCLabel, Flags) {

		var service = {},
      Label = DCLabel.Label;

		/**
		 * An array of Label objects containing all predefined labels.
		 */
		service.labels = {
			"oxygen": {
				action: createLabelAction("O", 2),
				id: "oxygen"
			},
			"sulfur": {
				action: createLabelAction("S", 2),
				id: "sulfur"
			},
			"phosphorus": {
				action: createLabelAction("P", 3),
				id: "phosphorus"
			},
			"nitrogen": {
				action: createLabelAction("N", 3),
				id: "nitrogen"
			},
			"carbon": {
				action: createLabelAction("C", 4),
				id: "carbon"
			},
			"fluorine": {
				action: createLabelAction("F", 1),
				id: "fluorine"
			},
			"chlorine": {
				action: createLabelAction("Cl", 1),
				id: "chlorine"
			},
			"bromine": {
				action: createLabelAction("Br", 1),
				id: "bromine"
			},
			"iodine": {
				action: createLabelAction("I", 1),
				id: "iodine"
			},
			"hydrogen": {
				action: createLabelAction("H", 1),
				id: "hydrogen"
			}
		};

		return service;

		function createLabelAction(label, hydrogens) {
			return function (scope) {
				scope.chosenLabel = new Label(label, hydrogens);
				Flags.selected = "label";
			}
		}
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemMenuButtons", DrawChemMenuButtons);

	DrawChemMenuButtons.$inject = [
    "DrawChemStructures",
		"DrawChemLabels",
    "DrawChemActions",
		"DrawChemEdits",
    "DrawChemArrows",
    "DrawChemGeomShapes",
    "DrawChemDirectiveFlags"
  ];

	function DrawChemMenuButtons(Structures, Labels, Actions, Edits, Arrows, Shapes, Flags) {

		var service = {};

    service.addButtonsToScope = function (scope) {
			var menu = {
				"Actions": {
					actions: Actions.actions
				},
				"Edit": {
					actions: Edits.edits
				},
				"Arrows": {
					actions: Arrows.arrows
				},
				"Shapes": {
					actions: Shapes.shapes
				},
				"Structures": {
					actions: Structures.structures
				},
				"Labels": {
					actions: Labels.labels
				}
			}

			scope.menu = {};

      // stores all actions related to Actions, Edit, Arrows, and Shapes menu items
      angular.forEach(menu, function (item, name) {
				scope.menu[name] = {
					actions: item.actions,
					scope: scope
				}
			});

      scope.chooseCustomLabel = function (text) {
				Flags.customLabel = text;
        Flags.selected = "customLabel";
      }
    }

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);

	DrawChemStructures.$inject = [
		"DrawChemConst",
		"DrawChemUtils",
		"DCStructure",
		"DCStructureCluster",
		"DCAtom",
		"DCBond",
		"DrawChemDirectiveFlags"
	];

	function DrawChemStructures(Const, Utils, DCStructure, DCStructureCluster, DCAtom, DCBond, Flags) {

		var service = {},
			Atom = DCAtom.Atom,
			Bond = DCBond.Bond,
			Structure = DCStructure.Structure,
			StructureCluster = DCStructureCluster.StructureCluster,
			BONDS = Const.BONDS;

		/**
		 * Generates benzene structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.benzene = function () {
			var cluster,
				name = "benzene",
				defs = generateRings(120, 6, "aromatic");

			cluster = new StructureCluster(name, defs);
			return cluster;
		};

		/**
		 * Generates cyclohexane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclohexane = function () {
			var cluster,
				name = "cyclohexane",
				defs = generateRings(120, 6);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates cyclopentane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclopentane = function () {
			var cluster,
				name = "cyclopentane",
				defs = generateRings(108, 5);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclopropane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclopropane = function () {
			var cluster,
				name = "cyclopropane",
				defs = generateRings(60, 3);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclobutane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclobutane = function () {
			var cluster,
				name = "cyclobutane",
				defs = generateRings(90, 4);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cycloheptane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cycloheptane = function () {
			var cluster,
				name = "cycloheptane",
				defs = generateRings(128.57, 7);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclooctane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclooctane = function () {
			var cluster,
				name = "cyclooctane",
				defs = generateRings(135, 8);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates a cyclononane structure in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.cyclononane = function () {
			var cluster,
				name = "cyclononane",
				defs = generateRings(140, 9);

			cluster = new StructureCluster(name, defs);

			return cluster;
		};

		/**
		 * Generates single bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.singleBond = function () {
			var cluster,
				multiplicity = "single",
				name = "single-bond",
				defs = generateBonds("single", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates double bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.doubleBond = function () {
			var cluster,
				multiplicity = "double",
				name = "double-bond",
				defs = generateBonds("double", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates triple bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.tripleBond = function () {
			var cluster,
				multiplicity = "triple",
				name = "triple-bond",
				defs = generateBonds("triple", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates wedge bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.wedgeBond = function () {
			var cluster,
				multiplicity = "single",
				name = "wedge-bond",
				defs = generateBonds("wedge", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Generates wedge bond in each of the defined directions.
		 * @returns {StructureCluster}
		 */
		service.dashBond = function () {
			var cluster,
				multiplicity = "single",
				name = "dash-bond",
				defs = generateBonds("dash", multiplicity);

			cluster = new StructureCluster(name, defs, multiplicity);

			return cluster;
		};

		/**
		 * Stores all predefined structures.
		 */
		service.structures = {
			"cyclopropane": {
				action: createStructureAction(service.cyclopropane),
				id: "cyclopropane",
				thumbnail: true
			},
			"cyclobutane": {
				action: createStructureAction(service.cyclobutane),
				id: "cyclobutane",
				thumbnail: true
			},
			"benzene": {
				action: createStructureAction(service.benzene),
				id: "benzene",
				thumbnail: true
			},
			"cyclohexane": {
				action: createStructureAction(service.cyclohexane),
				id: "cyclohexane",
				thumbnail: true
			},
			"cyclopentane": {
				action: createStructureAction(service.cyclopentane),
				id: "cyclopentane",
				thumbnail: true
			},
			"cycloheptane": {
				action: createStructureAction(service.cycloheptane),
				id: "cycloheptane",
				thumbnail: true
			},
			"cyclooctane": {
				action: createStructureAction(service.cyclooctane),
				id: "cyclooctane",
				thumbnail: true
			},
			"cyclononane": {
				action: createStructureAction(service.cyclononane),
				id: "cyclononane",
				thumbnail: true
			},
			"single bond": {
				action: createStructureAction(service.singleBond),
				id: "single-bond",
				thumbnail: true
			},
			"wedge bond": {
				action: createStructureAction(service.wedgeBond),
				id: "wedge-bond",
				thumbnail: true
			},
			"dash bond": {
				action: createStructureAction(service.dashBond),
				id: "dash-bond",
				thumbnail: true
			},
			"double bond": {
				action: createStructureAction(service.doubleBond),
				id: "double-bond",
				thumbnail: true
			},
			"triple bond": {
				action: createStructureAction(service.tripleBond),
				id: "triple-bond",
				thumbnail: true
			}
		};

		return service;

		function createStructureAction(cb) {
			return function (scope) {
				scope.chosenStructure = cb();
				Flags.selected = "structure";
			}
		}

		/**
		 * Generates a ring in each of the defined direction.
		 * @param {Number} deg - angle in degs between two bonds in the ring,
		 * @param {Number} size - size of the ring,
		 * @param {String} decorate - indicates decorate element (e.g. aromatic ring),
		 * @returns {Structure[]}
		 */
		function generateRings(deg, size, decorate) {
			var i, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				direction = BONDS[i].direction;
				result.push(genRing(direction, deg, size));
			}

			return result;

			/**
			 * Generates a ring.
			 * @param {String} direction - in which direction the ring will be generated,
			 * @param {Number} deg - angle in degs between two bonds in the ring,
			 * @param {Number} size - size of the ring,
			 * @returns {Structure}
			 */
			function genRing(direction, deg, size) {
				var firstAtom, nextAtom, structure,
					opposite = Atom.getOppositeDirection(direction),
					bond = Const.getBondByDirection(opposite).bond,
					rotVect = Utils.rotVectCCW(bond, deg / 2);

				firstAtom = new Atom([0, 0], [], "", []);
				nextAtom = new Atom(rotVect, [], "", []);
				firstAtom.addBond(new Bond("single", nextAtom));
				genAtoms(nextAtom, size);
				structure = new Structure(opposite, [firstAtom]);
				if (decorate === "aromatic") {
					structure.setAromatic();
				}

				return structure;

				/**
				 * Recursively generates atoms.
				 * @param {Atom} prevAtom - previous atom (the one to which new atom will be added),
				 * @param {Number} depth - current depth of the structure tree
				 */
				function genAtoms(prevAtom, depth) {
					var rotVect = Utils.rotVectCW(prevAtom.getCoords(), 180 - deg),
					  newAtom = new Atom(rotVect, [], "", []);
					if (depth === 1) { return undefined; }
					prevAtom.addBond(new Bond("single", newAtom));
					genAtoms(newAtom, depth - 1);
				}
			}
		}

		/**
		 * Generates single bonds in all defined directions.
		 * @param {String} type - bond type, e.g. 'single', 'double'.
		 * @returns {Structure[]}
		 */
		function generateBonds(type, multiplicity) {
			var i, bond, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				bond = BONDS[i].bond;
				direction = BONDS[i].direction;
				result.push(
					new Structure(
						direction,
						[
							new Atom([0, 0], [
								new Bond(type, new Atom(bond, [], "", [{ direction: Atom.getOppositeDirection(direction), type: multiplicity }]))
							], "")
						]
					)
				);
			}

			return result;
		}
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.provider("DrawChemPaths", DrawChemPathsProvider);
	
	function DrawChemPathsProvider() {
		var path = "",
			pathSvg = path + "svg";
		
		return {
			setPath: function (value) {
				path = value;
			},
			setPathSvg: function (value) {
				pathSvg = value;
			},
			$get: function () {
				return {
					getPath: function () {
						return path;
					},
					getPathToSvg: function () {
						return pathSvg;
					}
				};
			}
		};
	}
	
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemGenElements", DrawChemGenElements);

	DrawChemGenElements.$inject = ["DrawChemConst", "DrawChemUtils", "DCShape"];

	function DrawChemGenElements(Const, Utils, DCShape) {

		var service = {},
      BONDS_AUX = Const.BONDS_AUX,
      BOND_LENGTH = Const.BOND_LENGTH,
      AROMATIC_R = Const.AROMATIC_R;

    service.generateRects = function (rects, obj) {
      rects.forEach(function (rect) {
        var aux =
          "<rect class='" + rect.class +
            "' x='" + rect.rect[0].toFixed(2) +
            "' y='" + rect.rect[1].toFixed(2) +
            "' width='" + rect.rect[2].toFixed(2) +
            "' height='" + rect.rect[3].toFixed(2) +
          "'></rect>";
        obj.full += aux;
        obj.mini += aux;
      });
    };

    service.generatePaths = function (paths, obj) {
      paths.forEach(function (path) {
        var aux;
        if (typeof path.class !== "undefined") {
          aux = "<path class='" + path.class + "' d='" + path.line + "'></path>";
        } else {
          aux = "<path d='" + path.line + "'></path>";
        }
        obj.full += aux;
        obj.mini += aux;
      });
    };

    service.generateCircles = function (circles, obj) {
      circles.forEach(function (circle) {
        var aux = circle.selected ? "edit": "atom";
        obj.full +=
          "<circle class='" + aux +
            "' cx='" + circle.circle[0].toFixed(2) +
            "' cy='" + circle.circle[1].toFixed(2) +
            "' r='" + circle.circle[2].toFixed(2) +
          "'></circle>";
      });
    };

    service.generateLabels = function (labels, obj) {
      labels.forEach(function (label) {
        var aux =
          drawDodecagon(label) +
          "<text dy='0.2125em' " +
            "x='" + label.labelX.toFixed(2) + "' " +
            "y='" + label.labelY.toFixed(2) + "' " +
            "atomx='" + label.atomX.toFixed(2) + "' " +
            "atomy='" + label.atomY.toFixed(2) + "' " +
            "text-anchor='" + genTextAnchor(label.mode) + "' " +
          ">" + genLabel(label.label) + "</text>";
        obj.full += aux;
        obj.mini += aux;
      });
    };

    service.generateAromatics = function (input, obj) {
      var aromatics = input.getDecorate("aromatic");
      aromatics.forEach(function (arom) {
        obj.full += genArom(arom, "arom");
        obj.mini += genArom(arom, "tr-arom");
      });

      function genArom(arom, clazz) {
        return "<circle class='" + clazz + "' " +
          "cx='" + arom.coords[0].toFixed(2) + "' " +
          "cy='" + arom.coords[1].toFixed(2) + "' " +
          "r='" + AROMATIC_R.toFixed(2) + "' " +
          "></circle>";
      }
    }

    /**
    * Transforms output into an array of strings.
    * Basically, it translates each array of coordinates into its string representation.
    * @returns {String[]}
    */
    service.stringifyPaths = function (output) {
      var result = [], i, j, line, point, lineStr;
      for (i = 0; i < output.length; i += 1) {
        line = output[i];
        lineStr = { line: "" };
        for (j = 0; j < line.length; j += 1) {
          point = line[j];
          if (typeof point === "string") {
            if (point === "arrow" || point === "arrow-eq" || point === "wedge") {
              lineStr.class = point;
            } else {
              lineStr.line += point + " ";
            }
          } else if (typeof point[0] === "number") {
            lineStr.line += point[0].toFixed(2) + " " + point[1].toFixed(2) + " ";
          }
        }
        result.push(lineStr);
      }
      return result;
    };

		return service;

    function drawDodecagon(label) {
      var i, x, y, aux, factor,result = [];

      factor = 0.5 * label.height / BOND_LENGTH;
      for (i = 0; i < BONDS_AUX.length; i += 1) {
        x = BONDS_AUX[i].bond[0];
        y = BONDS_AUX[i].bond[1];
        result = result.concat(Utils.addCoordsNoPrec([label.atomX, label.atomY], [x, y], factor));
      }
      return "<polygon class='text' points='" + service.stringifyPaths([result])[0].line + "'></polygon>";
    }

    function genTextAnchor(mode) {
      if (mode === "rl") {
        return "end";
      } else if (mode === "lr") {
        return "start";
      } else {
        return "start";
      }
    }

    function genLabel(labelName) {
      var i, aux, isPreceded = false, output = "";
      for (i = 0; i < labelName.length; i += 1) {
        aux = labelName.substr(i, 1);
        if (Utils.isNumeric(aux)) {
          output += "<tspan class='sub' dy='" + DCShape.fontSize * 0.25 + "' >" + aux + "</tspan>";
          isPreceded = true;
        } else if (isPreceded) {
          output += "<tspan dy='-" + DCShape.fontSize * 0.25 + "' >" + aux + "</tspan>";
          isPreceded = false;
        } else {
          output += "<tspan>" + aux + "</tspan>";
        }
      }
      return output;
    }
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChem", DrawChem);
	
	function DrawChem() {
		
		var service = {},
			// at the beginning, the modal is hidden
			showModal = false,
			// an array accumulating contents from different 'instances' (pseudo-'instances', actually) of the editor
			instances = [],
			// currently active 'instance'
			currentInstance = {};
		
		/**
		 * Returns 'true' if the modal should be shown, 'false' otherwise.
		 * @public
		 * @returns {boolean}
		 */
		service.showEditor = function () {
			return showModal;
		}
		
		/**
		 * Runs the editor, i.e. shows the modal, fetches the editor 'instance', and assigns it to the currently active 'instance'.
		 * If the 'instance' does not exist, a new one is created.
		 * @public
		 * @param {string} name - name of the 'instance' with which the editor is to be opened
		 */
		service.runEditor = function (name) {
			var inst;
			showModal = true;
			if (!instanceExists(name)) {
				instances.push({
					name: name,
					content: "",
					structure: null
				});
			}
			inst = getInstance(name);
			currentInstance.name = inst.name;
			currentInstance.content = inst.content;
			currentInstance.structure = inst.structure;
		}
		
		/**
		 * Returns the content of the 'instance' with the specified name. If it does not exist, an empty string is returned.
		 * If the argument is not supplied, the content of the currently active 'instance' is returned.
		 * @public
		 * @param {string} name - name of the 'instance' which content is to be returned
		 * @returns {string}
		 */
		service.getContent = function (name) {
			if (typeof name === "string") {
				var inst = getInstance(name);
				return typeof inst === "undefined" ? "": inst.content;
			}
			return currentInstance.content;
		}
		
		service.getInstance = function (name) {			
			if (typeof name === "undefined") {				
				return currentInstance;
			}
			return getInstance(name);
		}
		
		/**
		 * Sets the content of the 'instance'. If the name of the 'instance' is not supplied,
		 * the content of the currently active 'instance' is set and then the corresponding 'instance' in the 'instances' array is updated.
		 * @public
		 * @param {string} name - name of the instance
		 * @param {string} content - content to be set
		 */
		service.setContent = function (content, name) {			 
			if (typeof name === "undefined") {
				currentInstance.content = content;
			} else {
				setContent(content, name);
			}
		}
		
		service.setStructure = function (structure, name) {			 
			if (typeof name === "undefined") {
				currentInstance.structure = structure;
			} else {
				setStructure(structure, name);
			}
		}
		
		/**
		 * Transfers the currently active 'instance' to 'instances' array.
		 * @public
		 */
		service.transferContent = function () {
			setContent(currentInstance.content, currentInstance.name);
			setStructure(currentInstance.structure, currentInstance.name);
		}
		
		/**
		 * Hides the editor and clears the currently active 'instance'.
		 * @public
		 */
		service.closeEditor = function () {
			showModal = false;
			currentInstance = {};
		}
		
		/**
		 * Clears content associated with the specified 'instance'.
		 * If the name is not supplied, the currently active 'instance' is cleared.
		 * @public
		 * @param {string} name - name of the 'instance'
		 */
		service.clearContent = function (name) {
			if (typeof name === "string") {
				setContent("", name);
			} else {
				currentInstance.content = "";	
			}			
		}
		
		service.beautifySvg = function (name) {
			var svg = service.getContent(name), match,
				output = "<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>\n";
			
			match = svg.match(/<svg.*?>|<g.*?>|<style.*?<\/style>|<path.*?><\/path>|<circle.*?><\/circle>|<polygon.*?><\/polygon>|<text.*?<\/text>|<\/g>|<\/svg>|/g);
			
			match.forEach(function (row) {
				output += row + "\n";
			});
			
			return output;
		}
		
		// exposes API
		return service;
		
		/**
		 * Checks if the 'instance' exists.
		 * @private
		 * @param {string} name - name of the 'instance' to look for
		 * @returns {boolean}
		 */
		function instanceExists(name) {
			for (var i = 0; i < instances.length; i++) {
				if (instances[i].name === name) {
					return true;
				}
			}
			return false;
		}
		
		/**
		 * Returns 'instance' with the specified name.
		 * @private
		 * @param {string} - name of the 'instance' to look for
		 * @returns {Object}
		 */
		function getInstance(name) {
			for (var i = 0; i < instances.length; i++) {
				if (instances[i].name === name) {
					return instances[i];
				}
			}
		}
		
		/**
		 * Sets content of the 'instance' with the specified name. If the 'instance' does not exist, a new one is created.
		 * If the name is not specified, the content of the currently active 'instance' is saved in the 'instances' array.
		 * @private
		 * @param {string} - name of the 'instance' to look for
		 */
		function setContent(content, name) {
			var i;
			for (i = 0; i < instances.length; i++) {
				if (instances[i].name === name) {
					return instances[i].content = content;
				}
			}
			instances.push({
				name: name,
				content: content
			});
		}
		
		function setStructure(structure, name) {
			var i;
			for (i = 0; i < instances.length; i++) {
				if (instances[i].name === name) {
					return instances[i].structure = structure;
				}
			}
			instances.push({
				name: name,
				structure: structure
			});
		}
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemShapes", DrawChemShapes);

	DrawChemShapes.$inject = [
		"DCShape",
		"DrawChemConst",
		"DrawChemUtils",
		"DrawChemGenElements",
		"DCAtom",
		"DCBond",
		"DCArrow",
		"DCSelection"
	];

	function DrawChemShapes(DCShape, Const, Utils, GenElements, DCAtom, DCBond, DCArrow, DCSelection) {

		var service = {},
			BOND_LENGTH = Const.BOND_LENGTH,
			BONDS_AUX = Const.BONDS_AUX,
			Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Bond = DCBond.Bond,
			Selection = DCSelection.Selection;

		/**
		 * Modifies the structure.
		 * @param {Structure} base - structure to be modified,
		 * @param {StructureCluster} mod - StructureCluster containing appropriate Structure objects,
		 * @param {Number[]} mousePos - position of the mouse when 'mouseup' event occurred
		 * @param {Number[]|undefined} down - position of the mouse when 'mousedown' event occurred
		 * @param {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (base, mod, mousePos, down, mouseDownAndMove) {
			var modStr, firstAtom,
				found = false,
				isInsideCircle,
				origin = base.getOrigin();

			modStructure(base.getStructure(), origin);

			return base;

			/**
			* Recursively looks for an atom to modify.
			* @param {Atom[]|Bond[]} struct - array of atoms or array of bonds,
			* @param {Number[]} pos - absolute coordinates of an atom
			*/
			function modStructure(struct, pos) {
				var i, absPos, aux;
				for(i = 0; i < struct.length; i += 1) {
					if (struct[i] instanceof Arrow) {
						continue;
					}

					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();

					if (struct[i] instanceof Atom) { firstAtom = struct[i]; } // remember first atom in each structure

					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];

					if (found) { break; }

					isInsideCircle = Utils.insideCircle(absPos, mousePos);

					if (isInsideCircle && !mouseDownAndMove) {
						// if 'mouseup' was within a circle around an atom
						// and if a valid atom has not already been found
							modStr = chooseMod(aux);
							updateBonds(aux, modStr, absPos);
							updateDecorate(modStr, absPos);
							found = true;
							return base;
					}

					if (!isInsideCircle && Utils.compareCoords(down, absPos, 5)) {
						// if 'mousedown' was within a circle around an atom
						// but 'mouseup' was not
						// and if a valid atom has not already been found
						modStr = chooseDirectionManually(aux);
						updateBonds(aux, modStr, absPos);
						updateDecorate(modStr, absPos);
						found = true;
						return base;
					}

					// if none of the above was true, then continue looking down the structure tree
					modStructure(aux.getBonds(), absPos);
				}

				/**
				 * Updates decorate elements (e.g. aromatic rings) in the structure.
				 * @param {Structure} modStr - Structure object which may contain decorate elements
				 * @param {Number[]} abs - absolute coordinates
				 */
				function updateDecorate(modStr, abs) {
					var coords;
					if (modStr !== null && modStr.isAromatic() && typeof firstAtom !== "undefined") {
						coords = Const.getBondByDirection(modStr.getName()).bond;
						return base.addDecorate("aromatic", {
							fromWhich: firstAtom.getCoords(),
							coords: [coords[0] + abs[0], coords[1] + abs[1]]
						});
					}
				}

				/**
				 * Updates bonds array in an Atom object.
				 * @param {Atom} atom - an Atom object or Bond object to update
				 * @param {Atom[]} modStr - an array of Atom objects to attach
				 * @param {Number[]} absPos - absolute position of the atom to update
				 */
				function updateBonds(atom, modStr, absPos) {
					if (modStr !== null) {
						modifyExisting(modStr, absPos);
						atom.addBonds(modStr.getStructure(0).getBonds());
					}
				}

				/**
				 * Checks if an atom already exists. If it does, that atoms attachedBonds array is updated.
				 * @param {Atom[]} modStr - an array of Atom objects
				 * @param {Number[]} absPos - absolute position of the atom to update
				 */
				function modifyExisting(modStr, absPos) {
					var i, newAbsPos, atom, newName,
						struct = modStr.getStructure(0).getBonds();
					for(i = 0; i < struct.length; i += 1) {
						newAbsPos = [struct[i].getAtom().getCoords("x") + absPos[0], struct[i].getAtom().getCoords("y") + absPos[1]];
						atom = service.isWithin(base, newAbsPos).foundAtom;
						if (typeof atom !== "undefined") {
							newName = Atom.getOppositeDirection(modStr.getName());
							atom.attachBond({ direction: newName, type: mod.getBondsMultiplicity() });
							return atom.calculateNext();
						}
					}
				}
			}

			/**
			 * Lets the user decide in which of the eight directions the next bond is going to be pointing.
			 * Draws a circle around a chosen atom and divides it into eight equal parts. Checks to which part the coordinates
			 * associated with the 'mouseup' event belong and chooses the suitable bond.
			 * @param {Atom} current - currently active Atom object
			 * @returns {Atom[]}
			 */
			function chooseDirectionManually(current) {
				return chooseMod(current, service.getDirection(mousePos, down));
			}

			/**
			 * Chooses a suitable modification from mod object.
			 * @param {Atom} current - currently active Atom object
			 * @param {String|undefined} - outgoing direction (either manually or automatically set)
			 * @returns {Atom[]}
			 */
			function chooseMod(current, output) {
				var i, at, name, toCompare, next;
				if (mod.defs.length === 1) {
					return mod.getDefault().getStructure(0).getBonds();
				} else {
					for(i = 0; i < mod.defs.length; i += 1) {
						at = mod.defs[i];
						next = current.getNext() || "N";
						if (next === "max") {
							return null;
						}
						name = at.getName();
						toCompare = output || next;
						if (toCompare === name) {
							current.attachBond({ direction: name, type: mod.getBondsMultiplicity() });
							current.calculateNext();
							return at;
						}
					}
				}
			}
		}

		/**
		 * Looks for an atom Object (or Objects if more than one has the specified coords) and deletes it.
		 * Attaches items in its 'bonds' array directly to 'structure' array in Structure object.
		 * @params {Structure} structure - a Structure object to modify,
		 * @params {Number[]} mouseCoords - coordinates of the mouse pointer (where 'mouseup occurred')
		 * @returns {Structure}
		 */
		service.deleteFromStructure = function (structure, mouseCoords) {
			var origin = structure.getOrigin(), newAtomArray = [], aux = [], aromaticArr, newAromaticArr;

			// recursievly look for an atom to delete
			check(structure.getStructure(), origin);

			// applies new coords to the found atom Objects
			angular.forEach(newAtomArray, function (ob) {
				var obj = ob.obj;
				if (obj instanceof Arrow) {
					obj.setOrigin(ob.coords);
				} else if (obj instanceof Atom) {
					obj.setCoords(ob.coords);
				}
				aux.push(obj);
			});

			if (structure.isAromatic()) {
				// if is aromatic
				aromaticArr = structure.getDecorate("aromatic");
				newAromaticArr = [];
				angular.forEach(aromaticArr, function (arom) {
					if (!Utils.insideCircle(arom.coords, mouseCoords, Const.AROMATIC_R)) {
						newAromaticArr.push(arom);
					}
				});
				structure.setDecorate("aromatic", newAromaticArr);
			}

			structure.setStructure(aux);

			return structure;

			/**
			* Recursively looks for atom Objects to delete.
			* @param {Atom|Bond|Arrow} struct - 'structure' array or 'bonds' array,
			* @param {Number[]} pos - current absolute position,
			* @param {Atom} prevAtom - preceding atom Object (makes sense when iterating over 'bonds' array)
			*/
			function check(struct, pos, prevAtom) {
				var i, absPos, current, newBondArray = [], absPosStart, absPosEnd;
				for(i = 0; i < struct.length; i += 1) {
					current = struct[i];
					if (current instanceof Arrow) {
						// current Object is arrow
						absPosStart = [current.getOrigin("x") + pos[0], current.getOrigin("y") + pos[1]];
						absPosEnd = [current.getEnd("x") + pos[0], current.getEnd("y") + pos[1]];
						if (!(Utils.insideCircle(absPosStart, mouseCoords) || Utils.insideCircle(absPosEnd, mouseCoords))) {
							// if this arrow was NOT chosen then don't apply any changes
							// omit it otherwise
							newAtomArray.push({ obj: current, coords: current.getOrigin() });
						}
					} else if (current instanceof Atom) {
						// current Object is atom
						absPos = [current.getCoords("x") + pos[0], current.getCoords("y") + pos[1]];
						if (Utils.insideCircle(absPos, mouseCoords)) {
							// if this atom was chosen then apply changes
							changeArray(absPos, current);
						} else {
							// don't change anything otherwise
							newAtomArray.push({ obj: current, coords: current.getCoords() });
						}
						check(current.getBonds(), absPos, current);
					} else if (current instanceof Bond) {
						// current Object is bond
						absPos = [current.getAtom().getCoords("x") + pos[0], current.getAtom().getCoords("y") + pos[1]];
						if (Utils.insideCircle(absPos, mouseCoords)) {
							// if atom at the end of this bond was chosen then apply changes
							changeArray(absPos, current.getAtom());
						} else {
							// don't change anything otherwise
							newBondArray.push(current);
						}
						check(current.getAtom().getBonds(), absPos, current.getAtom());
					}
				}

				// when finished iterating over 'bonds' array
				// set an array of all bond Objects that were NOT chosen
				// otherwise prevAtom is undefined
				if (typeof prevAtom !== "undefined") { prevAtom.setBonds(newBondArray); }

				// extracts atom Objects from the 'bonds' array of the deleted atom Object
				// adds them to 'newAtomArray' array and sets their new coords
				function changeArray(absPos, atom) {
					var i, newCoords, newAbsPos, at;
					for (i = 0; i < atom.getBonds().length; i += 1) {
						at = atom.getBonds(i).getAtom();
						newAbsPos = [at.getCoords("x") + absPos[0], at.getCoords("y") + absPos[1]];
						newCoords = Utils.subtractCoords(newAbsPos, origin);
						newAtomArray.push({ obj: at, coords: newCoords });
					}
				}
			}
		}

		/**
		 * Checks if the mouse pointer is within a circle of an atom.
		 * @param {Structure} structure - a Structure object on which search is performed
		 * @param {Number[]} position - set of coordinates against which the search is performed
		 * @returns {Atom}
		 */
		service.isWithin = function (structure, position) {
			var found = false,
				foundObj = {},
				origin = structure.getOrigin();

			check(structure.getStructure(), origin);

			return foundObj;

			function check(struct, pos) {
				var i, absPos, aux;
				for(i = 0; i < struct.length; i += 1) {
					if (struct[i] instanceof Arrow) {
						continue;
					}
					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					if (!found && Utils.insideCircle(absPos, position)) {
						found = true;
						foundObj.foundAtom = aux;
						foundObj.absPos = absPos;
					} else {
					  check(aux.getBonds(), absPos);
					}
				}
			}
		}

		/**
		 * Generates the desired output based on given input.
		 * @param {Structure} input - a Structure object containing all information needed to render the shape
		 * @param {String} id - id of the object to be created (will be used inside 'g' tag and in 'use' tag)
		 */
		service.draw = function (input, id) {
			var shape,
				output = parseInput(input),
				paths = output.paths,
				circles = output.circles,
				labels = output.labels,
				rects = output.rects,
				minMax = output.minMax;
			shape = new DCShape.Shape(genElements().full, genElements().mini, id);
			shape.elementFull = shape.generateStyle("expanded") + shape.elementFull;
			shape.elementMini = shape.generateStyle("base") + shape.elementMini;
			shape.setMinMax(minMax);
			return shape;

			/**
			 * Generates a string from the output array and wraps each line with 'path' tags, each circle with 'circle' tags,
			 * and each decorate element with suitable tags.
			 */
			function genElements() {
				var result = { full: "", mini: "" };

				GenElements.generateRects(rects, result);
				GenElements.generatePaths(paths, result);
				GenElements.generateCircles(circles, result);
				GenElements.generateLabels(labels, result);

				if (input.isAromatic()) {
					GenElements.generateAromatics(input, result);
				}

				return result;
			}

			/**
			* Translates the input into an svg-suitable set of coordinates.
			* @param {Structure} input - an input object
			* @returns {Object}
			*/
		  function parseInput(input) {
				var output = [], circles = [], labels = [], rects = [], i, absPos, absPosStart, absPosEnd, len, selection, atom, arrow, obj,
					origin = input.getOrigin(), minMax = { minX: origin[0], maxX: origin[0], minY: origin[1], maxY: origin[1] },
					circR = Const.CIRC_R, width, height, quarter, startX, startY;

				for (i = 0; i < input.getStructure().length; i += 1) {
					obj = input.getStructure(i);
					if (obj instanceof Selection) {
						selection = obj;
						absPosStart = Utils.addCoordsNoPrec(origin, selection.getOrigin());
						absPosEnd = selection.getCurrent();
						quarter = selection.getQuarter();
						rects.push(DCSelection.calcRect(quarter, absPosStart, absPosEnd));
					} else if (obj instanceof Atom) {
						atom = obj;
						absPos = Utils.addCoordsNoPrec(origin, atom.getCoords());
						updateLabel(absPos, atom);
						updateMinMax(absPos);
						len = output.push(["M", absPos]);
						circles.push({ selected: atom.selected, circle: [absPos[0], absPos[1], circR] });
						connect(absPos, atom.getBonds(), output[len - 1], atom.selected);
					} else if (obj instanceof Arrow) {
						arrow = obj;
						absPosStart = Utils.addCoordsNoPrec(origin, arrow.getOrigin());
						absPosEnd = Utils.addCoordsNoPrec(origin, arrow.getEnd());
						updateMinMax(absPosStart);
						updateMinMax(absPosEnd);
						circles.push({ selected: arrow.selected, circle: [ absPosStart[0], absPosStart[1], circR ] });
						circles.push({ selected: arrow.selected, circle: [ absPosEnd[0], absPosEnd[1], circR ] });
						output.push(DCArrow.calcArrow(absPosStart, absPosEnd, arrow.getType()));
					}
				}

				return {
					paths: GenElements.stringifyPaths(output),
					rects: rects,
					circles: circles,
					labels: labels,
					minMax: minMax
				};

				/**
				* Recursively translates the input, until it finds an element with an empty 'bonds' array.
				* @param {Bond[]} bonds - an array of Bond objects
				* @param {String|Number[]} - an array of coordinates with 'M' and 'L' commands
				*/
				function connect(prevAbsPos, bonds, currentLine, selected) {
					var i, absPos, atom, bondType;
					for (i = 0; i < bonds.length; i += 1) {
						atom = bonds[i].getAtom();
						bondType = bonds[i].getType();
						absPos = [
							prevAbsPos[0] + atom.getCoords("x"),
							prevAbsPos[1] + atom.getCoords("y")
						];
						updateMinMax(absPos);
						updateLabel(absPos, atom);
						circles.push({ selected: selected, circle: [absPos[0], absPos[1], circR] });
						if (i === 0) {
							drawLine(prevAbsPos, absPos, bondType, atom, "continue", selected);
						} else {
							drawLine(prevAbsPos, absPos, bondType, atom, "begin", selected);
						}
					}
				}

				function drawLine(prevAbsPos, absPos, bondType, atom, mode, selected) {
					var newLen = output.length;
					if (bondType === "single") {
						if (mode === "continue") {
							output[newLen - 1].push("L");
							output[newLen - 1].push(absPos);
						} else if (mode === "begin") {
							newLen = output.push(["M", prevAbsPos, "L", absPos]);
						}
					} else if (bondType === "double") {
						output.push(DCBond.calcDoubleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "triple") {
						output.push(DCBond.calcTripleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge") {
						output.push(DCBond.calcWedgeBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash") {
						output.push(DCBond.calcDashBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					}
					connect(absPos, atom.getBonds(), output[newLen - 1], selected);
				}

				function updateLabel(absPos, atom) {
					var label = atom.getLabel(), labelObj;
					if (typeof label !== "undefined") {
						labelObj = genLabelInfo();
						labels.push(labelObj);
					}

					function genLabelInfo() {
						var bondsRemained = label.getMaxBonds() - calcBondsIn(atom.getAttachedBonds()) - calcBondsOut(atom.getBonds()),
							labelNameObj = { name: label.getLabelName() };

						addHydrogens();

						return {
							length: labelNameObj.name.length,
							label: labelNameObj.name,
							mode: label.getMode(),
							atomX: absPos[0],
							atomY: absPos[1],
							labelX: absPos[0] + labelNameObj.correctX,
							labelY: absPos[1] + 0.09 * BOND_LENGTH,
							width: DCShape.fontSize * labelNameObj.name.length,
							height: DCShape.fontSize
						};

						function calcBondsIn(bonds) {
							var i, type, result = 0;
							for (i = 0; i < bonds.length; i += 1) {
								type = bonds[i].type;
								switch (type) {
									case "single": result += 1; break;
									case "double": result += 2; break;
									case "triple": result += 3; break;
								}
							}
							return result;
						}

						function calcBondsOut(bonds) {
							var i, type, result = 0;
							for (i = 0; i < bonds.length; i += 1) {
								type = bonds[i].getType();
								switch (type) {
									case "single": result += 1; break;
									case "wedge": result += 1; break;
									case "dash": result += 1; break;
									case "double": result += 2; break;
									case "triple": result += 3; break;
								}
							}
							return result;
						}

						function addHydrogens() {
							var i, mode = label.getMode(), hydrogens = 0;
							for (i = 0; i < bondsRemained; i += 1) {
								hydrogens += 1;
							}

							labelNameObj.hydrogens = hydrogens;

							if (typeof mode === "undefined") {
								// if mode is not known (if there was previously no label)
								// try to guess which one should it be
								mode = getTextDirection();
								label.setMode(mode);
							}

							if (hydrogens > 0) {
								// only happens for predefined labels
								// custom labels can't have implicit hydrogens
								hydrogensAboveZero();
							} else {
								hydrogensZeroOrLess();
							}

							labelNameObj.correctX = calcCorrect() * BOND_LENGTH;

							function hydrogensAboveZero() {
								if (mode === "rl") {
									labelNameObj.name = hydrogens === 1 ?
										 "H" + labelNameObj.name: "H" + hydrogens + labelNameObj.name;
								} else if (mode === "lr") {
									labelNameObj.name = hydrogens === 1 ?
										labelNameObj.name + "H": labelNameObj.name + "H" + hydrogens;
								}
							}

							function hydrogensZeroOrLess() {
								if (mode === "rl") {
									labelNameObj.name = Utils.invertGroup(labelNameObj.name);
								}
							}

							function getTextDirection() {
								var countE = 0;
								atom.getAttachedBonds().forEach(function (direction) {
									countE = direction.direction.indexOf("E") < 0 ? countE: countE + 1;
								});
								return countE > 0 ? "rl": "lr";
							}

							function calcCorrect() {
								if (mode === "rl") {
									return 0.175;
								} else if (mode === "lr") {
									return -0.175;
								} else if (mode === "tb") {

								} else if (mode === "bt") {

								}
							}
						}
					}
				}

				function updateMinMax(absPos) {
					if (absPos[0] > minMax.maxX) {
						minMax.maxX = absPos[0];
					}
					if (absPos[0] < minMax.minX) {
						minMax.minX = absPos[0];
					}
					if (absPos[1] > minMax.maxY) {
						minMax.maxY = absPos[1];
					}
					if (absPos[1] < minMax.minY) {
						minMax.minY = absPos[1];
					}
				}
			}
		}

		/**
		 * Divides a circle (center at pos2) into 12 parts and checks to which part the coords at pos1 belong.
		 * @param {Number[]} pos1 - coordinates of the center
		 * @param {Number[]} pos2 - coords to check
		 * @returns {String}
		 */
		service.getDirection = function (pos1, pos2) {
			var alpha = Math.PI / 6,
				r = Math.sqrt(Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2)),
				x = Math.sin(alpha / 2) * r,
				x1 = Math.cos(3 * alpha / 2) * r,
				y = Math.cos(alpha / 2) * r,
				y1 = Math.sin(3 * alpha / 2) * r;

			if (check(-x, x, -r, -y)) {
				return "N";
			} else if (check(x, x1, -y, -y1)) {
				return "NE1";
			} else if (check(x1, y, -y1, -x)) {
				return "NE2";
			} else if (check(y, r, -x, x)) {
				return "E";
			} else if (check(x1, y, x, y1)) {
				return "SE1";
			} else if (check(x, x1, y1, y)) {
				return "SE2";
			} else if (check(-x, x, y, r)) {
				return "S";
			} else if (check(-x1, -x, y1, y)) {
				return "SW1";
			} else if (check(-y, -x1, x, y1)) {
				return "SW2";
			} else if (check(-r, -y, -x, x)) {
				return "W";
			} else if (check(-y, -x1, -y1, -x)) {
				return "NW1";
			} else if (check(-x1, -x, -y, -y1)) {
				return "NW2";
			} else {
				return "N";
			}

			function check(arg1, arg2, arg3, arg4) {
				return pos1[0] >= (pos2[0] + arg1) && pos1[0] <= (pos2[0] + arg2) &&
					pos1[1] >= (pos2[1] + arg3) && pos1[1] <= (pos2[1] + arg4);
			}
		}

		return service;
	}
})();
