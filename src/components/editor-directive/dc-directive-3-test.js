describe("DrawChemEditor directive tests - part3", function () {
	beforeEach(module("mmAngularDrawChem"));

	var $scope, element, $rootScope, DrawChem, DrawChemModStructure, DrawChemStructures, template, styleFull;

	beforeEach(inject(function ($httpBackend, $compile, _$rootScope_, _DrawChem_, _DrawChemModStructure_, _DrawChemStructures_) {
		// configure path for static files
		jasmine.getFixtures().fixturesPath = "base/assets/";
		// load template of the editor
		template = readFixtures("draw-chem-editor-modal.html");

		DrawChem = _DrawChem_;
		DrawChemModStructure = _DrawChemModStructure_;
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

	it("should draw a double bond", function () {
		var custom = DrawChemStructures.cyclohexane(),
			add = DrawChemStructures.doubleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-double-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 100, 100);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 99.30 98.00 L 99.30 78.00 M 96.70 98.00 L 96.70 78.00 \"></path>" +
							"<path d=\"M 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should draw a triple bond", function () {
		var custom = DrawChemStructures.cyclohexane(),
			add = DrawChemStructures.tripleBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-triple-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 100, 100);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 100.00 98.00 L 100.00 78.00 M 98.00 98.00 L 98.00 78.00 M 96.00 98.00 L 96.00 78.00 \"></path>" +
							"<path d=\"M 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should draw a wedge bond", function () {
		var custom = DrawChemStructures.cyclohexane(),
			add = DrawChemStructures.wedgeBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-wedge-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 100, 100);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path class=\"wedge\" d=\"M 98.00 98.00 L 99.30 78.00 L 96.70 78.00 Z \"></path>" +
							"<path d=\"M 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should draw a dash bond", function () {
		var custom = DrawChemStructures.cyclohexane(),
			add = DrawChemStructures.dashBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-dash-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 100, 100);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 98.26 96.00 L 97.74 96.00 M 98.39 94.00 L 97.61 94.00 M 98.52 92.00 L 97.48 92.00 M 98.65 90.00 L 97.35 90.00 M 98.78 88.00 L 97.22 88.00 M 98.91 86.00 L 97.09 86.00 M 99.04 84.00 L 96.96 84.00 M 99.17 82.00 L 96.83 82.00 M 99.30 80.00 L 96.70 80.00 M 99.43 78.00 L 96.57 78.00 \"></path>" +
							"<path d=\"M 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});

	it("should draw an undefined bond", function () {
		var custom = DrawChemStructures.cyclohexane(),
			add = DrawChemStructures.undefinedBond();
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true);
		temp.find("#dc-" + custom.name).click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(custom.getDefault());
		mouseClick(temp, 100, 100);
		temp.find("#dc-undefined-bond").click();
		expect(element.isolateScope().chosenStructure.getDefault()).toEqual(add.getDefault());
		mouseClick(temp, 100, 100);
		expect(temp.find(".dc-editor-dialog-content").html())
			.toEqual(
				"<svg>" +
						"<g id=\"cmpd1\">" +
							"<style type=\"text/css\">" +
								styleBase + styleExpanded +
							"</style>" +
							"<path d=\"M 98.00 98.00 L 115.32 108.00 L 115.32 128.00 L 98.00 138.00 L 80.68 128.00 L 80.68 108.00 L 98.00 98.00 \"></path>" +
							"<path d=\"M 98.00 98.00 C 96.05 98.00 , 96.05 96.00 , 98.00 96.00 S 99.95 94.00 , 98.00 94.00 S 96.05 92.00 , 98.00 92.00 S 99.95 90.00 , 98.00 90.00 S 96.05 88.00 , 98.00 88.00 S 99.95 86.00 , 98.00 86.00 S 96.05 84.00 , 98.00 84.00 S 99.95 82.00 , 98.00 82.00 S 96.05 80.00 , 98.00 80.00 S 99.95 78.00 , 98.00 78.00 \"></path>" +
							"<path d=\"M 98.00 78.00 \"></path>" +
							"<rect class=\"focus\" x=\"99.50\" y=\"95.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(30.00, 99.50, 95.40)\"></rect>" +
							"<rect class=\"focus\" x=\"118.32\" y=\"108.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(90.00, 118.32, 108.00)\"></rect>" +
							"<rect class=\"focus\" x=\"116.82\" y=\"130.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(150.00, 116.82, 130.60)\"></rect>" +
							"<rect class=\"focus\" x=\"96.50\" y=\"140.60\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-150.00, 96.50, 140.60)\"></rect>" +
							"<rect class=\"focus\" x=\"77.68\" y=\"128.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 77.68, 128.00)\"></rect>" +
							"<rect class=\"focus\" x=\"79.18\" y=\"105.40\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-30.00, 79.18, 105.40)\"></rect>" +
							"<rect class=\"focus\" x=\"95.00\" y=\"98.00\" rx=\"2.00\" ry=\"2.00\" width=\"20.00\" height=\"6.00\" transform=\"rotate(-90.00, 95.00, 98.00)\"></rect>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"98.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"115.32\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"138.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"128.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"80.68\" cy=\"108.00\" r=\"3.40\"></circle>" +
							"<circle class=\"atom\" cx=\"98.00\" cy=\"78.00\" r=\"3.40\"></circle>" +
						"</g>" +
				"</svg>"
			);
	});
});
