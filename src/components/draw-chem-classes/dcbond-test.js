describe("DCBond service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var Bond, Atom;
	
	beforeEach(inject(function (_DCAtom_, _DCBond_) {
		Atom = _DCAtom_.Atom;
		Bond = _DCBond_.Bond;
	}));
	
	it("should create a new Bond object", function () {
		var atom = new Atom([0, 0], []),
			bond = new Bond("single", atom);
		expect(bond.getType()).toEqual("single");
		expect(bond.getAtom()).toEqual(atom);		
	});
});