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
