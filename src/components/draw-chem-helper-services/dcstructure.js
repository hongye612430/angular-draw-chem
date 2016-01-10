(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCStructure", DCStructure);
	
	function DCStructure() {
		
		var service = {};
		
		/**
		* Creates a new Structure.
		* @class
		* @param {String} name - name of the structure
		* @param {Atom[]} structure - an array of atoms
		*/
		function Structure(name, structure, decorate) {
			this.name = name;			
			this.structure = structure;
			this.transform = [];
			this.origin = [];
			this.decorate = decorate || {};
		}		
		
		/**
		 * Sets the specified transform (translate, scale, etc.)
		 * @param {String} name - a name of the transform
		 * @param {Number[]} content - an array with the coordinates
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
		 * @returns {Number[]}
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
		 * @param {Number[]} origin - an array with coordinates
		 */
		Structure.prototype.setOrigin = function (origin) {
			this.origin = origin;
			angular.forEach(this.decorate, function (value, key) {
				value.forEach(function (element) {
					element[0] += origin[0];
					element[1] += origin[1];
				});
			});
		}
		
		/**
		 * Gets the coordinates of the first atom.
		 * @returns {Number[]}
		 */
		Structure.prototype.getOrigin = function (coord) {
			if (coord === "x") {
				return this.origin[0];
			} else if (coord === "y") {
				return this.origin[1];
			} else {
				return this.origin;
			}
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
		 * @returns {Atom[]|Atom}
		 */
		Structure.prototype.getStructure = function (index) {
			if (arguments.length === 0) {
				return this.structure;
			} else {
				return this.structure[index];
			}
		}
		
		/**
		 * Gets the name of the structure.
		 * @returns {String}
		 */
		Structure.prototype.getName = function () {
			return this.name;
		}
		
		/**
		 * Gets the decorate element.
		 * @returns {Object}
		 */
		Structure.prototype.getDecorate = function (decorate) {
			return this.decorate[decorate];
		}
		
		/**
		 * Sets the decorate element.
		 * @param {String} decorate - an element to add to the array
		 */
		Structure.prototype.addDecorate = function (decorate, coords) {
			if (typeof this.decorate[decorate] === "undefined") {
				this.decorate[decorate] = [];
			}
			this.decorate[decorate].push(coords);
		}
		
		service.Structure = Structure;
		
		return service;
	}
})();