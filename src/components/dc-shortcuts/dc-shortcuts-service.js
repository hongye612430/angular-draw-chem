(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DCShortcutsStorage", DCShortcutsStorage);

	DCShortcutsStorage.$inject = ["DrawChemDirectiveActions"];

	function DCShortcutsStorage(Actions) {

		var keysPredefined = {
        16: "shift",
        17: "ctrl",
        27: "esc",
        84: "t",
        90: "z"
      },
      keyCombination = {},
      service = {};

    registerShortcut("ctrl+z", Actions.undo);
    registerShortcut("ctrl+t", Actions.transfer);
    registerShortcut("ctrl+esc", Actions.close);

    service.down = function (keyCode) {
      setKey(keyCode, true);
    }

    service.released = function (keyCode) {
      fireEvent();
      setKey(keyCode, false);
    }

		return service;

    function registerShortcut(combination, cb) {
      var i,
        keys = combination.split("+"),
        currentCombination = { cb: cb, keys: {} };

      for (i = 0; i < keys.length; i += 1) {
        currentCombination.keys[keys[i]] = false;
      }
      keyCombination[combination] = currentCombination;
    }

    function setKey(keyCode, type) {
      var keyInvolved = keysPredefined[keyCode];
      if (typeof keyInvolved !== "undefined") {
        angular.forEach(keyCombination, function (value, key) {
          if (typeof value.keys[keyInvolved] !== "undefined") {
            value.keys[keyInvolved] = type;
          }
        });
      }
    }

    function fireEvent(keyCode) {
      angular.forEach(keyCombination, function (value, key) {
        if(allWereDown(value.keys)) {
          console.log(value.keys)
          value.cb();
        }
      });

      function allWereDown(keys) {
        var result = typeof keys !== "undefined";
        angular.forEach(keys, function (value, key) {
          if (!value) { result = false; }
        });
        return result;
      }
    }
	}
})();
