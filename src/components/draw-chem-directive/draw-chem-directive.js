(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = ["DrawChemShapes", "DrawChemStructures", "DrawChem", "$sce", "$window"];
	
	function DrawChemEditor(DrawChemShapes, DrawChemStructures, DrawChem, $sce, $window) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				/**
				 * Sets width and height of the dialog box based on corresponding attributes.
				 */
				scope.dialogStyle = {};
				if (attrs.width) {
					scope.dialogStyle.width = attrs.width;
				}
				if (attrs.height) {
					scope.dialogStyle.height = attrs.height;
				}
				
				/**
				 * Closes the editor.
				 */
				scope.closeEditor = function () {
					DrawChem.closeEditor();
				}
				
				/**
				 * Returns content to be bound in the dialog box.
				 */
				scope.content = function () {
					return $sce.trustAsHtml(DrawChem.getContent());
				}
				
				/**
				 * Clears the content.
				 */
				scope.clear = function () {
					DrawChem.clearContent();
				}
				
				/**
				 * Transfers the content.
				 */
				scope.transfer = function () {
					DrawChem.transferContent();
				}
				
				/**
				 * Stores the chosen structure.
				 */
				scope.chosenStructure;
				
				/**
				 * Stores the current structure.
				 */
				scope.currentStructure;
				
				/**
				 * Stores all predefined structures.
				 */
				scope.customButtons = [];
				
				/**
				 * Adds all predefined shapes to the scope.
				 */
				angular.forEach(DrawChemStructures.custom, function (custom) {
					var customInstance = custom();
					scope.customButtons.push({
						name: customInstance.name,
						choose: function () {
							scope.chosenStructure = customInstance;
						}
					});
				});
				
				/**
				 * Draws chosen shape.
				 */
				scope.drawShape = function ($event) {
					var clickCoords = innerCoords(),
						drawn = "";
					modifyCurrentStructure();
					drawn = DrawChemShapes.draw(scope.currentStructure.getStructure(), "cmpd1").generate();
					DrawChem.setContent(drawn);
					
					function innerCoords() {
						var content = element.find("dc-content")[0],
							coords = [								
								parseFloat(($event.clientX - content.getBoundingClientRect().left - 2).toFixed(2)),
								parseFloat(($event.clientY - content.getBoundingClientRect().top - 2).toFixed(2))
							]
						return coords;
					}
					
					function modifyCurrentStructure() {
						if (DrawChem.getContent() !== "") {
							DrawChemShapes.modifyStructure(scope.currentStructure, angular.copy(scope.chosenStructure), clickCoords);
						} else {
							scope.currentStructure = angular.copy(scope.chosenStructure);
							scope.currentStructure.getStructure(0).setCoords(clickCoords);
						}
					}
				}
			}
		}
	}
})();