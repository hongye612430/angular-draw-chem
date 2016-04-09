describe("DCStructure service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Structure, Atom, Arrow;

	beforeEach(inject(function (_DCStructure_, _DCAtom_, _DCArrow_, _DCBond_) {
		Structure = _DCStructure_.Structure;
		Atom = _DCAtom_.Atom;
		Bond = _DCBond_.Bond,
		Arrow = _DCArrow_.Arrow;
	}));

	it("should create a new `Structure` object", function () {
		var structure = new Structure("N", [new Arrow("one-way-arrow", [0, 20])]);
		expect(structure).toBeDefined();
		expect(structure.getName()).toEqual("N");
		structure.setOrigin([100, 10]);
		expect(structure.getOrigin()).toEqual([100, 10]);
	});

	it("should perform an action on each `Atom` object", function () {
		var atom1 = new Atom([20, 20], []),
		  atom2 = new Atom([25, 25], []),
			atom3 = new Atom([10, 10], [new Bond("single", atom1)]),
			atom4 = new Atom([15, 15], [new Bond("single", atom2)]),
			atom5 = new Atom([0, 0], [
				new Bond("single", atom3),
				new Bond("single", atom4)
			]),
		  structure = new Structure("N", [atom5]);
		structure.doOnEach("atom", Atom.prototype.select);
		expect(atom1.isSelected()).toEqual(true);
		expect(atom2.isSelected()).toEqual(true);
		expect(atom3.isSelected()).toEqual(true);
		expect(atom4.isSelected()).toEqual(true);
		expect(atom5.isSelected()).toEqual(true);
		structure.doOnEach("atom", Atom.prototype.deselect);
		expect(atom1.isSelected()).toEqual(false);
		expect(atom2.isSelected()).toEqual(false);
		expect(atom3.isSelected()).toEqual(false);
		expect(atom4.isSelected()).toEqual(false);
		expect(atom5.isSelected()).toEqual(false);
	});

	it("should perform an action on each `Arrow` object", function () {
		var arrow1 = new Arrow("one-way-arrow", [0, 20]),
		  arrow2 = new Arrow("one-way-arrow", [30, 40]),
		  structure = new Structure("N", [arrow1, arrow2]);
		structure.doOnEach("arrow", Arrow.prototype.select);
		expect(arrow1.isSelected()).toEqual(true);
		expect(arrow2.isSelected()).toEqual(true);
	});

	it("should mark all objects as selected", function () {
		var arrow = new Arrow("one-way-arrow", [0, 20]),
		  atom = new Atom([0, 0], []),
		  structure = new Structure("N", [arrow, atom]);
		structure.selectAll();
		expect(arrow.isSelected()).toEqual(true);
		expect(atom.isSelected()).toEqual(true);
	});

	it("should mark all objects as selected and then deselect them", function () {
		var arrow = new Arrow("one-way-arrow", [0, 20]),
		  atom = new Atom([0, 0], []),
		  structure = new Structure("N", [arrow, atom]);
		structure.selectAll();
		expect(arrow.isSelected()).toEqual(true);
		expect(atom.isSelected()).toEqual(true);
		structure.deselectAll();
		expect(arrow.isSelected()).toEqual(false);
		expect(atom.isSelected()).toEqual(false);
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
