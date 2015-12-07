describe("DrawChemShapes service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemShapes;
	
	beforeEach(inject(function (_DrawChemShapes_) {		
		DrawChemShapes = _DrawChemShapes_;
	}));
	
	it("should close the editor", function () {
		expect(DrawChemShapes.benzene().generate()).toEqual(
			"<svg>" +
				"<defs>" +
					"<g id='benzene'>" +
						"<polygon points='0.00 -11.55 10.00 -5.77 10.00 5.77 0.00 11.55 -10.00 5.77 -10.00 -5.77'></polygon>" +
						"<circle r='6.67'></circle>" +
					"</g>" +
				"</defs>" +
				"<use xmlns:xlink='http://www.w3.org/1999/xlink' " +
					 "xlink:href='#benzene' transform='' style='stroke: black; stroke-width: 0.48; fill: none;'></use>" +
			"</svg>"
		);
	});
});