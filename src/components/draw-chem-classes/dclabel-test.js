describe("DCLabel service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var Label;
	
	beforeEach(inject(function (_DCLabel_) {
		Label = _DCLabel_.Label;
	}));
	
	it("should create a new Label object", function () {
		var label = new Label("O", 2);
		expect(label.getMaxBonds()).toEqual(2);
		label.setMaxBonds(1);
		expect(label.getMaxBonds()).toEqual(1);
		expect(label.getLabel()).toEqual("O");
	});
});