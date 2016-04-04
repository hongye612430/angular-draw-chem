describe("DCSelection service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Selection, DCSelection;

	beforeEach(inject(function (_DCSelection_) {
		DCSelection = _DCSelection_;
		Selection = _DCSelection_.Selection;
	}));

	it("should create a new `Selection` object", function () {
		var selection = new Selection([0, 0], [100, 100]);
		expect(selection).toBeDefined();
		expect(selection.getOrigin()).toEqual([0, 0]);
		expect(selection.getCurrent()).toEqual([100, 100]);
	});

	it("should calculate attributes of a rectangle associated with mouse events", function () {
		var rect = DCSelection.calcRect([10, 10], [100, 100]);
		expect(rect.class).toEqual("selection");
		expect(rect.rect).toEqual([10, 10, 90, 90]);
		rect = DCSelection.calcRect([20, 20], [10, 10]);
		expect(rect.rect).toEqual([10, 10, 10, 10]);
		rect = DCSelection.calcRect([20, 20], [30, 10]);
		expect(rect.rect).toEqual([20, 10, 10, 10]);
		rect = DCSelection.calcRect([20, 20], [10, 40]);
		expect(rect.rect).toEqual([10, 20, 10, 20]);
		rect = DCSelection.calcRect([20, 20], [20, 40]);
		expect(rect.rect).toEqual([20, 20, 0, 20]);
	});
});
