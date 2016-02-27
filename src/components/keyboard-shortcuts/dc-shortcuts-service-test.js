describe("DrawChemKeyShortcuts service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var DrawChemKeyShortcuts;

	beforeEach(inject(function (_DrawChemKeyShortcuts_) {
		DrawChemKeyShortcuts = _DrawChemKeyShortcuts_;
	}));

	it("should have down and released methods", function () {
		expect(DrawChemKeyShortcuts.down).toBeDefined();
    expect(DrawChemKeyShortcuts.released).toBeDefined();
	});
})
