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

  DCArrowCluster.$inject = ["DrawChemUtils", "DrawChemConst", "DCArrow"];

	function DCArrowCluster(Utils, Const, DCArrow) {

		var service = {},
		  Arrow = DCArrow.Arrow;

		/**
		* Creates a new `ArrowCluster` object.
		* @class
		* @param {string} name - name of the cluster,
		* @param {Arrow[]} defs - array of `Arrow` objects
		*/
		function ArrowCluster(name, defs) {
			this.name = name;
			this.defs = defs;
		}

		/**
		* Gets default `Arrow` object.
		* @returns {Arrow}
		*/
		ArrowCluster.prototype.getDefault = function () {
      var i;
			for (i = 0; i < this.defs.length; i += 1) {
			  if(Utils.compareVectors(this.defs[i].getRelativeEnd(), Const.BOND_E, 5)) {
          return this.defs[i];
        }
			}
		};

		/**
		* Gets a suitable `Arrow` based on supplied coordinates.
		* @param {number[]} mouseCoords1 - coordinates associated with onMouseDown event,
		* @param {number[]} mouseCoords2 - coordinates associated with onMouseUp event,
		* @returns {Arrow}
		*/
    ArrowCluster.prototype.getArrow = function (mouseCoords1, mouseCoords2) {
			var possibleVectors = [], vector, i;
			for (i = 0; i < this.defs.length; i += 1) {
				possibleVectors.push(this.defs[i].getRelativeEnd());
			}
			vector = Utils.getClosestVector(mouseCoords1, mouseCoords2, possibleVectors);
			return new Arrow(this.name, vector);
		};

		service.ArrowCluster = ArrowCluster;

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCArrow", DCArrow);

	function DCArrow() {

		var service = {};

		/**
		* Creates a new `Arrow` object.
		* @class
		* @param {string} type - arrow type (one-way, etc.),
		* @param {number[]} relativeEnd - building vector
		*/
		function Arrow(type, relativeEnd) {
			this.type = type;
			this.relativeEnd = relativeEnd;
		}

		/**
		* Checks if this `Arrow` object is marked as selected.
		* @returns {boolean}
		*/
		Arrow.prototype.isSelected = function () {
			return !!this.selected;
		};

		/**
		* Marks this `Arrow` object as selected.
		*/
		Arrow.prototype.select = function () {
			this.selected = true;
		};

		/**
		* Unmarks selection of this `Arrow`.
		*/
		Arrow.prototype.deselect = function () {
			this.selected = false;
		};

		/**
		* Gets type of this `Arrow` object.
		* @returns {string}
		*/
		Arrow.prototype.getType = function () {
			return this.type;
		};

		/**
		* Gets relative end (vector) of this `Arrow` object.
		* @returns {number[]}
		*/
		Arrow.prototype.getRelativeEnd = function () {
			return this.relativeEnd;
		};

		/**
		* Gets end coordinates of this `Arrow` object in relation to its origin.
		* @param {string} coord - which coord to return ('x' or 'y'),
		* @returns {number|number[]}
		*/
		Arrow.prototype.getEnd = function (coord) {
			if (coord === "x") {
				return this.end[0];
			} else if (coord === "y") {
				return this.end[1];
			} else {
				return this.end;
			}
		};

		/**
		 * Sets origin of this `Arrow` object.
		 * @param {number[]} origin - beginning coords of the arrow
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
		* Gets start coordinates of this `Arrow` object.
		* @param {string} coord - which coord to return ('x' or 'y'),
		* @returns {number|number[]}
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

		/**
		 * Updates end coordinates of this `Arrow` object (in relation to its origin).
		 */
		Arrow.prototype.updateEnd = function () {
			if (typeof this.relativeEnd !== "undefined") {
				this.end = [
					this.origin[0] + this.relativeEnd[0],
					this.origin[1] + this.relativeEnd[1],
				];
			}
		};

		service.Arrow = Arrow;

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCAtom", DCAtom);

	DCAtom.$inject = ["DrawChemConst", "DrawChemUtils"];

	function DCAtom(Const, Utils) {

		var service = {};

		/**
		* Creates a new `Atom` object.
		* @class
		* @param {number[]} coords - an array with coordinates of the atom,
		* @param {Bond[]} bonds - an array of bonds coming out of the atom,
		* @param {Object} attachedBonds - directions of all bonds coming out or coming in as object: { in: [{ vector: `number[]`, multiplicity: `number` }], out: [same] }
		*/
		function Atom(coords, bonds, attachedBonds) {
			this.coords = coords;
			this.bonds = bonds;
			this.attachedBonds = attachedBonds || {};
			this.label;
		}

		/**
		* Checks if this `Atom` object is marked as selected.
		* @returns {boolean}
		*/
		Atom.prototype.isSelected = function () {
			return !!this.selected;
		};

		/**
		* Marks `Atom` object as selected.
		*/
		Atom.prototype.select = function () {
			this.selected = true;
		};

		/**
		* Marks `Atom` object as orphan.
		*/
		Atom.prototype.setAsOrphan = function () {
			this.orphan = true;
		};

		/**
		* Checks if this `Atom` object is marked as orphan.
		*/
		Atom.prototype.isOrphan = function () {
			return !!this.orphan;
		};

		/**
		* Unmarks selection.
		*/
		Atom.prototype.deselect = function () {
			this.selected = false;
		};

		/**
		 * Calculates direction of an opposite bond.
		 * @param {string} direction - direction of the bond
		 * @returns {string}
		 */
		Atom.getOppositeDirection = function (direction) {
			var DIRS = Const.DIRECTIONS,
			  index = DIRS.indexOf(direction),
			  movedIndex = Utils.moveToRight(DIRS, index, DIRS.length / 2);
			return DIRS[movedIndex];
		};

		/**
		 * Adds a bond to the attachedBonds array.
		 * @param {string} type - type of the bond, i.e. 'in' or 'out',
		 * @param {object} bond - bond defined as { vector: `number[]`, multiplicity: `number` }
		 */
		Atom.prototype.attachBond = function (type, bond) {
			if (typeof this.attachedBonds[type] === "undefined") {
				// initiates array if it does not exist
				this.attachedBonds[type] = [];
			}
			this.attachedBonds[type].push(bond);
		};

		/**
		 * Sets coordinates of the atom.
		 * @param {number[]} coords - an array with coordinates of the atom
		 */
		Atom.prototype.setCoords = function (coords) {
			this.coords = coords;
		};

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
		 * Gets all attached bonds.
		 * @param {string} type - type of the bond, 'in' or 'out'
		 * @returns {object|object[]} - returns an object if `type` is not supplied, an array of objects if `type` is supplied
		 */
		Atom.prototype.getAttachedBonds = function (type) {
			if (typeof type === "undefined") {
				// returns an object holding both 'in' and 'out' properties
				return this.attachedBonds;
			}
			return this.attachedBonds[type];
		};

		/**
		 * Sets `Label` object.
		 * @param {Label} label - a `Label` object
		 */
		Atom.prototype.setLabel = function (label) {
			this.label = label;
		};

		/**
		 * Gets` Label` object.
		 * @returns {Label}
		 */
		Atom.prototype.getLabel = function () {
			return this.label;
		};

		/**
		 * Gets an array of all `Bonds` objects coming out of this `Atom` object.
		 * @param {number} index - an index of desired `Bond` object
		 * @returns {Bond[]|Bond} - returns an array of `Bonds` if index is not supplied, a `Bond` object at specifed index otherwise
		 */
		Atom.prototype.getBonds = function (index) {
			if (typeof index === "undefined") {
				return this.bonds;
			} else {
				return this.bonds[index];
			}
		};

		/**
		 * Sets an array of `Bond' objects coming out of this `Atom` object.
		 * @param {Bond[]} bonds - array of `Bond` objects
		 */
		Atom.prototype.setBonds = function (bonds) {
			this.bonds = bonds;
		};

		/**
		 * Adds a new `Bond` object to the array.
		 * @param {Bond} bond - a new `Bond` object to be added to this `Atom` object
		 */
		Atom.prototype.addBond = function (bond) {
			this.bonds.push(bond);
		};

		/**
		 * Adds new `Bond` objects to the array.
		 * @param {Bond[]} bonds - an array of `Bond` objects to be added
		 */
		Atom.prototype.addBonds = function (bonds) {
			bonds.forEach(function (bond) {
				this.bonds.push(bond);
			}, this);
		};

		service.Atom = Atom;

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCBondStructure", DCBondStructure);

	function DCBondStructure() {

		var service = {};

    /**
		* Creates a new `BondStructure` object.
		* @class
    * @param {string} name - name of the cyclic structure,
    * @param {number} multiplicity - multiplicity of the bond
		*/
    function BondStructure(name, multiplicity) {
      this.name = name;
      this.multiplicity = multiplicity;
    }

    /**
    * Gets name of bond structure.
    * @returns {string}
    */
    BondStructure.prototype.getName = function () {
      return this.name;
    };

    /**
    * Gets multiplicity of the bond.
    * @returns {number}
    */
    BondStructure.prototype.getMultiplicity = function () {
      return this.multiplicity;
    };

    service.BondStructure = BondStructure;

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCBond", DCBond);

	function DCBond() {

		var service = {};

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

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCCyclicStructure", DCCyclicStructure);

	function DCCyclicStructure() {

		var service = {};

    /**
		* Creates a new `CyclicStructure` object.
		* @class
    * @param {string} name - name of the cyclic structure,
    * @param {number} ringSize - size of the ring,
    * @param {number} angle - angle in degrees between two bonds (vectors) in the ring,
    * @param {boolean} aromatic - true if structure is aromatic
		*/
    function CyclicStructure(name, ringSize, angle, aromatic) {
      this.name = name;
      this.ringSize = ringSize;
      this.angle = angle;
      this.aromatic = aromatic;
    }

    /**
    * Gets name of cyclic structure.
    * @returns {string}
    */
    CyclicStructure.prototype.getName = function () {
      return this.name;
    };

    /**
    * Gets ring size of cyclic structure.
    * @returns {number}
    */
    CyclicStructure.prototype.getRingSize = function () {
      return this.ringSize;
    };

    /**
    * Gets angle in degrees between two bonds (vectors) in the ring.
    * @returns {string}
    */
    CyclicStructure.prototype.getAngle = function () {
      return this.angle;
    };

    /**
    * Checks if structure is aromatic.
    * @returns {boolean}
    */
    CyclicStructure.prototype.isAromatic = function () {
      return !!this.aromatic;
    };

    service.CyclicStructure = CyclicStructure;

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
		* Creates a new `Label` object.
		* @class
		* @param {string} label - name of the group/atom symbol
		* @param {number} bonds - maximum number of bonds associated `Atom` object can be connected with
		* @param {string} mode - how the label should be anchored, i.e. left to right ('lr'), right to left ('rl'), etc.
		*/
		function Label(label, bonds, mode) {
			this.labelName = label;
			this.bonds = bonds;
			this.mode = mode;
		}

		/**
		 * Gets name of the group/atom symbol.
		 * @returns {string}
		 */
		Label.prototype.getLabelName = function () {
			return this.labelName;
		};

		/**
		 * Sets name of the group/atom symbol.
		 * @param {string} labelName - name of the group/atom symbol
		 */
		Label.prototype.setLabelName = function (labelName) {
			this.labelName = labelName;
		};

		/**
		 * Gets maximum number of bonds associated with `Atom` object (e.g. label 'O', oxygen, has maximum two bonds).
		 * @returns {number}
		 */
		Label.prototype.getMaxBonds = function () {
			return this.bonds;
		};

		/**
		 * Sets maximum number of bonds.
		 * @param {number} bonds - maximum number of bonds
		 */
		Label.prototype.setMaxBonds = function (bonds) {
			this.bonds = bonds;
		};

		/**
		 * Gets mode of the label, i.e. 'rl' for 'right to left', 'lr' for 'left to right'.
		 * Useful for anchoring of the text tag.
		 * @returns {string}
		 */
		Label.prototype.getMode = function () {
			return this.mode;
		};

		/**
		 * Sets mode of the label.
		 * @param (string) mode - mode to set
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
		* Creates a new `Selection` object.
		* @class
		* @param {number[]} origin - coords of the origin (relative to the absolute position of the 'parent' `Structure` object)
		* @param {number[]} current - current absolute position of the mouse
		*/
		function Selection(origin, current) {
			this.origin = origin;
			this.current = current;
		}

		/**
		 * Gets origin of this `Selection` object.
		 * @param {string} coord - which coord to return ('x' or 'y')
		 * @returns {number|number[]}
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
		 * Sets origin of this `Selection` object.
		 * @param {number[]} origin - origin of this `Selection` object
		 */
		Selection.prototype.setOrigin = function (origin) {
			this.origin = origin;
		};

		/**
		 * Gets current mouse position.
		 * @param {string} coord - which coord to return ('x' or 'y')
		 * @returns {number[]}
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
		 * @param {number[]} - current mouse position.
		 */
		Selection.prototype.setCurrent = function (current) {
		  this.current = current;
		};

		service.Selection = Selection;

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);

	DCStructureCluster.$inject = ["DrawChemUtils", "DrawChemConst"];

	function DCStructureCluster(Utils, Const) {

		var service = {};

		/**
		* Creates a new `StructureCluster` object.
		* @class
		* @param {string} name - name of the cluster,
		* @param {Structure[]} defs - array of Structure objects belonging to the cluster,
		* @param {number} ringSize - size of the associated ring, defaults to 0 for acyclic structures,
		* @param {number} angle - angle between bonds in cyclic structures,
		* @param {number} mult - multiplicity of the associated bond (undefined for cyclic structures)
		*/
		function StructureCluster(name, defs, ringSize, angle, mult) {
			this.name = name;
			this.defs = defs;
			this.ringSize = ringSize;
			this.angle = angle;
			this.multiplicity = mult;
			this.defaultStructure = defs[0];
		}

		/**
		* Gets `defs` array.
		* @returns {Structure[]}
		*/
		StructureCluster.prototype.getDefs = function () {
			return this.defs;
		};

		/**
		* Gets name of the cluster.
		* @returns {string}
		*/
		StructureCluster.prototype.getName = function () {
			return this.name;
		};

		/**
		* Gets size of the associated ring. Defaults to 0 for acyclic structures.
		* @returns {number}
		*/
		StructureCluster.prototype.getRingSize = function () {
			return this.ringSize;
		};

		/**
		* Gets multiplicity of the associated bond. Undefined for cyclic structures.
		* @returns {number}
		*/
		StructureCluster.prototype.getMult = function () {
			return this.multiplicity;
		};

		/**
		* Gets angle between bonds (vectors) in the associated ring.
		* @returns {number}
		*/
		StructureCluster.prototype.getAngle = function () {
			return this.angle;
		};

		/**
		* Gets default `Structure` object.
		* @returns {Structure}
		*/
		StructureCluster.prototype.getDefault = function () {
			return this.defaultStructure;
		};

		/**
		* Gets a suitable `Structure` based on supplied coordinates.
		* @param {number[]} mouseCoords1 - coordinates associated with onMouseDown event,
		* @param {number[]} mouseCoords2 - coordinates associated with onMouseUp event,
		* @returns {Structure}
		*/
		StructureCluster.prototype.getStructure = function (mouseCoords1, mouseCoords2) {
			var i, possibleVectors = [], vector, bond;
			for (i = 0; i < Const.BONDS.length; i += 1) {
				possibleVectors.push(Const.BONDS[i].bond);
			}
			vector = Utils.getClosestVector(mouseCoords1, mouseCoords2, possibleVectors);
			for (i = 0; i < this.defs.length; i += 1) {
				bond = Const.getBondByDirection(this.defs[i].getName()).bond;
				if (Utils.compareVectors(bond, vector, 5)) {
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

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCSvg", DCSvg);

	DCSvg.$inject = ["DrawChemConst"];

	function DCSvg(Const) {

		var service = {};

		service.fontSize = 18;
		service.subFontSize = 14;
		service.font = "Arial";

		/**
		 * Creates a new `Svg` element. This helper class has methods
		 * for wrapping an svg element (e.g. path) with other elements (e.g. g, defs).
		 * @class
		 * @param {string} elementFull - svg element for editor
		 * @param {string} elementMini - svg element for displaying outside of the editor
		 * @param {string} id - id of the g element
		 */
		function Svg(elementFull, elementMini, id) {
			this.elementFull = elementFull;
			this.elementMini = elementMini;
			this.id = id;
		}

		/**
		 * Gets full element.
		 * @returns {string}
		 */
		Svg.prototype.getElementFull = function () {
			return this.elementFull;
		};

		/**
		 * Sets full element.
		 * @param {string} element - full element
		 */
		Svg.prototype.setElementFull = function (element) {
			this.elementFull = element;
		};

		/**
		 * Gets mini element.
		 * @returns {string}
		 */
		Svg.prototype.getElementMini = function () {
			return this.elementMini;
		};

		/**
		 * Sets mini element.
		 * @param {string} element - mini element
		 */
		Svg.prototype.setElementMini = function (element) {
			this.elementMini = element;
		};

		/**
		 * Sets an array of extreme coords (minX, maxX, minY, maxY).
		 * @param {number[]} minMax - array of coords
		 */
		Svg.prototype.setMinMax = function (minMax) {
			this.minMax = minMax;
		}

		/**
		 * Wraps an instance of Svg with a custom tag.
		 * @param {string} el - name of the tag, if this param equals 'g', then id attribute is automatically added
		 * @param {Object} attr - attribute of the tag
		 * @param {string} attr.key - name of the attribute
		 * @param {string} attr.val - value of the attribute
		 */
		Svg.prototype.wrap = function (which, el, attr) {
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
		 * @param {string} which - 'expanded' for the whole css, 'base' for css needed to render the molecule (without circles on hover, etc.)
		 */
		Svg.generateStyle = function (which) {
			var style = {
					expanded: {
						"circle.atom:hover": {
							"opacity": "0.3",
							"stroke": "black",
							"stroke-width": Const.BOND_WIDTH,
						},
						"circle.arom:hover": {
							"opacity": "0.3",
							"stroke": "black",
							"stroke-width": Const.BOND_WIDTH,
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
							"stroke-width": Const.BOND_WIDTH,
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
							"stroke-width": Const.BOND_WIDTH,
							"fill": "none"
						},
						"circle.tr-arom": {
							"stroke": "black",
							"stroke-width": Const.BOND_WIDTH,
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
				},
			  attr = "<style type=\"text/css\">";

			if (which === "expanded") {
				which = { base: style.base, expanded: style.expanded };
			} else if (which === "base") {
				which = { base: style.base, expanded: {} };
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
		};

		service.Svg = Svg;

		return service;
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
    "DrawChemModStructure",
    "DrawChemCache",
    "DrawChemConst",
    "DCLabel",
		"DCStructure",
		"DCSelection"
  ];

	function DrawChemDirectiveMouseActions(Flags, Utils, ModStructure, Cache, Const, DCLabel, DCStructure, DCSelection) {

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
				var withinObject = ModStructure.isWithin(Cache.getCurrentStructure(), mouseFlags.downMouseCoords);
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
          atom = ModStructure.isWithin(structure, mouseFlags.downMouseCoords).foundAtom,
          currentLabel = atom.getLabel();
				// set Label object
				// either predefined or custom
        if (Flags.selected === "label") {
          atom.setLabel(angular.copy(scope.chosenLabel));
        } else if (Flags.selected === "customLabel") {
					Flags.customLabel = typeof Flags.customLabel === "undefined" ? "": Flags.customLabel;
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
						arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
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
						newCoords = Utils.subtractVectors(mouseCoords, structure.getOrigin());
						arrow.setOrigin(newCoords);
					}
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// set origin of the Structure object (which may be different from current mouse position)
						arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
					} else {
						// otherwise get default arrow
						arrow = angular.copy(scope.chosenArrow.getDefault());
					}
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
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
						structure = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
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
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
					if (mouseFlags.movedOnEmpty) {
						// if the mousemove event occurred before this mouseup event
						// choose an appropriate Structure object from the StructureCluster object
						structureAux = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
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
					// choose appropriate `Arrow` based on mouse coords
					arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
					// as a reminder: Structure object has origin with an absolute value,
					// but each object in its structures array has origin in relation to this absolute value;
					// first object in this array has therefore always coords [0, 0]
					arrow.setOrigin([0, 0]);
				} else {
					// if the content is not empty, a Structure object already exists
					// so get Structure object from Cache
					structure = angular.copy(Cache.getCurrentStructure());
					// choose appropriate arrow from ArrowCluster object
					arrow = scope.chosenArrow.getArrow(mouseFlags.downMouseCoords, mouseCoords);
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
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
					structure = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
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
					newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
					// choose an appropriate Structure object from the StructureCluster object
					structureAux = angular.copy(scope.chosenStructure.getStructure(mouseFlags.downMouseCoords, mouseCoords));
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
				moveDistance = Utils.subtractVectors(mouseCoords, mouseFlags.downMouseCoords);
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
				newCoords = Utils.subtractVectors(mouseFlags.downMouseCoords, structure.getOrigin());
				selection = new Selection(newCoords, mouseCoords);
			}
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
		"DrawChemModStructure",
		"DrawChemSvgRenderer",
		"DrawChemCache",
		"DrawChemDirectiveFlags"
	];

	function DrawChemDirectiveUtils(ModStructure, SvgRenderer, Cache, Flags) {

		var service = {};

		/**
		 * Draws the specified structure.
		 * @params {Structure} structure - a Structure object to draw.
		 */
		service.drawStructure = function (structure) {
			var drawn = "";
			drawn = SvgRenderer.draw(structure, "cmpd1");
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
		service.subtractVectors = function (arr1, arr2) {
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
			return ModStructure.modifyStructure(
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
			return ModStructure.deleteFromStructure(
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

	DrawChemConst.$inject = ["DrawChemUtils"];

	function DrawChemConst(Utils) {

		var service = {};

		service.SET_BOND_LENGTH;

		/**
		* Sets length of the bond and then initializes other constants.
		* For use at config step.
		* @param {number} length - length of the bond
		*/
		service.setBondLength = function (length) {
			service.SET_BOND_LENGTH = length;
			init(); // initialize all constants
		}

		// initialize all constants
		init();

		/**
		* Initializes all constants.
		*/
		function init() {

			// the default bond length
			service.BOND_LENGTH = service.SET_BOND_LENGTH || 20;

			// proportion of the bond width to bond length
			// 0.04 corresponds to the ACS settings in ChemDraw, according to
			// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
			service.WIDTH_TO_LENGTH = 0.04;

			// angle between possible bonds when adding a new bond (in degrees)
			service.FREQ = 15;

			//
			service.PUSH = 0.25;

			// default angle between two bonds (in degrees)
			service.ANGLE = 120;

			// maximum number of bonds at one atom
			service.MAX_BONDS = 10;

			// default r of an aromatic circle
			service.AROMATIC_R = service.BOND_LENGTH * 0.45;

			// default distance between two parallel bonds in double bonds (as a percent of the bond length);
			service.BETWEEN_DBL_BONDS = 0.065;

			// default distance between two furthest bonds in triple bonds (as a percent of the bond length);
			service.BETWEEN_TRP_BONDS = 0.1;

			// default arrow size (as a percent of the bond length);
			service.ARROW_SIZE = 0.065;

			// default starting point of the arrow head (as a percent of the bond length);
			service.ARROW_START = 0.85;

			// default bond width
			service.BOND_WIDTH = (service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2);

			// default r of a circle around an atom
			service.CIRC_R = service.BOND_LENGTH * 0.12;

			// default directions, clock-wise
			service.DIRECTIONS = [
				"N", "NE1", "NE2", "NE3", "NE4", "NE5",
				"E", "SE1", "SE2", "SE3", "SE4", "SE5",
				"S", "SW1", "SW2", "SW3", "SW4", "SW5",
				"W", "NW1", "NW2", "NW3", "NW4", "NW5"
			];

			// bonds + their directions
			service.BONDS = [];

			// adds all bonds to `service`, e.g. `service.BOND_N`
			generateBonds();

			/**
			* Returns a bond vector associated with a direction.
			* @param {string} direction - direction of the bond
			* @returns {number[]}
			*/
			service.getBondByDirection = function (direction) {
				var i;
				for (i = 0; i < service.BONDS.length; i += 1) {
					if (service.BONDS[i].direction === direction) {
						return service.BONDS[i];
					}
				}
			};

			// adds all bonds to `service`, e.g. `service.BOND_N`
			// then to `service.BONDS` array
			function generateBonds() {
				var vector = [0, -service.BOND_LENGTH]; // starting vector, north direction
				service.DIRECTIONS.forEach(function (direction) {
					var name = "BOND_" + direction;
					service[name] = vector; // add vector to `service`
					service.BONDS.push({ direction: direction, bond: vector }); // add bond to `BONDS` array
					vector = Utils.rotVectCW(vector, service.FREQ); // rotate vector by default angle
				});
			}
		}

		return service;
	}
})();

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
		* @param {number} factor - multiplies second vector by a factor (optional)
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
		 * @param {number} tolerance - r of the circle,
		 * @returns {boolean}
		 */
		service.insideCircle = function (center, point, tolerance) {
			return Math.abs(center[0] - point[0]) < tolerance && Math.abs(center[1] - point[1]) < tolerance;
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
		.factory("DrawChemActions", DrawChemActions);

	DrawChemActions.$inject = [
		"DrawChemCache",
		"DrawChem",
		"DrawChemSvgRenderer",
		"DrawChemDirectiveUtils"
	];

	function DrawChemActions(DrawChemCache, DrawChem, SvgRenderer, DrawChemDirUtils) {

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
				shape = SvgRenderer.draw(structure, "transfer");
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

      // stores all actions related to Actions, Edit, Arrows, and ModStructure menu items
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
		"DCCyclicStructure",
		"DCBondStructure",
		"DrawChemDirectiveFlags"
	];

	function DrawChemStructures(Const, Utils, DCStructure, DCStructureCluster, DCAtom, DCBond, DCCyclicStructure, DCBondStructure, Flags) {

		var service = {},
			Atom = DCAtom.Atom,
			Bond = DCBond.Bond,
			CyclicStructure = DCCyclicStructure.CyclicStructure,
			BondStructure = DCBondStructure.BondStructure,
			Structure = DCStructure.Structure,
			StructureCluster = DCStructureCluster.StructureCluster,
			BONDS = Const.BONDS, cyclicStructures, bondStructures;

		cyclicStructures = [
			new CyclicStructure("cyclopropane", 3, 60),
			new CyclicStructure("cyclobutane", 4, 90),
			new CyclicStructure("cyclopentane", 5, 108),
			new CyclicStructure("cyclohexane", 6, 120),
			new CyclicStructure("benzene", 6, 120, true),
			new CyclicStructure("cycloheptane", 7, 128.57),
			new CyclicStructure("cyclooctane", 8, 135),
			new CyclicStructure("cyclononane", 9, 140)
		];

		bondStructures = [
			new BondStructure("single", 1),
			new BondStructure("wedge", 1),
			new BondStructure("dash", 1),
			new BondStructure("double", 2),
			new BondStructure("triple", 3)
		];

		addCyclicStructures();
		addBondStructures();

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

		/**
		 * Generates single bonds in all defined directions.
		 * @param {string} type - bond type, e.g. 'single', 'double',
		 * @returns {Structure[]}
		 */
		service.generateBonds = function(type, mult) {
			var i, bond, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				bond = BONDS[i].bond;
				direction = BONDS[i].direction;
				result.push(
					new Structure(
						direction,
						[
							new Atom([0, 0], [service.generateBond(bond, type, mult)],
								{ out: [{ vector: bond, multiplicity: mult }] } )
						]
					)
				);
			}
			return result;
		};

		/**
		* Generates a `Bond` object.
		* @param {number[]} bond - vector associated with this bond,
		* @param {string} type - bond type, e.g. 'single', 'double',
		* @param {number} mult - bond multiplicity,
		* @returns {Bond}
		*/
		service.generateBond = function (bond, type, mult) {
			return new Bond(type, new Atom(bond, [], { in: [{ vector: angular.copy(bond), multiplicity: mult }] }));
		};

		/**
		 * Generates a ring in each of the defined direction.
		 * @param {number} deg - angle in degs between two bonds in the ring,
		 * @param {number} size - size of the ring,
		 * @param {string} decorate - indicates decorate element (e.g. aromatic ring),
		 * @returns {Structure[]}
		 */
		service.generateRings = function (deg, size, aromatic) {
			var i, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				direction = BONDS[i].direction;
				result.push(genRing(direction, deg, size, aromatic));
			}

			return result;

			/**
			 * Generates a ring.
			 * @param {string} direction - in which direction the ring will be generated,
			 * @param {number} deg - angle in degs between two bonds (vectors) in the ring,
			 * @param {number} size - size of the ring,
			 * @returns {Structure}
			 */
			function genRing(direction, deg, size) {
				var firstAtom, nextAtom, structure,
					opposite = Atom.getOppositeDirection(direction),
					bond = Const.getBondByDirection(opposite).bond,
					rotVect = Utils.rotVectCCW(bond, deg / 2);

				firstAtom = new Atom([0, 0], [], { out: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
				nextAtom = new Atom(rotVect, [], { in: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
				firstAtom.addBond(new Bond("single", nextAtom));
				service.generateRing(nextAtom, size, deg, firstAtom);
				structure = new Structure(opposite, [firstAtom]);
				if (aromatic) {
					structure.setAromatic();
				}

				return structure;
			}
		};

		/**
		 * Recursively generates atoms in a circular manner (generates a ring as a result).
		 * @param {Atom} atom - `Atom` object, to which new atom will be added,
		 * @param {number} depth - starting/current depth of the structure tree,
		 * @param {number} deg - angle between bonds (vectors),
		 * @param {Atom} firstAtom - first `Atom` object in this cyclic structure
		 */
		service.generateRing = function(atom, depth, deg, firstAtom) {
			var rotVect = Utils.rotVectCW(atom.getCoords(), 180 - deg),
				newAtom = new Atom(rotVect, []);

			atom.attachBond("out", { vector: angular.copy(rotVect), multiplicity: 1 });
			if (depth === 1) {
				atom.setAsOrphan();
				firstAtom.attachBond("in", { vector: angular.copy(atom.getCoords()), multiplicity: 1 });
				return;
			}
			newAtom.attachBond("in", { vector: angular.copy(rotVect), multiplicity: 1 });
			atom.addBond(new Bond("single", newAtom));
			service.generateRing(newAtom, depth - 1, deg, firstAtom);
		};

		return service;

		/**
		* Adds an action associated with a button.
		* @param {Function} cb - a callback fn to invoke after clicking on the button,
		* @returns {Function}
		*/
		function createStructureAction(cb) {
			return function (scope) {
				scope.chosenStructure = cb();
				Flags.selected = "structure";
			}
		}

		/**
		* Defines functions associated with bonds.
		*/
		function addBondStructures() {
			bondStructures.forEach(function (bondStr) {
				var name = bondStr.getName(),
					multiplicity = bondStr.getMultiplicity();
				service[name + "Bond"] = function () {
					var defs = service.generateBonds(name, multiplicity),
					  cluster = new StructureCluster(name, defs, 0, 0, multiplicity);
					return cluster;
				};
			});
		}

		/**
		* Defines functions associated with cyclic structures.
		*/
		function addCyclicStructures() {
			cyclicStructures.forEach(function (cyclic) {
				var name = cyclic.getName(),
				  ringSize = cyclic.getRingSize(),
					angle = cyclic.getAngle(),
					aromatic = cyclic.isAromatic();
				service[name] = function () {
					var defs = service.generateRings(angle, ringSize, aromatic),
						cluster = new StructureCluster(name, defs, ringSize, angle);
					return cluster;
				};
			});
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
		.factory("DrawChemModStructure", DrawChemModStructure);

	DrawChemModStructure.$inject = [
		"DrawChemConst",
		"DrawChemUtils",
		"DrawChemStructures",
		"DCAtom",
		"DCBond",
		"DCArrow",
		"DCSelection",
		"DCSvg"
	];

	function DrawChemModStructure(Const, Utils, Structures, DCAtom, DCBond, DCArrow, DCSelection, DCSvg) {

		var service = {},
			BOND_LENGTH = Const.BOND_LENGTH,
			BONDS_AUX = Const.BONDS_AUX,
			Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Bond = DCBond.Bond,
			Svg = DCSvg.Svg,
			Selection = DCSelection.Selection;

		/**
		 * Modifies the `Structure` object and returns it.
		 * @param {Structure} base - `Structure` object to be modified,
		 * @param {StructureCluster} mod - `StructureCluster` object containing appropriate `Structure` objects,
		 * @param {number[]} mousePos - position of the mouse when 'onMouseUp' event occurred
		 * @param {number[]|undefined} down - position of the mouse when 'onMouseDown' event occurred
		 * @param {boolean} mouseDownAndMove - true if 'onMouseMove' and 'onMouseDown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (base, mod, mousePos, down, mouseDownAndMove) {
			var vector, firstAtom,
				found = false,
				isInsideCircle,
				origin = base.getOrigin();

			modStructure(base.getStructure(), origin);

			return base;

			/**
			* Recursively looks for an atom to modify.
			* @param {Atom[]|Bond[]} struct - array of atoms or array of bonds,
			* @param {number[]} pos - absolute coordinates of an atom
			*/
			function modStructure(struct, pos) {
				var i, absPos, aux, obj;
				for(i = 0; i < struct.length; i += 1) {

					obj = struct[i];

					if (!(obj instanceof Atom || obj instanceof Bond)) { continue; }

					if (found) { break; }

					if (obj instanceof Atom) {
						firstAtom = struct[i];
						aux = obj;
					} else {
						aux = obj.getAtom();
						if (aux.isOrphan()) { continue; }
					}

					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];

					isInsideCircle = Utils.insideCircle(absPos, mousePos, Const.CIRC_R);

					if (isInsideCircle && !mouseDownAndMove) {
						// if 'mouseup' was within a circle around an atom
						// and if a valid atom has not already been found
						vector = chooseDirectionAutomatically(aux);
						if (vector !== "full atom") {
						  updateAtom(vector, aux, absPos);
						}
						//updateDecorate(modStr, absPos);
						found = true;
						return base;
					}

					if (!isInsideCircle && Utils.compareVectors(down, absPos, 5)) {
						// if 'mousedown' was within a circle around an atom
						// but 'mouseup' was not
						// and if a valid atom has not already been found
						vector = chooseDirectionManually(aux);
						updateAtom(vector, aux, absPos);
						//updateDecorate(modStr, absPos);
						found = true;
						return base;
					}

					// if none of the above was true, then continue looking down the structure tree
					modStructure(aux.getBonds(), absPos);
				}

				/**
				* Updates `Atom` object.
				* @param {number[]} vector - indicates direction, in which the change should be made,
				* @param {Atom} atom - `Atom` object that is going to be modified
				*/
				function updateAtom(vector, atom, absPos) {
					var name = mod.getName(), // gets name of the `StructureCluster `object
					  size = mod.getRingSize(), // gets size of the ring (defaults to 0 for non-rings)
						mult = mod.getMult(), // gets multiplicity of the bond (undefined for rings)
						bond, angle, nextAtom, rotVect, foundAtom;
					if (size > 0) {
						/*
						* if we are dealing with a ring
						*/
						angle = mod.getAngle(); // gets angle between bonds inside the ring
						rotVect = Utils.rotVectCCW(vector, angle / 2); // adjust to angle bisector
						// define next `Atom` object
						nextAtom = new Atom(rotVect, [], { in: [{ vector: angular.copy(rotVect), multiplicity: 1 }] });
						// attach it to the starting `Atom` object
						atom.addBond(new Bond("single", nextAtom));
						// update `attachedBonds` array
						atom.attachBond("out", { vector: angular.copy(rotVect), multiplicity: 1 });
						// recursively generate the rest of the ring
						Structures.generateRing(nextAtom, size, angle, atom);
					} else {
						/*
						* if we are dealing with a bond
						*/
						// generate `Bond` object in the direction indicated by `vector`
						bond = Structures.generateBond(vector, name, mult);
						// check if an `Atom` object laready exists at this coords
						foundAtom = service.isWithin(
							base,
							Utils.addVectors(absPos, vector)
						).foundAtom;
						if (typeof foundAtom !== "undefined") {
							bond.getAtom().setAsOrphan();
							foundAtom.attachBond("in", { vector: vector, multiplicity: mult })
						}
						// attach it to the starting `atom`
						atom.addBond(bond);
						// update `attachedBonds` array
						atom.attachBond("out", { vector: angular.copy(vector), multiplicity: mult });
					}
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
			}

			/**
			 * Lets the user decide in which direction the next bond is going to be.
			 * Enables rotating the bond around an atom (by a degree defined in Constants).
			 * @param {Atom} current - currently active Atom object
			 * @returns {number[]}
			 */
			function chooseDirectionManually(current) {
				var inBonds = current.getAttachedBonds("in"), // attached incoming bonds
				  outBonds = current.getAttachedBonds("out"), // attached outcoming bonds
					possibleBonds, firstInBond, firstOutBond, angle, vect;

				if (typeof inBonds !== "undefined" && typeof outBonds !== "undefined") {
					// if both in- and outcoming bonds are defined,
					// get first in- and first outcoming bond,
					firstInBond = inBonds[0].vector;
					firstOutBond = outBonds[0].vector;
					// find angle between them
					angle = Math.acos(Utils.dotProduct(Utils.norm(firstInBond), Utils.norm(firstOutBond))) * 180 / Math.PI;
					// construct angle bisector
					vect = Utils.rotVectCCW(firstInBond, (180 - angle) / 2);
				} else if (typeof inBonds !== "undefined") {
					vect = inBonds[0].vector;
				} else if (typeof outBonds !== "undefined") {
					vect = outBonds[0].vector;
				} else {
					// defaults to bond in north direction
					vect = Const.BOND_N;
				}
				// finds all possible bonds, starting with `vect` and rotating it every `Const.FREQ`
				possibleBonds = Utils.calcPossibleVectors(vect, Const.FREQ);
				// returns that vector from `possibleBonds` array,
				// that is closest to the vector made with `down` and `mousePos` coordinates
				return Utils.getClosestVector(down, mousePos, possibleBonds);
			}

			/**
			 * Automatically decides in which direction the next bond is going to be.
			 * @param {Atom} current - currently active Atom object
			 * @returns {number[]}
			 */
			function chooseDirectionAutomatically(current) {
				var inBonds = current.getAttachedBonds("in"), // attached incoming bonds
				  outBonds = current.getAttachedBonds("out"), // attached outcoming bonds
					size = mod.getRingSize(), // check if structure is cyclic
					possibleBonds, firstInBond, firstOutBond, angle, vect, vectAux;

				if (typeof inBonds !== "undefined" && typeof outBonds !== "undefined") {
					// if both in- and outcoming bonds are defined,
					// get first in- and first outcoming bond,
					firstInBond = inBonds[0].vector;
					firstOutBond = outBonds[0].vector;
					// find angle between them
					angle = Math.acos(Utils.dotProduct(Utils.norm(firstInBond), Utils.norm(firstOutBond))) * 180 / Math.PI;
					// construct angle bisector
					vectAux = Utils.rotVectCCW(firstInBond, (180 - angle) / 2);
					if (Utils.compareVectors(vectAux, firstOutBond, 5)) {
						vect = Utils.rotVectCW(firstInBond, (180 - angle) / 2);
					} else {
						vect = vectAux;
					}
				} else if (typeof inBonds !== "undefined") {
					if (size > 0) {
						vect = angular.copy(inBonds[0].vector);
					} else {
					  vect = Utils.rotVectCCW(inBonds[0].vector, Const.ANGLE / 2);
					}
				} else if (typeof outBonds !== "undefined") {
					vect = Utils.rotVectCCW(outBonds[0].vector, Const.ANGLE);
				} else {
					// defaults to bond in north direction
					vect = Const.BOND_N;
				}
				// recursively checks if this bond is already attached,
				// if so, rotates it by `Const.FREQ` clockwise
				return Utils.checkAttachedBonds(vect, current, Const.FREQ, Const.MAX_BONDS);
			}
		}

		/**
		 * Looks for an `Atom` object (or objects if more than one has the specified coords) and deletes it (them).
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
						if (!(Utils.insideCircle(absPosStart, mouseCoords, Const.CIRC_R) || Utils.insideCircle(absPosEnd, mouseCoords, Const.CIRC_R))) {
							// if this arrow was NOT chosen then don't apply any changes
							// omit it otherwise
							newAtomArray.push({ obj: current, coords: current.getOrigin() });
						}
					} else if (current instanceof Atom) {
						// current Object is atom
						absPos = [current.getCoords("x") + pos[0], current.getCoords("y") + pos[1]];
						if (Utils.insideCircle(absPos, mouseCoords, Const.CIRC_R)) {
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
						if (Utils.insideCircle(absPos, mouseCoords, Const.CIRC_R)) {
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
						newCoords = Utils.subtractVectors(newAbsPos, origin);
						newAtomArray.push({ obj: at, coords: newCoords });
					}
				}
			}
		}

		/**
		 * Checks if supplied coordinates are within a circle of an atom.
		 * @param {Structure} structure - a `Structure` object on which search is performed,
		 * @param {number[]} position - set of coordinates against which the search is performed,
		 * @returns {Object}
		 */
		service.isWithin = function (structure, position) {
			var found = false,
				foundObj = {},
				origin = structure.getOrigin();

			check(structure.getStructure(), origin);

			return foundObj;

			function check(struct, pos) {
				var i, absPos, aux, obj;
				for(i = 0; i < struct.length; i += 1) {
					obj = struct[i];
					if (!(obj instanceof Atom || obj instanceof Bond)) { continue; }
					if (obj instanceof Atom) {
						aux = obj;
					} else {
						aux = obj.getAtom();
						if (aux.isOrphan()) { continue; }
					}
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					if (!found && Utils.insideCircle(absPos, position, Const.CIRC_R)) {
						found = true;
						foundObj.foundAtom = aux;
						foundObj.absPos = absPos;
					} else {
					  check(aux.getBonds(), absPos);
					}
				}
			}
		};

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemSvgRenderer", DrawChemSvgRenderer);

  DrawChemSvgRenderer.$inject = [
		"DCSvg",
		"DCBond",
		"DCAtom",
		"DCArrow",
		"DCSelection",
		"DrawChemConst",
		"DrawChemUtils",
		"DrawChemSvgUtils",
		"DrawChemModStructure"
	];

	function DrawChemSvgRenderer(DCSvg, DCBond, DCAtom, DCArrow, DCSelection, Const, Utils, SvgUtils, ModStructure) {

		var service = {},
		  BETWEEN_DBL_BONDS = Const.BETWEEN_DBL_BONDS,
			BETWEEN_TRP_BONDS = Const.BETWEEN_TRP_BONDS,
			ARROW_START = Const.ARROW_START,
			ARROW_SIZE = Const.ARROW_SIZE,
		  Atom = DCAtom.Atom,
			Arrow = DCArrow.Arrow,
			Selection = DCSelection.Selection,
      Svg = DCSvg.Svg;

    /**
		 * Generates the desired output based on given input (`Structure` object).
		 * @param {Structure} input - a `Structure` object containing all information needed to render svg,
		 * @param {string} id - id of the object to be created (will be used inside 'g' element),
     * @returns {Svg}
		 */
		service.draw = function (input, id) {
			var styleBase = Svg.generateStyle("base"),
				styleExpanded = Svg.generateStyle("expanded"),
				output = parseInput(input),
				paths = output.paths,
				circles = output.circles,
				labels = output.labels,
				rects = output.rects,
				minMax = output.minMax,
			  svg = new Svg(
  				styleExpanded + genElements().full,
  				styleBase + genElements().mini,
  				id
			  );

			svg.setMinMax(minMax);

			return svg;

			/**
			 * Generates string from the output array and wraps each line with 'path' element,
			 * each circle with 'circle' element, etc.
			 * @returns {Object}
			 */
			function genElements() {
				var result = { full: "", mini: "" };
				SvgUtils.generateRects(rects, result);
				SvgUtils.generatePaths(paths, result);
				SvgUtils.generateCircles(circles, result);
				SvgUtils.generateLabels(labels, result);
				if (input.isAromatic()) {
					SvgUtils.generateAromatics(input, result);
				}
				return result;
			}

			/**
			* Transforms `Structure` object into a set of svg-suitable set of coordinates and instructions.
			* @param {Structure} input - an input (`Structure`) object,
			* @returns {Object}
			*/
		  function parseInput(input) {
				var output = [], circles = [], labels = [], rects = [],
          i, absPos, absPosStart, absPosEnd, len,
          selection, atom, arrow, obj, push,
					origin = input.getOrigin(),
          minMax = { minX: origin[0], maxX: origin[0], minY: origin[1], maxY: origin[1] },
					circR = Const.CIRC_R;

				for (i = 0; i < input.getStructure().length; i += 1) {
					obj = input.getStructure(i);
					if (obj instanceof Selection) {
						selection = obj;
						absPosStart = Utils.addVectors(origin, selection.getOrigin());
						absPosEnd = selection.getCurrent();
						rects.push(calcRect(absPosStart, absPosEnd));
					} else if (obj instanceof Atom) {
						atom = obj;
						absPos = Utils.addVectors(origin, atom.getCoords());
						SvgUtils.updateLabel(labels, absPos, atom);
						updateMinMax(absPos);
						push = typeof atom.getLabel() !== "undefined";
						len = output.push(["M", absPos]);
						circles.push({ selected: atom.selected, circle: [absPos[0], absPos[1], circR] });
						connect(absPos, atom.getBonds(), output[len - 1], atom.isSelected(), push);
					} else if (obj instanceof Arrow) {
						arrow = obj;
						absPosStart = Utils.addVectors(origin, arrow.getOrigin());
						absPosEnd = Utils.addVectors(origin, arrow.getEnd());
						updateMinMax(absPosStart);
						updateMinMax(absPosEnd);
						circles.push({ selected: arrow.isSelected(), circle: [ absPosStart[0], absPosStart[1], circR ] });
						circles.push({ selected: arrow.isSelected(), circle: [ absPosEnd[0], absPosEnd[1], circR ] });
						output.push(calcArrow(absPosStart, absPosEnd, arrow.getType()));
					}
				}

				return {
					paths: SvgUtils.stringifyPaths(output),
					rects: rects,
					circles: circles,
					labels: labels,
					minMax: minMax
				};

				/**
				* Recursively transforms input (with `drawLine` fn), until it finds an object with an empty 'bonds' array.
        * @param {number[]} prevAbsPos - previously used absolute coordinates,
				* @param {Bond[]} bonds - an array of `Bond` objects,
				* @param {string|number[]} currentLine - an array of coordinates with 'M' and 'L' commands,
        * @param {boolean} selected - true if object is marked as selected
				*/
				function connect(prevAbsPos, bonds, currentLine, selected, push) {
					var i, absPos, atom, bondType;
					for (i = 0; i < bonds.length; i += 1) {
						atom = bonds[i].getAtom();
						bondType = bonds[i].getType();
						absPos = [
							prevAbsPos[0] + atom.getCoords("x"),
							prevAbsPos[1] + atom.getCoords("y")
						];
						updateMinMax(absPos);
						SvgUtils.updateLabel(labels, absPos, atom);
						circles.push({ selected: selected, circle: [absPos[0], absPos[1], circR] });
						if (i === 0) {
							drawLine(prevAbsPos, absPos, bondType, atom, "continue", selected, push);
						} else {
							drawLine(prevAbsPos, absPos, bondType, atom, "begin", selected, push);
						}
					}
				}

        /**
				* Recursively transforms input (with `connect` fn), until it finds an object with an empty 'bonds' array.
        * @param {number[]} prevAbsPos - previously used absolute coordinates,
        * @param {number[]} absPos - currently used absolute coordinates,
				* @param {string} bondType - type of current `Bond` object, e.g. 'single', 'double',
				* @param {Atom} atom - `Atom` object at the end of current `Bond` object,
        * @param {string} mode - indicates if this should continue this line ('continue') or begin a new one ('begin'),
        * @param {boolean} selected - true if object is marked as selected
				*/
				function drawLine(prevAbsPos, absPos, bondType, atom, mode, selected, push) {
					var newLen = output.length, foundAtom,
					  pushVector = Utils.addVectors(
							prevAbsPos,
							Utils.multVectByScalar(atom.getCoords(), Const.PUSH)
						),
						newPush = typeof atom.getLabel() !== "undefined",
						newPushVector = Utils.addVectors(
							prevAbsPos,
							Utils.multVectByScalar(atom.getCoords(), 1 - Const.PUSH)
						);
					if (atom.isOrphan()) {
						foundAtom = ModStructure.isWithin(input, absPos).foundAtom;
						newPush = typeof foundAtom.getLabel() !== "undefined";
					}
					if (bondType === "single") {
						if (mode === "continue") {
							if (push) {
								output[newLen - 1].push("M");
								output[newLen - 1].push(pushVector);
							}
							output[newLen - 1].push("L");
							if (newPush) {
								output[newLen - 1].push(newPushVector);
							} else {
								output[newLen - 1].push(absPos);
							}
						} else if (mode === "begin") {
							if (push && newPush) {
								newLen = output.push(["M", pushVector, "L", newPushVector]);
							} else if (push) {
								newLen = output.push(["M", pushVector, "L", absPos]);
							} else if (newPush) {
								newLen = output.push(["M", prevAbsPos, "L", newPushVector]);
							} else {
							  newLen = output.push(["M", prevAbsPos, "L", absPos]);
							}
						}
					} else if (bondType === "double") {
						output.push(calcDoubleBondCoords(prevAbsPos, absPos, push, newPush));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "triple") {
						output.push(calcTripleBondCoords(prevAbsPos, absPos, push, newPush));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge") {
						output.push(calcWedgeBondCoords(prevAbsPos, absPos, push, newPush));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash") {
						output.push(calcDashBondCoords(prevAbsPos, absPos, push, newPush));
						newLen = output.push(["M", absPos]);
					}
					connect(absPos, atom.getBonds(), output[newLen - 1], selected, newPush);
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
		* Calculates data for the svg instructions in `path` element for arrow.
		* @param {number[]} start - start coordinates (absolute) of the arrow,
		* @param {number[]} end - end coordinates (absolute) of the arrow,
		* @param {string} type - arrow type (one-way, etc.),
		* @returns {Array}
		*/
		function calcArrow(start, end, type) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
				perpVectCoordsCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCCW = [vectCoords[1], -vectCoords[0]],
				endMarkerStart, startMarkerStart, M1, M2, L1, L2, L3, L4;
			if (type === "one-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				L1 = Utils.addVectors(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addVectors(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return ["arrow", "M", start, "L", end, "M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z"];
			} else if (type === "two-way-arrow") {
				endMarkerStart = [start[0] + vectCoords[0] * ARROW_START, start[1] + vectCoords[1] * ARROW_START];
				startMarkerStart = [start[0] + vectCoords[0] * (1 - ARROW_START), start[1] + vectCoords[1] * (1 - ARROW_START)];
				L1 = Utils.addVectors(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L2 = Utils.addVectors(endMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				L3 = Utils.addVectors(startMarkerStart, perpVectCoordsCCW, ARROW_SIZE);
				L4 = Utils.addVectors(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return [
					"arrow",
					"M", start, "L", end,
					"M", endMarkerStart, "L", L1, "L", end, "L", L2, "Z",
					"M", startMarkerStart, "L", L3, "L", start, "L", L4, "Z"
				];
			}
			else if (type === "equilibrium-arrow") {
				M1 = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				endMarkerStart = [parseFloat(M1[0]) + vectCoords[0] * ARROW_START, parseFloat(M1[1]) + vectCoords[1] * ARROW_START];
				L2 = Utils.addVectors(endMarkerStart, perpVectCoordsCCW, ARROW_SIZE);

				M2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				L3 = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_DBL_BONDS);
				startMarkerStart = [parseFloat(L3[0]) + vectCoords[0] * (1 - ARROW_START), parseFloat(L3[1]) + vectCoords[1] * (1 - ARROW_START)];
				L4 = Utils.addVectors(startMarkerStart, perpVectCoordsCW, ARROW_SIZE);
				return [
					"arrow-eq",
					"M", M1, "L", L1, "L", L2,
					"M", M2, "L", L3, "L", L4
				];
			}
		}

		/**
		* Calculates data for the svg instructions in `path` element for double bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		function calcDoubleBondCoords(start, end, push, newPush) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, Const.PUSH),
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				M1 = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				M2 = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);

			if (push) {
				doWithManyVectors("add", [M1, M2], aux);
			}
			if (newPush) {
				doWithManyVectors("subtract", [L1, L2], aux);
			}

			return ["M", M1, "L", L1, "M", M2, "L", L2];
		}

		/**
		* Calculates data for the svg instructions in `path` element for triple bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		function calcTripleBondCoords(start, end, push, newPush) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, Const.PUSH),
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				M1 = Utils.addVectors(start, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
				M2 = Utils.addVectors(start, perpVectCoordsCW, BETWEEN_TRP_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_TRP_BONDS);

			if (push) {
				doWithManyVectors("add", [M1, M2, start], aux);
			}
			if (newPush) {
				doWithManyVectors("subtract", [L1, L2, end], aux);
			}

			return ["M", M1, "L", L1, "M", start, "L", end, "M", M2, "L", L2];
		}

		/**
		* Calculates data for the svg instructions in `path` element for wedge bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		function calcWedgeBondCoords(start, end, push, newPush) {
			var vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, Const.PUSH),
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);

			if (push) { start = Utils.addVectors(start, aux); }

			if (newPush) {
				end = Utils.subtractVectors(end, aux);
				L1 = Utils.addVectors(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS);
				L2 = Utils.addVectors(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
			}

			return ["wedge", "M", start, "L", L1, "L", L2, "Z"];
		}

		/**
		* Calculates data for the svg instructions in `path` element for dash bond.
		* @param {number[]} start - start coordinates (absolute) of the atom,
		* @param {number[]} end - end coordinates (absolute) of the atom,
		* @returns {Array}
		*/
		function calcDashBondCoords(start, end, push, newPush) {
			var i, max = 10, factor = BETWEEN_DBL_BONDS / max, M, L, result = [],
			  vectCoords = [end[0] - start[0], end[1] - start[1]],
			  aux = Utils.multVectByScalar(vectCoords, Const.PUSH), currentEnd = start,
				perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
				perpVectCoordsCW = [vectCoords[1], -vectCoords[0]];

			if (push) {
				currentEnd = Utils.addVectors(start, aux);
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 2;
			}

			if (newPush) {
				vectCoords = Utils.subtractVectors(vectCoords, aux);
				max -= 2;
			}

			for (i = max; i > 0; i -= 1) {
				factor = factor + BETWEEN_DBL_BONDS / max;
				currentEnd = [currentEnd[0] + vectCoords[0] / max, currentEnd[1] + vectCoords[1] / max];
				M = Utils.addVectors(currentEnd, perpVectCoordsCCW, factor);
				L = Utils.addVectors(currentEnd, perpVectCoordsCW, factor);
				result = result.concat(["M", M, "L", L]);
			}
			return result;
		}

		/**
		* Calculates rectangle attributes (x, y, width, and height).
		* @param {number[]} absPosStart - absolute coordinates associated with onMouseDown event,
		* @param {number[]} absPosEnd - absolute coordinates associated with onMouseUp event,
		* @returns {Object}
		*/
		function calcRect(absPosStart, absPosEnd) {
			var startX, startY, width, height,
			  quadrant = Utils.getQuadrant(absPosStart, absPosEnd);

			if (quadrant === 1) {
				startX = absPosStart[0];
				startY = absPosEnd[1];
				width = absPosEnd[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quadrant === 2) {
				startX = absPosEnd[0];
				startY = absPosEnd[1];
				width = absPosStart[0] - startX;
				height = absPosStart[1] - startY;
			} else if (quadrant === 3) {
				startX = absPosEnd[0];
				startY = absPosStart[1];
				width = absPosStart[0] - startX;
				height = absPosEnd[1] - startY;
			} else if (quadrant === 4) {
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
		}

		function doWithManyVectors(what, vectors, u) {
			var aux;
			vectors.forEach(function (v) {
				if (what === "add") {
					aux = Utils.addVectors(v, u);
					v[0] = aux[0];
					v[1] = aux[1];
				} else if (what === "subtract") {
					aux = Utils.subtractVectors(v, u);
					v[0] = aux[0];
					v[1] = aux[1];
				}
			});
		}

		return service;
	}
})();

(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemSvgUtils", DrawChemSvgUtils);

	DrawChemSvgUtils.$inject = ["DrawChemConst", "DrawChemUtils", "DCSvg"];

	function DrawChemSvgUtils(Const, Utils, DCSvg) {

		var service = {},
      BONDS = Const.BONDS,
      BOND_LENGTH = Const.BOND_LENGTH,
      AROMATIC_R = Const.AROMATIC_R;

		/**
		* Generates `rect` elements.
		* @param {Object[]} rects - array of objects with data needed to construct a `rect` element,
		* @param {Object} obj - object accumulating `rect` elements
		*/
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

		/**
		* Generates `path` elements.
		* @param {Object[]} paths - array of objects with data needed to construct a `path` element,
		* @param {Object} obj - object accumulating `path` elements
		*/
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

		/**
		* Generates `circle` elements (around atoms).
		* @param {Object[]} circles - array of objects with data needed to construct a `circle` element,
		* @param {Object} obj - object accumulating `circle` elements
		*/
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

		/**
		* Generates `text` elements.
		* @param {Object[]} labels - array of objects with data needed to construct a `text` element,
		* @param {Object} obj - object accumulating `text` elements
		*/
    service.generateLabels = function (labels, obj) {
      labels.forEach(function (label) {
        var aux =
          //drawDodecagon(label) +
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

			/*function drawDodecagon(label) {
	      var i, factor,result = [];
	      factor = 0.5 * label.height / BOND_LENGTH;
	      for (i = 1; i < BONDS.length; i += 2) {
	        result.push(Utils.addVectors([label.atomX, label.atomY], BONDS[i].bond, factor));
	      }

	      return "<polygon class='text' points='" + getPoints() + "'></polygon>";

				function getPoints() {
					var str = "";
					result.forEach(function (arr) {
						str += arr[0].toFixed(2) + " " + arr[1].toFixed(2) + " ";
					});
					return str;
				}
	    }*/

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
	          output += "<tspan class='sub' dy='" + DCSvg.fontSize * 0.25 + "' >" + aux + "</tspan>";
	          isPreceded = true;
	        } else if (isPreceded) {
	          output += "<tspan dy='-" + DCSvg.fontSize * 0.25 + "' >" + aux + "</tspan>";
	          isPreceded = false;
	        } else {
	          output += "<tspan>" + aux + "</tspan>";
	        }
	      }
	      return output;
	    }
    };

		/**
		* Generates `circle` elements (aromatic rings).
		* @param {Structure} input - `Structure` object containing info about aromatics,
		* @param {Object} obj - object accumulating `circle` elements
		*/
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
    * Transforms input (array of `path` elements as array of coordinates and instructions ('M' and 'L')) into an array of strings.
		* @param {Array} input - mixed array of arrays with coordinates and instructions,
    * @returns {Object[]}
    */
    service.stringifyPaths = function (input) {
      var result = [], i, j, line, point, lineStr;
      for (i = 0; i < input.length; i += 1) {
        line = input[i];
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

		/**
		* Adds new element to `labels` array based on supplied `Atom` object and its absolute position.
		* @param {Object[]} labels - array of objects with all data necessary for generating `text` elements,
		* @param {number[]} absPos - absolute coordinates of an `Atom` object,
		* @param {Atom} atom - `Atom` object
		*/
		service.updateLabel = function(labels, absPos, atom) {
			var label = atom.getLabel(),
			  inBonds = atom.getAttachedBonds("in"),
				outBonds = atom.getAttachedBonds("out"),
			  labelObj;
			if (typeof label !== "undefined") {
				labelObj = genLabelInfo();
				labels.push(labelObj);
			}

			function genLabelInfo() {
				var bondsRemained = label.getMaxBonds() - calcBonds(inBonds) - calcBonds(outBonds),
					labelNameObj = { name: label.getLabelName() };

				getInfo();

				return {
					length: labelNameObj.name.length,
					label: labelNameObj.name,
					mode: labelNameObj.mode,
					atomX: absPos[0],
					atomY: absPos[1],
					labelX: absPos[0] + calcCorrectX(labelNameObj.mode) * BOND_LENGTH,
					labelY: absPos[1] + calcCorrectY() * BOND_LENGTH,
					width: DCSvg.fontSize * labelNameObj.name.length,
					height: DCSvg.fontSize
				};

				// calculates number of incoming and outcoming bonds
				function calcBonds(bonds) {
					var i, result = 0;
					if (typeof bonds === "undefined") {
						return 0;
					}

					for (i = 0; i < bonds.length; i += 1) {
						result += bonds[i].multiplicity;
					}
					return result;
				}

				function calcCorrectX(mode) {
					if (mode === "rl") {
						return 0.175;
					} else if (mode === "lr") {
						return -0.175;
					}
				}

				function calcCorrectY() {
					return 0.09;
				}

				function getInfo() {
					var i, mode = label.getMode(), hydrogens = 0;
					for (i = 0; i < bondsRemained; i += 1) {
						// if there are any bonds remained, add hydrogens
						hydrogens += 1;
					}

					// set number of hydrogens
					labelNameObj.hydrogens = hydrogens;

					if (typeof mode === "undefined") {
						// if mode is not known (if there was previously no label)
						// try to guess which one should it be
						mode = getTextDirection();
						label.setMode(mode);
					}

					labelNameObj.mode = mode;

					if (hydrogens > 0) {
						// only happens for predefined labels,
						// custom labels have number of hydrogens zero or less
						hydrogensAboveZero();
					} else {
						hydrogensZeroOrLess();
					}

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
						var countE = 0, countW = 0;
						if (typeof inBonds !== "undefined") {
							inBonds.forEach(function (bond) {
								if (bond.vector[0] > 0) {
									countE += 1;
								} else {
									countW += 1;
								}
							});
						}
						if (typeof outBonds !== "undefined") {
							outBonds.forEach(function (bond) {
								if (bond.vector[0] < 0) {
									countE += 1;
								} else {
									countW += 1;
								}
							});
						}
						return countE > countW ? "lr": "rl";
					}
				}
			}
		}

		return service;
	}
})();
