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
					"<rect class='focus' x='12.25' y='7.75' rx='2.00' ry='2.00' width='20.00' height='6.36' transform='rotate(45.00, 12.25, 7.75)'></rect>" +
					"<rect class='focus' x='28.00' y='22.00' rx='2.00' ry='2.00' width='20.00' height='8.49' transform='rotate(45.00, 28.00, 22.00)'></rect>" +
					"<rect class='focus' x='49.50' y='40.50' rx='2.00' ry='2.00' width='20.00' height='12.73' transform='rotate(45.00, 49.50, 40.50)'></rect>" +
					"<rect class='focus' x='28.75' y='21.25' rx='2.00' ry='2.00' width='20.00' height='10.61' transform='rotate(45.00, 28.75, 21.25)'></rect>" +
					"<rect class='focus' x='11.50' y='9.25' rx='2.00' ry='2.00' width='20.00' height='3.35' transform='rotate(63.43, 11.50, 9.25)'></rect>" +
					"<rect class='focus' x='12.40' y='10.75' rx='2.00' ry='2.00' width='20.00' height='5.03' transform='rotate(107.35, 12.40, 10.75)'></rect>" +
					"<rect class='focus' x='10.30' y='9.40' rx='2.00' ry='2.00' width='20.00' height='1.34' transform='rotate(26.57, 10.30, 9.40)'></rect>" +
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
