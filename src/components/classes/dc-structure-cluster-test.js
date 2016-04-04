describe("DCStructureCluster service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var Structure, StructureCluster, Atom, Bond, generateBonds;

	beforeEach(inject(function (_DCStructure_, _DCStructureCluster_, _DCAtom_, _DCBond_, _DrawChemConst_) {
		Structure = _DCStructure_.Structure;
		BONDS = _DrawChemConst_.BONDS;
		Atom = _DCAtom_.Atom;
		Bond = _DCBond_.Bond;
		StructureCluster = _DCStructureCluster_.StructureCluster;
		generateBonds = function(type, mult) {
			var i, bond, direction, result = [];
			for (i = 0; i < BONDS.length; i += 1) {
				bond = BONDS[i].bond;
				direction = BONDS[i].direction;
				result.push(
					new Structure(
						direction,
						[
							new Atom([0, 0], [generateBond(bond, type, mult)],
								{ out: [{ vector: bond, multiplicity: mult }] } )
						]
					)
				);
			}
			return result;

			function generateBond(bond, type, mult) {
				return new Bond(type, new Atom(bond, [], { in: [{ vector: angular.copy(bond), multiplicity: mult }] }));
			};
		};
	}));

	it("should create a `StructureCluster` object", function () {
		var cluster = new StructureCluster("single", generateBonds("single", 1));
		expect(cluster.getName()).toEqual("single");
	});

	it("should retrieve default `Structure` object", function () {
		var cluster = new StructureCluster("single", generateBonds("single", 1));
		expect(cluster.getDefault().getName()).toEqual("N");
	});

	it("should choose appropriate `Structure` object based on supported coords", function () {
		var cluster = new StructureCluster("single", generateBonds("single", 1));
		expect(cluster.getStructure([0, 0], [0, 200]).getName()).toEqual("S");
	});
});
