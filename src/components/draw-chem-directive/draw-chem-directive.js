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
					downMouseCoords,
					selected,
					movedOnEmpty = false,
					mouseDown = false,
					downOnAtom = false;
					
				scope.label = "";
				
				scope.changeLabel = function () {
					selected = "label";
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
					if (DrawChemCache.getCurrentStructure() === null) {
						DrawChem.clearContent();
					} else {
						draw(DrawChemCache.getCurrentStructure());
					}
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
							"viewBox": (shape.minMax.minX - 20).toFixed(2) + " " +
								(shape.minMax.minY - 20).toFixed(2) + " " +
								(shape.minMax.maxX - shape.minMax.minX + 40).toFixed(2) + " " +
								(shape.minMax.maxY - shape.minMax.minY + 40).toFixed(2),
							"height": "100%",
							"width": "100%"
						};
						content = shape.wrap("mini", "g").wrap("mini", "svg", attr).elementMini;
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
							selected = "structure";
						}
					});
				});
				
				/**
				 * Action to perform on 'mousedown' event.
				 */
				scope.doOnMouseDown = function ($event) {
					if ($event.which !== 1) {
						// if button other than left was pushed
						return undefined;
					}
					
					downMouseCoords = innerCoords($event);
					mouseDown = true;
					if (!isContentEmpty()) {
						// if content is not empty
						checkIfDownOnAtom();
					}
					
					function checkIfDownOnAtom() {
						downAtomCoords = DrawChemShapes.isWithin(DrawChemCache.getCurrentStructure(), downMouseCoords).absPos;
						if (typeof downAtomCoords !== "undefined") {
							// set flag if atom was selected
							downOnAtom = true;
						}
					}
				}
				
				/**
				 * Action to perform on 'mouseup' event.
				 */
				scope.doOnMouseUp = function ($event) {					
					var structure, mouseCoords = innerCoords($event);
					
					if ($event.which !== 1) {
						// if button other than left was released
						return undefined;
					}
					
					if (isContentEmpty()) {
						// if content is empty
						structure = drawOnEmptyContent();
					} else if (downOnAtom && selected === "label") {
						// if atom has been selected and 'change label' button is selected
						structure = modifyLabel();						
					} else if (downOnAtom && selected === "structure") {
						// if atom has been selected and any of the structure buttons has been clicked
						structure = modifyStructure(DrawChemCache.getCurrentStructure(), mouseCoords);
					}
					
					if (typeof structure !== "undefined") {
						// if the structure has been successfully set to something
						DrawChemCache.addStructure(angular.copy(structure));
						draw(structure);						
					}
					
					resetMouseFlags();
					
					function modifyLabel() {
						var structure = angular.copy(DrawChemCache.getCurrentStructure()),
							atom = DrawChemShapes.isWithin(structure, downMouseCoords).foundAtom;
						atom.setLabel(scope.label);
						return structure;
					}
					
					function drawOnEmptyContent() {
						var structure;
						if (movedOnEmpty) {
							structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, downMouseCoords));
							structure.setOrigin(downMouseCoords);
						} else {
							structure = angular.copy(scope.chosenStructure.getDefault());
							structure.setOrigin(mouseCoords);
						}
						return structure;
					}
				}
				
				/**
				 * Action to perform on 'mousemove' event.
				 */
				scope.doOnMouseMove = function ($event) {
					var mouseCoords = innerCoords($event), structure;
					
					if (selected !== "structure") {
						// if no structure has been chosen
						// then do nothing
						return undefined;
					}
						
					if (downOnAtom) {
						// if an atom has been chosen
						structure = modifyOnNonEmptyContent();
						draw(structure);
					} else if (mouseDown && isContentEmpty()) {
						// if content is empty and mouse button is pushed
						structure = modifyOnEmptyContent();
						draw(structure);
					}
					
					function modifyOnNonEmptyContent() {
						var frozenCurrentStructure = DrawChemCache.getCurrentStructure();					
						return modifyStructure(frozenCurrentStructure, mouseCoords, true);
					}
					
					function modifyOnEmptyContent() {
						var struct = angular.copy(scope.chosenStructure.getStructure(mouseCoords, downMouseCoords));
						struct.setOrigin(downMouseCoords);
						movedOnEmpty = true;
						return struct;
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
					downAtomCoords = undefined;
					downMouseCoords = undefined;
				}
				
				/**
				 * Draws the specified structure.
				 * @params {Structure} structure - a Structure object to draw.
				 */
				function draw(structure) {
					var drawn = "";					
					drawn = DrawChemShapes.draw(structure, "cmpd1");
					DrawChemCache.setCurrentSvg(drawn.wrap("full", "g").wrap("full", "svg").elementFull);
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
				
				/**
				 * Checks if the canvas is empty.
				 * @returns {Boolean}
				 */
				function isContentEmpty() {
					return DrawChemCache.getCurrentStructure() === null;
				}
			}
		}
	}
})();