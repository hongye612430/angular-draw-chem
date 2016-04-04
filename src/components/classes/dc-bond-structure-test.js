describe("DCBondStructure service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var BondStructure;

	beforeEach(inject(function (_DCBondStructure_) {
		BondStructure = _DCBondStructure_.BondStructure;
	}));

	it("should create a new `BondStructure` object", function () {
		var bondStructure = new BondStructure("single", 2);
		expect(bondStructure.getName()).toEqual("single");
		expect(bondStructure.getMultiplicity()).toEqual(2);
	});
});
