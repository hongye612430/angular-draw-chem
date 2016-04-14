(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemDirectiveFlags", DrawChemDirectiveFlags);

	DrawChemDirectiveFlags.$inject = [];

	function DrawChemDirectiveFlags() {

		var service = {};

    service.mouseFlags = {
      movedOnEmpty: false,
      mouseDown: false,
      downOnAtom: false,
			downOnBond: false,
			downOnNothing: false
    };

		service.customLabel = "";

		service.focused = false;

    service.selected = "";

		return service;
	}
})();
