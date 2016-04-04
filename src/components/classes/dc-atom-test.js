describe("DCAtom service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Atom, Bond, Label;

	beforeEach(inject(function (_DCAtom_, _DCBond_, _DCLabel_) {
		Atom = _DCAtom_.Atom;
		Bond = _DCBond_.Bond;
		Label = _DCLabel_.Label;
	}));

	it("should create a new `Atom` object", function () {
		var atom = new Atom([0, 0]);
		expect(atom).toBeDefined();
		expect(atom.getCoords()).toBeDefined();
		expect(atom.getCoords("x")).toEqual(0);
		expect(atom.getCoords("y")).toEqual(0);
		atom.setCoords([100, 100])
		expect(atom.getCoords()).toEqual([100, 100]);
	});

	it("should be able to set array of `Bond` objects", function () {
		var atom = new Atom([0, 0], []),
		  newAtom = new Atom([50, 50], []),
		  newBond = new Bond("single", newAtom);
		expect(atom.getBonds()).toEqual([]);
		atom.addBond(newBond);
		expect(atom.getBonds()).toEqual([newBond]);
		expect(atom.getBonds(0)).toEqual(newBond);
	});

	it("should add an array of `Bond` objects", function () {
		var atom = new Atom([0, 0], []),
			newAtom1 = new Atom([50, 50], []),
			newAtom2 = new Atom([110, 110], []),
			bonds = [new Bond("single", newAtom1), new Bond("single", newAtom2)];
		expect(atom.getBonds()).toEqual([]);
		atom.addBonds(bonds);
		expect(atom.getBonds()).toEqual(bonds);
	});

	it("should mark `Atom` object as selected", function () {
		var atom = new Atom([0, 0], []);
		expect(atom.isSelected()).toEqual(false);
		atom.select();
		expect(atom.isSelected()).toEqual(true);
		atom.deselect();
		expect(atom.isSelected()).toEqual(false);
	});

	it("should get opposite direction", function () {
		expect(Atom.getOppositeDirection("N")).toEqual("S");
		expect(Atom.getOppositeDirection("NE3")).toEqual("SW3");
	});

	it("should label `Atom` object", function () {
		var atom = new Atom([0, 0], []),
		  label = new Label("OBn");
		atom.setLabel(label);
		expect(atom.getLabel()).toEqual(label);
	});

	it("should add objects to `attachedBonds` object", function () {
		var atom = new Atom([0, 0], []),
		  bondIn = { vector: [10, 10], multiplicity: 1 },
		  bondOut = { vector: [20, 20], multiplicity: 1 };
		expect(atom.getAttachedBonds("in")).toBeUndefined();
		expect(atom.getAttachedBonds("out")).toBeUndefined();
		atom.attachBond("in", bondIn);
		atom.attachBond("out", bondOut);
		expect(atom.getAttachedBonds("in")).toEqual([bondIn]);
		expect(atom.getAttachedBonds("out")).toEqual([bondOut]);
		expect(atom.getAttachedBonds()).toEqual({
			in: [bondIn],
			out: [bondOut]
		});
	});
});
