(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemShapes", DrawChemShapes);
	
	function DrawChemShapes() {
		
		/**
		 * Creates a new Structure.
		 * @class
		 */
		function Structure() {
			
		}
		
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
			this.styleAttr = "stroke: black; stroke-width: " + 0.48 * this.scale + "; fill: none;";
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
			var customAttr = {};
			if (el === "g" && !attr) {
				attr = customAttr;
				attr.key = "id";
				attr.val = this.id;
			}
			if (attr) {
				this.element = "<" + el + " " + attr.key + "='" + attr.val + "'>" + this.element + "</" + el + ">";
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
			this.transformAttr += transform + "(" + value.x;
			if (value.y) {
				this.transformAttr += "," + value.y;
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
				"' " + "style='" + this.styleAttr +
				"'></use>";
		};
		
		/**
		 * Generates 'use' element and wraps the content with 'svg' tags.
		 * @returns {string}
		 */
		Shape.prototype.generate = function () {
			this.element += this.generateUse();
			return this.wrap("svg").element;
		};
		
		var service = {};
		
		// the default bond length
		service.bondLength = 10;
		
		// the default bond width
		service.bondWidth = service.bondLength * service.widthToLength;
		
		// proportion of the bond width to bond length
		// 0.041 corresponds to the ACS settings in ChemDraw, according to
		// https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Chemistry/Structure_drawing
		service.widthToLength = 0.041;
		
		/**
		 * Generates the desired output based on given input.
		 * @param {Structure} input - an object containing all information needed to render the shape
		 * @param {string} id - id of the object to be created (will be used inside 'g' tag and in 'use' tag)
		 */
		service.draw = function (input, id) {
			var shape,
				output = parseInput(input);
			shape = new Shape(genPaths(), id);
			return shape.wrap("g").wrap("defs").generate();
			
			// generates a string from the output array and wraps each line with 'path' tags.
			function genPaths() {
				var result = "";
				output.forEach(function (path) {
					result += "<path d='" + path + "'></path>";
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
			var output = [],
				// sets the coordinates of the root element
				len = output.push(["M", input[0].coords]); // 'M' for 'moveto' - sets pen to the coordinates
			connect(input[0].coords, input[0].bonds, output[len - 1]);
			return stringifyOutput();
			
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
					currentLine.push("l"); // 'l' for lineto - draws line to the specified coordinates
					currentLine.push(bonds[0].coords);
					connect(bonds[0].coords, bonds[0].bonds, currentLine);
				}				
				for (i = 1; i < bonds.length; i += 1) {
					newRoot = bonds[i].coords;
					newLen = output.push(["M", root, "l", newRoot]);
					connect(newRoot, bonds[i].bonds, output[newLen - 1]);
				}
			}
			
			/**
			 * Transforms output into an array of strings.
			 * Basically, it translates each array of coordinates into its string representation.
			 * @returns {string[]}
			 */
			function stringifyOutput() {
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