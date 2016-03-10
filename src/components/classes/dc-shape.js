(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCShape", DCShape);

	DCShape.$inject = ["DrawChemConst"];

	function DCShape(DrawChemConst) {

		var service = {};

		service.fontSize = 18;
		service.subFontSize = 14;
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
			this.style = {
				expanded: {
					"circle.atom:hover": {
						"opacity": "0.3",
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
					},
					"text:hover": {
						"opacity": "0.3"
					},
					"circle.atom": {
						"opacity": "0",
					},
					"circle.edit": {
						"stroke": "black",
						"fill": "none"
					}
				},
				base: {
					"path": {
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
						"fill": "none"
					},
					"path.wedge": {
						"fill": "black"
					},
					"path.arrow": {
						"fill": "black"
					},
					"path.arrow-eq": {
						"fill": "none"
					},
					"circle.arom": {
						"stroke": "black",
						"stroke-width": DrawChemConst.BOND_WIDTH * this.scale,
						"fill": "none"
					},
					"text": {
						"font-family": service.font,
						"cursor": "default",
						"font-size": service.fontSize + "px"
					},
					"tspan.sub": {
						"font-size": service.subFontSize + "px"
					},
					"polygon.text": {
						"fill": "white"
					}
				}
			};
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

		/**
		 * Generates style tag with all info about the style enclosed.
		 * @param {String} which - 'expanded' for the whole css, 'base' for css needed to render the molecule (without circles on hover, etc.)
		 */
		Shape.prototype.generateStyle = function (which) {
			var attr = "<style type=\"text/css\">";

			if (which === "expanded") {
				which = { base: this.style.base, expanded: this.style.expanded };
			} else if (which === "base") {
				which = { base: this.style.base, expanded: {} };
			}

			angular.forEach(which, function (value, key) {
				angular.forEach(value, function (value, key) {
					attr += key + "{";
					angular.forEach(value, function (value, key) {
						attr += key + ":" + value + ";";
					});
					attr += "}"
				});
			});
			return attr + "</style>";
		}

		service.Shape = Shape;

		return service;
	}
})();
