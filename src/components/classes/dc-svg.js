(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCSvg", DCSvg);

	DCSvg.$inject = ["DrawChemConst"];

	function DCSvg(Const) {

		var service = {};

		service.fontSize = 18;
		service.subFontSize = 14;
		service.font = "Arial";

		/**
		 * Creates a new `Svg` element. This helper class has methods
		 * for wrapping an svg element (e.g. path) with other elements (e.g. g, defs).
		 * @class
		 * @param {string} elementFull - svg element for editor
		 * @param {string} elementMini - svg element for displaying outside of the editor
		 * @param {string} id - id of the g element
		 */
		function Svg(elementFull, elementMini, id) {
			this.elementFull = elementFull;
			this.elementMini = elementMini;
			this.id = id;
		}

		/**
		 * Gets full element.
		 * @returns {string}
		 */
		Svg.prototype.getElementFull = function () {
			return this.elementFull;
		};

		/**
		 * Sets full element.
		 * @param {string} element - full element
		 */
		Svg.prototype.setElementFull = function (element) {
			this.elementFull = element;
		};

		/**
		 * Gets mini element.
		 * @returns {string}
		 */
		Svg.prototype.getElementMini = function () {
			return this.elementMini;
		};

		/**
		 * Sets mini element.
		 * @param {string} element - mini element
		 */
		Svg.prototype.setElementMini = function (element) {
			this.elementMini = element;
		};

		/**
		 * Sets an array of extreme coords (minX, maxX, minY, maxY).
		 * @param {number[]} minMax - array of coords
		 */
		Svg.prototype.setMinMax = function (minMax) {
			this.minMax = minMax;
		}

		/**
		 * Wraps an instance of Svg with a custom tag.
		 * @param {string} el - name of the tag, if this param equals 'g', then id attribute is automatically added
		 * @param {Object} attr - attribute of the tag
		 * @param {string} attr.key - name of the attribute
		 * @param {string} attr.val - value of the attribute
		 */
		Svg.prototype.wrap = function (which, el, attr) {
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
		 * Generates style tag with all info about the style enclosed.
		 * @param {string} which - 'expanded' for the whole css, 'base' for css needed to render the molecule (without circles on hover, etc.)
		 */
		Svg.generateStyle = function (which) {
			var style = {
					expanded: {
						"circle.atom:hover": {
							"opacity": "0.3"
						},
						"circle.arom:hover": {
							"opacity": "0.3",
							"stroke": "black",
							"stroke-width": Const.BOND_WIDTH,
							"fill": "black"
						},
						"rect.focus": {
							"opacity": "0",
							"stroke": "black"
						},
						"rect.focus:hover": {
							"opacity": "0.3"
						},
						"text.edit:hover": {
							"opacity": "0.3"
						},
						"circle.atom": {
							"opacity": "0",
							"stroke": "black",
							"stroke-width": Const.BOND_WIDTH
						},
						"circle.edit": {
							"stroke": "black",
							"fill": "none"
						},
						"circle.label": {
							"opacity": "0"
						},
						"rect.selection": {
							"stroke": "black",
							"stroke-dasharray": "10 5",
							"fill": "none"
						}
					},
					base: {
						"path": {
							"stroke": "black",
							"stroke-width": Const.BOND_WIDTH,
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
							"stroke-width": Const.BOND_WIDTH,
							"fill": "none"
						},
						"circle.tr-arom": {
							"stroke": "black",
							"stroke-width": Const.BOND_WIDTH,
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
				},
			  attr = "<style type=\"text/css\">";

			if (which === "expanded") {
				which = { base: style.base, expanded: style.expanded };
			} else if (which === "base") {
				which = { base: style.base, expanded: {} };
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
		};

		service.Svg = Svg;

		return service;
	}
})();
