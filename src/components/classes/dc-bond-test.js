describe("DCBond service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Bond, Atom;

	beforeEach(inject(function (_DCBond_, _DCAtom_) {
		Bond = _DCBond_.Bond;
    Atom = _DCAtom_.Atom;
	}));

	it("should create a new `Bond` object", function () {
		var atom = new Atom([0, 0]),
      bond = new Bond("single", atom);
		expect(bond.getType()).toEqual("single");
		expect(bond.getAtom()).toEqual(atom);
	});

	it("should calculate multiplicity", function () {
		var atom = new Atom([0, 0]),
      bond = new Bond("single", atom);
		expect(bond.calcMultiplicity()).toEqual(1);
		bond = new Bond("wedge-inverted", atom);
		expect(bond.calcMultiplicity()).toEqual(1);
		bond = new Bond("double-left", atom);
		expect(bond.calcMultiplicity()).toEqual(2);
		bond = new Bond("double", atom);
		expect(bond.calcMultiplicity()).toEqual(2);
		bond = new Bond("triple", atom);
		expect(bond.calcMultiplicity()).toEqual(3);
	});
});
