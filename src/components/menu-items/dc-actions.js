(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemActions", DrawChemActions);

	DrawChemActions.$inject = [
		"DrawChemCache",
		"DrawChem",
		"DrawChemSvgRenderer",
		"DrawChemDirectiveUtils"
	];

	function DrawChemActions(Cache, DrawChem, SvgRenderer) {

		var service = {};

		/**
		 * Closes the editor.
		 */
		service.close = function () {
			DrawChem.closeEditor();
		};

		/**
		 * Transfers the content.
		 */
		service.transfer = function () {
			var structure = Cache.getCurrentStructure(),
				shape, attr, content = "";

			if (structure !== null) {
				shape = SvgRenderer.draw(structure, "transfer");
				attr = {
					"viewBox": (shape.minMax.minX - 30).toFixed(2) + " " +
						(shape.minMax.minY - 30).toFixed(2) + " " +
						(shape.minMax.maxX - shape.minMax.minX + 60).toFixed(2) + " " +
						(shape.minMax.maxY - shape.minMax.minY + 60).toFixed(2),
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

		service.actions = {
				"transfer": {
					shortcut: "ctrl + t",
					id: "transfer",
					action: service.transfer
				},
				"close": {
					shortcut: "ctrl + q",
					id: "close",
					action: service.close
				}
		};

		return service;
	}
})();
