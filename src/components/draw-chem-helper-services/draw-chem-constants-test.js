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
	
	it("should define bond coordinates in eight directions", function () {
		expect(DrawChemConst.BOND_N).toBeDefined();
		expect(DrawChemConst.BOND_S).toBeDefined();
		expect(DrawChemConst.BOND_E).toBeDefined();
		expect(DrawChemConst.BOND_W).toBeDefined();
		expect(DrawChemConst.BOND_NE).toBeDefined();
		expect(DrawChemConst.BOND_SE).toBeDefined();
		expect(DrawChemConst.BOND_NW).toBeDefined();
		expect(DrawChemConst.BOND_SW).toBeDefined();
	});
});