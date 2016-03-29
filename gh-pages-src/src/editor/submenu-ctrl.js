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
