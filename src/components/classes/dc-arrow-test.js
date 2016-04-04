describe("DCArrow service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Arrow;

	beforeEach(inject(function (_DCArrow_, _DrawChemConst_) {
		Arrow = _DCArrow_.Arrow;
		Const = _DrawChemConst_;
	}));

	it("should create a new `Arrow` object", function () {
		var arrow = new Arrow("one-way-arrow", Const.BOND_E);
		expect(arrow).toBeDefined();
		expect(arrow.getType()).toEqual("one-way-arrow");
		expect(arrow.getRelativeEnd()).toEqual(Const.BOND_E);
	});

	it("should be able to mark `Arrow` object as selected", function () {
		var arrow = new Arrow("one-way-arrow", Const.BOND_E);
		expect(arrow.isSelected()).toEqual(false);
		arrow.select();
		expect(arrow.isSelected()).toEqual(true);
		arrow.deselect();
		expect(arrow.isSelected()).toEqual(false);
	});

	it("should be able to set new origin on `Arrow` object", function () {
		var arrow = new Arrow("one-way-arrow", Const.BOND_E);
		expect(arrow.getEnd()).toBeUndefined();
		arrow.setOrigin([10, 10]);
		expect(arrow.getEnd()).toEqual([Const.BOND_E[0] + 10, Const.BOND_E[1] + 10]);
	});

	it("should be able to update end coords of `Arrow` object", function () {
		var arrow = new Arrow("one-way-arrow", Const.BOND_E), origin = [10, 10];
		expect(arrow.getEnd()).toBeUndefined();
		arrow.setOrigin(origin);
		expect(arrow.getEnd()).toEqual([Const.BOND_E[0] + 10, Const.BOND_E[1] + 10]);
		origin[0] = 20;
		arrow.updateEnd();
		expect(arrow.getEnd()).toEqual([Const.BOND_E[0] + 20, Const.BOND_E[1] + 10]);
	});
});
