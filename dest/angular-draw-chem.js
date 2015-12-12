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
	
	DrawChemEditor.$inject = ["DrawChemShapes", "DrawChemStructures", "DrawChem", "$sce", "$window"];
	
	function DrawChemEditor(DrawChemShapes, DrawChemStructures, DrawChem, $sce, $window) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
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
					scope.customButtons.push({
						name: custom.name,
						choose: function () {
							scope.chosenStructure = custom.structure;
						}
					});
				});
				
				/**
				 * Draws chosen shape.
				 */
				scope.drawShape = function ($event) {
					var clickCoords = innerCoords(),
						drawn = "";
						
					modifyCurrentStructure();
					drawn = DrawChemShapes.draw(scope.currentStructure, "cmpd1").transform("translate", clickCoords).generate();
					DrawChem.setContent(drawn);
					
					function innerCoords() {
						var content = element.find("dc-content")[0],
							coords = [								
								parseFloat(($event.clientX - content.getBoundingClientRect().left - 2).toFixed(2)),
								parseFloat(($event.clientY - content.getBoundingClientRect().top - 2).toFixed(2))
							]
						return coords;
					}
					
					function modifyCurrentStructure() {
						if (DrawChem.getContent() === "") {
							scope.currentStructure = angular.copy(scope.chosenStructure);
						} else {
							DrawChemShapes.modifyStructure(scope.currentStructure, scope.chosenStructure, clickCoords);
						}						
					}
				}
			}
		}
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
				"circle:hover": {
					"opacity": "0.3",
					"stroke": "black",
					"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
				},
				"circle": {
					"opacity": "0",
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
			if (value[1]) {
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
			this.element += this.generateUse();
			return this.wrap("svg").element;
		};
		
		service.Shape = Shape;
		
		return service;		
	}		
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.service("DCStructure", DCStructure);
	
	/**
	* Creates a new DCStructure.
	* @class
	*/
	function DCStructure() {
		
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemConst", DrawChemConst);
	
	function DrawChemConst() {
		
		var service = {};
		
		// the default bond length
		service.BOND_LENGTH = 20;
		
		// proportion of the bond width to bond length
		// 0.041 corresponds to the ACS settings in ChemDraw, according to
		// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
		service.WIDTH_TO_LENGTH = 0.04;
		
		// the default bond width
		service.BOND_WIDTH = parseFloat((service.BOND_LENGTH * service.WIDTH_TO_LENGTH).toFixed(2));
		
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
		
	DrawChemShapes.$inject = ["DCShape", "DrawChemConst"];
	
	function DrawChemShapes(DCShape, DrawChemConst) {
		
		var service = {};
		
		/**
		 * Generates the desired output based on given input.
		 * @param {Structure} input - an object containing all information needed to render the shape
		 * @param {string} id - id of the object to be created (will be used inside 'g' tag and in 'use' tag)
		 */
		service.draw = function (input, id) {
			var shape,
				output = parseInput(input),
				paths = output.paths,
				circles = output.circles;
			shape = new DCShape.Shape(genElements(), id);
			shape.element = shape.generateStyle() + shape.element;
			return shape.wrap("g").wrap("defs");
			
			// generates a string from the output array and wraps each line with 'path' tags.
			function genElements() {
				var result = "", coords;
				paths.forEach(function (path) {
					result += "<path d='" + path + "'></path>";					
				});
				circles.forEach(function (circle) {
					result += "<circle cx='" + circle[0] + "' cy='" + circle[1] + "' r='" + circle[2] + "' ></circle>";
				});
				
				return result;
			}
		}
		
		/**
		 * Translates the input into an svg-suitable set of coordinates.
		 * @param {Structure[]} input - an input object
		 * @returns {string} output as an array of arrays
		 *					 (each array defines set of coordinates for the 'path' tag,
		 *					 so it can be regarded as a distinct line)
		 */
		function parseInput(input) {
			var output = [], circles = [], circR = DrawChemConst.BOND_LENGTH * 0.12,
				// sets the coordinates of the root element
				// 'M' for 'moveto' - sets pen to the coordinates
				len = output.push(["M", input[0].coords]);
				
			circles.push([
				input[0].coords[0],
				input[0].coords[1],
				circR
			]);
			connect(input[0].coords, input[0].bonds, output[len - 1]);
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
				var i, newLen, newRoot;
				// if length of the bonds is 0, then do nothing
				if (bonds.length > 0) {
					circles.push([
						circles[circles.length - 1][0] + bonds[0].coords[0],
						circles[circles.length - 1][1] + bonds[0].coords[1],
						circR
					]);
					currentLine.push("l"); // 'l' for lineto - draws line to the specified coordinates
					currentLine.push(bonds[0].coords);
					connect(bonds[0].coords, bonds[0].bonds, currentLine);
				}				
				for (i = 1; i < bonds.length; i += 1) {
					newRoot = bonds[i].coords;
					circles.push([
						root[0] + bonds[i].coords[0],
						root[1] + bonds[i].coords[1],
						circR
					]);
					newLen = output.push(["M", root, "l", newRoot]);
					connect(newRoot, bonds[i].bonds, output[newLen - 1]);
				}
			}
			
			/**
			 * Transforms output into an array of strings.
			 * Basically, it translates each array of coordinates into its string representation.
			 * @returns {string[]}
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
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemStructures", DrawChemStructures);
		
	DrawChemStructures.$inject = ["DrawChemConst"];
	
	function DrawChemStructures(DrawChemConst) {
		
		var service = {}, LEN = DrawChemConst.BOND_LENGTH;
		
		/**
		 * Stores all predefined structures.
		 */
		service.custom = [			
			{
				name: "benzene",
				structure: [
					{
						coords: [0, 0],
						bonds: [
							{
								coords: [parseFloat((LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
								bonds: [
									{
										coords: [0, LEN],
										bonds: [
											{
												coords: [parseFloat(-(LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
												bonds: [
													{
														coords: [parseFloat(-(LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat(-(LEN / 2).toFixed(2))],
														bonds: [
															{
																coords: [0, -LEN],
																bonds: []
															}
														]
													}
												]
											}
										]
									}
								]
							},
							{
								coords: [parseFloat(-(LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
								bonds: []
							}
						]
					}
				]
			},
			{
				name: "single bond",
				structure: [
					{
						coords: [0, 0],
						bonds: [
							{
								coords: [parseFloat((LEN * Math.sqrt(3) / 2).toFixed(2)), parseFloat((LEN / 2).toFixed(2))],
								bonds: []
							}
						]
					}
				]
			}
		];
		
		return service;
	}
})();