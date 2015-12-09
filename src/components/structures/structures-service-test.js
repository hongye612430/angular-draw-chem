describe("DrawChem service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemStructures;
	
	beforeEach(inject(function (_DrawChemStructures_) {
		DrawChemStructures = _DrawChemStructures_;
	}));
	
	it("should have an array with predefined structures", function () {
		// an array containing predefined structures should be defined
		expect(DrawChemStructures.custom).toBeDefined();
		// each element should contain name and structure poperties
		DrawChemStructures.custom.forEach(function (custom) {
			expect(custom.name).toBeDefined();
			expect(custom.structure).toBeDefined();
		});
	});
})