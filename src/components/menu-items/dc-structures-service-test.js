describe("DrawChemStructures service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var DrawChemStructures;

	beforeEach(inject(function (_DrawChemStructures_) {
		DrawChemStructures = _DrawChemStructures_;
	}));

	it("should have an array with predefined structures", function () {
		// an array containing predefined structures should be defined
		expect(DrawChemStructures.structures).toBeDefined();
	});
})
