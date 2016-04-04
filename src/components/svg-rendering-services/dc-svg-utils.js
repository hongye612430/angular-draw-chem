(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemSvgUtils", DrawChemSvgUtils);

	DrawChemSvgUtils.$inject = ["DrawChemConst", "DrawChemUtils", "DCSvg"];

	function DrawChemSvgUtils(Const, Utils, DCSvg) {

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

		service.updateLabel = function(absPos, atom) {
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
					width: DCSvg.fontSize * labelNameObj.name.length,
					height: DCSvg.fontSize
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

		return service;

    function drawDodecagon(label) {
      var i, x, y, aux, factor,result = [];

      factor = 0.5 * label.height / BOND_LENGTH;
      for (i = 0; i < BONDS_AUX.length; i += 1) {
        x = BONDS_AUX[i].bond[0];
        y = BONDS_AUX[i].bond[1];
        result = result.concat(Utils.addVectors([label.atomX, label.atomY], [x, y], factor));
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
	}
})();
