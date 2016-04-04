describe("DCBond service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Bond, Atom;

	beforeEach(inject(function (_DCBond_, _DCAtom_) {
		Bond = _DCBond_.Bond;
    Atom = _DCAtom_.Atom;
	}));

	it("should create a new `BondStructure` object", function () {
		var atom = new Atom([0, 0]),
      bond = new Bond("single", atom);
		expect(bond.getType()).toEqual("single");
		expect(bond.getAtom()).toEqual(atom);
	});
});
