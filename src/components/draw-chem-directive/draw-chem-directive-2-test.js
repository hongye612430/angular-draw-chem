describe("DrawChemEditor directive tests - part2", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var $scope, element, $rootScope, DrawChem, DrawChemShapes, DrawChemStructures, template, styleFull;
	
	styleFull = "path{" +
			"stroke:black;" +
			"stroke-width:0.8;" +
			"fill:none;" +
		"}" +
		"path.wedge{" +
			"stroke:black;" +
			"stroke-width:0.8;" +
			"fill:black;" +
		"}" +
		"circle.atom:hover{" +
			"opacity:0.3;" +
			"stroke:black;" +
			"stroke-width:0.8;" +
		"}" +
		"circle.atom{" +
			"opacity:0;" +
		"}" +
		"circle.arom{" +
			"stroke:black;" +
			"stroke-width:0.8;" +
			"fill:none;" +
		"}" +
		"text{" +
			"font-family:Arial;" +
			"cursor:default;" +
			"text-anchor:middle;" +
			"dominant-baseline:middle;" +
			"font-size:18px;" +
		"}" +
		"rect{" +
			"fill:white;" +
		"}";
	
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
	
	it("should undo the most recent changes", function () {
		var custom = DrawChemStructures.benzene(),
			add = DrawChemStructures.singleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);		
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
		temp.find("#dc-" + add.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 101,
			clientY: 99
		});
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 101,
			clientY: 99
		});
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleFull +
							"</style>" +
							"<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +	
							"<path d=\"M 98 98 L 98 78 \"></path>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"78\" r=\"2.4\"></circle>" +
							"<circle class=\"arom\" cx=\"98\" cy=\"118\" r=\"9\"></circle>" +
						"</g>" +
				"</svg>"
			);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 118,
			clientY: 110
		});
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 118,
			clientY: 110
		});
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleFull +
							"</style>" +
							"<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
							"<path d=\"M 115.32 108 L 132.64 98 \"></path>" +
							"<path d=\"M 98 98 L 98 78 \"></path>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"132.64\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"78\" r=\"2.4\"></circle>" +
							"<circle class=\"arom\" cx=\"98\" cy=\"118\" r=\"9\"></circle>" +
						"</g>" +
				"</svg>"
			);
		temp.find("#dc-undo").click();
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
					"<g id=\"cmpd1\">" +
						"<style type=\"text/css\">" +
							styleFull +
						"</style>" +
						"<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +	
						"<path d=\"M 98 98 L 98 78 \"></path>" +
						"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
						"<circle class=\"atom\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
						"<circle class=\"atom\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
						"<circle class=\"atom\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
						"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
						"<circle class=\"atom\" cx=\"98\" cy=\"78\" r=\"2.4\"></circle>" +
						"<circle class=\"arom\" cx=\"98\" cy=\"118\" r=\"9\"></circle>" +
					"</g>" +
				"</svg>"
			);
	});
	
});