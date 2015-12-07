(function () {
	"use strict";
	angular.module("mmAngularDrawChem", ["ngSanitize"])
		.config(["$sanitizeProvider", function ($sanitizeProvider) {
			$sanitizeProvider.enableSvg();
		}]);
})();