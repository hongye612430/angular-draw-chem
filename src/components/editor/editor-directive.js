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