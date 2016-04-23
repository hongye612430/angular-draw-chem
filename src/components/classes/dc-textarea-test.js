describe("DCTextArea service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var TextArea;

	beforeEach(inject(function (_DCTextArea_) {
		TextArea = _DCTextArea_.TextArea;
	}));

	it("should create a new `TextArea` object", function () {
    var txt = new TextArea("NaBH_(4)");
    expect(txt.getText()).toEqual("NaBH_(4)");
    txt.setText("H_(2)");
    expect(txt.getText()).toEqual("H_(2)");
	});

	it("should set/get origin", function () {
    var txt = new TextArea("NaCl", [0, 0]);
    expect(txt.getText()).toEqual("NaCl");
		expect(txt.getOrigin()).toEqual([0, 0]);
    txt.setOrigin([100, 100]);
    expect(txt.getOrigin()).toEqual([100, 100]);
	});
});
