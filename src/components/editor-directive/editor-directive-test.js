describe("DrawChemEditor directive tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var $scope, element, DrawChem, template;
	
	beforeEach(inject(function ($httpBackend, $compile, $rootScope, _DrawChem_, _DrawChemShapes_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor.html");
		
		DrawChem = _DrawChem_;
		DrawChemShapes = _DrawChemShapes_;
		
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
	
	it("should choose a scaffold", function () {
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find(".dc-custom-button").click();
		expect(element.isolateScope().chosenShape).toEqual(DrawChemShapes.benzene());
	});
	
	it("should change content of the output", function () {
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find(".dc-custom-button").click();
		expect(element.isolateScope().chosenShape).toEqual(DrawChemShapes.benzene());
		temp.find(".dc-editor-dialog-content").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual(
			"<svg>" +
				"<defs>" +
					"<g id=\"cmpd1\">" +
						"<path d=\"M 100 100 l 200 100 \"></path>" +
						"<path d=\"M 100 100 l 100 200 \"></path>" +	
						"<path d=\"M 100 100 l 50 50 \"></path>" +								
					"</g>" +
				"</defs>" +
				"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
					 "xlink:href=\"#cmpd1\" transform=\"\" style=\"stroke: black; stroke-width: 0.48; fill: none;\"></use>" +
			"</svg>"
		);
	});
});