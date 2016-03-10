(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemCache", DrawChemCache);

	function DrawChemCache() {

		var service = {},
			namedStructures = {},
			cachedStructures = [{ structure: null, svg: "" }],
			structurePointer = 0,
			maxCapacity = 10;

		service.addStructure = function (structure) {
			if (structurePointer < cachedStructures.length - 1) {
				cachedStructures = cachedStructures.slice(0, structurePointer + 1);
			}
			cachedStructures.push({structure: structure, svg: ""});

			if (cachedStructures.length > 10) {
				cachedStructures.shift();
			}

			service.moveRightInStructures();
		};

		service.getCurrentPosition = function () {
			return structurePointer;
		}

		service.getStructureLength = function () {
			return cachedStructures.length;
		};

		service.getCurrentStructure = function () {
			return cachedStructures[structurePointer].structure;
		};

		service.getCurrentSvg = function () {
			return cachedStructures[structurePointer].svg;
		};

		service.setCurrentSvg = function (svg) {
			cachedStructures[structurePointer].svg = svg;
		};

		service.moveLeftInStructures = function () {
			if (structurePointer > 0) {
				structurePointer -= 1;
			}
		};

		service.moveRightInStructures = function () {
			if (structurePointer < cachedStructures.length - 1) {
				structurePointer += 1;
			}
		}

		return service;
	}
})();
