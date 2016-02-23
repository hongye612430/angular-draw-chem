(function () {
  "use strict";
  angular.module("mmAngularDrawChem")
    .directive("dcShortcuts", DcShortcuts);

  DcShortcuts.$inject = [
    "DCShortcutsStorage",
    "$rootScope"
  ];

  function DcShortcuts(Shortcuts, $rootScope) {
    return {
      restrict: "A",
      link: function (scope, element) {

        element.bind("keydown", function ($event) {
          if ($event.ctrlKey) {
            $event.preventDefault();
            Shortcuts.down($event.keyCode);
          }
        });

        element.bind("keyup", function ($event) {
          Shortcuts.released($event.keyCode);
          $rootScope.$digest();
        });
      }
    }
  }
})();
