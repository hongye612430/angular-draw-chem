describe("DCStructure service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Structure, Atom, Arrow;

	beforeEach(inject(function (_DCStructure_, _DCAtom_, _DCArrow_) {
		Structure = _DCStructure_.Structure;
		Atom = _DCAtom_.Atom;
		Arrow = _DCArrow_.Arrow;
	}));

	it("should create a new `Structure` object", function () {
		var structure = new Structure("N", [new Arrow("one-way-arrow", [0, 20])]);
		expect(structure).toBeDefined();
		expect(structure.getName()).toEqual("N");
		structure.setOrigin([100, 10]);
		expect(structure.getOrigin()).toEqual([100, 10]);
	});

	it("should mark all objects as selected", function () {
		var arrow = new Arrow("one-way-arrow", [0, 20]),
		  atom = new Atom([0, 0], []),
		  structure = new Structure("N", [arrow, atom]);
		structure.selectAll();
		expect(arrow.isSelected()).toEqual(true);
		expect(atom.isSelected()).toEqual(true);
	});

	it("should delete selected objects", function () {
		var arrow = new Arrow("one-way-arrow", [0, 20]),
		  atom = new Atom([0, 0], []),
		  structure = new Structure("N", [arrow, atom]);
		structure.selectAll();
		structure.deleteSelected();
		expect(structure.getStructure()).toEqual([]);
	});
});
