describe("DCSvg service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Svg;

	beforeEach(inject(function (_DCSvg_) {
		Svg = _DCSvg_.Svg;
	}));

	it("should create a new `Svg` object", function () {
		var elementFull = "<path d='M 0 0 l 10 10'></path><circle></circle>",
			elementMini = "<path d='M 0 0 l 10 10'></path>",
			id = "cmpd1",
			svg = new Svg(elementFull, elementMini, id);
		expect(svg).toBeDefined();
		expect(svg.elementFull).toEqual("<path d='M 0 0 l 10 10'></path><circle></circle>");
		expect(svg.elementMini).toEqual("<path d='M 0 0 l 10 10'></path>");
		expect(svg.id).toEqual("cmpd1");
	});

	it("should wrap element with tags", function () {
		var elementFull = "<path d='M 0 0 l 10 10'></path><circle></circle>",
			elementMini = "<path d='M 0 0 l 10 10'></path>",
			id = "cmpd1",
			svg = new Svg(elementFull, elementMini, id);
		svg.wrap("full", "g");
		expect(svg.getElementFull()).toEqual("<g id='cmpd1' ><path d='M 0 0 l 10 10'></path><circle></circle></g>");
		svg.wrap("mini", "svg", { "width": 120 });
		expect(svg.getElementMini()).toEqual("<svg width='120' ><path d='M 0 0 l 10 10'></path></svg>");
	});

	it("should generate style", function () {
		var style = Svg.generateStyle("base");
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
