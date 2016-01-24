describe("DrawChemShapes service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemShapes, DrawChemStructures, DrawChemConst, Atom, Structure, styleFull;
	
	styleFull = "path{" +
			"stroke:black;" +
			"stroke-width:0.8;" +
			"fill:none;" +
		"}" +
		"path.wedge{" +
			"stroke:black;" +
			"stroke-width:0.8;" +
			"fill:black;" +
		"}" +
		"circle.atom:hover{" +
			"opacity:0.3;" +
			"stroke:black;" +
			"stroke-width:0.8;" +
		"}" +
		"circle.atom{" +
			"opacity:0;" +
		"}" +
		"circle.arom{" +
			"stroke:black;" +
			"stroke-width:0.8;" +
			"fill:none;" +
		"}" +
		"text{" +
			"font-family:Arial;" +
			"cursor:default;" +
			"text-anchor:middle;" +
			"dominant-baseline:middle;" +
			"font-size:18px;" +
		"}" +
		"rect{" +
			"fill:white;" +
		"}";
	
	beforeEach(inject(function (_DrawChemShapes_, _DrawChemStructures_, _DrawChemConst_, _DCAtom_, _DCStructure_, _DCBond_) {
		Atom = _DCAtom_.Atom;
		Bond = _DCBond_.Bond;
		DrawChemShapes = _DrawChemShapes_;
		DrawChemConst = _DrawChemConst_;
		DrawChemStructures = _DrawChemStructures_;
		Structure = _DCStructure_.Structure;
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
		var input = new Structure("test", [
			new Atom([10, 10], [
				new Bond("single", new Atom([15, 15], [
					new Bond("single", new Atom([20, 20], [
						new Bond("single", new Atom([30, 30], []))
					])),
					new Bond("single", new Atom([25, 25], []))
				])),
				new Bond("single", new Atom([5, 10], [])),
				new Bond("single", new Atom([-5, 16], [])),
				new Bond("single", new Atom([4, 2], []))
			])
		]);
		input.setOrigin([10, 10]);
		expect(DrawChemShapes.draw(input, "cmpd1").wrap("full", "g").wrap("full", "svg").elementFull).toEqual(
			"<svg>" +
				"<g id='cmpd1' >" +
					"<style type=\"text/css\">" +
						styleFull +
					"</style>" +
					"<path d='M 10 10 L 25 25 L 45 45 L 75 75 '></path>" +
					"<path d='M 25 25 L 50 50 '></path>" +	
					"<path d='M 10 10 L 15 20 '></path>" +
					"<path d='M 10 10 L 5 26 '></path>" +
					"<path d='M 10 10 L 14 12 '></path>" +
					"<circle class='atom' cx='10' cy='10' r='2.4' ></circle>" +
					"<circle class='atom' cx='25' cy='25' r='2.4' ></circle>" +
					"<circle class='atom' cx='45' cy='45' r='2.4' ></circle>" +
					"<circle class='atom' cx='75' cy='75' r='2.4' ></circle>" +
					"<circle class='atom' cx='50' cy='50' r='2.4' ></circle>" +
					"<circle class='atom' cx='15' cy='20' r='2.4' ></circle>" +
					"<circle class='atom' cx='5' cy='26' r='2.4' ></circle>" +
					"<circle class='atom' cx='14' cy='12' r='2.4' ></circle>" +
				"</g>" +
			"</svg>"
		);
	});
});