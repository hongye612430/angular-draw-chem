(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);

	DrawChemEditor.$inject = [
		"DrawChemPaths",
		"DrawChemCache",
		"DrawChemDirectiveFlags",
		"DrawChemDirectiveUtils",
		"DrawChemDirectiveMouseActions",
		"DrawChemMenuButtons",
		"$sce"
	];

	function DrawChemEditor(Paths, Cache, Flags, DirUtils, MouseActions, MenuButtons, $sce) {
		return {
			template: "<div ng-include=\"getEditorUrl()\"></div>",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				scope.getEditorUrl = function () {
					var editorHtml = attrs.dcModal === "" ? "draw-chem-editor-modal.html": "draw-chem-editor.html";
					return Paths.getPath() + editorHtml;
				};

				scope.pathToSvg = Paths.getPathToSvg();

				// Sets width and height of the dialog box based on corresponding attributes.
				scope.dialogStyle = {};

				if (attrs.width) {
					scope.dialogStyle.width = attrs.width;
				}
				if (attrs.height) {
					scope.dialogStyle.height = attrs.height;
				}

				scope.setFocus = function () {
					Flags.focused = true;
				};

				scope.unsetFocus = function () {
					Flags.focused = false;
				};

				// Returns content which will be bound in the dialog box.
				scope.content = function () {
					return $sce.trustAsHtml(Cache.getCurrentSvg());
				};

				// Adds all buttons to the scope
				MenuButtons.addButtonsToScope(scope);

				/***** Mouse Events *****/
				scope.doOnMouseDown = function ($event) {
					try {
						MouseActions.doOnMouseDown($event, scope, element);
					} catch (e) {
						DirUtils.resetMouseFlags();
						console.log(e, e.name, e.message);
					}
				};

				scope.doOnMouseUp = function ($event) {
					try {
						MouseActions.doOnMouseUp($event, scope, element);
					} catch (e) {
						DirUtils.resetMouseFlags();
						console.log(e, e.name, e.message);
					}
				};

				scope.doOnMouseMove = function ($event) {
					try {
						MouseActions.doOnMouseMove($event, scope, element);
					} catch (e) {
						DirUtils.resetMouseFlags();
						console.log(e, e.name, e.message);
					}
				};
			}
		}
	}
})();
