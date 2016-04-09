(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemEdits", DrawChemEdits);

	DrawChemEdits.$inject = ["DrawChem", "DrawChemCache", "DrawChemDirectiveUtils", "DrawChemDirectiveFlags"];

	function DrawChemEdits(DrawChem, Cache, Utils, Flags) {

		var service = {};

		/**
		* Deletes all structures marked as selected.
		*/
    service.deleteFromStructure = function () {
			Flags.selected = "delete";
    };

		/**
		* Deletes all structures marked as selected.
		*/
    service.deleteSelected = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null) {
				structure.deleteSelected();
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}
    };

		/**
		* Marks all structures as selected.
		*/
    service.select = function () {
			service.deselectAll();
			Flags.selected = "select";
    };

		/**
		* Marks all structures as selected.
		*/
    service.selectAll = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null) {
				structure.selectAll();
				Cache.addStructure(structure);
			  Utils.drawStructure(structure);
			}
    };

		/**
		* Deselects all structures.
		*/
		service.deselectAll = function () {
			var structure = angular.copy(Cache.getCurrentStructure());
			if (structure !== null) {
				structure.deselectAll();
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}
    };

		/**
		* Copies all selected structures.
		*/
		service.copy = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), selected;
			if (structure !== null) {
				selected = structure.getSelected();
				structure.setStructure(selected);
				Flags.copy = structure;
			}
		};

		/**
		* Copies all selected structures.
		*/
		service.cut = function () {
			var structure = angular.copy(Cache.getCurrentStructure()),
			  cut = angular.copy(Cache.getCurrentStructure()), selected;
			if (structure !== null) {
				selected = cut.getSelected();
				cut.setStructure(selected);
				Flags.copy = cut;
				structure.deleteSelected();
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}
		};

		/**
		* Pastes all copied structures.
		*/
		service.paste = function () {
			var structure = angular.copy(Cache.getCurrentStructure()),
			  copy = angular.copy(Flags.copy);
			if (structure !== null && typeof copy !== "undefined") {
				structure.deselectAll();
				moveSelected(copy.getStructure());
				structure.addToStructures(copy.getStructure());
				Cache.addStructure(structure);
				Utils.drawStructure(structure);
			}

			function moveSelected(selected) {
				selected.forEach(function (s) {
					s.addToCoords([50, 50]);
				});
			}
		};

		/**
		* Aligns all structures to the uppermost point.
		*/
		service.alignUp = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignUp(minMax.minY);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Aligns all structures to the lowermost point.
		*/
		service.alignDown = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignDown(minMax.maxY);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Aligns all structures to the rightmost point.
		*/
		service.alignRight = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignRight(minMax.maxX);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Aligns all structures to the rightmost point.
		*/
		service.alignLeft = function () {
			var structure = angular.copy(Cache.getCurrentStructure()), changed = false, minMax;
			if (structure !== null) {
				minMax = structure.findMinMax();
				changed = structure.alignLeft(minMax.minX);
				if (changed) {
					Cache.addStructure(structure);
					Utils.drawStructure(structure);
				}
			}
		};

		/**
		* Moves structure.
		*/
    service.moveStructure = function () {
			Flags.selected = "moveStructure";
			return {
				left: moveStructureTo("left"),
				up: moveStructureTo("up"),
				right: moveStructureTo("right"),
				down: moveStructureTo("down")
			};

			function moveStructureTo(dir) {
				return function () {
					var structure = angular.copy(Cache.getCurrentStructure());
					if (structure !== null) {
						structure.moveStructureTo(dir);
						Cache.addStructure(structure);
						Utils.drawStructure(structure);
					}
				};
			}
    };

		/**
		 * Undoes a change associated with the recent 'mouseup' event.
		 */
		service.undo = function () {
			Cache.moveLeftInStructures();
			if (Cache.getCurrentStructure() === null) {
				DrawChem.clearContent();
			} else {
				Utils.drawStructure(Cache.getCurrentStructure());
			}
		};

		/**
		 * Reverses the recent 'undo' action.
		 */
		service.forward = function () {
			Cache.moveRightInStructures();
			if (Cache.getCurrentStructure() === null) {
				DrawChem.clearContent();
			} else {
				Utils.drawStructure(Cache.getCurrentStructure());
			}
		};

		/**
		 * Clears the content.
		 */
		service.deleteAll = function () {
			Cache.addStructure(null);
			Cache.setCurrentSvg("");
		};

		service.edits = {
			"move": {
				action: service.moveStructure,
				id: "move",
				shortcut: "arrows / ctrl + b",
				shortcutBind: {
					left: service.moveStructure().left,
					up: service.moveStructure().up,
					right: service.moveStructure().right,
					down: service.moveStructure().down
				}
			},
			"select": {
				action: service.select,
				id: "select",
				shortcut: "shift + s"
			},
			"select all": {
				action: service.selectAll,
				id: "select-all",
				shortcut: "ctrl + a"
			},
			"deselect all": {
				action: service.deselectAll,
				id: "deselect-all",
				shortcut: "ctrl + d",
				separate: true
			},
			"copy": {
				action: service.copy,
				id: "copy",
				shortcut: "ctrl + c"
			},
			"cut": {
				action: service.cut,
				id: "cut",
				shortcut: "ctrl + x"
			},
			"undo": {
				action: service.undo,
				id: "undo",
				shortcut: "ctrl + z"
			},
			"forward": {
				action: service.forward,
				id: "forward",
				shortcut: "ctrl + f"
			},
			"paste": {
				action: service.paste,
				id: "paste",
				shortcut: "ctrl + v",
				separate: true
			},
			"align up": {
				action: service.alignUp,
				id: "align-up",
				shortcut: "shift + q"
			},
			"align down": {
				action: service.alignDown,
				id: "align-down",
				shortcut: "shift + w"
			},
			"align right": {
				action: service.alignRight,
				id: "align-right",
				shortcut: "shift + r"
			},
			"align left": {
				action: service.alignLeft,
				id: "align-left",
				separate: true,
				shortcut: "shift + e"
			},
			"delete all": {
				shortcut: "ctrl + e",
				id: "clear",
				action: service.deleteAll
			},
			"delete selected": {
				action: service.deleteSelected,
				id: "delete-selected",
				shortcut: "del"
			},
			"erase": {
				action: service.deleteFromStructure,
				id: "delete",
			}
		};

		return service;
	}
})();
