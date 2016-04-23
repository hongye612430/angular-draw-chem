(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCTextArea", DCTextArea);

	function DCTextArea() {

		var service = {};

		/**
		* Creates a new `TextArea` object.
		* @class
		* @param {string} text - associated text,
		* @param {number[]} origin - origin coordinates (relative to parent `Structure` object's origin)
		*/
		function TextArea(text, origin) {
			this.text = text;
			this.origin = origin;
		}

		/**
		 * Gets text.
		 * @returns {string}
		 */
		TextArea.prototype.getText = function () {
			return this.text;
		};

    /**
		 * Sets text.
		 * @param {string} text - associated text
		 */
		TextArea.prototype.setText = function (text) {
			this.text = text;
		};

		/**
		 * Gets origin.
		 * @returns {number[]}
		 */
		TextArea.prototype.getOrigin = function () {
			return this.origin;
		};

		/**
		 * Sets origin.
		 * @param {number[]} origin - origin coordinates (relative to parent `Structure` object's origin)
		 */
		TextArea.prototype.setOrigin = function (origin) {
			this.origin = origin;
		};

		service.TextArea = TextArea;

		return service;
	}
})();
