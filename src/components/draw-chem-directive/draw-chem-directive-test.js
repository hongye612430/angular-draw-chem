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
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom);		
	});
	
	it("should store the current structure (as a Structure object)", function () {
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom);
		expect(element.isolateScope().currentStructure).toBeUndefined();
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 2,
			clientY: 2
		});
		custom.setTransform("translate", [0, 0]);
		expect(element.isolateScope().currentStructure).toEqual(custom);	
	});
	
	it("should set the content after clicking on the 'transfer' button", function () {
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
	
	it("should change content of the output after clicking on the drawing area", function () {
		var custom = DrawChemStructures.benzene();		
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 2,
			clientY: 2
		});
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
							"<path d=\"M 0 0 L 17.32 10 L 17.32 30 L 0 40 L -17.32 30 L -17.32 10 \"></path>" +
							"<path d=\"M 0 0 L -17.32 10 \"></path>" +
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
						" transform=\"translate(0,0)\"></use>" +
				"</svg>"
			);		
	});
	
	it("should clear the content after clicking on the 'clear' button", function () {
		var custom = DrawChemStructures.benzene();		
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);		
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 2,
			clientY: 2
		});
		temp.find(".dc-custom-button").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual("");
	});
	
	it("should render a modified structure", function () {
		var custom = DrawChemStructures.benzene(),
			add = DrawChemStructures.singleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);		
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 100,
			clientY: 100
		});
		temp.find("#dc-" + add.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(add);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 101,
			clientY: 99
		});
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
							"<path d=\"M 0 0 L 17.32 10 L 17.32 30 L 0 40 L -17.32 30 L -17.32 10 \"></path>" +
							"<path d=\"M 0 0 L -17.32 10 \"></path>" +
							"<path d=\"M 0 0 L 0 -20 \"></path>" +
							"<circle cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"40\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"-20\" r=\"2.4\"></circle>" +
						"</g>" +
					"</defs>" +
					"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#cmpd1\"" +
					" transform=\"translate(98,98)\"></use>" +
				"</svg>"
			);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 118,
			clientY: 110
		});
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
							"<path d=\"M 0 0 L 17.32 10 L 17.32 30 L 0 40 L -17.32 30 L -17.32 10 \"></path>" +
							"<path d=\"M 17.32 10 L 17.32 -10 \"></path>" +
							"<path d=\"M 0 0 L -17.32 10 \"></path>" +					
							"<path d=\"M 0 0 L 0 -20 \"></path>" +							
							"<circle cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"40\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"-10\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"-20\" r=\"2.4\"></circle>" +
						"</g>" +
					"</defs>" +
					"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#cmpd1\"" +
					" transform=\"translate(98,98)\"></use>" +
				"</svg>"
			);
	});
	
	it("should be able to draw further, on the recently added structure", function () {
		var custom = DrawChemStructures.benzene(),
			add = DrawChemStructures.singleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);		
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(custom);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 100,
			clientY: 100
		});
		temp.find("#dc-" + add.name).click();
		expect(element.isolateScope().chosenStructure).toEqual(add);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 101,
			clientY: 99
		});
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
							"<path d=\"M 0 0 L 17.32 10 L 17.32 30 L 0 40 L -17.32 30 L -17.32 10 \"></path>" +
							"<path d=\"M 0 0 L -17.32 10 \"></path>" +
							"<path d=\"M 0 0 L 0 -20 \"></path>" +
							"<circle cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"40\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"-20\" r=\"2.4\"></circle>" +
						"</g>" +
					"</defs>" +
					"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#cmpd1\"" +
					" transform=\"translate(98,98)\"></use>" +
				"</svg>"
			);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "click",
			clientX: 100,
			clientY: 79
		});
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
							"<path d=\"M 0 0 L 17.32 10 L 17.32 30 L 0 40 L -17.32 30 L -17.32 10 \"></path>" +
							"<path d=\"M 0 0 L -17.32 10 \"></path>" +
							"<path d=\"M 0 0 L 0 -20 L 0 -40 \"></path>" +
							"<circle cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"40\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"-20\" r=\"2.4\"></circle>" +
							"<circle cx=\"0\" cy=\"-40\" r=\"2.4\"></circle>" +
						"</g>" +
					"</defs>" +
					"<use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#cmpd1\"" +
					" transform=\"translate(98,98)\"></use>" +
				"</svg>"
			);
	});
});