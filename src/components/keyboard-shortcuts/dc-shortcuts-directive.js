(function () {
  "use strict";
  angular.module("mmAngularDrawChem")
    .directive("dcShortcuts", DcShortcuts);

  DcShortcuts.$inject = [
    "DrawChem",
    "DrawChemKeyShortcuts",
    "$rootScope"
  ];

  function DcShortcuts(DrawChem, Shortcuts, $rootScope) {
    return {
      restrict: "A",
      link: function (scope, element) {

        element.bind("keydown", function ($event) {
          if (DrawChem.showEditor()) {
            $event.preventDefault();
            Shortcuts.down($event.keyCode);
          }
        });

        element.bind("keyup", function ($event) {
          if (DrawChem.showEditor()) {
            $event.preventDefault();
            Shortcuts.released($event.keyCode);
            $rootScope.$digest();
          }
        });
      }
    }
  }
})();
