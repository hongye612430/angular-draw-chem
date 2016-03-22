(function () {
  "use strict";
  angular.module("mmAngularDrawChem")
    .directive("dcShortcuts", DcShortcuts);

  DcShortcuts.$inject = [
    "DrawChem",
    "DrawChemKeyShortcuts",
    "DrawChemDirectiveFlags",
    "$rootScope"
  ];

  function DcShortcuts(DrawChem, Shortcuts, Flags, $rootScope) {
    return {
      restrict: "A",
      link: function (scope, element) {

        element.bind("keydown", function ($event) {
          if (DrawChem.showEditor() && (!Flags.focused || $event.ctrlKey)) {
            // should prevent default only if editor is shown and
            // either custom label field is NOT focused
            // or ctrl/shift key is involved
            $event.preventDefault();
            Shortcuts.down($event.keyCode);
          }
        });

        element.bind("keyup", function ($event) {
          if (DrawChem.showEditor() && (!Flags.focused || $event.ctrlKey)) {
            // should prevent default only if editor is shown and
            // either custom label field is NOT focused
            // or ctrl/shift key is involved
            $event.preventDefault();
            Shortcuts.released($event.keyCode);
            $rootScope.$digest();
          }
        });

        function ctrlOrShift($event) {
          return $event.ctrlKey || $event.shiftKey;
        }
      }
    }
  }
})();
