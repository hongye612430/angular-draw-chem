describe("DCShape service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Shape;

	beforeEach(inject(function (_DCShape_) {
		Shape = _DCShape_.Shape;
	}));

	it("should create a new `Shape` object", function () {
		var elementFull = "<path d='M 0 0 l 10 10'></path><circle></circle>",
			elementMini = "<path d='M 0 0 l 10 10'></path>",
			id = "cmpd1",
			shape = new Shape(elementFull, elementMini, id);
		expect(shape).toBeDefined();
		expect(shape.elementFull).toEqual("<path d='M 0 0 l 10 10'></path><circle></circle>");
		expect(shape.elementMini).toEqual("<path d='M 0 0 l 10 10'></path>");
		expect(shape.id).toEqual("cmpd1");
	});

	it("should wrap element with tags", function () {
		var elementFull = "<path d='M 0 0 l 10 10'></path><circle></circle>",
			elementMini = "<path d='M 0 0 l 10 10'></path>",
			id = "cmpd1",
			shape = new Shape(elementFull, elementMini, id);
		shape.wrap("full", "g");
		expect(shape.getElementFull()).toEqual("<g id='cmpd1' ><path d='M 0 0 l 10 10'></path><circle></circle></g>");
		shape.wrap("mini", "svg", { "width": 120 });
		expect(shape.getElementMini()).toEqual("<svg width='120' ><path d='M 0 0 l 10 10'></path></svg>");
	});

	it("should generate style", function () {
		var style = Shape.generateStyle("base");
		expect(style).toEqual(
			"<style type=\"text/css\">" +
				"path{" +
					"stroke:black;" +
					"stroke-width:0.80;" +
					"fill:none;" +
				"}" +
				"path.wedge{" +
					"fill:black;" +
				"}" +
				"path.arrow{" +
					"fill:black;" +
				"}" +
				"path.arrow-eq{" +
					"fill:none;" +
				"}" +
				"circle.arom{" +
					"stroke:black;" +
					"stroke-width:0.80;" +
					"fill:none;" +
				"}" +
				"circle.tr-arom{" +
					"stroke:black;" +
					"stroke-width:0.80;" +
					"fill:none;" +
				"}" +
				"text{" +
					"font-family:Arial;" +
					"cursor:default;" +
					"font-size:18px;" +
				"}" +
				"tspan.sub{" +
					"font-size:14px;" +
				"}" +
				"polygon.text{" +
					"fill:white;" +
				"}" +
			"</style>"
		);
	});
});
