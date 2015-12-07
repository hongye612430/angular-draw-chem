describe("DrawChemEditor directive tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var $scope, element, DrawChem, template;
	
	beforeEach(inject(function ($httpBackend, $compile, $rootScope, _DrawChem_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor.html");
		
		DrawChem = _DrawChem_;
		
		$scope = $rootScope.$new();
		element = angular.element(
			"<div draw-chem-editor></div>"
		);		
		temp = $compile(element)($scope);
		$httpBackend
			.expectGET("draw-chem-editor.html")
			.respond(template);
		$scope.$digest();
		$httpBackend.flush();
	}));
	
	it("should close the editor", function () {
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		// if the close button has been clicked
		temp.find(".dc-editor-close").click();
		expect(DrawChem.showEditor()).toEqual(false);
		
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		// if the background has been clicked
		temp.find(".dc-editor-overlay").click();
		expect(DrawChem.showEditor()).toEqual(false);
	});
	
	it("should render the basic scaffolds", function () {
		var output = temp.find(".dc-editor-dialog-content");
		temp.find(".dc-benzene-button").click();
		expect(output.html()).toEqual(
			"<svg>" +
				"<defs>" +
					"<g id=\"benzene\">" +
						"<polygon points=\"0.00 -11.55 10.00 -5.77 10.00 5.77 0.00 11.55 -10.00 5.77 -10.00 -5.77\"></polygon>" +
						"<circle r=\"6.67\"></circle>" +
					"</g>" +
				"</defs>" +
				"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#benzene\" transform=\"\" style=\"stroke: black; stroke-width: 0.48; fill: none;\"></use>" +
			"</svg>"
		);
	});
});