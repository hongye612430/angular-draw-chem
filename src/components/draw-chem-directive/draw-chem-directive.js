(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = ["DrawChemShapes", "DrawChemStructures", "DrawChem", "DrawChemConst", "DrawChemCache", "$sce", "$window"];
	
	function DrawChemEditor(DrawChemShapes, DrawChemStructures, DrawChem, DrawChemConst, DrawChemCache, $sce, $window) {
		return {
			templateUrl: "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				
				var downAtomCoords,
					downClickCoords,
					changeLabel = false,
					movedOnEmpty = false,
					mouseDown = false,
					downOnAtom = false;
					
				scope.label = "";
				
				scope.changeLabel = function () {
					changeLabel = true;
					scope.chosenStructure = undefined;
				}
				
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
				 * Returns content which will be bound in the dialog box.
				 */
				scope.content = function () {
					return $sce.trustAsHtml(DrawChemCache.getCurrentSvg());
				}
				
				/**
				 * Undoes a change associated with the recent 'mouseup' event.
				 */
				scope.undo = function () {
					DrawChemCache.moveLeftInStructures();
					if (DrawChemCache.getCurrentStructure() === null) {
						DrawChem.clearContent();
					} else {
						draw(DrawChemCache.getCurrentStructure());
					}				
				}
				
				/**
				 * Reverses the recent 'undo' action.
				 */
				scope.forward = function () {
					DrawChemCache.moveRightInStructures();
					draw(DrawChemCache.getCurrentStructure());
				}
				
				/**
				 * Clears the content.
				 */
				scope.clear = function () {
					DrawChemCache.addStructure(null);
					DrawChemCache.setCurrentSvg("");
				}
				
				/**
				 * Transfers the content.
				 */
				scope.transfer = function () {					
					var structure = DrawChemCache.getCurrentStructure(),
						shape, attr, content = "";
						
					if (structure !== null) {
						shape = DrawChemShapes.draw(structure, "cmpd1");
						attr = {
							"viewBox": (shape.minMax.minX - 20) + " " +
								(shape.minMax.minY - 20) + " " +
								(shape.minMax.maxX - shape.minMax.minX + 40) + " " +
								(shape.minMax.maxY - shape.minMax.minY + 40),
							"height": "100%",
							"width": "100%"
						};
						content = shape.wrap("mini", "svg", attr).getElementMini();
					}
					DrawChem.setContent(content);
					DrawChem.setStructure(structure);
					DrawChem.transferContent();
				}
				
				/**
				 * Stores the chosen structure.
				 */
				scope.chosenStructure;
				
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
					downClickCoords = innerCoords($event);		
					mouseDown = true;
					if (DrawChemCache.getCurrentStructure() !== null) {
						downAtomCoords = DrawChemShapes.isWithin(DrawChemCache.getCurrentStructure(), downClickCoords).absPos;						
						if (typeof downAtomCoords !== "undefined") {
							downOnAtom = true;
						}
					}
				}
				
				/**
				 * Action to perform on 'mouseup' event.
				 */
				scope.doOnMouseUp = function ($event) {
					var structure,
						atom,
						mouseCoords = innerCoords($event),						
						currentStructure = DrawChemCache.getCurrentStructure();
					
					if (changeLabel) {
						structure = angular.copy(currentStructure);
						atom = DrawChemShapes.isWithin(structure, mouseCoords).foundAtom;
						atom.setLabel(scope.label);
					} else {
						if (DrawChemCache.getCurrentStructure() !== null) {
							structure = modifyStructure(currentStructure, mouseCoords);					
						} else if (typeof scope.chosenStructure !== "undefined") {
							if (movedOnEmpty) {
								structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, downClickCoords));
								structure.setOrigin(downClickCoords);
							} else {
								structure = angular.copy(scope.chosenStructure.getDefault());
								structure.setOrigin(mouseCoords);
							}
						}
					}
					
					if (typeof structure !== "undefined") {
						DrawChemCache.addStructure(angular.copy(structure));
						draw(structure);
						resetMouseFlags();
					}
				}
				
				/**
				 * Action to perform on 'mousemove' event.
				 */
				scope.doOnMouseMove = function ($event) {
					var mouseCoords = innerCoords($event),
						updatedCurrentStructure,						
						frozenCurrentStructure,
						structure;
					if (downOnAtom && typeof scope.chosenStructure !== "undefined") {
						frozenCurrentStructure = DrawChemCache.getCurrentStructure();
						updatedCurrentStructure = modifyStructure(frozenCurrentStructure, mouseCoords, true);
						draw(updatedCurrentStructure);
					} else if (mouseDown && typeof scope.chosenStructure !== "undefined" && DrawChemCache.getCurrentStructure() === null) {
						structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, downClickCoords));
						structure.setOrigin(downClickCoords);
						movedOnEmpty = true;
						draw(structure);
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
					movedOnEmpty = false;
					changeLabel = false;
					downAtomCoords = undefined;
					downClickCoords = undefined;
				}
				
				/**
				 * Draws the specified structure.
				 * @params {Structure} structure - a Structure object to draw.
				 */
				function draw(structure) {
					var drawn = "";					
					drawn = DrawChemShapes.draw(structure, "cmpd1");
					DrawChemCache.setCurrentSvg(drawn.wrap("full", "svg").getElementFull());
				}
				
				/**
				 * Modifies the specified structure by adding a new structure to it.
				 * @params {Structure} structure - a Structure object to modify,
				 * @params {Number[]} clickCoords - coordinates of the mouse pointer
				 * @params {Boolean} mouseDownAndMove - true if 'mouseonmove' and 'mousedown' are true
				 * @returns {Structure}
				 */
				function modifyStructure(structure, mouseCoords, mouseDownAndMove) {
					return DrawChemShapes.modifyStructure(
						angular.copy(structure),
						angular.copy(scope.chosenStructure),
						mouseCoords,
						downAtomCoords,
						mouseDownAndMove
					);
				}
			}
		}
	}
})();