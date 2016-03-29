(function () {
	"use strict";
	angular.module("angularDrawChemSite", ["ngSanitize", "ngRoute", "mmAngularDrawChem"])
		.config(["DrawChemPathsProvider", function (DrawChemPathsProvider) {
			DrawChemPathsProvider.setPath("draw-chem-editor/");
			DrawChemPathsProvider.setPathSvg("draw-chem-editor/svg");
		}])
		.config(["$routeProvider", function ($routeProvider) {
			$routeProvider.when("/", {
				templateUrl: "components/home/home.html"
			})
			.when("/editor", {
				templateUrl: "components/editor/editor-main.html",
				controller: "MainCtrl",
				controllerAs: "mainCtrl"
			})
			.when("/editor/:submenu", {
				templateUrl: "components/editor/submenu.html",
				controller: "SubmenuCtrl",
				controllerAs: "submenuCtrl"
			})
			.otherwise({ redirectTo: "/" })
		}])
		.run(["DrawChemConst", function (DrawChemConst) {
			DrawChemConst.setBondLength(35);
		}])
		.controller("AppCtrl", AppCtrl);

	AppCtrl.$inject = ["DrawChem", "$http"];

  function AppCtrl(DrawChem, $http) {
    var vm = this;
    vm.runEditor = function () {
			DrawChem.runEditor("test");
		};
    vm.showEditor = function () {
			return DrawChem.showEditor();
		};
		$http
			.get("https://api.github.com/repos/mmmalik/angular-draw-chem/tags")
			.then(function (success) {
				vm.version = typeof success.data[0] === "undefined" ? "unstable": "v" + success.data[0].name;
			}, function (err) {
				vm.version = "unknown";
			});
  }
})();
