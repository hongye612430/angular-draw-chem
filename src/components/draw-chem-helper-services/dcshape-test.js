describe("DrawChemEditor directive tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DCShape;
	
	beforeEach(inject(function (_DCShape_) {
		DCShape = _DCShape_;
	}));
	
	it("should create a new Shape object", function () {
		var element = "<path d='M 0 0 l 10 10'></path>",
			id = "cmpd1",
			shape = new DCShape.Shape(element, id);
		expect(shape).toBeDefined();
		expect(shape.element).toEqual("<path d='M 0 0 l 10 10'></path>");
		expect(shape.id).toEqual("cmpd1");
	});
});