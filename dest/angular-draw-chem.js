(function () {
	"use strict";
	angular.module("mmAngularDrawChem", ["ngSanitize"])
		.config(["$sanitizeProvider", function ($sanitizeProvider) {
			$sanitizeProvider.enableSvg();
		}]);
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = ["DrawChemShapes", "DrawChem", "$sce"];
	
	function DrawChemEditor(DrawChemShapes, DrawChem, $sce) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "=",
				editorWidth: "@",
				editorHeight: "@"
			},
			link: function (scope, element, attrs) {				
				scope.closeEditor = DrawChem.closeEditor;
				scope.content = "";
				scope.benzene = function () {
					scope.content = $sce.trustAsHtml(DrawChemShapes.benzene().generate());
				};
			}
		}
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChem", DrawChem);
	
	function DrawChem() {
		
		var service = {},
			// at the beginning, the modal is hidden
			showModal = false,
			// an array accumulating contents from different 'instances' (pseudo-'instances', actually) of the editor
			instances = [],
			// currently active 'instance'
			currentInstance = {};
		
		/*
		 * Returns 'true' if the modal should be shown, 'false' otherwise.
		 * @api public
		 *
		 */
		service.showEditor = function () {
			return showModal;
		}
		
		/*
		 * Runs the editor, i.e. shows the modal, fetches the editor 'instance', and assigns it to the currently active 'instance'.
		 * If the 'instance' does not exist, a new one is created.
		 * @api public
		 * @param name - string, name of the 'instance' with which the editor is to be opened
		 * 
		 */
		service.runEditor = function (name) {
			showModal = true;
			if (!instanceExists(name)) {
				instances.push({
					name: name,
					content: ""
				});
			}
			currentInstance = getInstance(name);
		}
		
		/*
		 * Returns the content of the 'instance' with the specified name. If it does not exist, an empty string is returned.
		 * If the argument is not supplied, the content of the currently active 'instance' is returned.
		 * @api public
		 * @param name - string, name of the 'instance' which content is to be returned
		 *
		 */
		service.getContent = function (name) {
			if (typeof name === "string") {
				return function () {
					var inst = getInstance(name);
					return typeof inst === "undefined" ? "": inst.content;
				}
			}
			return function () {
				return currentInstance.content;
			};
		}
		
		/*
		 * Sets the content of the 'instance'. If the name of the 'instance' is not supplied,
		 * the content of the currently active 'instance' is set and then the corresponding 'instance' in the 'instances' array is updated.
		 * @api public
		 * @param name - string, name of the instance
		 * @param content - string, content to be set
		 *
		 */
		service.setContent = function (content, name) {			 
			if (typeof name === "undefined") {
				currentInstance.content = content;
				setInstance();
			} else {
				setInstance(content, name);
			}
		}
		
		/*
		 * Hides the editor and clears the currently active 'instance'.
		 * @api public
		 *
		 */
		service.closeEditor = function () {
			showModal = false;
			currentInstance = {};
		}
		
		return service;
		
		/*
		 * Checks if the 'instance' exists.
		 * @api private
		 * @param name - string, name of the 'instance' to look for
		 *
		 */
		function instanceExists(name) {
			for (var i = 0; i < instances.length; i++) {
				if (instances[i].name === name) {
					return true;
				}
			}
			return false;
		}
		
		/*
		 * Returns 'instance' with the specified name.
		 * @api private
		 * @param name - string, name of the 'instance' to look for
		 *
		 */
		function getInstance(name) {
			for (var i = 0; i < instances.length; i++) {
				if (instances[i].name === name) {
					return instances[i];
				}
			}
		}
		
		/*
		 * Sets content of the 'instance' with the specified name. If the 'instance' does not exist, a new one is created.
		 * If the name is not specified, the content of the currently active 'instance' is saved in the 'instances' array.
		 * @api private
		 * @param name - string, name of the 'instance' to look for
		 *
		 */
		function setInstance(content, name) {
			var i;
			if (arguments.length === 0) {
				for (i = 0; i < instances.length; i++) {
					if (instances[i].name === currentInstance.name) {
						return instances[i] = currentInstance;
					}
				}
			} else {
				for (i = 0; i < instances.length; i++) {
					if (instances[i].name === name) {
						return instances[i].content = content;
					}
				}
				instances.push({
					name: name,
					content: content
				});
			}			
		}
	}
})();
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