describe("DCAtom service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var Atom, Structure;
	
	beforeEach(inject(function (_DCAtom_, _DCStructure_) {
		Atom = _DCAtom_.Atom;
		Structure = _DCStructure_.Structure;
	}));
	
	it("should create a new Atom object", function () {
		var atom = new Atom([0, 0], []),
			newAtom = new Atom([50, 50], []);
		expect(atom.coords).toBeDefined();
		expect(atom.bonds).toBeDefined();
		atom.setCoords([100, 100])
		expect(atom.getCoords()).toEqual([100, 100]);
		expect(atom.getBonds()).toEqual([]);
		atom.addBond(newAtom);
		expect(atom.getBonds()).toEqual([newAtom]);
	});
	
	it("should return the specified coordinate", function () {
		var atom = new Atom([0, 0], []);
		expect(atom.getCoords("x")).toEqual(0);
	});
	
	it("should return an atom at the specified index", function () {
		var atom = new Atom([0, 0], [
			new Atom([10, 10], [])
		]);
		expect(atom.getBonds(0).getCoords()).toEqual([10, 10]);
	});
	
	it("should add a whole new structure to the bonds", function () {
		var atom = new Atom([0, 0], []),
			str = new Structure("custom", [
				new Atom([99, 99], [
					new Atom([110, 110], [])
				])
			]);
		atom.addBonds(str.getStructure());
		expect(atom.getBonds()).toEqual(
			str.getStructure()
		);
	});
});