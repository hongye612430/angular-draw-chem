(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);
	
	DrawChemEditor.$inject = [
		"DrawChemPaths",
		"DrawChemShapes",
		"DrawChemStructures",
		"DrawChemCache",
		"DrawChemDirectiveActions",
		"DrawChemDirectiveUtils",
		"$sce"
	];
	
	function DrawChemEditor(DrawChemPaths, DrawChemShapes, DrawChemStructures, DrawChemCache, DrawChemDirActions, DrawChemDirUtils, $sce) {
		return {
			templateUrl: DrawChemPaths.getPath() + "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {
				
				var mouseFlags = {
						downAtomCoords: undefined,
						downMouseCoords: undefined,					
						movedOnEmpty: false,
						mouseDown: false,
						downOnAtom: false
					},
					selected;
				
				scope.pathToSvg = DrawChemPaths.getPathToSvg();
				
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
					return $sce.trustAsHtml(DrawChemCache.getCurrentSvg());
				};
				
				// stores all actions, e.g. clear, transfer, undo.
				scope.actions = [];
				
				angular.forEach(DrawChemDirActions.actions, function (action) {
					if (action.name === "close") {
						scope[action.name] = action.action;
					}
					scope.actions.push({
						name: action.name,
						action: action.action
					});
				});
				
				// Stores the chosen label.
				scope.chosenLabel;
				
				// stores all labels
				scope.labels = [];
				
				angular.forEach(DrawChemStructures.labels, function (label) {
					scope.labels.push({
						name: label.getLabel(),
						choose: function () {
							scope.chosenLabel = angular.copy(label);
							selected = "label";
						}
					})
				});
				
				// Stores the chosen structure.			
				scope.chosenStructure;
				
				// Stores all predefined structures.
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
				
				/***** Mouse Events *****/				
				scope.doOnMouseDown = function ($event) {
					if ($event.which !== 1) {
						// if button other than left was pushed
						return undefined;
					}
					
					mouseFlags.downMouseCoords = DrawChemDirUtils.innerCoords(element, $event);
					mouseFlags.mouseDown = true;
					if (!DrawChemDirUtils.isContentEmpty()) {
						// if content is not empty
						checkIfDownOnAtom();
					}
					
					function checkIfDownOnAtom() {
						mouseFlags.downAtomCoords =
							DrawChemShapes.isWithin(
								DrawChemCache.getCurrentStructure(),
								mouseFlags.downMouseCoords
							).absPos;
						if (typeof mouseFlags.downAtomCoords !== "undefined") {
							// set flag if atom was selected
							mouseFlags.downOnAtom = true;
						}
					}
				}
				
				scope.doOnMouseUp = function ($event) {					
					var structure, mouseCoords = DrawChemDirUtils.innerCoords(element, $event);
					
					if ($event.which !== 1) {
						// if button other than left was released
						return undefined;
					}
					
					if (DrawChemDirUtils.isContentEmpty()) {
						// if content is empty
						structure = drawOnEmptyContent();
					} else if (mouseFlags.downOnAtom && selected === "label") {
						// if atom has been selected and 'change label' button is selected
						structure = modifyLabel();						
					} else if (mouseFlags.downOnAtom && selected === "structure") {
						// if atom has been selected and any of the structure buttons has been clicked
						structure = DrawChemDirUtils.modifyStructure(
							DrawChemCache.getCurrentStructure(),
							scope.chosenStructure,
							mouseCoords,
							mouseFlags.downAtomCoords
						);
					}
					
					if (typeof structure !== "undefined") {
						// if the structure has been successfully set to something
						DrawChemCache.addStructure(angular.copy(structure));
						DrawChemDirUtils.drawStructure(structure);						
					}
					
					DrawChemDirUtils.resetMouseFlags(mouseFlags);
					
					function modifyLabel() {
						var structure = angular.copy(DrawChemCache.getCurrentStructure()),
							atom = DrawChemShapes.isWithin(structure, mouseFlags.downMouseCoords).foundAtom;
						atom.setLabel(scope.chosenLabel.getLabel());
						return structure;
					}
					
					function drawOnEmptyContent() {
						var structure;
						if (mouseFlags.movedOnEmpty) {
							structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
							structure.setOrigin(mouseFlags.downMouseCoords);
						} else {
							structure = angular.copy(scope.chosenStructure.getDefault());
							structure.setOrigin(mouseCoords);
						}
						return structure;
					}
				}				
				
				scope.doOnMouseMove = function ($event) {
					var mouseCoords = DrawChemDirUtils.innerCoords(element, $event), structure;
					
					if (selected !== "structure") {
						// if no structure has been chosen
						// then do nothing
						return undefined;
					}
						
					if (mouseFlags.downOnAtom) {
						// if an atom has been chosen
						structure = modifyOnNonEmptyContent();
						DrawChemDirUtils.drawStructure(structure);
					} else if (mouseFlags.mouseDown && DrawChemDirUtils.isContentEmpty()) {
						// if content is empty and mouse button is pushed
						structure = modifyOnEmptyContent();
						DrawChemDirUtils.drawStructure(structure);
					}
					
					function modifyOnNonEmptyContent() {
						var frozenCurrentStructure = DrawChemCache.getCurrentStructure();					
						return DrawChemDirUtils.modifyStructure(
							frozenCurrentStructure,
							scope.chosenStructure,
							mouseCoords,
							mouseFlags.downAtomCoords,
							true
						);
					}
					
					function modifyOnEmptyContent() {
						var struct = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
						struct.setOrigin(mouseFlags.downMouseCoords);
						mouseFlags.movedOnEmpty = true;
						return struct;
					}
				}
			}
		}
	}
})();