describe("DrawChemConst service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemConst;
	
	beforeEach(inject(function (_DrawChemConst_) {		
		DrawChemConst = _DrawChemConst_;
	}));

	it("should define the thickness and length of a bond", function () {
		expect(DrawChemConst.BOND_LENGTH).toBeDefined();
		expect(DrawChemConst.BOND_WIDTH).toBeDefined();
	});
});