describe("DCArrowCluster service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var ArrowCluster, Const, generateArrows;

	beforeEach(inject(function (_DCArrowCluster_, _DrawChemConst_, _DrawChemUtils_, _DCArrow_) {
		ArrowCluster = _DCArrowCluster_.ArrowCluster;
		Const = _DrawChemConst_;
		Utils = _DrawChemUtils_;
		Arrow = _DCArrow_.Arrow;
		generateArrows = function (type) {
			var startVector = Const.BOND_N, result = [], i,
			  possibleVectors = Utils.calcPossibleVectors(startVector, Const.FREQ);
			possibleVectors.push(startVector);
			for (i = 0; i < possibleVectors.length; i += 1) {
				result.push(new Arrow(type, possibleVectors[i]));
			}
			return result;
		};
	}));

	it("should create `ArrowCluster` object", function () {
		var defs = generateArrows("one-way-arrow"),
		  cluster = new ArrowCluster("one-way-arrow", defs);
		expect(cluster).toBeDefined();
	});

	it("should return default `Arrow` object", function () {
		var defs = generateArrows("one-way-arrow"),
		  cluster = new ArrowCluster("one-way-arrow", defs),
			arrow = cluster.getDefault();
		expect(arrow.getRelativeEnd()).toEqual(Const.BOND_E);
	});

	it("should return chosen `Arrow` object", function () {
		var defs = generateArrows("one-way-arrow"),
		  cluster = new ArrowCluster("one-way-arrow", defs),
			arrow = cluster.getArrow([0, 0], [0, -100]),
			endX = parseFloat(arrow.getRelativeEnd()[0].toFixed(2)),
			endY = parseFloat(arrow.getRelativeEnd()[1].toFixed(2));
		endX = endX === -0 ? 0: endX;
		expect([endX, endY]).toEqual(Const.BOND_N);
	});
});
