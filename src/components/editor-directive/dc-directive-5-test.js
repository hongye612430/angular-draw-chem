describe("DrawChemEditor directive tests - part2", function () {
	beforeEach(module("mmAngularDrawChem"));

	var $scope, element, $rootScope, DrawChem, DrawChemCache, DrawChemShapes, DrawChemStructures, template, styleFull;

	beforeEach(inject(function ($httpBackend, $compile, _$rootScope_, _DrawChem_, _DrawChemCache_, _DrawChemShapes_, _DrawChemStructures_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor-modal.html");

		DrawChem = _DrawChem_;
		DrawChemShapes = _DrawChemShapes_;
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
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-up").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 98 L 218 98 M 215 98 L 215.00 96.70 L 218 98 L 215.00 99.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"98\" r=\"2.4\"></circle>" +
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
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-down").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 138 L 218 138 M 215 138 L 215.00 136.70 L 218 138 L 215.00 139.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"138\" r=\"2.4\"></circle>" +
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
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-left").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 80.68 118 L 100.68 118 M 97.68 118 L 97.68 116.70 L 100.68 118 L 97.68 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"100.68\" cy=\"118\" r=\"2.4\"></circle>" +
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
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-right").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 200.68 98 L 218 108 L 218 128 L 200.68 138 L 183.36 128 L 183.36 108 L 200.68 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
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
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-align-right").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 200.68 98 L 218 108 L 218 128 L 200.68 138 L 183.36 128 L 183.36 108 L 200.68 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
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
          "<path d=\"M 200.68 98 L 218 108 L 218 128 L 200.68 138 L 183.36 128 L 183.36 108 L 200.68 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"183.36\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"200.68\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
        "</g>" +
    "</svg>");
    temp.find("#dc-undo").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
          "<path class=\"arrow\" d=\"M 198 118 L 218 118 M 215 118 L 215.00 116.70 L 218 118 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"198\" cy=\"118\" r=\"2.4\"></circle>" +
          "<circle class=\"edit\" cx=\"218\" cy=\"118\" r=\"2.4\"></circle>" +
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
