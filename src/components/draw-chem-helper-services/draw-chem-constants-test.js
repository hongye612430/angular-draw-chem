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
	
	it("should define bond coordinates in twelve directions", function () {
		expect(DrawChemConst.BOND_N).toBeDefined();
		expect(DrawChemConst.BOND_S).toBeDefined();
		expect(DrawChemConst.BOND_E).toBeDefined();
		expect(DrawChemConst.BOND_W).toBeDefined();
		expect(DrawChemConst.BOND_NE1).toBeDefined();
		expect(DrawChemConst.BOND_SE1).toBeDefined();
		expect(DrawChemConst.BOND_NW1).toBeDefined();
		expect(DrawChemConst.BOND_SW1).toBeDefined();
		expect(DrawChemConst.BOND_NE2).toBeDefined();
		expect(DrawChemConst.BOND_SE2).toBeDefined();
		expect(DrawChemConst.BOND_NW2).toBeDefined();
		expect(DrawChemConst.BOND_SW2).toBeDefined();
	});
});