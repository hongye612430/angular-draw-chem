describe("DrawChemSvgRenderer service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var SvgRenderer, Atom, Structure, Bond;

	beforeEach(inject(function (_DrawChemSvgRenderer_, _DCAtom_, _DCStructure_, _DCBond_) {
		Atom = _DCAtom_.Atom;
		Bond = _DCBond_.Bond;
		Structure = _DCStructure_.Structure;
		SvgRenderer = _DrawChemSvgRenderer_;
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
		input.setOrigin([0, 0]);
		expect(
			SvgRenderer
				.draw(input, "cmpd1")
				.wrap("full", "g")
				.wrap("full", "svg")
				.getElementFull()
		).toEqual(
			"<svg>" +
				"<g id='cmpd1' >" +
					"<style type=\"text/css\">" +
						styleBase + styleExpanded +
					"</style>" +
					"<path d='M 10.00 10.00 L 25.00 25.00 L 45.00 45.00 L 75.00 75.00 '></path>" +
					"<path d='M 25.00 25.00 L 50.00 50.00 '></path>" +
					"<path d='M 10.00 10.00 L 15.00 20.00 '></path>" +
					"<path d='M 10.00 10.00 L 5.00 26.00 '></path>" +
					"<path d='M 10.00 10.00 L 14.00 12.00 '></path>" +
					"<circle class='atom' cx='10.00' cy='10.00' r='2.40'></circle>" +
					"<circle class='atom' cx='25.00' cy='25.00' r='2.40'></circle>" +
					"<circle class='atom' cx='45.00' cy='45.00' r='2.40'></circle>" +
					"<circle class='atom' cx='75.00' cy='75.00' r='2.40'></circle>" +
					"<circle class='atom' cx='50.00' cy='50.00' r='2.40'></circle>" +
					"<circle class='atom' cx='15.00' cy='20.00' r='2.40'></circle>" +
					"<circle class='atom' cx='5.00' cy='26.00' r='2.40'></circle>" +
					"<circle class='atom' cx='14.00' cy='12.00' r='2.40'></circle>" +
				"</g>" +
			"</svg>"
		);
	});
});