describe("DrawChemLabels service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var DrawChemLabels;

	beforeEach(inject(function (_DrawChemLabels_) {
		DrawChemLabels = _DrawChemLabels_;
	}));

	it("should have an array with predefined labels", function () {
		expect(DrawChemLabels.labels).toBeDefined();		
	});
})
