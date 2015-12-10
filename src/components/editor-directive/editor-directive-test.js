describe("DrawChemEditor directive tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var $scope, element, DrawChem, DrawChemShapes, DrawChemStructures, template;
	
	beforeEach(inject(function ($httpBackend, $compile, $rootScope, _DrawChem_, _DrawChemShapes_, _DrawChemStructures_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor.html");
		
		DrawChem = _DrawChem_;
		DrawChemShapes = _DrawChemShapes_;
		DrawChemStructures = _DrawChemStructures_;
		
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
		DrawChemStructures.custom.forEach(function (custom) {
			temp.find("#dc-" + custom.name).click();
			expect(element.isolateScope().chosenStructure).toEqual(custom.structure);
		});		
	});
	
	it("should change content of the output", function () {
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChemStructures.custom.forEach(function (custom) {
			temp.find("#dc-" + custom.name).click();
			expect(element.isolateScope().chosenStructure).toEqual(custom.structure);
			temp.find(".dc-editor-dialog-content").click();
			expect(temp.find(".dc-editor-dialog-content").html())
				.toEqual(
					DrawChemShapes
						.draw(custom.structure, "cmpd1")
						.replace(/'/g, "\"")
				);
		});		
	});
	
	it("should clear the content", function () {
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChemStructures.custom.forEach(function (custom) {
			temp.find("#dc-" + custom.name).click();
			expect(element.isolateScope().chosenStructure).toEqual(custom.structure);
			temp.find(".dc-editor-dialog-content").click();
			expect(temp.find(".dc-editor-dialog-content").html())
				.toEqual(
					DrawChemShapes
						.draw(custom.structure, "cmpd1")
						.replace(/'/g, "\"")
				);
			temp.find(".dc-clear-content-button").click();
			expect(temp.find(".dc-editor-dialog-content").html()).toEqual("");
		});		
	});
});