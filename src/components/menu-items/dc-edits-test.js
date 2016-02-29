describe("DrawChemEdits service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var DrawChemEdits;

	beforeEach(inject(function (_DrawChemEdits_) {
		DrawChemEdits = _DrawChemEdits_;
	}));

	it("should have an array with predefined edit actions", function () {
		expect(DrawChemEdits.edits).toBeDefined();
	});
})
