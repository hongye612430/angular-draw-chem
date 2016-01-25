describe("DrawChemPaths provider and service tests", function () {
	beforeEach(function () {
		angular
			.module("testApp", ["mmAngularDrawChem"])
			.config(["DrawChemPathsProvider",
				function (DrawChemPathsProvider) {
					DrawChemPathsProvider.setPath("draw-chem-editor/");
					DrawChemPathsProvider.setPathSvg("draw-chem-editor/svg");
				}])
		
		module("mmAngularDrawChem", "testApp");
	});
	
	beforeEach(inject(function (_DrawChemPaths_) {
		DrawChemPaths = _DrawChemPaths_;
	}));
	
	it("should retrieve previously set paths", function () {		
		expect(DrawChemPaths.getPath()).toEqual("draw-chem-editor/");
		expect(DrawChemPaths.getPathToSvg()).toEqual("draw-chem-editor/svg");
	});
});