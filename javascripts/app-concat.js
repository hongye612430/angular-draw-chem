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

(function () {
	"use strict";
	angular.module("angularDrawChemSite")
		.controller("SubmenuCtrl", SubmenuCtrl);

	SubmenuCtrl.$inject = ["$location", "$http"];

  function SubmenuCtrl($location, $http) {
    var vm = this;
		vm.getTemplate = function () {
			var location = $location.path();
			if (location === "/editor") {
				return "components/editor/sub-default.html"
			}
			return "components" + location + "-sub.html";
		};
		vm.svgs = {
			"erythromycin": { file: "erythromycin", style: { width: "30%" } },
			"barbituric acid": { file: "barbituric-acid", style: { width: "15%" } },
			"inositol": { file: "inositol", style: { width: "15%" } },
			"miglustat": { file: "miglustat", style: { width: "15%" } },
			"naringenin": { file: "naringenin", style: { width: "25%" } },
			"curcumin": { file: "curcumin", style: { width: "35%" } },
			"cephalosporins": { file: "cephalosporins", style: { width: "20%" } }
		};
		vm.releases = [];
		$http
			.get("https://api.github.com/repos/mmmalik/angular-draw-chem/releases")
			.then(function (success) {
				var releases = typeof success.data.length === 0 ? "no releases": success.data;
				angular.forEach(releases, function (release) {
					var obj = {
						name: "v" + release["tag_name"],
						zip: release["zipball_url"],
						tar: release["tarball_url"]
					};
					vm.releases.push(obj);
				});
			}, function (err) {
				vm.releases = "no releases available";
			});
  }
})();

(function () {
	"use strict";
	angular.module("angularDrawChemSite")
		.controller("SidebarCtrl", SidebarCtrl);

	SidebarCtrl.$inject = ["$http"];

  function SidebarCtrl($http) {
    var vm = this;
    var bootstrapPrefix = "glyphicon glyphicon-";
    var imagesPath = "images/";

    vm.menuItems = {
      "Home": {
        icon: bootstrapPrefix + "home",
        link: "#/"
      },
      "Editor": {
        icon: bootstrapPrefix + "edit",
				link: "#/editor",
        submenu: {
          "download": {
            icon: bootstrapPrefix + "download-alt",
						link: "#/editor/download"
          },
          "manual": {
            icon: bootstrapPrefix + "book",
						link: "#/editor/manual",
          },
          "examples": {
            icon: bootstrapPrefix + "tags",
						link: "#/editor/examples",
          }
        }
      },
      "GitHub": {
        icon: "icon-github",
        link: "https://github.com/MMMalik/angular-draw-chem"
      }
    };		
  }
})();

(function () {
	"use strict";
	angular.module("angularDrawChemSite")
		.directive("sidebarMenu", SidebarMenu);

  function SidebarMenu() {
    return {
			templateUrl: "components/sidebar-menu/sidebar-menu.html",
      scope: {
        menuItems: "=",
        itemWidth: "@"
      },
			link: function (scope, element, attrs) {
        scope.dots = "";
        for (var i = 0; i < 100; i += 1) {
          scope.dots += ".";
        }
      }
    };
  }
})();
