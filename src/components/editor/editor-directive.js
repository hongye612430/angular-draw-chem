(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = ["DrawChem", "$sce"];
	
	function DrawChemEditor(DrawChem, $sce) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "=",
				editorWidth: "@",
				editorHeight: "@"
			},
			link: function (scope, element, attrs) {
				scope.closeEditor = DrawChem.closeEditor;
			}
		}
	}
})();