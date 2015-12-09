describe("DrawChem service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemStructures;
	
	beforeEach(inject(function (_DrawChemStructures_) {
		DrawChemStructures = _DrawChemStructures_;
	}));
	
	it("should have an array with predefined structures", function () {
		expect(DrawChemStructures.custom).toBeDefined(); // an array containing predefined structures should be defined
	});
})