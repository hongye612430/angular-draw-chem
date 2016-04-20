describe("DrawChemUtils service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Utils, Bond, Const;

	beforeEach(inject(function (_DrawChemUtils_, _DCBond_, _DCAtom_) {
		Utils = _DrawChemUtils_;
		Bond = _DCBond_.Bond;
		Atom = _DCAtom_.Atom;
	}));

	it("should calculate quadrant", function () {
		var q = Utils.getQuadrant([50, 50], [100, 100]);
		expect(q).toEqual(4);
		q = Utils.getQuadrant([50, 50], [25, 25]);
		expect(q).toEqual(2);
		q = Utils.getQuadrant([50, 50], [100, 25]);
		expect(q).toEqual(1);
		q = Utils.getQuadrant([50, 50], [25, 100]);
		expect(q).toEqual(3);
	});

	it("should add two vectors", function () {
		var v = Utils.addVectors([10, 10], [50, 50]);
		expect(v).toEqual([60, 60]);
		v = Utils.addVectors([5, 5], [50, 50], 2);
		expect(v).toEqual([105, 105]);
	});

	it("should multiply vector by a scalar", function () {
		var v = Utils.multVectByScalar([5, 10], 5);
		expect(v).toEqual([25, 50]);
	});

	it("should compare two vectors", function () {
		var test = Utils.compareVectors([25.234, 25.543], [25.2349, 25.54321], 2);
		expect(test).toEqual(true);
		test = Utils.compareVectors([25.234, 25.543], [25.2349, 25.54321], 3);
		expect(test).toEqual(false);
	});

	it("should check if object is numeric value", function () {
		var test = Utils.isNumeric(2);
		expect(test).toEqual(true);
		test = Utils.isNumeric(undefined);
		expect(test).toEqual(false);
		test = Utils.isNumeric({});
		expect(test).toEqual(false);
		test = Utils.isNumeric("a22");
		expect(test).toEqual(false);
		test = Utils.isNumeric("321");
		expect(test).toEqual(true);
	});

	it("should check if object is small letter", function () {
		var test = Utils.isSmallLetter("a");
		expect(test).toEqual(true);
		Utils.isSmallLetter("z");
		expect(test).toEqual(true);
		Utils.isSmallLetter("g");
		expect(test).toEqual(true);
		test = Utils.isSmallLetter("A");
		expect(test).toEqual(false);
		test = Utils.isSmallLetter({});
		expect(test).toEqual(false);
		test = Utils.isSmallLetter("a22");
		expect(test).toEqual(false);
		test = Utils.isSmallLetter("Z");
		expect(test).toEqual(false);
	});

	it("should compare two floats", function () {
		var test = Utils.compareFloats(21.321, 21.32145, 3);
		expect(test).toEqual(true);
		test = Utils.compareFloats(21.321, 21.32145, 4);
		expect(test).toEqual(false);
	});

	it("should invert a chemical group", function () {
		var group = Utils.invertGroup("OBn");
		expect(group).toEqual("BnO");
		group = Utils.invertGroup("SCN");
		expect(group).toEqual("NCS");
		group = Utils.invertGroup(undefined);
		expect(group).toEqual("");
		group = Utils.invertGroup("");
		expect(group).toEqual("");
		group = Utils.invertGroup("Sm");
		expect(group).toEqual("Sm");
		//group = Utils.invertGroup("OTBS");
		//expect(group).toEqual("TBSO");
		group = Utils.invertGroup("NHBn");
		expect(group).toEqual("BnHN");
	});

	it("should be able to use an array in a cicular manner (left)", function () {
		var array = [1, 2, 3, 4, 5, 6];
		  index = Utils.moveToLeft(array, 3, 2);
		expect(index).toEqual(1);
		index = Utils.moveToLeft(array, 3, 5);
		expect(index).toEqual(4);
	});

	it("should be able to use an array in a cicular manner (right)", function () {
		var array = [1, 2, 3, 4, 5, 6];
		  index = Utils.moveToRight(array, 3, 2);
		expect(index).toEqual(5);
		index = Utils.moveToRight(array, 3, 5);
		expect(index).toEqual(2);
	});

	it("should check if point is inside a circle", function () {
		var test = Utils.insideCircle([2, 2], [4, 4], 2);
		expect(test).toEqual(false);
		test = Utils.insideCircle([2, 2], [3, 3], 2);
		expect(test).toEqual(true);
	});

	it("should subtract vectors", function () {
		var v = Utils.subtractVectors([2, 2], [4, 4]);
		expect(v).toEqual([-2, -2]);
	});

	it("should rotate vector clock-wise", function () {
		var v = Utils.rotVectCW([1, 1], 45);
		expect([v[0].toFixed(2), v[1].toFixed(2)]).toEqual(["0.00", "1.41"]);
		v = Utils.rotVectCW([1, 1], 90);
		expect([v[0].toFixed(2), v[1].toFixed(2)]).toEqual(["-1.00", "1.00"]);
	});

	it("should rotate vector counter clock-wise", function () {
		var v = Utils.rotVectCCW([1, 1], 45);
		expect([v[0].toFixed(2), v[1].toFixed(2)]).toEqual(["1.41", "0.00"]);
		v = Utils.rotVectCCW([1, 1], 90);
		expect([v[0].toFixed(2), v[1].toFixed(2)]).toEqual(["1.00", "-1.00"]);
	});

	it("should normalize a vector", function () {
		var v = Utils.norm([3, 4]);
		expect([v[0].toFixed(2), v[1].toFixed(2)]).toEqual(["0.60", "0.80"]);
	});

	it("should calculate dot product of two vectors", function () {
		var d = Utils.dotProduct([3, 3], [2, 2]);
		expect(d).toEqual(12);
	});

	it("should calculate area of a rectangle", function () {
		var points = [[0, 2], [0, -2], [10, -2], [10, 2]];
		expect(Utils.getRectArea(points)).toEqual(40);
	});

	it("should compare length of two vectors", function () {
		var v1 = [3, 4], v2 = [1, 1];
		expect(Utils.vect(v1).isLongerThan(v2)).toEqual(true);
		expect(Utils.vect(v2).isShorterThan(v1)).toEqual(true);
	});

	it("should check if a point is inside a rectangle", function () {
		var bond = new Bond("single", new Atom([10, 0])),
		  inside = Utils.insideFocus([0, 0], bond, [1, 1], 0.2, 10);
		expect(inside).toEqual(true);
		inside = Utils.insideFocus([0, 0], bond, [1, 3], 0.2, 10);
		expect(inside).toEqual(false);
	});
});
