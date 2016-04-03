(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemGenElements", DrawChemGenElements);

	DrawChemGenElements.$inject = ["DrawChemConst", "DrawChemUtils", "DCShape"];

	function DrawChemGenElements(Const, Utils, DCShape) {

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
          output += "<tspan class='sub' dy='" + DCShape.fontSize * 0.25 + "' >" + aux + "</tspan>";
          isPreceded = true;
        } else if (isPreceded) {
          output += "<tspan dy='-" + DCShape.fontSize * 0.25 + "' >" + aux + "</tspan>";
          isPreceded = false;
        } else {
          output += "<tspan>" + aux + "</tspan>";
        }
      }
      return output;
    }
	}
})();
