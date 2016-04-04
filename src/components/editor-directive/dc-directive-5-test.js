describe("DrawChemEditor directive tests - part5", function () {
	beforeEach(module("mmAngularDrawChem"));

	var $scope, element, $rootScope, DrawChem, DrawChemCache, DrawChemModStructure, DrawChemStructures, template, styleFull;

	beforeEach(inject(function ($httpBackend, $compile, _$rootScope_, _DrawChem_, _DrawChemCache_, _DrawChemModStructure_, _DrawChemStructures_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor-modal.html");

		DrawChem = _DrawChem_;
		DrawChemModStructure = _DrawChemModStructure_;
		DrawChemStructures = _DrawChemStructures_;
    DrawChemCache = _DrawChemCache_;
		$rootScope = _$rootScope_;

		$scope = $rootScope.$new();
		element = angular.element(
			"<div draw-chem-editor dc-modal></div>"
		);
		temp = $compile(element)($scope);
		$httpBackend
			.expectGET("draw-chem-editor-modal.html")
			.respond(template);
		$scope.$digest();
		$httpBackend.flush();
	}));

  it("should align all selected structures to the uppermost point", function () {
    var custom = DrawChemStructures.cyclohexane();
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    temp.find("#dc-" + custom.name).click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    temp.find("#dc-one-way-arrow").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 200,
			clientY: 120
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 200,
			clientY: 120
		});
		temp.find("#dc-select-all").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-up").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 98.00 L 218.00 98.00 M 215.00 98.00 L 215.00 96.70 L 218.00 98.00 L 215.00 99.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
	});

  it("should align all selected structures to the downmost point", function () {
    var custom = DrawChemStructures.cyclohexane();
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    temp.find("#dc-" + custom.name).click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    temp.find("#dc-one-way-arrow").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 200,
			clientY: 120
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 200,
			clientY: 120
		});
		temp.find("#dc-select-all").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-down").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 138.00 L 218.00 138.00 M 215.00 138.00 L 215.00 136.70 L 218.00 138.00 L 215.00 139.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
	});

  it("should align all selected structures to the leftmost point", function () {
    var custom = DrawChemStructures.cyclohexane();
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    temp.find("#dc-" + custom.name).click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    temp.find("#dc-one-way-arrow").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 200,
			clientY: 120
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 200,
			clientY: 120
		});
		temp.find("#dc-select-all").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-left").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 80.68 118.00 L 100.68 118.00 M 97.68 118.00 L 97.68 116.70 L 100.68 118.00 L 97.68 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"100.68\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
	});

  it("should align all selected structures to the rightmost point", function () {
    var custom = DrawChemStructures.cyclohexane();
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    temp.find("#dc-" + custom.name).click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    temp.find("#dc-one-way-arrow").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 200,
			clientY: 120
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 200,
			clientY: 120
		});
		temp.find("#dc-select-all").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-right").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 200.68 98.00 L 218.00 108.00 L 218.00 128.00 L 200.68 138.00 L 183.36 128.00 L 183.36 108.00 L 200.68 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
	});

	it("should not react to multiple clicking of 'align-...' if already aligned", function () {
    var custom = DrawChemStructures.cyclohexane();
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    temp.find("#dc-" + custom.name).click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    temp.find("#dc-one-way-arrow").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 200,
			clientY: 120
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 200,
			clientY: 120
		});
		temp.find("#dc-select-all").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-right").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 200.68 98.00 L 218.00 108.00 L 218.00 128.00 L 200.68 138.00 L 183.36 128.00 L 183.36 108.00 L 200.68 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-right").click();
    temp.find("#dc-align-right").click();
    temp.find("#dc-align-right").click();
    temp.find("#dc-align-right").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 200.68 98.00 L 218.00 108.00 L 218.00 128.00 L 200.68 138.00 L 183.36 128.00 L 183.36 108.00 L 200.68 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-undo").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
          "<circle class=\"edit\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
	});

	it("should select structures with selection tool", function () {
    var custom = DrawChemStructures.cyclohexane(), i, structureArray;
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    temp.find("#dc-" + custom.name).click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    temp.find("#dc-one-way-arrow").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 200,
			clientY: 120
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 200,
			clientY: 120
		});
		temp.find("#dc-select").click();
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 50,
			clientY: 50
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 250,
			clientY: 250
		});
		structureArray = DrawChemCache.getCurrentStructure().getStructure();
    expect(structureArray.length).toEqual(2);
    for (i = 0; i < structureArray.length; i++) {
      expect(structureArray[i].selected).toEqual(true);
    }
	});
});
