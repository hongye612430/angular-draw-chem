(function () {
	"use strict";
	angular.module("angularDrawChemSite")
		.controller("MainCtrl", MainCtrl);

  MainCtrl.$inject = ["DrawChem", "$sce"];

  function MainCtrl(DrawChem, $sce) {
    var vm = this;
    var activeTabClass = "active";
    var inactiveTabClass = "";

    vm.runOutput = function () {
			DrawChem.closeEditor();
      vm.showOutput = true;
		}    
		vm.input = function () {
			return $sce.trustAsHtml(DrawChem.getContent("test"));
		}
		vm.svg = function () {
			if (DrawChem.getContent("test") === "") {
				return "";
			}
			return DrawChem.beautifySvg("test");
		}
  }
})();
