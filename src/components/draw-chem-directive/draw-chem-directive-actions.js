(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveActions", DrawChemDirectiveActions);

	DrawChemDirectiveActions.$inject = [
		"DrawChemCache",
		"DrawChem",
		"DrawChemShapes",
		"DrawChemDirectiveUtils"
	];

	function DrawChemDirectiveActions(DrawChemCache, DrawChem, DrawChemShapes, DrawChemDirUtils) {

		var service = {};

		/**
		 * Reverses the recent 'undo' action.
		 */
		service.forward = function () {
			DrawChemCache.moveRightInStructures();
			if (DrawChemCache.getCurrentStructure() === null) {
				DrawChem.clearContent();
			} else {
				DrawChemDirUtils.drawStructure(DrawChemCache.getCurrentStructure());
			}
		};

		/**
		 * Closes the editor.
		 */
		service.close = function () {
			DrawChem.closeEditor();
		};

		/**
		 * Clears the content.
		 */
		service.clear = function () {
			DrawChemCache.addStructure(null);
			DrawChemCache.setCurrentSvg("");
		};

		/**
		 * Undoes a change associated with the recent 'mouseup' event.
		 */
		service.undo = function () {
			DrawChemCache.moveLeftInStructures();
			if (DrawChemCache.getCurrentStructure() === null) {
				DrawChem.clearContent();
			} else {
				DrawChemDirUtils.drawStructure(DrawChemCache.getCurrentStructure());
			}
		};

		/**
		 * Transfers the content.
		 */
		service.transfer = function () {
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
					"width": "100%",
					"xmlns": "http://www.w3.org/2000/svg",
					"xmlns:xlink": "http://www.w3.org/1999/xlink"
				};
				content = shape.wrap("mini", "g").wrap("mini", "svg", attr).elementMini;
			}
			DrawChem.setContent(content);
			DrawChem.setStructure(structure);
			DrawChem.transferContent();
		};

		service.actions = [
			{ name: "undo", shortcut: "ctrl + z", action: service.undo },
			{ name: "forward", shortcut: "ctrl + f", action: service.forward },
			{ name: "transfer", shortcut: "ctrl + t", action: service.transfer },
			{ name: "clear", shortcut: "ctrl + e", action: service.clear },
			{ name: "close", shortcut: "ctrl + q", action: service.close }
		];

		return service;
	}
})();
