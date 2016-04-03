(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCBondStructure", DCBondStructure);

	function DCBondStructure() {

		var service = {};

    /**
		* Creates a new `BondStructure` object.
		* @class
    * @param {string} name - name of the cyclic structure,
    * @param {number} multiplicity - multiplicity of the bond
		*/
    function BondStructure(name, multiplicity) {
      this.name = name;
      this.multiplicity = multiplicity;
    }

    /**
    * Gets name of bond structure.
    * @returns {string}
    */
    BondStructure.prototype.getName = function () {
      return this.name;
    };

    /**
    * Gets multiplicity of the bond.
    * @returns {number}
    */
    BondStructure.prototype.getMultiplicity = function () {
      return this.multiplicity;
    };

    service.BondStructure = BondStructure;

		return service;
	}
})();
