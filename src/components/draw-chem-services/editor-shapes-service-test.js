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
		expect(DrawChemShapes.draw(input, "cmpd1").generate()).toEqual(
			"<svg>" +
				"<defs>" +
					"<g id='cmpd1' >" +
						"<style type=\"text/css\">" +
							"path{" +
								"stroke:black;" +
								"stroke-width:0.8;" +
								"fill:none;" +
							"}" +
							"circle:hover{" +
								"opacity:0.3;" +
								"stroke:black;" +
								"stroke-width:0.8;" +
							"}" +
							"circle{" +
								"opacity:0;" +
							"}" +
						"</style>" +
						"<path d='M 10 10 l 15 15 l 20 20 l 30 30 '></path>" +
						"<path d='M 15 15 l 25 25 '></path>" +	
						"<path d='M 10 10 l 5 10 '></path>" +
						"<path d='M 10 10 l -5 16 '></path>" +
						"<path d='M 10 10 l 4 2 '></path>" +
						"<circle cx='10' cy='10' r='2.4' ></circle>" +
						"<circle cx='25' cy='25' r='2.4' ></circle>" +
						"<circle cx='45' cy='45' r='2.4' ></circle>" +
						"<circle cx='75' cy='75' r='2.4' ></circle>" +
						"<circle cx='40' cy='40' r='2.4' ></circle>" +
						"<circle cx='15' cy='20' r='2.4' ></circle>" +
						"<circle cx='5' cy='26' r='2.4' ></circle>" +
						"<circle cx='14' cy='12' r='2.4' ></circle>" +
					"</g>" +
				"</defs>" +
				"<use xmlns:xlink='http://www.w3.org/1999/xlink' " +
					 "xlink:href='#cmpd1' transform=''></use>" +
			"</svg>"
		);
	});
});