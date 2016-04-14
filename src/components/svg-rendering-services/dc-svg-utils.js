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
        var clazz;
				if (circle.hasLabel) {
					clazz = "label";
				} else if (circle.isSelected) {
					clazz = "edit";
				} else {
					clazz = "atom";
				}
				if (!circle.isOrphan) {
					obj.full +=
	          "<circle class='" + clazz +
	            "' cx='" + circle.circle[0].toFixed(2) +
	            "' cy='" + circle.circle[1].toFixed(2) +
	            "' r='" + circle.circle[2].toFixed(2) +
	          "'></circle>";
				}
      });
    };

		/**
		* Generates `text` elements.
		* @param {Object[]} labels - array of objects with data needed to construct a `text` element,
		* @param {Object} obj - object accumulating `text` elements
		*/
    service.generateLabels = function (labels, obj) {
      labels.forEach(function (label) {
        obj.full += genText("edit", label);
        obj.mini += genText("tr", label);
      });

			function genText(clazz, label) {
				return "<text class='" + clazz + "' dy='0.2125em' " +
					"x='" + label.labelX.toFixed(2) + "' " +
					"y='" + label.labelY.toFixed(2) + "' " +
					"atomx='" + label.atomX.toFixed(2) + "' " +
					"atomy='" + label.atomY.toFixed(2) + "' " +
					"text-anchor='" + genTextAnchor(label.mode) + "' " +
				">" + genLabel(label.label) + "</text>";
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
            if (isClass(point)) {
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

			function isClass(str) {
				return str !== "M" && str !== "L" && str !== "C" && str !== "S" && str !== "Z" && str !== ",";
			}
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
					labelX: absPos[0] + calcCorrectX(labelNameObj.mode, labelNameObj.name) * BOND_LENGTH,
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

				function calcCorrectX(mode, name) {
					if (mode === "rl") {
						return name === "I" ? 0.07: 0.2;
					} else if (mode === "lr") {
						return name === "I" ? -0.07: -0.2;
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
				}
			}
		}

		return service;
	}
})();
