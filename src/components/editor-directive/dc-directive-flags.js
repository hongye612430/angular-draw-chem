(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveFlags", DrawChemDirectiveFlags);

	DrawChemDirectiveFlags.$inject = [];

	function DrawChemDirectiveFlags() {

		var service = {};

    service.mouseFlags = {
      downAtomCoords: undefined,
			downAtomObject: undefined,
      downMouseCoords: undefined,
      movedOnEmpty: false,
      mouseDown: false,
      downOnAtom: false
    };

    service.selected = "";

		return service;
	}
})();
