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
