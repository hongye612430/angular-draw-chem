describe("dcShortcuts directive tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var DrawChemKeyShortcuts, DrawChem, DrawChemStructures, element, temp, editor, triggerKeyDown, triggerKeyUp, $rootScope;

	beforeEach(inject(function (_DrawChemKeyShortcuts_, _DrawChem_, _DrawChemStructures_, _$rootScope_, $httpBackend, $compile) {
		DrawChemKeyShortcuts = _DrawChemKeyShortcuts_;
    DrawChem = _DrawChem_;
		$rootScope = _$rootScope_;
    DrawChemStructures = _DrawChemStructures_;
    triggerKeyDown = function (element, keyCode, ctrlKey) {
      var e = angular.element.Event("keydown");
      e.keyCode = keyCode;
      e.ctrlKey = ctrlKey;
      element.trigger(e);
    };

    triggerKeyUp = function (element, keyCode, ctrlKey) {
      var e = angular.element.Event("keyup");
      e.keyCode = keyCode;
      e.ctrlKey = ctrlKey;
      element.trigger(e);
    };

    jasmine.getFixtures().fixturesPath = "base/assets/";
		template = readFixtures("draw-chem-editor-modal.html");
    $scope = $rootScope.$new();

    // shortcuts directive
		element = angular.element(
			"<div dc-shortcuts></div>"
		);
		temp = $compile(element)($scope);

    // editor directive
    editor = angular.element(
			"<div draw-chem-editor dc-modal></div>"
		);
		editor = $compile(editor)($scope);
		$httpBackend
			.expectGET("draw-chem-editor-modal.html")
			.respond(template);
		$scope.$digest();
		$httpBackend.flush();
	}));

	it("should be able to close the editor with keyboard", function () {
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    // ctrl+q
		triggerKeyDown(temp, 17, true);
    triggerKeyDown(temp, 81, true);
    triggerKeyUp(temp, 81, true);
    expect(DrawChem.showEditor()).toEqual(false);
	});

  it("should be able to undo recent change and go forward", function () {
    var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		editor.find("#dc-" + custom.name).click();
		expect(editor.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		editor.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 2,
			clientY: 2
		});
		expect(normZeroes(editor.find(".dc-editor-dialog-content").html()))
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 0.00 0.00 L 17.32 10.00 L 17.32 30.00 L 0.00 40.00 L -17.32 30.00 L -17.32 10.00 L 0.00 0.00 \"></path>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"0.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"40.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"arom\" cx=\"0.00\" cy=\"20.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
    // ctrl+z
    triggerKeyDown(temp, 17, true);
    triggerKeyDown(temp, 90, true);
    triggerKeyUp(temp, 90, true);
    expect(editor.find(".dc-editor-dialog-content").html()).toEqual("");
    // ctrl+f
    triggerKeyDown(temp, 17, true);
    triggerKeyDown(temp, 70, true);
    triggerKeyUp(temp, 70, true);
    expect(normZeroes(editor.find(".dc-editor-dialog-content").html()))
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 0.00 0.00 L 17.32 10.00 L 17.32 30.00 L 0.00 40.00 L -17.32 30.00 L -17.32 10.00 L 0.00 0.00 \"></path>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"0.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"40.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"arom\" cx=\"0.00\" cy=\"20.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should set the content after clicking on the 'transfer' button", function () {
		var parallelScope = $rootScope.$new(),
			custom = DrawChemStructures.benzene();

		parallelScope.input = function () {
			return DrawChem.getContent("test");
		};
		parallelScope.run = function () {
			DrawChem.runEditor("test");
		};

		parallelScope.run();
		expect(DrawChem.showEditor()).toEqual(true);
		expect(parallelScope.input()).toEqual("");
		editor.find("#dc-" + custom.name).click();
		editor.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
		// ctrl+t
    triggerKeyDown(temp, 17, true);
    triggerKeyDown(temp, 84, true);
    triggerKeyUp(temp, 84, true);
		expect(parallelScope.input())
			.toEqual(
				"<svg viewBox='60.68 78.00 74.64 80.00' height='100%' width='100%' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' >" +
					"<g id='transfer' >" +
						"<style type=\"text/css\">" +
							styleBase +
						"</style>" +
						"<path d='M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 '></path>" +
						"<circle class='tr-arom' cx='98.00' cy='118.00' r='9.00' ></circle>" +
					"</g>" +
				"</svg>"
			);
	});

	it("should clear the content after clicking on the 'clear' button", function () {
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		editor.find("#dc-" + custom.name).click();
		editor.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 2,
			clientY: 2
		});
		expect(normZeroes(editor.find(".dc-editor-dialog-content").html()))
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 0.00 0.00 L 17.32 10.00 L 17.32 30.00 L 0.00 40.00 L -17.32 30.00 L -17.32 10.00 L 0.00 0.00 \"></path>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"0.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"40.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"arom\" cx=\"0.00\" cy=\"20.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
    // ctrl+e
		triggerKeyDown(temp, 17, true);
    triggerKeyDown(temp, 69, true);
    triggerKeyUp(temp, 69, true);
		expect(editor.find(".dc-editor-dialog-content").html()).toEqual("");
	});

	it("should not do anything if editor is not shown", function () {
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		editor.find("#dc-" + custom.name).click();
		editor.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 2,
			clientY: 2
		});
		expect(normZeroes(editor.find(".dc-editor-dialog-content").html()))
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 0.00 0.00 L 17.32 10.00 L 17.32 30.00 L 0.00 40.00 L -17.32 30.00 L -17.32 10.00 L 0.00 0.00 \"></path>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"0.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"40.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"arom\" cx=\"0.00\" cy=\"20.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
		// ctrl+q
		triggerKeyDown(temp, 17, true);
	  triggerKeyDown(temp, 81, true);
	  triggerKeyUp(temp, 81, true);
	  expect(DrawChem.showEditor()).toEqual(false);
    // ctrl+e should not work
		triggerKeyDown(temp, 17, true);
    triggerKeyDown(temp, 69, true);
    triggerKeyUp(temp, 69, true);
		expect(normZeroes(editor.find(".dc-editor-dialog-content").html()))
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 0.00 0.00 L 17.32 10.00 L 17.32 30.00 L 0.00 40.00 L -17.32 30.00 L -17.32 10.00 L 0.00 0.00 \"></path>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"0.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"0.00\" cy=\"40.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"30.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"10.00\" r=\"2.40\"></circle>" +
							"<circle class=\"arom\" cx=\"0.00\" cy=\"20.00\" r=\"9.00\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should move the selected structure after clicking on an arrow", function () {
		var custom = DrawChemStructures.cyclohexane();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		editor.find("#dc-" + custom.name).click();
		editor.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
		editor.find("#dc-select-all").click();
    // arrow up
		triggerKeyDown(temp, 38, false);
		triggerKeyUp(temp, 38, false);
		editor.find("#dc-deselect-all").click();
		expect(editor.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 93.00 L 115.32 103.00 L 115.32 123.00 L 98.00 133.00 L 80.68 123.00 L 80.68 103.00 L 98.00 93.00 \"></path>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"93.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"103.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"123.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"133.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"123.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"103.00\" r=\"2.40\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should not move any structure if not selected", function () {
		var custom = DrawChemStructures.cyclohexane();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		editor.find("#dc-" + custom.name).click();
		editor.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    // arrow up
		triggerKeyDown(temp, 38, false);
		triggerKeyUp(temp, 38, false);
		expect(editor.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});
})
