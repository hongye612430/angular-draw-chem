describe("DrawChemEditor directive tests - part4", function () {
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

  it("should not select anything if there is no structure", function () {
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual("");
		temp.find("#dc-select-all").click();
	});

	it("should select all present structures", function () {
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
    structureArray = DrawChemCache.getCurrentStructure().getStructure();
    expect(structureArray.length).toEqual(2);
    for (i = 0; i < structureArray.length; i++) {
      expect(structureArray[i].selected).toEqual(true);
    }
	});

  it("should deselect all selected structures", function () {
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
		temp.find("#dc-select-all").click();
    temp.find("#dc-deselect-all").click();
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
          "<path class=\"arrow\" d=\"M 198.00 118.00 L 218.00 118.00 M 215.00 118.00 L 215.00 116.70 L 218.00 118.00 L 215.00 119.30 Z \"></path>" +
          "<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"198.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"218.00\" cy=\"118.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
    structureArray = DrawChemCache.getCurrentStructure().getStructure();
    expect(structureArray.length).toEqual(2);
    for (i = 0; i < structureArray.length; i++) {
      expect(structureArray[i].selected).toEqual(false);
    }
	});

	it("should delete all selected structures", function () {
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
		temp.find("#dc-delete-selected").click();
		temp.find("#dc-" + custom.name).click();
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 400,
			clientY: 400
		});
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 400,
			clientY: 400
		});
    expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 398.00 398.00 L 415.32 408.00 L 415.32 428.00 L 398.00 438.00 L 380.68 428.00 L 380.68 408.00 L 398.00 398.00 \"></path>" +
          "<circle class=\"atom\" cx=\"398.00\" cy=\"398.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"415.32\" cy=\"408.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"415.32\" cy=\"428.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"398.00\" cy=\"438.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"380.68\" cy=\"428.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"380.68\" cy=\"408.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"398.00\" cy=\"398.00\" r=\"2.40\"></circle>" +
        "</g>" +
    "</svg>");
	});
});
