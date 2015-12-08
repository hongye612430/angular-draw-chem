(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = ["DrawChemShapes", "DrawChem", "$sce"];
	
	function DrawChemEditor(DrawChemShapes, DrawChem, $sce) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				scope.dialogStyle = {};
				if (attrs.width) {
					scope.dialogStyle.width = attrs.width;
				}
				if (attrs.height) {
					scope.dialogStyle.height = attrs.height;
				}
				scope.closeEditor = function () {
					DrawChem.closeEditor();
				}
				scope.content = function () {
					return $sce.trustAsHtml(DrawChem.getContent());
				}
				scope.chosenShape;
				scope.custom = function () {
					scope.chosenShape = DrawChemShapes.benzene();
				};
				scope.drawShape = function () {
					var drawn = DrawChemShapes.draw(scope.chosenShape, "cmpd1");
					DrawChem.setContent(drawn);
				}
			}
		}
	}
})();