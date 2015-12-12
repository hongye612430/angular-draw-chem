describe("DrawChemEditor directive tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var $scope, element, $rootScope, DrawChem, DrawChemShapes, DrawChemStructures, template;
	
	beforeEach(inject(function ($httpBackend, $compile, _$rootScope_, _DrawChem_, _DrawChemShapes_, _DrawChemStructures_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor.html");
		
		DrawChem = _DrawChem_;
		DrawChemShapes = _DrawChemShapes_;
		DrawChemStructures = _DrawChemStructures_;
		$rootScope = _$rootScope_;
		
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
		var custom = DrawChemStructures.custom[0];
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom.structure);		
	});
	
	it("should store the current structure (as Structure object)", function () {
		var custom = DrawChemStructures.custom[0];
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom.structure);
		expect(element.isolateScope().currentStructure).toBeUndefined();
		temp.find(".dc-editor-dialog-content").click();
		expect(element.isolateScope().currentStructure).toEqual(custom.structure);	
	});
	
	it("should set the content", function () {
		var parallelScope = $rootScope.$new();
		parallelScope.input = function () {
			return DrawChem.getContent("test");
		}
		parallelScope.run = function () {
			DrawChem.runEditor("test");
		}
		
		parallelScope.run();
		expect(DrawChem.showEditor()).toEqual(true);
		expect(parallelScope.input()).toEqual("");
		DrawChem.setContent("A content");
		temp.find("#dc-transfer").click();
		expect(parallelScope.input()).toEqual("A content");
	});
	
	it("should change content of the output", function () {
		var custom = DrawChemStructures.custom[0];		
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom.structure);
		temp.find(".dc-editor-dialog-content").click();
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
					"<defs>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								"path{" +
									"stroke:black;" +
									"stroke-width:0.8;" +
									"fill:none;" +
								"}" +
								"circle:hover{" +
									"opacity:0.3;" +
									"stroke:black;" +
									"stroke-width:0.8;" +
								"}" +
								"circle{" +
									"opacity:0;" +
								"}" +
							"</style>" +
							"<path d=\"M 0 0 l 17.32 10 l 0 20 l -17.32 10 l -17.32 -10 l 0 -20 \"></path>" +
							"<path d=\"M 0 0 l -17.32 10 \"></path>" +
							"<circle cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"40\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
						"</g>" +
					"</defs>" +
					"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#cmpd1\"" +
						" transform=\"translate(NaN)\"></use>" +
				"</svg>"
			);		
	});
	
	it("should clear the content", function () {
		var custom = DrawChemStructures.custom[0];		
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);		
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom.structure);
		temp.find(".dc-editor-dialog-content").click();
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
					"<defs>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								"path{" +
									"stroke:black;" +
									"stroke-width:0.8;" +
									"fill:none;" +
								"}" +
								"circle:hover{" +
									"opacity:0.3;" +
									"stroke:black;" +
									"stroke-width:0.8;" +
								"}" +
								"circle{" +
									"opacity:0;" +
								"}" +
							"</style>" +
							"<path d=\"M 0 0 l 17.32 10 l 0 20 l -17.32 10 l -17.32 -10 l 0 -20 \"></path>" +
							"<path d=\"M 0 0 l -17.32 10 \"></path>" +
							"<circle cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"40\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
						"</g>" +
					"</defs>" +
					"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#cmpd1\"" +
					" transform=\"translate(NaN)\"></use>" +
				"</svg>"
			);
		temp.find(".dc-custom-button").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual("");
	});
});