(function () {
	"use strict";
	angular.module("mmAngularDrawChem", ["ngSanitize"]);
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("editorModal", EditorModal);
	
	EditorModal.$inject = ["DrawChemEditor", "$sce"];
	
	function EditorModal(DrawChemEditor, $sce) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "=",
				editorWidth: "@",
				editorHeight: "@"
			},
			link: function (scope, element, attrs) {
				
			}
		}
	}
})();
(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemEditor", DrawChemEditor);
	
	function DrawChemEditor() {
		
		var service = {},
			// at the beginning, the modal is hidden
			showModal = false,
			// an array accumulating contents from different 'instances' (pseudo-'instances', actually) of the editor
			instances = [],
			// currently active 'instance'
			currentInstance = {};
		
		/*
		 * Returns 'true' if the modal should be shown
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