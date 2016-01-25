(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.provider("DrawChemPaths", DrawChemPathsProvider);
	
	function DrawChemPathsProvider() {
		var path = "",
			pathSvg = path + "svg";
		
		return {
			setPath: function (value) {
				path = value;
			},
			setPathSvg: function (value) {
				pathSvg = value;
			},
			$get: function () {
				return {
					getPath: function () {
						return path;
					},
					getPathToSvg: function () {
						return pathSvg;
					}
				};
			}
		};
	}
	
})();