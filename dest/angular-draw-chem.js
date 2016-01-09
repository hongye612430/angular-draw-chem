(function () {
	"use strict";
	angular.module("mmAngularDrawChem", ["ngSanitize"])
		.config(["$sanitizeProvider", function ($sanitizeProvider) {
			$sanitizeProvider.enableSvg();
		}]);
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = ["DrawChemShapes", "DrawChemStructures", "DrawChem", "$sce", "$window", "DrawChemConst"];
	
	function DrawChemEditor(DrawChemShapes, DrawChemStructures, DrawChem, $sce, $window, DrawChemConst) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				
				var downAtomCoords,
					mouseDown = false,
					downOnAtom = false;
				
				/**
				 * Sets width and height of the dialog box based on corresponding attributes.
				 */
				scope.dialogStyle = {};
				if (attrs.width) {
					scope.dialogStyle.width = attrs.width;					
				}
				if (attrs.height) {
					scope.dialogStyle.height = attrs.height;					
				}
				
				/**
				 * Closes the editor.
				 */
				scope.closeEditor = function () {
					DrawChem.closeEditor();
				}
				
				/**
				 * Returns content to be bound in the dialog box.
				 */
				scope.content = function () {
					return $sce.trustAsHtml(DrawChem.getContent());
				}
				
				/**
				 * Clears the content.
				 */
				scope.clear = function () {
					DrawChem.clearContent();
				}
				
				/**
				 * Transfers the content.
				 */
				scope.transfer = function () {
					DrawChem.transferContent();
				}
				
				/**
				 * Stores the chosen structure.
				 */
				scope.chosenStructure;
				
				/**
				 * Stores the current structure.
				 */
				scope.currentStructure;
				
				/**
				 * Stores all predefined structures.
				 */
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
						}
					});
				});
				
				/**
				 * Action to perform on 'mousedown' event.
				 */
				scope.doOnMouseDown = function ($event) {
					var clickCoords = innerCoords($event);						
					mouseDown = true;
					if (DrawChem.getContent() !== "") {
						downAtomCoords = DrawChemShapes.isWithin(scope.currentStructure, clickCoords).absPos;
						downOnAtom = true;
					}
				}
				
				/**
				 * Action to perform on 'mouseup' event.
				 */
				scope.doOnMouseUp = function ($event) {
					var clickCoords = innerCoords($event);
					if (DrawChem.getContent() !== "") {
						scope.currentStructure = modifyStructure(scope.currentStructure, clickCoords);						
					} else {
						scope.currentStructure = angular.copy(scope.chosenStructure).getDefault();
						scope.currentStructure.setOrigin(clickCoords);
					}
					draw(scope.currentStructure);
					resetMouseFlags();
				}
				
				/**
				 * Action to perform on 'mousemove' event.
				 */
				scope.doOnMouseMove = function ($event) {
					var clickCoords, updatedCurrentStructure, frozenCurrentStructure;
					if (downOnAtom) {
						clickCoords = innerCoords($event);
						frozenCurrentStructure = angular.copy(scope.currentStructure);
						updatedCurrentStructure = modifyStructure(frozenCurrentStructure, clickCoords);
						draw(updatedCurrentStructure);
					}							
				}
				
				/**
				 * Calculates the coordinates of the mouse pointer during an event.
				 * Takes into account the margin of the enclosing div.
				 * @params {Event} $event - an Event object
				 * @returns {Number[]}
				 */
				function innerCoords($event) {
					// 
					var content = element.find("dc-content")[0],
						coords = [								
							parseFloat(($event.clientX - content.getBoundingClientRect().left - 2).toFixed(2)),
							parseFloat(($event.clientY - content.getBoundingClientRect().top - 2).toFixed(2))
						]
					return coords;
				}
				
				/**
				 * Resets to default values associated with mouse events.
				 */
				function resetMouseFlags() {
					mouseDown = false;
					downOnAtom = false;
					downAtomCoords = undefined;
				}
				
				/**
				 * Draws the specified structure.
				 * @params {Structure} structure - a Structure object to draw.
				 */
				function draw(structure) {
					var drawn = "";					
					drawn = DrawChemShapes.draw(structure, "cmpd1").generate();
					DrawChem.setContent(drawn);					
				}
				
				/**
				 * Modifies the specified structure by adding a new structure to it.
				 * @params {Structure} structure - a Structure object to modify,
				 * @params {Number[]} clickCoords - coordinates of the mouse pointer
				 * @returns {Structure}
				 */
				function modifyStructure(structure, clickCoords) {
					return DrawChemShapes.modifyStructure(
							structure,
							angular.copy(scope.chosenStructure),
							clickCoords,
							downAtomCoords
						);
				}
			}
		}
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
		* @param {Number[]} - an array with coordinates of the atom
		* @param {Atom[]} - an array of atoms this atom is connected with
		*/
		function Atom(coords, bonds, info, attachedBonds) {
			this.coords = coords;	
			this.bonds = bonds;
			this.info = info;
			this.attachedBonds = attachedBonds || [];
			this.next = "";
			this.calculateNext();
		}
		
		Atom.getOppositeBond = function (bond) {
			switch (bond) {
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
		Atom.prototype.addBond = function (atom) {
			this.bonds.push(atom);
		}
		
		/**
		 * Adds new bonds.
		 * @param {Atom[]} bonds - an array of bonds to be added
		 */
		Atom.prototype.addBonds = function (bonds) {
			bonds.forEach(function (atom) {
				this.bonds.push(atom);
			}, this);
		}
		
		service.Atom = Atom;
		
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
		
		/**
		 * Creates a new Shape. This helper class has methods
		 * for wrapping an svg element (e.g. path) with other elements (e.g. g, defs).		 
		 * @class
		 * @private
		 * @param {string} element - an svg element
		 * @param {string} id - an id of the element
		 */
		function Shape(element, id) {
			this.element = element;
			this.id = id;
			this.scale = 1;
			this.transformAttr = "";
			this.style = {
				"path": {
					"stroke": "black",
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					"fill": "none"
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
				}
			}
		}
		
		/**
		 * Wraps an instance of Shape with a custom tag.
		 * @param {string} el - name of the tag, if this param equals 'g', then id attribute is automatically added
		 * @param {Object} attr - attribute of the tag
		 * @param {string} attr.key - name of the attribute
		 * @param {string} attr.val - value of the attribute
		 * @returns {Shape}
		 */
		Shape.prototype.wrap = function (el, attr) {
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
				this.element = tagOpen + ">" + this.element + "</" + el + ">";
			} else {
				this.element = "<" + el + ">" + this.element + "</" + el + ">";
			}
			return this;
		};
		
		/**
		 * Adds a specified transformation to transformAttr.
		 * @param {string} transform - the transformation (e.g. scale, translate)
		 * @param {Object} value - coordinates of the transformation
		 * @param {number} value.x - x coordinate
		 * @param {number} value.y - y coordinate
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
		
		/**
		 * Adds a specified style to styleAttr.
		 * 
		 */
		Shape.prototype.style = function (style) {
			// todo
		};
		
		/**
		 * Generates 'use' tag based on id, transformAttr, and styleAttr.
		 * @returns {string}
		 */
		Shape.prototype.generateUse = function () {
			return "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#" + this.id +
				"' transform='" + this.transformAttr +
				"'></use>";
		};
		
		Shape.prototype.generateStyle = function () {
			var attr = "<style type=\"text/css\">";
			angular.forEach(this.style, function (value, key) {
				attr += key + "{";
				angular.forEach(value, function (value, key) {
					attr += key + ":" + value + ";";
				});
				attr += "}"
			});
			return attr + "</style>";
		}
		
		/**
		 * Generates 'use' element and wraps the content with 'svg' tags.
		 * @returns {string}
		 */
		Shape.prototype.generate = function () {
			//this.element += this.generateUse();
			return this.wrap("svg").element;
		};
		
		service.Shape = Shape;
		
		return service;		
	}		
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructureCluster", DCStructureCluster);
	
	function DCStructureCluster() {
		
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
			this.decorate = decorate;
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
		 * @returns {String}
		 */
		Structure.prototype.getDecorate = function () {
			return this.decorate;
		}
		
		service.Structure = Structure;
		
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
			// the default bond length
			service.BOND_LENGTH = service.SET_BOND_LENGTH || 20;
			
			// proportion of the bond width to bond length
			// 0.04 corresponds to the ACS settings in ChemDraw, according to
			// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
			service.WIDTH_TO_LENGTH = 0.04;
			
			// the default bond width
			service.BOND_WIDTH = parseFloat((service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2));
			
			// the default r of a circle around an atom
			service.CIRC_R = service.BOND_LENGTH * 0.12;
			
			// bond in north direction
			service.BOND_N = [0, -service.BOND_LENGTH];
			// bond in south direction
			service.BOND_S = [0, service.BOND_LENGTH];
			// bond in east direction
			service.BOND_E = [parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), 0];
			// bond in west direction
			service.BOND_W = [-parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), 0];
			// bond in north-east direction (first clock-wise)
			service.BOND_NE1 = [service.BOND_LENGTH / 2, -parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))],
			// bond in north-east direction (second clock-wise)
			service.BOND_NE2 = [parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), -service.BOND_LENGTH / 2];
			// bond in south-east direction (first clock-wise)
			service.BOND_SE1 = [parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), service.BOND_LENGTH / 2],
			// bond in south-east direction (second clock-wise)
			service.BOND_SE2 = [service.BOND_LENGTH / 2, parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))];
			// bond in south-west direction (first clock-wise)
			service.BOND_SW1 = [-service.BOND_LENGTH / 2, parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))];
			// bond in south-west direction (second clock-wise)
			service.BOND_SW2 = [-parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), service.BOND_LENGTH / 2];
			// bond in north-west direction (first clock-wise)
			service.BOND_NW1 = [-parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2)), -service.BOND_LENGTH / 2];
			// bond in north-west direction (second clock-wise)	
			service.BOND_NW2 = [-service.BOND_LENGTH / 2, -parseFloat((service.BOND_LENGTH * Math.sqrt(3) / 2).toFixed(2))];					
			// bonds as array
			service.BONDS = [
				{ direction: "N", bond: service.BOND_N },
				{ direction: "S", bond: service.BOND_S },
				{ direction: "E", bond: service.BOND_E },
				{ direction: "W", bond: service.BOND_W },
				{ direction: "NE1", bond: service.BOND_NE1 },
				{ direction: "NE2", bond: service.BOND_NE2 },
				{ direction: "NW1", bond: service.BOND_NW1 },
				{ direction: "NW2", bond: service.BOND_NW2 },
				{ direction: "SE1", bond: service.BOND_SE1 },
				{ direction: "SE2", bond: service.BOND_SE2 },
				{ direction: "SW1", bond: service.BOND_SW1 },
				{ direction: "SW2", bond: service.BOND_SW2 }
			];	
		}		
		
		return service;		
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
					content: ""
				});
			}
			inst = getInstance(name);
			currentInstance.name = inst.name;
			currentInstance.content = inst.content;
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
				setInstance(content, name);
			}
		}
		
		/**
		 * Transfers the currently active 'instance' to 'instances' array.
		 * @public
		 */
		service.transferContent = function () {
			setInstance(currentInstance.content, currentInstance.name);
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
				setInstance("", name);
			} else {
				currentInstance.content = "";	
			}			
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
		function setInstance(content, name) {
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
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemShapes", DrawChemShapes);
		
	DrawChemShapes.$inject = ["DCShape", "DrawChemConst", "DCAtom"];
	
	function DrawChemShapes(DCShape, DrawChemConst, DCAtom) {
		
		var service = {}, Atom = DCAtom.Atom;
		
		/**
		 * Modifies the structure.
		 * @param {Structure} base - structure to be modified,
		 * @param {Structure} mod - structure to be added,
		 * @param {Number[]} mousePos - position of the mouse when 'mouseup' event occurred
		 * @param {Number[]|undefined} down - position of the mouse when 'mousedown' event occurred
		 * @returns {Structure}
		 */
		service.modifyStructure = function (base, mod, mousePos, down) {
			var modStr,
				found = false,
				origin = base.getOrigin();	
			
			modStructure(base.getStructure(), origin);
			
			return base;
			
			/**
			* Recursively looks for an atom to modify.
			* @param {Atom[]} base - array of atoms,
			* @param {Number[]} pos - absolute coordinates of an atom
			*/
			function modStructure(struct, pos) {
				var i, absPos;
				for(i = 0; i < struct.length; i += 1) {
					absPos = [struct[i].getCoords("x") + pos[0], struct[i].getCoords("y") + pos[1]];
					if (!found && insideCircle(absPos, mousePos)) {
						// if 'mouseup' was within a circle around an atom
						// and if a valid atom has not already been found
							modStr = chooseMod(struct[i]);
							updateBonds(struct[i], modStr, absPos);							
							found = true;
							return base;										
					}
					
					if (!found && compareCoords(down, absPos, 5)) {
						// if 'mousedown' was within a circle around an atom
						// and if a valid atom has not already been found
						modStr = chooseDirectionManually(struct[i]);
						updateBonds(struct[i], modStr, absPos);
						found = true;
						return base;
					}
					
					// if none of the above was true, then continue looking down the structure tree
					modStructure(struct[i].getBonds(), absPos);					
				}
				
				/**
				 * Updates bonds array in an Atom object.
				 * @param {Atom} atom - an Atom object to update
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
						newAbsPos = [struct[i].getCoords("x") + absPos[0], struct[i].getCoords("y") + absPos[1]];
						atom = service.isWithin(base, newAbsPos).foundAtom;
						if (typeof atom !== "undefined") {
							newName = Atom.getOppositeBond(modStr.getName());
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
				var alpha = Math.PI / 6,
					r = Math.sqrt(Math.pow((mousePos[0] - down[0]), 2) + Math.pow((mousePos[1] - down[1]), 2)),
					x = Math.sin(alpha / 2) * r,
					x1 = Math.cos(3 * alpha / 2) * r,
					y = Math.cos(alpha / 2) * r,
					y1 = Math.sin(3 * alpha / 2) * r,
					output;
				if (check(-x, x, -r, -y)) {
					output = "N";
				} else if (check(x, x1, -y, -y1)) {
					output = "NE1";
				} else if (check(x1, y, -y1, -x)) {
					output = "NE2";
				} else if (check(y, r, -x, x)) {
					output = "E";
				} else if (check(x1, y, x, y1)) {
					output = "SE1";
				} else if (check(x, x1, y1, y)) {
					output = "SE2";
				} else if (check(-x, x, y, r)) {
					output = "S";
				} else if (check(-x1, -x, y1, y)) {
					output = "SW1";
				} else if (check(-y, -x1, x, y1)) {
					output = "SW2";
				} else if (check(-r, -y, -x, x)) {
					output = "W";
				} else if (check(-y, -x1, -y1, -x)) {
					output = "NW1";
				} else if (check(-x1, -x, -y, -y1)) {
					output = "NW2";
				}
				
				return chooseMod(current, output);
			
				function check(arg1, arg2, arg3, arg4) {
					return mousePos[0] > (down[0] + arg1) && mousePos[0] <= (down[0] + arg2) &&
						mousePos[1] >= (down[1] + arg3) && mousePos[1] <= (down[1] + arg4);
				}				
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
				
			checkDeeper(structure.getStructure(), origin);
			
			return foundObj;
			
			function checkDeeper(struct, pos) {
				var i, absPos;
				for(i = 0; i < struct.length; i += 1) {
					absPos = [struct[i].getCoords("x") + pos[0], struct[i].getCoords("y") + pos[1]];
					if (!found && insideCircle(absPos, position)) {
						found = true;
						foundObj.foundAtom = struct[i];
						foundObj.absPos = absPos;
					} else {
						checkDeeper(struct[i].getBonds(), absPos);
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
				circles = output.circles;
			shape = new DCShape.Shape(genElements(), id);
			shape.element = shape.generateStyle() + shape.element;
			return shape.wrap("g");
			
			// generates a string from the output array and wraps each line with 'path' tags.
			function genElements() {
				var result = "", coords;
				paths.forEach(function (path) {
					result += "<path d='" + path + "'></path>";					
				});
				circles.forEach(function (circle) {
					result += "<circle class='atom' cx='" + circle[0] + "' cy='" + circle[1] + "' r='" + circle[2] + "' ></circle>";
				});
				if (input.getDecorate() === "aromatic") {
					result += "<circle class='arom' cx='" + input.getOrigin("x") +
						"' cy='" + (input.getOrigin("y") + DrawChemConst.BOND_LENGTH) +
						"' r='" + DrawChemConst.BOND_LENGTH * 0.45 +
						"' ></circle>";
				}
				
				return result;
			}
		}
		
		/**
		 * Translates the input into an svg-suitable set of coordinates.
		 * @param {Structure} input - an input object
		 * @returns {Object}
		 */
		function parseInput(input) {
			var output = [], circles = [], circR = DrawChemConst.CIRC_R,
				// sets the coordinates of the root element
				// 'M' for 'moveto' - sets pen to the coordinates
				len = output.push(["M", input.getOrigin()]);
				
			circles.push([
				input.getOrigin("x"),
				input.getOrigin("y"),
				circR
			]);
			
			connect(input.getOrigin(), input.getStructure(0).getBonds(), output[len - 1]);
			
			return {
				paths: stringifyPaths(),
				circles: circles
			}
			
			/**
			 * Recursively translates the input, until it finds an element with an empty 'bonds' array.
			 * @param {Number[]} root - a two-element array of coordinates of the root element
			 * @param {Structure[]} bonds - an array of Structure 'instances'
			 * @param {Array} - an array of coordinates with 'M' and 'l' commands
			 */
			function connect(root, bonds, currentLine) {
				var i, newLen, absPos,
					prevAbsPos = [
						circles[circles.length - 1][0],
						circles[circles.length - 1][1]
					];				
				// if length of the bonds is 0, then do nothing				
				if (bonds.length > 0) {
					absPos = [
						prevAbsPos[0] + bonds[0].getCoords("x"),
						prevAbsPos[1] + bonds[0].getCoords("y")
					];
					circles.push([absPos[0], absPos[1], circR]);
					currentLine.push("L"); // 'l' for lineto - draws line to the specified coordinates
					currentLine.push(absPos);					
					if (bonds[0].getInfo() === "Z") {
						currentLine.push("Z");
						if (bonds[0].getBonds().length > 0) {
							newLen = output.push(["M", absPos]);
							connect(absPos, bonds[0].getBonds(), output[newLen - 1]);
						}
					} else {
						connect(bonds[0].getCoords(), bonds[0].getBonds(), currentLine);
					}
				}				
				for (i = 1; i < bonds.length; i += 1) {
					absPos = [
						prevAbsPos[0] + bonds[i].getCoords("x"),
						prevAbsPos[1] + bonds[i].getCoords("y")
					];
					circles.push([absPos[0], absPos[1], circR]);
					newLen = output.push(["M", prevAbsPos, "L", absPos]);
					connect(absPos, bonds[i].getBonds(), output[newLen - 1]);
				}
			}
			
			/**
			 * Transforms output into an array of strings.
			 * Basically, it translates each array of coordinates into its string representation.
			 * @returns {String[]}
			 */
			function stringifyPaths() {
				var result = [], i, j, line, point, lineStr;
				for (i = 0; i < output.length; i += 1) {
					line = output[i];
					lineStr = "";
					for (j = 0; j < line.length; j += 1) {
						point = line[j];
						if (typeof point === "string") {
							lineStr += point + " ";
						} else {
							lineStr += point[0] + " " + point[1] + " ";
						}
					}
					result.push(lineStr);
				}
				return result;
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
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);
		
	DrawChemStructures.$inject = ["DrawChemConst", "DCStructure", "DCStructureCluster", "DCAtom"];
	
	function DrawChemStructures(DrawChemConst, DCStructure, DCStructureCluster, DCAtom) {

		var service = {},
			benzene,
			Atom = DCAtom.Atom,
			StructureCluster = DCStructureCluster.StructureCluster,
			singleBond,
			BOND_N = DrawChemConst.BOND_N,
			BOND_S = DrawChemConst.BOND_S,
			BOND_W = DrawChemConst.BOND_W,
			BOND_E = DrawChemConst.BOND_E,
			BOND_NE1 = DrawChemConst.BOND_NE1,
			BOND_NE2 = DrawChemConst.BOND_NE2,
			BOND_NW1 = DrawChemConst.BOND_NW1,
			BOND_NW2 = DrawChemConst.BOND_NW2,
			BOND_SE1 = DrawChemConst.BOND_SE1,
			BOND_SE2 = DrawChemConst.BOND_SE2,
			BOND_SW1 = DrawChemConst.BOND_SW1,
			BOND_SW2 = DrawChemConst.BOND_SW2;
			
		service.benzene = function () {
			var name = "benzene",
				defs = [
					new DCStructure.Structure(
						"N",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE1, [
									new Atom(BOND_S, [
										new Atom(BOND_SW2, [
											new Atom(BOND_NW1, [
												new Atom(BOND_N, [], "Z", ["S", "NE2"])
											], "", ["SE1", "N"])
										], "", ["NE2", "NW1"])
									], "", ["N", "SW2"])
								], "", ["NW1", "S"])
							], "", ["SE1", "SW2"])			
						],
						"aromatic"
					)
				],
				cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		service.cyclohexane = function () {
			var name = "cyclohexane",
				defs = [
					new DCStructure.Structure(
						"N",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE1, [
									new Atom(BOND_S, [
										new Atom(BOND_SW2, [
											new Atom(BOND_NW1, [
												new Atom(BOND_N, [], "Z", ["S", "NE2"])
											], "", ["SE1", "N"])
										], "", ["NE2", "NW1"])
									], "", ["N", "SW2"])
								], "", ["NW1", "S"])
							], "", ["SE1", "SW2"])			
						]
					)
				],
				cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		service.singleBond = function () {
			var name = "single-bond",
				defs = [
					new DCStructure.Structure(
						"N",
						[
							new Atom([0, 0], [
								new Atom(BOND_N, [], "", ["S"])
							], "", ["N"])
						]
					),
					new DCStructure.Structure(
						"NE1",
						[
							new Atom([0, 0], [
								new Atom(BOND_NE1, [], "", ["SW1"])
							], "", ["NE1"])
						]
					),
					new DCStructure.Structure(
						"NE2",
						[
							new Atom([0, 0], [
								new Atom(BOND_NE2, [], "", ["SW2"])
							], "", ["NE2"])
						]
					),
					new DCStructure.Structure(
						"E",
						[
							new Atom([0, 0], [
								new Atom(BOND_E, [], "", ["W"])
							], "", ["E"])
						]
					),
					new DCStructure.Structure(
						"SE1",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE1, [], "", ["NW1"])
							], "", ["SE1"])
						]
					),
					new DCStructure.Structure(
						"SE2",
						[
							new Atom([0, 0], [
								new Atom(BOND_SE2, [], "", ["NW2"])
							], "", ["SE2"])
						]
					),
					new DCStructure.Structure(
						"S",
						[
							new Atom([0, 0], [
								new Atom(BOND_S, [], "", ["N"])
							], "", ["S"])
						]
					),
					new DCStructure.Structure(
						"SW1",
						[
							new Atom([0, 0], [
								new Atom(BOND_SW1, [], "", ["NE1"])
							], "", ["SW1"])
						]
					),
					new DCStructure.Structure(
						"SW2",
						[
							new Atom([0, 0], [
								new Atom(BOND_SW2, [], "", ["NE2"])
							], "", ["SW2"])
						]
					),					
					new DCStructure.Structure(
						"W",
						[
							new Atom([0, 0], [
								new Atom(BOND_W, [], "", ["E"])
							], "", ["W"])
						]
					),
					new DCStructure.Structure(
						"NW1",
						[
							new Atom([0, 0], [
								new Atom(BOND_NW1, [], "", ["SE1"])
							], "", ["NW1"])
						]
					),
					new DCStructure.Structure(
						"NW2",
						[
							new Atom([0, 0], [
								new Atom(BOND_NW2, [], "", ["SE2"])
							], "", ["NW2"])
						]
					)
				],
				cluster = new StructureCluster(name, defs);
				
			return cluster;
		};
		
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [service.benzene, service.cyclohexane, service.singleBond];
		
		return service;
	}
})();