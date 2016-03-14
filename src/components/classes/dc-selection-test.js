describe("DCSelection service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var DCSelection;

	beforeEach(inject(function (_DCSelection_) {
		DCSelection = _DCSelection_;
	}));

	it("should create a new Selection object", function () {
		var selection = new DCSelection.Selection([0, 0], [100, 100]);
		expect(selection).toBeDefined();
		expect(selection.getOrigin()).toEqual([0, 0]);
		expect(selection.getCurrent()).toEqual([100, 100]);
	});
});
