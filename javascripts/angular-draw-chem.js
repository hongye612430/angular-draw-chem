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
			this.label;
			this.calculateNext();
		}
		
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
				var str = this.attachedBonds[0];
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
					return (this.attachedBonds[0] === d1 && this.attachedBonds[1] === d2) ||
						(this.attachedBonds[0] === d2 && this.attachedBonds[1] === d1);
				}
			}
			
			function check() {
				var i, bonds = DrawChemConst.BONDS;
				for(i = 0; i < bonds.length; i += 1) {
					if (this.attachedBonds.indexOf(bonds[i].direction) < 0) {
						return bonds[i].direction;
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
		 * @returns {Atom[]|Atom}
		 */
		Atom.prototype.getBonds = function (index) {
			if (arguments.length === 0) {
				return this.bonds;
			} else {				
				return this.bonds[index];	
			}			
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
		.factory("DCLabel", DCLabel);
	
	function DCLabel() {
		
		var service = {};
		
		/**
		* Creates a new Label.
		* @class
		* @param {String} label - a symbol of the atom
		* @param {Number} bonds - a maximum number of bonds this atom should be connected with
		*/
		function Label(label, bonds) {
			this.labelName = label;	
			this.bonds = bonds;
		}
		
		Label.prototype.getLabelName = function () {
			return this.labelName;
		};
		
		Label.prototype.setLabelName = function (labelName) {
			this.labelName = labelName;
		};
		
		Label.prototype.getMaxBonds = function () {
			return this.bonds;
		};
		
		Label.prototype.setMaxBonds = function (bonds) {
			this.bonds = bonds;
		};
		
		service.Label = Label;
		
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
			this.styleFull = {
				"path": {
					"stroke": "black",
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					"fill": "none"
				},
				"path.wedge": {
					"stroke": "black", 
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					"fill": "black"
				},
				"circle.atom:hover": {
					"opacity": "0.3",
					"stroke": "black",
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
				},
				"circle.atom": {
					"opacity": "0",
				},
				"circle.arom": {
					"stroke": "black",
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					"fill": "none"
				},
				"text": {
					"font-family": service.font,
					"cursor": "default",
					"text-anchor": "middle",
					"dominant-baseline": "middle",
					"font-size": service.fontSize + "px"
				},
				"polygon.text": {
					"fill": "white"
				}
			};
			this.styleMini = {
				"path": {
					"stroke": "black",
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					"fill": "none"
				},
				"path.wedge": {
					"stroke": "black", 
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					"fill": "black"
				},
				"circle.arom": {
					"stroke": "black",
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					"fill": "none"
				},
				"text": {
					"font-family": service.font,
					"cursor": "default",
					"text-anchor": "middle",
					"dominant-baseline": "middle",
					"font-size": service.fontSize + "px"
				},
				"polygon.text": {
					"fill": "white"
				}			
			}
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
		 * Adds a specified transformation to transformAttr.
		 * @param {String} transform - the transformation (e.g. scale, translate)
		 * @param {Object} value - coordinates of the transformation
		 * @param {Number} value.x - x coordinate
		 * @param {Number} value.y - y coordinate
		 * @returns {Shape}
		 */
		Shape.prototype.transform = function (transform, value) {
			if (this.transformAttr) {
				this.transformAttr += " ";
			}
			this.transformAttr += transform + "(" + value[0];
			if (value.length > 1) {
				this.transformAttr += "," + value[1];
			}			
			this.transformAttr += ")";
			return this;
		};
		
		Shape.prototype.generateStyle = function (which) {
			var attr = "<style type=\"text/css\">";
			
			if (which === "full") {
				which = this.styleFull;
			} else if (which === "mini") {
				which = this.styleMini;
			}
			
			angular.forEach(which, function (value, key) {
				attr += key + "{";
				angular.forEach(value, function (value, key) {
					attr += key + ":" + value + ";";
				});
				attr += "}"
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
		function StructureCluster(name, defs) {
			this.name = name;
			this.defs = defs;
			this.defaultStructure = defs[0];
		}
		
		StructureCluster.prototype.getDefs = function () {
			return this.defs;
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
	
	function DCStructure() {
		
		var service = {};
		
		/**
		* Creates a new Structure.
		* @class
		* @param {String} name - name of the structure
		* @param {Atom[]} structure - an array of atoms
		*/
		function Structure(name, structure, decorate) {
			this.name = name;			
			this.structure = structure;
			this.transform = [];
			this.origin = [];
			this.decorate = decorate || {};
		}		
		
		/**
		 * Sets the specified transform (translate, scale, etc.)
		 * @param {String} name - a name of the transform
		 * @param {Number[]} content - an array with the coordinates
		 */
		Structure.prototype.setTransform = function (name, content) {
			this.transform.push(
				{
					name: name,
					content: content
				}
			);
		}
		
		/**
		 * Gets the specified transform.
		 * @returns {Number[]}
		 */
		Structure.prototype.getTransform = function (name) {
			var i, transform = this.transform;
			for (i = 0; i < transform.length; i += 1) {
				if (transform[i].name === name) {
					return transform[i].content;
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
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveActions", DrawChemDirectiveActions);
	
	DrawChemDirectiveActions.$inject = [
		"DrawChemCache",
		"DrawChem",
		"DrawChemShapes",
		"DrawChemDirectiveUtils"
	];
	
	function DrawChemDirectiveActions(DrawChemCache, DrawChem, DrawChemShapes, DrawChemDirUtils) {
		
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
				shape = DrawChemShapes.draw(structure, "cmpd1");
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
		
		service.actions = [
			{ name: "undo", action: service.undo },
			{ name: "forward", action: service.forward },
			{ name: "transfer", action: service.transfer },
			{ name: "clear", action: service.clear },
			{ name: "close", action: service.close }
		];
		
		return service;
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveUtils", DrawChemDirectiveUtils);
	
	DrawChemDirectiveUtils.$inject = [
		"DrawChemShapes",
		"DrawChemCache"
	];
	
	function DrawChemDirectiveUtils(DrawChemShapes, DrawChemCache) {
		
		var service = {};
		
		/**
		 * Draws the specified structure.
		 * @params {Structure} structure - a Structure object to draw.
		 */
		service.drawStructure = function (structure) {
			var drawn = "";					
			drawn = DrawChemShapes.draw(structure, "cmpd1");
			DrawChemCache.setCurrentSvg(drawn.wrap("full", "g").wrap("full", "svg").elementFull);
		};
		
		/**
		 * Sets all boolean values to false and non-boolean to undefined.
		 * @params {Object} flags - an object containing flags (as mix of boolean and non-boolean values)
		 */
		service.resetMouseFlags = function (flags) {
			angular.forEach(flags, function (value, key) {
				if (typeof value === "boolean") {
					flags[key] = false;
				} else {
					flags[key] = undefined;
				}
			});
		};
		
		/**
		 * Checks if the canvas is empty.
		 * @returns {Boolean}
		 */
		service.isContentEmpty = function isContentEmpty() {
			return DrawChemCache.getCurrentStructure() === null;
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
		 * @params {Number[]} clickCoords - coordinates of the mouse pointer
		 * @params {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
		 * @returns {Structure}
		 */
		service.modifyStructure = function (structure, chosenStructure, mouseCoords, downAtomCoords, mouseDownAndMove) {
			return DrawChemShapes.modifyStructure(
				angular.copy(structure),
				angular.copy(chosenStructure),
				mouseCoords,
				downAtomCoords,
				mouseDownAndMove
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
		"DrawChemShapes",
		"DrawChemStructures",
		"DrawChemCache",
		"DrawChemDirectiveActions",
		"DrawChemDirectiveUtils",
		"$sce"
	];
	
	function DrawChemEditor(DrawChemPaths, DrawChemShapes, DrawChemStructures, DrawChemCache, DrawChemDirActions, DrawChemDirUtils, $sce) {
		return {
			templateUrl: DrawChemPaths.getPath() + "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				
				var mouseFlags = {
						downAtomCoords: undefined,
						downMouseCoords: undefined,					
						movedOnEmpty: false,
						mouseDown: false,
						downOnAtom: false
					},
					selected;
				
				scope.pathToSvg = DrawChemPaths.getPathToSvg();
				
				// Sets width and height of the dialog box based on corresponding attributes.
				scope.dialogStyle = {};
				
				if (attrs.width) {
					scope.dialogStyle.width = attrs.width;					
				}
				if (attrs.height) {
					scope.dialogStyle.height = attrs.height;					
				}
				
				// Returns content which will be bound in the dialog box.
				scope.content = function () {
					return $sce.trustAsHtml(DrawChemCache.getCurrentSvg());
				};
				
				// stores all actions, e.g. clear, transfer, undo.
				scope.actions = [];
				
				angular.forEach(DrawChemDirActions.actions, function (action) {
					if (action.name === "close") {
						scope[action.name] = action.action;
					}
					scope.actions.push({
						name: action.name,
						action: action.action
					});
				});
				
				// Stores the chosen label.
				scope.chosenLabel;
				
				// stores all labels
				scope.labels = [];
				
				angular.forEach(DrawChemStructures.labels, function (label) {
					scope.labels.push({
						name: label.getLabelName(),
						choose: function () {
							scope.chosenLabel = label;
							selected = "label";
						}
					})
				});
				
				// Stores the chosen structure.			
				scope.chosenStructure;
				
				// Stores all predefined structures.
				scope.customButtons = [];
				
				/**
				 * Adds all predefined shapes to the scope.
				 */
				angular.forEach(DrawChemStructures.custom, function (custom) {
					var customInstance = custom();
					scope.customButtons.push({
						name: customInstance.name,
						choose: function () {
							scope.chosenStructure = customInstance;
							selected = "structure";
						}
					});
				});
				
				/***** Mouse Events *****/				
				scope.doOnMouseDown = function ($event) {
					if ($event.which !== 1) {
						// if button other than left was pushed
						return undefined;
					}
					
					mouseFlags.downMouseCoords = DrawChemDirUtils.innerCoords(element, $event);
					mouseFlags.mouseDown = true;
					if (!DrawChemDirUtils.isContentEmpty()) {
						// if content is not empty
						checkIfDownOnAtom();
					}
					
					function checkIfDownOnAtom() {
						mouseFlags.downAtomCoords =
							DrawChemShapes.isWithin(
								DrawChemCache.getCurrentStructure(),
								mouseFlags.downMouseCoords
							).absPos;
						if (typeof mouseFlags.downAtomCoords !== "undefined") {
							// set flag if atom was selected
							mouseFlags.downOnAtom = true;
						}
					}
				}
				
				scope.doOnMouseUp = function ($event) {					
					var structure, mouseCoords = DrawChemDirUtils.innerCoords(element, $event);
					
					if ($event.which !== 1) {
						// if button other than left was released
						return undefined;
					}
					
					if (DrawChemDirUtils.isContentEmpty()) {
						// if content is empty
						structure = drawOnEmptyContent();
					} else if (mouseFlags.downOnAtom && selected === "label") {
						// if atom has been selected and 'change label' button is selected
						structure = modifyLabel();						
					} else if (mouseFlags.downOnAtom && selected === "structure") {
						// if atom has been selected and any of the structure buttons has been clicked
						structure = DrawChemDirUtils.modifyStructure(
							DrawChemCache.getCurrentStructure(),
							scope.chosenStructure,
							mouseCoords,
							mouseFlags.downAtomCoords
						);
					}
					
					if (typeof structure !== "undefined") {
						// if the structure has been successfully set to something
						DrawChemCache.addStructure(angular.copy(structure));
						DrawChemDirUtils.drawStructure(structure);						
					}
					
					DrawChemDirUtils.resetMouseFlags(mouseFlags);
					
					function modifyLabel() {
						var structure = angular.copy(DrawChemCache.getCurrentStructure()),
							atom = DrawChemShapes.isWithin(structure, mouseFlags.downMouseCoords).foundAtom;
						atom.setLabel(angular.copy(scope.chosenLabel));
						return structure;
					}
					
					function drawOnEmptyContent() {
						var structure;
						if (mouseFlags.movedOnEmpty) {
							structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
							structure.setOrigin(mouseFlags.downMouseCoords);
						} else {
							structure = angular.copy(scope.chosenStructure.getDefault());
							structure.setOrigin(mouseCoords);
						}
						return structure;
					}
				}				
				
				scope.doOnMouseMove = function ($event) {
					var mouseCoords = DrawChemDirUtils.innerCoords(element, $event), structure;
					
					if (selected !== "structure") {
						// if no structure has been chosen
						// then do nothing
						return undefined;
					}
						
					if (mouseFlags.downOnAtom) {
						// if an atom has been chosen
						structure = modifyOnNonEmptyContent();
						DrawChemDirUtils.drawStructure(structure);
					} else if (mouseFlags.mouseDown && DrawChemDirUtils.isContentEmpty()) {
						// if content is empty and mouse button is pushed
						structure = modifyOnEmptyContent();
						DrawChemDirUtils.drawStructure(structure);
					}
					
					function modifyOnNonEmptyContent() {
						var frozenCurrentStructure = DrawChemCache.getCurrentStructure();					
						return DrawChemDirUtils.modifyStructure(
							frozenCurrentStructure,
							scope.chosenStructure,
							mouseCoords,
							mouseFlags.downAtomCoords,
							true
						);
					}
					
					function modifyOnEmptyContent() {
						var struct = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
						struct.setOrigin(mouseFlags.downMouseCoords);
						mouseFlags.movedOnEmpty = true;
						return struct;
					}
				}
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
			cachedStructures = [{structure: null, svg: ""}],
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
			
			// the default distance between two parallel triple bonds in double bonds (as a percent of the bond length);
			service.BETWEEN_TRP_BONDS = 0.1;
			
			// the default bond width
			service.BOND_WIDTH = (service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2);
			
			// the default r of a circle around an atom
			service.CIRC_R = service.BOND_LENGTH * 0.12;
			
			// bond in north direction
			service.BOND_N = [0, -service.BOND_LENGTH];
			// bond in south direction
			service.BOND_S = [0, service.BOND_LENGTH];
			// bond in east direction
			service.BOND_E = [service.BOND_LENGTH, 0];
			// bond in west direction
			service.BOND_W = [-service.BOND_LENGTH, 0];
			// bond in north-east direction (first clock-wise)
			service.BOND_NE1 = [service.BOND_LENGTH / 2, -calcBond];
			// bond in north-east direction (second clock-wise)
			service.BOND_NE2 = [calcBond, -service.BOND_LENGTH / 2];
			// bond in south-east direction (first clock-wise)
			service.BOND_SE1 = [calcBond, service.BOND_LENGTH / 2],
			// bond in south-east direction (second clock-wise)
			service.BOND_SE2 = [service.BOND_LENGTH / 2, calcBond];
			// bond in south-west direction (first clock-wise)
			service.BOND_SW1 = [-service.BOND_LENGTH / 2, calcBond];
			// bond in south-west direction (second clock-wise)
			service.BOND_SW2 = [-calcBond, service.BOND_LENGTH / 2];
			// bond in north-west direction (first clock-wise)
			service.BOND_NW1 = [-calcBond, -service.BOND_LENGTH / 2];
			// bond in north-west direction (second clock-wise)	
			service.BOND_NW2 = [-service.BOND_LENGTH / 2, -calcBond];					
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
			
			service.BOND_N_NE1 = [calcBondAux1, -calcBondAux2];
			service.BOND_NE1_NE2 = [calcBondAux3, -calcBondAux3];
			service.BOND_NE2_E = [calcBondAux2, -calcBondAux1];
			service.BOND_E_SE1 = [calcBondAux2, calcBondAux1];
			service.BOND_SE1_SE2 = [calcBondAux3, calcBondAux3];
			service.BOND_SE2_S = [calcBondAux1, calcBondAux2];
			service.BOND_S_SW1 = [-calcBondAux1, calcBondAux2];
			service.BOND_SW1_SW2 = [-calcBondAux3, calcBondAux3];
			service.BOND_SW2_W = [-calcBondAux2, calcBondAux1];
			service.BOND_W_NW1 = [-calcBondAux2, -calcBondAux1];
			service.BOND_NW1_NW2 = [-calcBondAux3, -calcBondAux3];
			service.BOND_NW2_N = [-calcBondAux1, -calcBondAux2];
			
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
		.factory("DrawChemStructures", DrawChemStructures);
		
	DrawChemStructures.$inject = ["DrawChemConst", "DCStructure", "DCStructureCluster", "DCAtom", "DCBond", "DCLabel"];
	
	function DrawChemStructures(DrawChemConst, DCStructure, DCStructureCluster, DCAtom, DCBond, DCLabel) {

		var service = {},
			Atom = DCAtom.Atom,
			Bond = DCBond.Bond,
			Label = DCLabel.Label,
			Structure = DCStructure.Structure,
			StructureCluster = DCStructureCluster.StructureCluster,
			BONDS = DrawChemConst.BONDS;
		
		/**
		 * Generates benzene structures in each defined direction.
		 * @returns {StructureCluster}
		 */
		service.benzene = function () {
			var cluster,
				name = "benzene",
				defs = generateSixMemberedRings("aromatic");
				
			cluster = new StructureCluster(name, defs);
			return cluster;
		};
		
		/**
		 * Generates cyclohexane structures in each defined direction.
		 * @returns {StructureCluster}
		 */
		service.cyclohexane = function () {
			var cluster,
				name = "cyclohexane",
				defs = generateSixMemberedRings();
				
			cluster = new StructureCluster(name, defs);
			
			return cluster;
		};
		
		/**
		 * Generates single bond structures in each defined direction.
		 * @returns {StructureCluster}
		 */
		service.singleBond = function () {
			var cluster,
				name = "single-bond",
				defs = generateSingleBonds("single");
				
			cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		/**
		 * Generates double bond structures in each defined direction.
		 * @returns {StructureCluster}
		 */
		service.doubleBond = function () {
			var cluster,
				name = "double-bond",
				defs = generateSingleBonds("double");
				
			cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		/**
		 * Generates triple bond structures in each defined direction.
		 * @returns {StructureCluster}
		 */
		service.tripleBond = function () {
			var cluster,
				name = "triple-bond",
				defs = generateSingleBonds("triple");
				
			cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		/**
		 * Generates wedge bond structures in each defined direction.
		 * @returns {StructureCluster}
		 */
		service.wedgeBond = function () {
			var cluster,
				name = "wedge-bond",
				defs = generateSingleBonds("wedge");
				
			cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		/**
		 * Generates wedge bond structures in each defined direction.
		 * @returns {StructureCluster}
		 */
		service.dashBond = function () {
			var cluster,
				name = "dash-bond",
				defs = generateSingleBonds("dash");
				
			cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		/**
		 * An array of Label objects containing all supported labels.
		 */
		service.labels = [
			new Label("O", 2),
			new Label("S", 2),
			new Label("P", 3),
			new Label("N", 3),
			new Label("F", 1),
			new Label("Cl", 1),
			new Label("Br", 1),
			new Label("I", 1),
			new Label("H", 1)
		];
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [
			service.benzene,
			service.cyclohexane,
			service.singleBond,
			service.doubleBond,
			service.tripleBond,
			service.wedgeBond,
			service.dashBond
		];
		
		return service;
		
		/**
		 * Generates six-membered rings (60 deg between bonds) in each of defined direction.
		 * @param {String} decorate - indicates decorate element (e.g. aromatic ring)
		 * @returns {Structure[]}
		 */
		function generateSixMemberedRings(decorate) {
			var i, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				direction = BONDS[i].direction;				
				result.push(generateRing(direction));
			}
			
			return result;
			
			/**
			 * Generates a six-membered ring in the specified direction.
			 * This may be a little bit confusing, but in this function, the direction parameter (e.g. N, NE1)
			 * is associated not only with the bond direction,
			 * but is also used to indicate the relative position of an atom.
			 * @param {String} direction - direction of the ring
			 * @returns {Structure}
			 */
			function generateRing(direction) {
				var firstAtom, structure, bond,
					dirs = calcDirections(direction),
					opposite = Atom.getOppositeDirection(direction);
				
				firstAtom = new Atom([0, 0], [], "", dirs.current);
				genAtoms(firstAtom, dirs, 6);
				structure = new Structure(opposite, [firstAtom]);
				if (typeof decorate !== "undefined") {
					bond = DrawChemConst.getBondByDirection(opposite).bond;
					structure.addDecorate(decorate, [bond[0], bond[1]]);
				}
				
				return structure;
				
				/**
				 * Recursievely generates atoms.
				 * @param {Atom} atom - atom to which next atom will be added.
				 * @param {Object} dirs - keeps track of attached bonds, next bond and next atom
				 * @param {Number} depth - current depth of the structure tree				 
				 */
				function genAtoms(atom, dirs, depth) {
					var newDirs = calcDirections(dirs.nextDirection), newAtom;
					if (depth === 1) {
						return atom.addBond(new Bond("single", new Atom(dirs.nextBond, [], "")));
					}
					newAtom = new Atom(dirs.nextBond, [], "", newDirs.current);
					atom.addBond(new Bond("single", newAtom));
					genAtoms(newAtom, newDirs, depth - 1);
				}
				
				/**
				 * Calculates attached bonds, next bond and next atom.
				 * @param {String} direction - direction based on which calculations are made
				 * @returns {Object}
				 */
				function calcDirections(direction) {
					var i, left, right, next;
					
					for (i = 0; i < BONDS.length; i += 1) {
						if (BONDS[i].direction === direction) {
							left = moveToLeft(BONDS, i, 4);
							right = moveToRight(BONDS, i, 4);
							next = moveToRight(BONDS, i, 2);
							break;
						}
					}
					
					return {
						// attached bonds
						current: [BONDS[left].direction, BONDS[right].direction],
						// next bond
						nextBond: BONDS[right].bond,
						// next direction
						nextDirection: BONDS[next].direction
					};
					
					// this way, the array can be used circularly
					function moveToLeft(array, index, d) {
						if (index - d < 0) {
							return index - d + array.length;
						}
						return index - d;
					}
					
					// this way, the array can be used circularly
					function moveToRight(array, index, d) {
						if (index + d > array.length - 1) {
							return index + d - array.length;
						}
						return index + d;
					}
				}
			}
		}
		
		/**
		 * Generates single bonds in all defined directions.
		 * @param {String} type - bond type, e.g. 'single', 'double'.
		 * @returns {Structure[]}
		 */
		function generateSingleBonds(type) {
			var i, bond, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				bond = BONDS[i].bond;
				direction = BONDS[i].direction;
				result.push(
					new Structure(
						direction,
						[
							new Atom([0, 0], [
								new Bond(type, new Atom(bond, [], "", [Atom.getOppositeDirection(direction)]))
							], "", [direction])
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
		
	DrawChemShapes.$inject = ["DCShape", "DrawChemConst", "DCAtom", "DCBond"];
	
	function DrawChemShapes(DCShape, DrawChemConst, DCAtom, DCBond) {
		
		var service = {},
			BOND_LENGTH = DrawChemConst.BOND_LENGTH,
			BONDS_AUX = DrawChemConst.BONDS_AUX,
			BETWEEN_DBL_BONDS = DrawChemConst.BETWEEN_DBL_BONDS,
			BETWEEN_TRP_BONDS = DrawChemConst.BETWEEN_TRP_BONDS,
			Atom = DCAtom.Atom;
		
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
			var modStr,
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
					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					
					if (found) { break; }
					
					isInsideCircle = insideCircle(absPos, mousePos);
					
					if (isInsideCircle && !mouseDownAndMove) {
						// if 'mouseup' was within a circle around an atom
						// and if a valid atom has not already been found
							modStr = chooseMod(aux);			
							updateBonds(aux, modStr, absPos);
							updateDecorate(modStr, absPos);
							found = true;
							return base;										
					}
					
					if (!isInsideCircle && compareCoords(down, absPos, 5)) {
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
					if (modStr !== null && typeof modStr.getDecorate("aromatic") !== "undefined") {
						coords = DrawChemConst.getBondByDirection(modStr.getName()).bond;
						return base.addDecorate("aromatic", [coords[0] + abs[0], coords[1] + abs[1]]);
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
							atom.attachBond(newName);
							return atom.calculateNext();
						}
					}
				}
			}
			
			/**
			 * Compares coordinates in two arrays. Returns false if at least one of them is undefined or if any pair of the coordinates is inequal.
			 * Returns true if they are equal.
			 * @param {Number[]} arr1 - an array of coordinates,
			 * @param {Number[]} arr2 - an array of coordinates,
			 * @param {Number} prec - precision,
			 * @returns {Boolean}
			 */
			function compareCoords(arr1, arr2, prec) {				
				if (typeof arr1 === "undefined" || typeof arr2 === "undefined") {
					return false;
				}
				return arr1[0].toFixed(prec) === arr2[0].toFixed(prec) && arr1[1].toFixed(prec) === arr2[1].toFixed(prec);
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
						next = current.getNext();
						if (next === "max") {
							return null;
						}
						name = at.getName();
						toCompare = output || next;
						if (toCompare === name) {
							current.attachBond(name);
							current.calculateNext();							
							return at;
						}
					}
				}
			}
		}
		
		/**
		 * Checks if the mouse pointer is within a circle of an atom. If the atom is found, a function is called on it (if supplied).
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
					aux = struct[i] instanceof Atom ? struct[i]: struct[i].getAtom();
					absPos = [aux.getCoords("x") + pos[0], aux.getCoords("y") + pos[1]];
					if (!found && insideCircle(absPos, position)) {
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
				minMax = output.minMax;
			shape = new DCShape.Shape(genElements().full, genElements().mini, id);
			shape.elementFull = shape.generateStyle("full") + shape.elementFull;
			shape.elementMini = shape.generateStyle("mini") + shape.elementMini;
			shape.setMinMax(minMax);
			return shape;
			
			/**
			 * Generates a string from the output array and wraps each line with 'path' tags, each circle with 'circle' tags,
			 * and each decorate element with suitable tags.
			 */
			function genElements() {
				var full = "", mini = "", aux = "";
				paths.forEach(function (path) {
					if (typeof path.class !== "undefined") {
						aux = "<path class='" + path.class + "' d='" + path.line + "'></path>";
					} else {
						aux = "<path d='" + path.line + "'></path>";
					}					
					full += aux;
					mini += aux;					
				});
				circles.forEach(function (circle) {
					full += "<circle class='atom' cx='" + circle[0] + "' cy='" + circle[1] + "' r='" + circle[2] + "' ></circle>";
				});
				labels.forEach(function (label) {
					aux = drawDodecagon(label) +
						"<text writing-mode='" + label.mode + "' x='" + label.labelX +  "' y='" + label.labelY + "'>" + label.label + "</text>";
					full += aux;
					mini += aux;
				});
				if (input.getDecorate("aromatic")) {
					input.getDecorate("aromatic").forEach(function (coords) {
						aux = "<circle class='arom' cx='" + coords[0] +
						"' cy='" + coords[1] +
						"' r='" + DrawChemConst.AROMATIC_R +
						"' ></circle>";
						full += aux;
						mini += aux;
					})					
				}
				
				return {
					full: full,
					mini: mini
				};
				
				function drawDodecagon(label) {
					var i, x, y, aux, factor,result = [];
					
					aux = label.length === 1 ? 0.58: 0.5;
					factor = aux * label.height / BOND_LENGTH;
					for (i = 0; i < BONDS_AUX.length; i += 1) {
						x = BONDS_AUX[i].bond[0];
						y = BONDS_AUX[i].bond[1];
						result = result.concat(addCoords([label.atomX, label.atomY], [x, y], factor));
					}					
					return "<polygon class='text' points='" + stringifyPaths([result])[0].line + "'></polygon>";
				}
			}
			
			/**
			* Translates the input into an svg-suitable set of coordinates.
			* @param {Structure} input - an input object
			* @returns {Object}
			*/
		    function parseInput(input) {
				var output = [], circles = [], labels = [],
					origin = input.getOrigin(),
					minMax = {
						minX: origin[0],
						minY: origin[1],
						maxX: origin[0],
						maxY: origin[1]
					},
					circR = DrawChemConst.CIRC_R,
					// sets the coordinates of the root element
					// 'M' for 'moveto' - sets pen to the coordinates
					len = output.push(["M", origin]);
				   
				circles.push([
				   input.getOrigin("x"),
				   input.getOrigin("y"),
				   circR
				]);
				
				updateLabel(origin, input.getStructure(0));
				connect(input.getStructure(0).getBonds(), output[len - 1]);
			   
				return {
					paths: stringifyPaths(output),
					circles: circles,
					labels: labels,
					minMax: minMax
				};
			   
				/**
				* Recursively translates the input, until it finds an element with an empty 'bonds' array.
				* @param {Bond[]} bonds - an array of Bond objects
				* @param {String|Number[]} - an array of coordinates with 'M' and 'L' commands
				*/
				function connect(bonds, currentLine) {
					var i, absPos, atom, bondType,
						prevAbsPos = [
							circles[circles.length - 1][0],
							circles[circles.length - 1][1]
						];			
					for (i = 0; i < bonds.length; i += 1) {
						atom = bonds[i].getAtom();
						bondType = bonds[i].getType();
						absPos = [
							prevAbsPos[0] + atom.getCoords("x"),
							prevAbsPos[1] + atom.getCoords("y")
						];
						updateMinMax(absPos);
						updateLabel(absPos, atom);
						circles.push([absPos[0], absPos[1], circR]);
						if (i === 0) {
							drawLine(prevAbsPos, absPos, bondType, atom, "continue");
						} else {
							drawLine(prevAbsPos, absPos, bondType, atom, "begin");
						}
					}					
				}
				
				function drawLine(prevAbsPos, absPos, bondType, atom, mode) {
					var newLen = output.length;
					if (bondType === "single") {
						if (mode === "continue") {
							output[newLen - 1].push("L");
							output[newLen - 1].push(absPos);
						} else if (mode === "begin") {
							newLen = output.push(["M", prevAbsPos, "L", absPos]);
						}
					} else if (bondType === "double") {						
						output.push(calcDoubleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "triple") {
						output.push(calcTripleBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "wedge") {
						output.push(calcWedgeBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					} else if (bondType === "dash") {
						output.push(calcDashBondCoords(prevAbsPos, absPos));
						newLen = output.push(["M", absPos]);
					}
					connect(atom.getBonds(), output[newLen - 1]);					
				}
				
				function calcDoubleBondCoords(start, end) {
					var vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
						M1 = addCoords(start, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
						L1 = addCoords(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
						M2 = addCoords(start, perpVectCoordsCW, BETWEEN_DBL_BONDS),
						L2 = addCoords(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
					return ["M", M1, "L", L1, "M", M2, "L", L2];
				}
				
				function calcTripleBondCoords(start, end) {
					var vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
						M1 = addCoords(start, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
						L1 = addCoords(end, perpVectCoordsCCW, BETWEEN_TRP_BONDS),
						M2 = addCoords(start, perpVectCoordsCW, BETWEEN_TRP_BONDS),
						L2 = addCoords(end, perpVectCoordsCW, BETWEEN_TRP_BONDS);
					return ["M", M1, "L", L1, "M", start, "L", end, "M", M2, "L", L2];
				}
				
				function calcWedgeBondCoords(start, end) {
					var vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]],
						L1 = addCoords(end, perpVectCoordsCCW, BETWEEN_DBL_BONDS),
						L2 = addCoords(end, perpVectCoordsCW, BETWEEN_DBL_BONDS);
					return ["wedge", "M", start, "L", L1, "L", L2, "Z"];
				}
				
				function calcDashBondCoords(start, end) {
					var i, max = 7, factor = BETWEEN_DBL_BONDS / max, M, L, currentEnd = start, result = [],
						vectCoords = [end[0] - start[0], end[1] - start[1]],
						perpVectCoordsCCW = [-vectCoords[1], vectCoords[0]],
						perpVectCoordsCW = [vectCoords[1], -vectCoords[0]];
						
					for (i = max; i > 0; i -= 1) {
						factor = factor + BETWEEN_DBL_BONDS / max;
						currentEnd = [currentEnd[0] + vectCoords[0] / max, currentEnd[1] + vectCoords[1] / max];
						M = addCoords(currentEnd, perpVectCoordsCCW, factor);
						L = addCoords(currentEnd, perpVectCoordsCW, factor);
						result = result.concat(["M", M, "L", L]);
					}
					return result;
				}
				
				function updateLabel(absPos, atom) {
					var label = atom.getLabel(), labelObj;
					if (typeof label !== "undefined") {
						labelObj = genLabelInfo();
						labels.push(labelObj);
						updateMinMax([labelObj.x - 0.7 * labelObj.width / 2, labelObj.y - 0.7 * labelObj.height * 3 / 5]);
						updateMinMax([labelObj.x + 0.7 * labelObj.width / 2, labelObj.y + 0.7 * labelObj.height * 2 / 5]);
					}
					
					function genLabelInfo() {
						var bondsRemained = label.getMaxBonds() - atom.getAttachedBonds().length,
							labelNameObj = { name: label.getLabelName() };
							
						addHydrogens();
						
						return {
							length: labelNameObj.name.length,
							label: labelNameObj.name,
							mode: labelNameObj.mode || "lr",
							atomX: absPos[0],
							atomY: absPos[1],
							labelX: absPos[0] + labelNameObj.correctX,
							labelY: absPos[1] + 0.013 * Math.abs(absPos[1]),
							width: DCShape.fontSize * labelNameObj.name.length,
							height: DCShape.fontSize
						};
						
						function addHydrogens() {
							var i, correctX, hydrogens = 0;
							for (i = 0; i < bondsRemained; i += 1) {
								hydrogens += 1;								
							}
							
							labelNameObj.hydrogens = hydrogens;
							
							if (hydrogens > 0) {
								if (isLeft()) {
									labelNameObj.name = hydrogens === 1 ?
										 "H" + labelNameObj.name: "H" + hydrogens + labelNameObj.name;
									labelNameObj.mode = "rl";
									switch (hydrogens) {
										case 1: correctX = -0.028 * labelNameObj.name.length; break;
										case 2: correctX = -0.032 * labelNameObj.name.length; break;
									}
								} else {
									labelNameObj.name = hydrogens === 1 ?
										labelNameObj.name + "H": labelNameObj.name + "H" + hydrogens;
									switch (hydrogens) {
										case 1: correctX = 0.034 * (labelNameObj.name.length - 1); break;
										case 2: correctX = 0.028 * (labelNameObj.name.length - 1); break;
									}									
								}
							}
							
							correctX = correctX || 0.034 * (labelNameObj.name.length - 1);
							
							labelNameObj.correctX = correctX * Math.abs(absPos[0]);
							
							function isLeft() {
								var countE = 0;
								atom.getAttachedBonds().forEach(function (direction) {
									countE = direction.indexOf("E") < 0 ? countE: countE + 1;
								});
								return countE > 0;
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
			}
			
			function check(arg1, arg2, arg3, arg4) {
				return pos1[0] >= (pos2[0] + arg1) && pos1[0] <= (pos2[0] + arg2) &&
					pos1[1] >= (pos2[1] + arg3) && pos1[1] <= (pos2[1] + arg4);
			}
		}
		
		return service;
		
		/**
		 * Checks if a point is inside an area delimited by a circle.
		 * @param {Number[]} center - coordinates of the center of a circle
		 * @param {Number[]} point - coordinates of a point to be validated
		 * @returns {Boolean}
		 */
		function insideCircle(center, point) {
			var tolerance = DrawChemConst.CIRC_R;
			return Math.abs(center[0] - point[0]) < tolerance && Math.abs(center[1] - point[1]) < tolerance;
		}
		
		/**
		* Transforms output into an array of strings.
		* Basically, it translates each array of coordinates into its string representation.
		* @returns {String[]}
		*/
		function stringifyPaths(output) {
			var result = [], i, j, line, point, lineStr;
			for (i = 0; i < output.length; i += 1) {
				line = output[i];
				lineStr = { line: "" };
				for (j = 0; j < line.length; j += 1) {
					point = line[j];
					if (typeof point === "string") {
						if (point === "wedge") {
							lineStr.class = "wedge";
						} else {
							lineStr.line += point + " ";
						}
					} else {
						lineStr.line += point[0] + " " + point[1] + " ";
					}
				}
				result.push(lineStr);
			}
			return result;
		}
		
		function addCoords(coords1, coords2, factor) {
			return typeof factor === "undefined" ?
				[(coords1[0] + coords2[0]).toFixed(2), (coords1[1] + coords2[1]).toFixed(2)]:
				[(coords1[0] + factor * coords2[0]).toFixed(2), (coords1[1] + factor * coords2[1]).toFixed(2)];
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