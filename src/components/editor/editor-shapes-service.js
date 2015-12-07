(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemShapes", DrawChemShapes);
	
	function DrawChemShapes() {
		
		var Shape = function (element, id) {			
			this.element = element;
			this.id = id;
			this.scale = 1;
			this.transformAttr = "";
			this.styleAttr = "stroke: black; stroke-width: " + 0.48 * this.scale + "; fill: none;";
		};
		
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
		
		Shape.prototype.transform = function (transform) {
			this.transformAttr = "transform: " + transform;			
		};
		
		Shape.prototype.style = function (style) {
			this.styleAttr = "style: " + style;
		};
		
		Shape.prototype.generateUse = function () {
			return "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#" + this.id + "' transform='" + this.transformAttr + "' " + "style='" + this.styleAttr + "'></use>";
		};
		
		Shape.prototype.generate = function () {
			this.element += this.generateUse();
			return this.wrap("svg").element;
		};
		
		var service = {};
		
		service.benzene = function (transform, style) {
			var origin = { x: 0, y: 0 }, r = 10, a, h, points, pointsRnd = [], benzene;
			
			a = 2 * r / Math.sqrt(3),
			h = a * Math.sqrt(3) / 2,
			points = [
				origin.x, origin.y - a,
				origin.x + h, origin.y - a / 2,
				origin.x + h, origin.y + a / 2,
				origin.x, origin.y + a,
				origin.x - h, origin.y + a / 2,
				origin.x - h, origin.y - a / 2
			].forEach(function (point) {
				pointsRnd.push(point.toFixed(2));
			});			
			
			benzene = new Shape(
				"<polygon points='" + pointsRnd.join(" ") + "'></polygon>" +
				"<circle r='" + (2 / 3 * r).toFixed(2) + "'></circle>",
				"benzene"
			);
			return benzene.wrap("g").wrap("defs");		
		};
		
		return service;	
		
	}
})();