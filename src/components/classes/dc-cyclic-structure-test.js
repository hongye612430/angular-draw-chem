describe("DCCyclicStructure service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var CyclicStructure;

	beforeEach(inject(function (_DCCyclicStructure_) {
		CyclicStructure = _DCCyclicStructure_.CyclicStructure;
	}));

	it("should create a new `CyclicStructure` object", function () {
		var cyclicStructure = new CyclicStructure("benzene", 6, 120, true);
		expect(cyclicStructure.getName()).toEqual("benzene");
		expect(cyclicStructure.getRingSize()).toEqual(6);
    expect(cyclicStructure.getAngle()).toEqual(120);
    expect(cyclicStructure.isAromatic()).toEqual(true);		
	});
});
