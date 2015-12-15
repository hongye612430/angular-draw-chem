describe("DrawChemShapes service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemShapes, DrawChemStructures, DrawChemConst, Atom;
	
	beforeEach(inject(function (_DrawChemShapes_, _DrawChemStructures_, _DrawChemConst_, _DCAtom_) {
		Atom = _DCAtom_.Atom;
		DrawChemShapes = _DrawChemShapes_;
		DrawChemConst = _DrawChemConst_;
		DrawChemStructures = _DrawChemStructures_;
		BOND_N = DrawChemConst.BOND_N,
		BOND_S = DrawChemConst.BOND_S,
		BOND_W = DrawChemConst.BOND_W,
		BOND_E = DrawChemConst.BOND_E,
		BOND_NE = DrawChemConst.BOND_NE,
		BOND_NW = DrawChemConst.BOND_NW,
		BOND_SE = DrawChemConst.BOND_SE,
		BOND_SW = DrawChemConst.BOND_SW;
	}));
	
	it("should draw an object based on the input", function () {
		var input = [
			new Atom([10, 10], [
				new Atom([15, 15], [
					new Atom([20, 20], [
						new Atom([30, 30], [])
					]),
					new Atom([25, 25], [])
				]),
				new Atom([5, 10], []),
				new Atom([-5, 16], []),
				new Atom([4, 2], [])
			])
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
	
	it("should combine structure objects", function () {
		var benzene = DrawChemStructures.benzene(),
			singleBond = DrawChemStructures.singleBond(),
			toCompare = DrawChemStructures.benzene().getStructure();
			
		toCompare[0].setCoords([100, 100]);
		toCompare[0].addBond(singleBond.getStructure()[0].getBonds()[0]);
		benzene.getStructure()[0].setCoords([100, 100]);
		currentClick = [101, 99];
		DrawChemShapes.modifyStructure(benzene, singleBond, currentClick);
		expect(benzene.getStructure()).toEqual(toCompare);		
		
		toCompare[0].getBonds()[0].addBond(singleBond.getStructure()[0].getBonds()[0]);
		currentClick = [118, 109];
		DrawChemShapes.modifyStructure(benzene, singleBond, currentClick);
		expect(benzene.getStructure()).toEqual(toCompare);
	});
});