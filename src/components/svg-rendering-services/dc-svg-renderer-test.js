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
					"<rect class='focus' x='12.12' y='7.88' rx='2.00' ry='2.00' width='21.21' height='6.00' transform='rotate(45.00, 12.12, 7.88)'></rect>" +
					"<rect class='focus' x='27.12' y='22.88' rx='2.00' ry='2.00' width='28.28' height='6.00' transform='rotate(45.00, 27.12, 22.88)'></rect>" +
					"<rect class='focus' x='47.12' y='42.88' rx='2.00' ry='2.00' width='42.43' height='6.00' transform='rotate(45.00, 47.12, 42.88)'></rect>" +
					"<rect class='focus' x='27.12' y='22.88' rx='2.00' ry='2.00' width='35.36' height='6.00' transform='rotate(45.00, 27.12, 22.88)'></rect>" +
					"<rect class='focus' x='12.68' y='8.66' rx='2.00' ry='2.00' width='11.18' height='6.00' transform='rotate(63.43, 12.68, 8.66)'></rect>" +
					"<rect class='focus' x='12.86' y='10.89' rx='2.00' ry='2.00' width='16.76' height='6.00' transform='rotate(107.35, 12.86, 10.89)'></rect>" +
					"<rect class='focus' x='11.34' y='7.32' rx='2.00' ry='2.00' width='4.47' height='6.00' transform='rotate(26.57, 11.34, 7.32)'></rect>" +
					"<circle class='atom' cx='10.00' cy='10.00' r='3.40'></circle>" +
					"<circle class='atom' cx='25.00' cy='25.00' r='3.40'></circle>" +
					"<circle class='atom' cx='45.00' cy='45.00' r='3.40'></circle>" +
					"<circle class='atom' cx='75.00' cy='75.00' r='3.40'></circle>" +
					"<circle class='atom' cx='50.00' cy='50.00' r='3.40'></circle>" +
					"<circle class='atom' cx='15.00' cy='20.00' r='3.40'></circle>" +
					"<circle class='atom' cx='5.00' cy='26.00' r='3.40'></circle>" +
					"<circle class='atom' cx='14.00' cy='12.00' r='3.40'></circle>" +
				"</g>" +
			"</svg>"
		);
	});
});
