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