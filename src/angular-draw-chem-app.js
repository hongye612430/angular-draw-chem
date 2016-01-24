(function () {
	"use strict";
	angular.module("mmAngularDrawChem", ["ngSanitize", "ui.bootstrap"])
		.config(["$sanitizeProvider", function ($sanitizeProvider) {
			$sanitizeProvider.enableSvg();
		}]);
})();