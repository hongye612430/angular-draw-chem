(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);

	DrawChemEditor.$inject = [
		"DrawChemPaths",
		"DrawChemCache",
		"DrawChemDirectiveMouseActions",
		"DrawChemDirectiveMenuButtons",
		"$sce"
	];

	function DrawChemEditor(Paths, Cache, MouseActions, MenuButtons, $sce) {
		return {
			templateUrl: Paths.getPath() + "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {

				scope.pathToSvg = Paths.getPathToSvg();

				// Sets width and height of the dialog box based on corresponding attributes.
				scope.dialogStyle = {};

				if (attrs.width) {
					scope.dialogStyle.width = attrs.width;
				}
				if (attrs.height) {
					scope.dialogStyle.height = attrs.height;
				}

				// Returns content which will be bound in the dialog box.
				scope.content = function () {
					var svg = $sce.trustAsHtml(Cache.getCurrentSvg());
					return svg;
				};

				MenuButtons.addButtonsToScope(scope);

				/***** Mouse Events *****/
				scope.doOnMouseDown = function ($event) {
					try {
						MouseActions.doOnMouseDown($event, scope, element);
					} catch (e) {
						console.log(e);
					}
				}

				scope.doOnMouseUp = function ($event) {
					try {
						MouseActions.doOnMouseUp($event, scope, element);
					} catch (e) {
						console.log(e);
					}
				}

				scope.doOnMouseMove = function ($event) {
					try {
						MouseActions.doOnMouseMove($event, scope, element);
					} catch (e) {
						console.log(e);
					}
				}
			}
		}
	}
})();
