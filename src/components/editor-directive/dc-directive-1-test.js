var styleExpanded = "circle.atom:hover{" +
		"opacity:0.3;" +
		"stroke:black;" +
		"stroke-width:0.8;" +
	"}" +
	"text:hover{" +
		"opacity:0.3;" +
	"}" +
	"circle.atom{" +
		"opacity:0;" +
	"}" +
	"circle.edit{" +
		"stroke:black;" +
		"fill:none;" +
	"}",
	styleBase = "path{" +
		"stroke:black;" +
		"stroke-width:0.8;" +
		"fill:none;" +
	"}" +
	"path.wedge{" +
		"fill:black;" +
	"}" +
	"path.arrow{" +
		"fill:black;" +
	"}" +
	"path.arrow-eq{" +
		"fill:none;" +
	"}" +
	"circle.arom{" +
		"stroke:black;" +
		"stroke-width:0.8;" +
		"fill:none;" +
	"}" +
	"text{" +
		"font-family:Arial;" +
		"cursor:default;" +
		"font-size:18px;" +
	"}" +
	"tspan.sub{" +
		"font-size:14px;" +
	"}" +
	"polygon.text{" +
		"fill:white;" +
	"}";

describe("DrawChemEditor directive tests - part1", function () {
	beforeEach(module("mmAngularDrawChem"));

	var $scope, element, $rootScope, DrawChem, DrawChemShapes, DrawChemStructures, DrawChemCache, template;

	beforeEach(inject(function ($httpBackend, $compile, _$rootScope_, _DrawChem_, _DrawChemShapes_, _DrawChemStructures_, _DrawChemCache_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor-modal.html");

		DrawChem = _DrawChem_;
		DrawChemCache = _DrawChemCache_;
		DrawChemShapes = _DrawChemShapes_;
		DrawChemStructures = _DrawChemStructures_;
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
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
	});

	it("should store the current structure (as a Structure object)", function () {
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 2,
			clientY: 2
		});
		expect(DrawChemCache.getCurrentStructure()).toBeDefined();
	});

	it("should set the content after clicking on the 'transfer' button", function () {
		var parallelScope = $rootScope.$new(),
			custom = DrawChemStructures.benzene();

		parallelScope.input = function () {
			return DrawChem.getContent("test");
		};
		parallelScope.run = function () {
			DrawChem.runEditor("test");
		};

		parallelScope.run();
		expect(DrawChem.showEditor()).toEqual(true);
		expect(parallelScope.input()).toEqual("");
		temp.find("#dc-" + custom.name).click();
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 100
		});
		temp.find("#dc-transfer").click();
		expect(parallelScope.input())
			.toEqual(
				"<svg viewBox='60.68 78.00 74.64 80.00' height='100%' width='100%' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' >" +
					"<g id='cmpd1' >" +
						"<style type=\"text/css\">" +
							styleBase +
						"</style>" +
						"<path d='M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 '></path>" +
						"<circle class='arom' cx='98' cy='118' r='9' ></circle>" +
					"</g>" +
				"</svg>"
			);
	});

	it("should be able to transfer empty content", function () {
		var parallelScope = $rootScope.$new();

		parallelScope.input = function () {
			return DrawChem.getContent("test");
		};
		parallelScope.run = function () {
			DrawChem.runEditor("test");
		};

		parallelScope.run();
		expect(DrawChem.showEditor()).toEqual(true);
		expect(parallelScope.input()).toEqual("");
		temp.find("#dc-transfer").click();
		expect(parallelScope.input())
			.toEqual("");
	});

	it("should change content of the output after clicking on the drawing area", function () {
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 2,
			clientY: 2
		});
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 0 0 L 17.32 10 L 17.32 30 L 0 40 L -17.32 30 L -17.32 10 L 0 0 \"></path>" +
							"<circle class=\"atom\" cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"0\" cy=\"40\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"30\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"-17.32\" cy=\"10\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"0\" cy=\"0\" r=\"2.4\"></circle>" +
							"<circle class=\"arom\" cx=\"0\" cy=\"20\" r=\"9\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should clear the content after clicking on the 'clear' button", function () {
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 2,
			clientY: 2
		});
		temp.find("#dc-clear").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual("");
	});

	it("should do nothing if undo has been clicked, but the associated input is empty", function () {
		var custom = DrawChemStructures.benzene();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-undo").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual("");
		temp.find("#dc-" + custom.name).click();
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 2,
			clientY: 2
		});
		temp.find("#dc-undo").click();
		expect(temp.find(".dc-editor-dialog-content").html()).toEqual("");
	});

	it("should render a modified structure", function () {
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
			clientX: 100,
			clientY: 100
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
								styleBase + styleExpanded +
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
								styleBase + styleExpanded +
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
	});

	it("should be able to draw further, on the recently added structure", function () {
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
			clientX: 100,
			clientY: 100
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
								styleBase + styleExpanded +
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
			clientX: 100,
			clientY: 80
		});
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 79
		});
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
							"<path d=\"M 98 98 L 98 78 L 80.68 68 \"></path>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"78\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"68\" r=\"2.4\"></circle>" +
							"<circle class=\"arom\" cx=\"98\" cy=\"118\" r=\"9\"></circle>" +
						"</g>" +
				"</svg>"
			);
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mousedown",
			which: 1,
			clientX: 100,
			clientY: 80
		});
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 99,
			clientY: 80
		});
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
							"<path d=\"M 98 98 L 98 78 L 80.68 68 \"></path>" +
							"<path d=\"M 98 78 L 115.32 68 \"></path>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"78\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"68\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"68\" r=\"2.4\"></circle>" +
							"<circle class=\"arom\" cx=\"98\" cy=\"118\" r=\"9\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should be able to choose an atom on 'mousedown' and draw on 'mouseup', if the 'mouseup' is within the enclosing circle", function () {
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
			clientX: 100,
			clientY: 101
		});
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
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

	it("should be able to choose an atom on 'mousedown' and draw on 'mouseup', if the 'mouseup' is outside of the enclosing circle", function () {
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
			clientX: 100,
			clientY: -90
		});
		// expects 'N' bond
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
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
			clientX: 101,
			clientY: 99
		});
		temp.find(".dc-editor-dialog-content").triggerHandler({
			type : "mouseup",
			which: 1,
			clientX: 100,
			clientY: 190
		});
		// expects 'S' bond
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98 98 L 115.32 108 L 115.32 128 L 98 138 L 80.68 128 L 80.68 108 L 98 98 \"></path>" +
							"<path d=\"M 98 98 L 98 78 \"></path>" +
							"<path d=\"M 98 98 L 98 118 \"></path>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"138\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"98\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"78\" r=\"2.4\"></circle>" +
							"<circle class=\"atom\" cx=\"98\" cy=\"118\" r=\"2.4\"></circle>" +
							"<circle class=\"arom\" cx=\"98\" cy=\"118\" r=\"9\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	function stringCompare(str1, str2) {
		var i;
		for (i = 0; i < str1.length; i += 1) {
			if (str1.substr(i, 1) !== str2.substr(i, 1)) {
				console.log(str1.substr(i, 5), str2.substr(i, 5));
				break;
			}
		}
	}
});
