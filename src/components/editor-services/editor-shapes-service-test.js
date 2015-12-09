describe("DrawChemShapes service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemShapes;
	
	beforeEach(inject(function (_DrawChemShapes_) {		
		DrawChemShapes = _DrawChemShapes_;
	}));
	
	it("should draw an object based on the input", function () {
		var input = [
			{
				coords: [10, 10],
				bonds: [
					{
						coords: [15, 15],
						bonds: [
							{
								coords: [20, 20],
								bonds: [
									{
										coords: [30, 30],
										bonds: []
									}
								]
							},
							{
								coords: [25, 25],
								bonds: []
							}
						]
					},
					{
						coords: [5, 10],
						bonds: []
					},
					{
						coords: [-5, 16],
						bonds: []
					},
					{
						coords: [4, 2],
						bonds: []
					}
				]
			}
		];
		expect(DrawChemShapes.draw(input, "cmpd1")).toEqual(
			"<svg>" +
				"<defs>" +
					"<g id='cmpd1'>" +
						"<path d='M 10 10 l 15 15 l 20 20 l 30 30 '></path>" +
						"<path d='M 15 15 l 25 25 '></path>" +	
						"<path d='M 10 10 l 5 10 '></path>" +
						"<path d='M 10 10 l -5 16 '></path>" +
						"<path d='M 10 10 l 4 2 '></path>" +									
					"</g>" +
				"</defs>" +
				"<use xmlns:xlink='http://www.w3.org/1999/xlink' " +
					 "xlink:href='#cmpd1' transform='' style='stroke: black; stroke-width: 0.48; fill: none;'></use>" +
			"</svg>"
		);
	});
});