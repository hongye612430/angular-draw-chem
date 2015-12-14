(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructure", DCStructure);
	
	function DCStructure() {
		
		var service = {};
		
		/**
		* Creates a new Structure.
		* @class
		* @param {string} name - name of the structure
		* @param {Atom[]} structure - an array of atoms
		*/
		function Structure(name, structure) {
			this.name = name;			
			this.structure = structure;
			this.transform = [];
			this.origin = [];
		}		
		
		/**
		 * Sets the specified transform (translate, scale, etc.)
		 * @param {string} name - a name of the transform
		 * @param {number[]} content - an array with the coordinates
		 */
		Structure.prototype.setTransform = function (name, content) {
			this.transform.push(
				{
					name: name,
					content: content
				}
			);
		}
		
		/**
		 * Gets the specified transform.
		 * @returns {number[]}
		 */
		Structure.prototype.getTransform = function (name) {
			var i, transform = this.transform;
			for (i = 0; i < transform.length; i += 1) {
				if (transform[i].name === name) {
					return transform[i].content;
				}
			}
		}
		
		/**
		 * Sets coordinates of the first atom.
		 * @param {number[]} origin - an array with coordinates
		 */
		Structure.prototype.setOrigin = function (origin) {
			this.origin = origin;
		}
		
		/**
		 * Gets the coordinates of the first atom.
		 * @returns {number[]}
		 */
		Structure.prototype.getOrigin = function () {
			return this.origin;
		}
		
		/**
		 * Sets the structure array.
		 * @param {Atom[]} content - an array of atoms and their connections
		 */
		Structure.prototype.setStructure = function (structure) {
			this.structure = structure;
		}
		
		/**
		 * Gets the structure array.
		 * @returns {Atom[]}
		 */
		Structure.prototype.getStructure = function () {
			return this.structure;
		}
		
		service.Structure = Structure;
		
		return service;
	}
})();