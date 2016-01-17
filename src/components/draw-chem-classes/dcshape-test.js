describe("DCShape service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DCShape;
	
	beforeEach(inject(function (_DCShape_) {
		DCShape = _DCShape_;
	}));
	
	it("should create a new Shape object", function () {
		var elementFull = "<path d='M 0 0 l 10 10'></path><circle></circle>",
			elementMini = "<path d='M 0 0 l 10 10'></path>",
			id = "cmpd1",
			shape = new DCShape.Shape(elementFull, elementMini, id);
		expect(shape).toBeDefined();
		expect(shape.elementFull).toEqual("<path d='M 0 0 l 10 10'></path><circle></circle>");
		expect(shape.elementMini).toEqual("<path d='M 0 0 l 10 10'></path>");
		expect(shape.id).toEqual("cmpd1");
	});
});