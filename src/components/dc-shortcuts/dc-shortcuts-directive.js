(function () {
  "use strict";
  angular.module("mmAngularDrawChem")
    .directive("dcShortcuts", DcShortcuts);

  DcShortcuts.$inject = [
    "DCShortcutsStorage",
    "$document"
  ];

  function DcShortcuts(Shortcuts, $document) {
    return {
      restrict: "A",
      link: function (scope, element) {

        element.bind("keydown", function ($event) {
          if ($event.ctrlKey) {
            Shortcuts.down($event.keyCode);
            $event.preventDefault();
          }

        });

        element.bind("keyup", function ($event) {
          Shortcuts.released($event.keyCode);
        });
      }
    }
  }
})();
