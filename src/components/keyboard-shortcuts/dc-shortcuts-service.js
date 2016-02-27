(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemKeyShortcuts", DrawChemKeyShortcuts);

	DrawChemKeyShortcuts.$inject = ["DrawChemActions"];

	function DrawChemKeyShortcuts(Actions) {

		var keysPredefined = {
        17: "ctrl",
        69: "e",
        70: "f",
        81: "q",
        84: "t",
        90: "z"
      },
      keyCombination = {},
      service = {};

    registerShortcut("ctrl+z", Actions.undo);
    registerShortcut("ctrl+e", Actions.clear);
    registerShortcut("ctrl+f", Actions.forward);
    registerShortcut("ctrl+t", Actions.transfer);
    registerShortcut("ctrl+q", Actions.close);

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
