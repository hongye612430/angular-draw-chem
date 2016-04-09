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
        var aux = circle.isSelected && !circle.hasLabel && !circle.isOrphan ? "edit": "atom";
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
