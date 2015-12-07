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