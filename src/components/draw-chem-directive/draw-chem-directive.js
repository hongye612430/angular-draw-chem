(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.directive("drawChemEditor", DrawChemEditor);

	DrawChemEditor.$inject = [
		"DrawChemPaths",
		"DrawChemShapes",
		"DrawChemStructures",
		"DrawChemCache",
		"DrawChemConst",
		"DrawChemDirectiveActions",
		"DrawChemDirectiveUtils",
		"DCLabel",
		"$sce",
		"$compile"
	];

	function DrawChemEditor(DrawChemPaths, DrawChemShapes, DrawChemStructures, DrawChemCache, DrawChemConst, DrawChemDirActions, DrawChemDirUtils, DCLabel, $sce, $compile) {
		return {
			templateUrl: DrawChemPaths.getPath() + "draw-chem-editor.html",
			scope: {
				showEditor: "="
			},
			link: function (scope, element, attrs) {

				var Label = DCLabel.Label,
					mouseFlags = {
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
					var svg = $sce.trustAsHtml(DrawChemCache.getCurrentSvg());
					return svg;
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

				scope.customLabel = "";

				scope.chooseCustomLabel = function () {
					selected = "customLabel";
				}

				// stores all labels
				scope.labels = [];

				angular.forEach(DrawChemStructures.labels, function (label) {
					scope.labels.push({
						name: label.getLabelName(),
						choose: function () {
							scope.chosenLabel = label;
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
					try {
						doOnMouseDown($event);
					} catch (e) {
						console.log(e);
					}
				}

				scope.lolo = function () {
					console.log("lolo");
				}

				scope.doOnMouseUp = function ($event) {
					try {
						doOnMouseUp($event);
					} catch (e) {
						console.log(e);
					}
				}

				scope.doOnMouseMove = function ($event) {
					try {
						doOnMouseMove($event);
					} catch (e) {
						console.log(e);
					}
				}

				function doOnMouseDown($event) {
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

				function doOnMouseUp($event) {
					var structure, mouseCoords = DrawChemDirUtils.innerCoords(element, $event);

					if ($event.which !== 1) {
						// if button other than left was released
						return undefined;
					}

					if (mouseFlags.downOnAtom && (selected === "label" || selected === "customLabel")) {
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
					} else {
						structure = drawOnEmptySpace();
					}

					if (typeof structure !== "undefined") {
						// if the structure has been successfully set to something
						DrawChemCache.addStructure(structure);
						DrawChemDirUtils.drawStructure(structure);
					}

					DrawChemDirUtils.resetMouseFlags(mouseFlags);

					function modifyLabel() {
						var structure = angular.copy(DrawChemCache.getCurrentStructure()),
							atom = DrawChemShapes.isWithin(structure, mouseFlags.downMouseCoords).foundAtom,
							currentLabel = atom.getLabel();
						if (selected === "label") {
							atom.setLabel(angular.copy(scope.chosenLabel));
						} else if (selected === "customLabel") {
							atom.setLabel(new Label(scope.customLabel, 0, "lr"));
						}

						if (typeof currentLabel !== "undefined") {
							if (currentLabel.getMode() === "lr") {
								atom.getLabel().setMode("rl");
							} else if (currentLabel.getMode() === "rl") {
								atom.getLabel().setMode("lr");
							}
						}

						return structure;
					}

					function drawOnEmptySpace() {
						var structure, structureAux, newCoords, bond;
						if (DrawChemDirUtils.isContentEmpty()) {
							if (mouseFlags.movedOnEmpty) {
								structure = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
								structure.setOrigin(mouseFlags.downMouseCoords);
							} else {
								structure = angular.copy(scope.chosenStructure.getDefault());
								structure.setOrigin(mouseCoords);
							}
						} else {
							if (mouseFlags.movedOnEmpty) {
								structureAux = angular.copy(scope.chosenStructure.getStructure(mouseCoords, mouseFlags.downMouseCoords));
							} else {
								structureAux = angular.copy(scope.chosenStructure.getDefault());
							}
							structure = angular.copy(DrawChemCache.getCurrentStructure());
							newCoords = DrawChemDirUtils.subtractCoords(mouseCoords, structure.getOrigin());
							structureAux
								.getStructure(0)
								.setCoords(newCoords);
							if (typeof structureAux.getDecorate("aromatic") !== "undefined") {
								bond = DrawChemConst.getBondByDirection(structureAux.getName()).bond;
								structure.addDecorate("aromatic", [mouseCoords[0] + bond[0], mouseCoords[1] + bond[1]]);
							}
							structure.addToStructures(structureAux.getStructure(0));
						}
						return structure;
					}
				}

				function doOnMouseMove($event) {
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
					} else if (mouseFlags.mouseDown) {
						// if mouse button is pushed outside of the structure
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
