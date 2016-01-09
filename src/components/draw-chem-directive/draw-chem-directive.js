(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = ["DrawChemShapes", "DrawChemStructures", "DrawChem", "$sce", "$window", "DrawChemConst"];
	
	function DrawChemEditor(DrawChemShapes, DrawChemStructures, DrawChem, $sce, $window, DrawChemConst) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				
				var downAtomCoords,
					mouseDown = false,
					downOnAtom = false;
				
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
				 * Action to perform on 'mousedown' event.
				 */
				scope.doOnMouseDown = function ($event) {
					var clickCoords = innerCoords($event);						
					mouseDown = true;
					if (DrawChem.getContent() !== "") {
						downAtomCoords = DrawChemShapes.isWithin(scope.currentStructure, clickCoords).absPos;
						downOnAtom = true;
					}
				}
				
				/**
				 * Action to perform on 'mouseup' event.
				 */
				scope.doOnMouseUp = function ($event) {
					var clickCoords = innerCoords($event);
					if (DrawChem.getContent() !== "") {
						scope.currentStructure = modifyStructure(scope.currentStructure, clickCoords);						
					} else {
						scope.currentStructure = angular.copy(scope.chosenStructure).getDefault();
						scope.currentStructure.setOrigin(clickCoords);
					}
					draw(scope.currentStructure);
					resetMouseFlags();
				}
				
				/**
				 * Action to perform on 'mousemove' event.
				 */
				scope.doOnMouseMove = function ($event) {
					var clickCoords, updatedCurrentStructure, frozenCurrentStructure;
					if (downOnAtom) {
						clickCoords = innerCoords($event);
						frozenCurrentStructure = angular.copy(scope.currentStructure);
						updatedCurrentStructure = modifyStructure(frozenCurrentStructure, clickCoords);
						draw(updatedCurrentStructure);
					}							
				}
				
				/**
				 * Calculates the coordinates of the mouse pointer during an event.
				 * Takes into account the margin of the enclosing div.
				 * @params {Event} $event - an Event object
				 * @returns {Number[]}
				 */
				function innerCoords($event) {
					// 
					var content = element.find("dc-content")[0],
						coords = [								
							parseFloat(($event.clientX - content.getBoundingClientRect().left - 2).toFixed(2)),
							parseFloat(($event.clientY - content.getBoundingClientRect().top - 2).toFixed(2))
						]
					return coords;
				}
				
				/**
				 * Resets to default values associated with mouse events.
				 */
				function resetMouseFlags() {
					mouseDown = false;
					downOnAtom = false;
					downAtomCoords = undefined;
				}
				
				/**
				 * Draws the specified structure.
				 * @params {Structure} structure - a Structure object to draw.
				 */
				function draw(structure) {
					var drawn = "";					
					drawn = DrawChemShapes.draw(structure, "cmpd1").generate();
					DrawChem.setContent(drawn);					
				}
				
				/**
				 * Modifies the specified structure by adding a new structure to it.
				 * @params {Structure} structure - a Structure object to modify,
				 * @params {Number[]} clickCoords - coordinates of the mouse pointer
				 * @returns {Structure}
				 */
				function modifyStructure(structure, clickCoords) {
					return DrawChemShapes.modifyStructure(
							structure,
							angular.copy(scope.chosenStructure),
							clickCoords,
							downAtomCoords
						);
				}
			}
		}
	}
})();