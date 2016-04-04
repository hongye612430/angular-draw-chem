describe("DrawChemEditor directive tests - part7", function () {
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

  it("should move the selected structure with mouse", function () {
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
    temp.find("#dc-select-all").click();
    temp.find("#dc-move").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 400,
			clientY: 400
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 500,
			clientY: 500
		});
    temp.find("#dc-deselect-all").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
          "<path d=\"M 198.00 198.00 L 215.32 208.00 L 215.32 228.00 L 198.00 238.00 L 180.68 228.00 L 180.68 208.00 L 198.00 198.00 \"></path>" +
          "<circle class=\"atom\" cx=\"198.00\" cy=\"198.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"215.32\" cy=\"208.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"215.32\" cy=\"228.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"198.00\" cy=\"238.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"180.68\" cy=\"228.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"180.68\" cy=\"208.00\" r=\"2.40\"></circle>" +
          "<circle class=\"atom\" cx=\"198.00\" cy=\"198.00\" r=\"2.40\"></circle>" +
        "</g>" +
      "</svg>"
    );
	});

	it("should move the selected aromatic structure with mouse", function () {
    var custom = DrawChemStructures.benzene();
    DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
    temp.find("#dc-select-all").click();
    temp.find("#dc-move").click();
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 400,
			clientY: 400
		});
    temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 500,
			clientY: 500
		});
    temp.find("#dc-deselect-all").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
      "<svg>" +
        "<g id=\"cmpd1\">" +
          "<style type=\"text/css\">" +
            styleBase + styleExpanded +
          "</style>" +
					"<path d=\"M 198.00 198.00 L 215.32 208.00 L 215.32 228.00 L 198.00 238.00 L 180.68 228.00 L 180.68 208.00 L 198.00 198.00 \"></path>" +
					"<circle class=\"atom\" cx=\"198.00\" cy=\"198.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"215.32\" cy=\"208.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"215.32\" cy=\"228.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"198.00\" cy=\"238.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"180.68\" cy=\"228.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"180.68\" cy=\"208.00\" r=\"2.40\"></circle>" +
					"<circle class=\"atom\" cx=\"198.00\" cy=\"198.00\" r=\"2.40\"></circle>" +
					"<circle class=\"arom\" cx=\"198.00\" cy=\"218.00\" r=\"9.00\"></circle>" +
        "</g>" +
      "</svg>"
    );
	});
});
