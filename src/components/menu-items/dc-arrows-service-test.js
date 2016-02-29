describe("DrawChemArrows service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var DrawChemArrows;

	beforeEach(inject(function (_DrawChemArrows_) {
		DrawChemArrows = _DrawChemArrows_;
	}));

	it("should have an array with predefined arrows", function () {
		expect(DrawChemArrows.arrows).toBeDefined();
	});
})
