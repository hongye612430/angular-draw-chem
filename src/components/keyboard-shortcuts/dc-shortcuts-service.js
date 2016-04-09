(function () {
	"use strict";
	angular.module("mmAngularDrawChem")
		.factory("DrawChemKeyShortcuts", DrawChemKeyShortcuts);

	DrawChemKeyShortcuts.$inject = ["DrawChemActions", "DrawChemEdits"];

	function DrawChemKeyShortcuts(Actions, Edits, Moves) {

		var keysPredefined = {
				16: "shift",
        17: "ctrl",
				37: "leftarrow",
				38: "uparrow",
				39: "rightarrow",
				40: "downarrow",
				46: "del"
      },
      keyCombination = {},
      service = {};

		for (var i = 65; i <= 90; i+= 1) {
			keysPredefined[i] = String.fromCharCode(i).toLowerCase();
		}

		angular.forEach(Actions.actions, function (action) {
			if (typeof action.shortcut !== "undefined") {
				registerShortcut(action.shortcut, action.action);
			}
		});

		angular.forEach(Edits.edits, function (edit) {
			if (typeof edit.shortcut !== "undefined") {
				if (edit.shortcut === "arrows / ctrl + b") {
					registerShortcut("leftarrow", edit.shortcutBind.left);
					registerShortcut("uparrow", edit.shortcutBind.up);
					registerShortcut("rightarrow", edit.shortcutBind.right);
					registerShortcut("downarrow", edit.shortcutBind.down);
					registerShortcut("ctrl + b", edit.action);
				} else {
					registerShortcut(edit.shortcut, edit.action);
				}
			}
		});

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
        keys,
        currentCombination = { cb: cb, keys: {} };

			if (combination.indexOf(" + ") >= 0) {
				keys = combination.split(" + ");
				for (i = 0; i < keys.length; i += 1) {
	        currentCombination.keys[keys[i]] = false;
	      }
			} else {
				keys = combination;
				currentCombination.keys[keys] = false;
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
