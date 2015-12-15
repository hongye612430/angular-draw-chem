(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemShapes", DrawChemShapes);
		
	DrawChemShapes.$inject = ["DCShape", "DrawChemConst"];
	
	function DrawChemShapes(DCShape, DrawChemConst) {
		
		var service = {};
		
		/**
		 * Modifies the structure.
		 * @param {Structure} base - structure to be modified,
		 * @param {Structure} mod - structure to be added,
		 * @param {Number[]} mousePos - position of the mouse when 'click' was made
		 */
		service.modifyStructure = function (base, mod, mousePos) {
			var origin = base.getStructure()[0].getCoords(),				
				clickX = mousePos[0],
				clickY = mousePos[1];
			if (isWithin(origin[0], clickX) && isWithin(origin[1], clickY)) {
				base
					.getStructure()[0]
					.addBonds(mod.getStructure()[0].getBonds());						
				return base;
			} else {
				return modStructure(base.getStructure()[0].getBonds(), origin);
			}
			
			function modStructure(struct, pos) {
				var i, absPos;
				for(i = 0; i < struct.length; i += 1) {
					absPos = [struct[i].getCoords()[0] + pos[0], struct[i].getCoords()[1] + pos[1]];
					if (isWithin(absPos[0], clickX) && isWithin(absPos[1], clickY)) {
						struct[i].addBonds(mod.getStructure()[0].getBonds());						
						return base;
					} else {
						modStructure(struct[i].getBonds(), absPos);
					}
				}
			}
			
			function isWithin(point, click) {
				var tolerance = DrawChemConst.CIRC_R;
				return Math.abs(point - click) <= tolerance;
			}
		};
		
		/**
		 * Generates the desired output based on given input.
		 * @param {Atom[]} input - an object containing all information needed to render the shape
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
		 * @param {Atom[]} input - an input object
		 * @returns {string} output as an array of arrays
		 *					 (each array defines set of coordinates for the 'path' tag,
		 *					 so it can be regarded as a distinct line)
		 */
		function parseInput(input) {
			var output = [], circles = [], circR = DrawChemConst.CIRC_R,
				// sets the coordinates of the root element
				// 'M' for 'moveto' - sets pen to the coordinates
				len = output.push(["M", input[0].getCoords()]);
				
			circles.push([
				input[0].getCoords()[0],
				input[0].getCoords()[1],
				circR
			]);
			connect(input[0].getCoords(), input[0].getBonds(), output[len - 1]);
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
						circles[circles.length - 1][0] + bonds[0].getCoords()[0],
						circles[circles.length - 1][1] + bonds[0].getCoords()[1],
						circR
					]);
					currentLine.push("l"); // 'l' for lineto - draws line to the specified coordinates
					currentLine.push(bonds[0].getCoords());
					connect(bonds[0].getCoords(), bonds[0].getBonds(), currentLine);
				}				
				for (i = 1; i < bonds.length; i += 1) {
					newRoot = bonds[i].getCoords();
					circles.push([
						root[0] + newRoot[0],
						root[1] + newRoot[1],
						circR
					]);
					newLen = output.push(["M", root, "l", newRoot]);
					connect(newRoot, bonds[i].getBonds(), output[newLen - 1]);
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