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
			"Ring-closing metathesis": {
				file: "metathesis",
				style: { width: "50%" },
				paper: "Malik, M.; Witkowski, G.; Ceborska, M.; Jarosz, S. <i>Org. Lett.</i> <strong>2013</strong>, <i>15</i>, 6214-6217"
			},
			"White's macrolactonization": {
				file: "macrolactonization",
				style: { width: "65%" },
				paper: "Fraunhoffer, K.F.; Prabagaran, N.; Sirois, L.E.; White, M. C. <i>JACS</i> <strong>2006</strong>, <i>128</i>, 9032-9033"
			},
			"Barton–McCombie deoxygenation": {
				file: "barton",
				style: { width: "75%" },
				paper: "Tormo, J.; Fu, G. C. <i>Org. Syn.</i> <strong>2002</strong>, <i>78</i>, 239"
			}
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
