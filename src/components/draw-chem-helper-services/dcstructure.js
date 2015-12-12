(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructure", DCStructure);
	
	function DCStructure() {
		
		var service = {};
		
		/**
		* Creates a new DCStructure.
		* @class
		*/
		function Structure(name, structure) {
			this.name = name;
			this.structure = structure;
			this.transform = [];
		}
		
		Structure.prototype.setTransform = function (name, content) {
			this.transform.push(
				{
					name: name,
					content: content
				}
			);
		}
		
		Structure.prototype.getTransform = function (name) {
			var i, transform = this.transform;
			for (i = 0; i < transform.length; i += 1) {
				if (transform[i].name === name) {
					return transform[i].content;
				}
			}
		}
		
		service.Structure = Structure;
		
		return service;
	}
})();