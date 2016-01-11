(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemCache", DrawChemCache);
	
	function DrawChemCache() {
		
		var service = {},
			namedStructures = {},			
			cachedStructures = [],
			structurePointer = -1,
			maxCapacity = 10;
		
		service.addStructure = function (structure) {
			if (structurePointer < cachedStructures.length - 1) {
				cachedStructures = cachedStructures.slice(0, structurePointer + 1);				
			}
			cachedStructures.push(structure);
			service.moveRightInStructures();
			
			if (cachedStructures.length > 10) {
				cachedStructures.shift();
			}						
		};
		
		service.getCurrentPosition = function () {
			return structurePointer;
		}
		
		service.getStructureLength = function () {
			return cachedStructures.length;
		};
		
		service.removeLastStructure = function () {
			return cachedStructures.pop();
		};
		
		service.removeFirstStructure = function () {
			return cachedStructures.shift();
		};
		
		service.getCurrentStructure = function () {
			return cachedStructures[structurePointer];
		};
		
		service.moveLeftInStructures = function () {
			if (structurePointer > -1) {
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