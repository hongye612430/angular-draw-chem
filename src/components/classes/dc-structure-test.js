describe("DCStructure service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Structure, Atom;

	beforeEach(inject(function (_DCStructure_, _DCAtom_) {
		Structure = _DCStructure_.Structure;
		Atom = _DCAtom_.Atom;
	}));

	it("should create a new Structure object", function () {
		var name = "name",
			struct = [],
			structure = new Structure(name, struct);
		expect(structure).toBeDefined();
		expect(structure.name).toEqual("name");
		structure.setOrigin([100, 10]);
		expect(structure.getOrigin()).toEqual([100, 10]);
	});

	it("should return atom at the specified index", function () {
		var name = "name",
			struct = [new Atom([10, 10], [])],
			structure = new Structure(name, struct);
		expect(structure.getStructure(0).getCoords()).toEqual([10, 10]);
	});

});
