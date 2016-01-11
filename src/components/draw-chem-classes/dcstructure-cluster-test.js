describe("DCStructureCluster service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var Structure, StructureCluster, Atom;
	
	beforeEach(inject(function (_DCStructure_, _DCStructureCluster_, _DCAtom_) {
		Structure = _DCStructure_.Structure;
		Atom = _DCAtom_.Atom;
		StructureCluster = _DCStructureCluster_.StructureCluster;
	}));
	
	it("should create StructureCluster object", function () {
		var name = "test1",
			bonds1 = [new Atom([10, 10], [])],
			structure1 = new Structure("name1", bonds1),
			bonds2 = [new Atom([10, 20], [])],
			structure2 = new Structure("name2", bonds2),
			cluster = new StructureCluster(name, [structure1, structure2]);
		expect(cluster.getDefs()).toEqual([structure1, structure2]);
	});
	
	it("should retrieve the default Structure object", function () {
		var name = "test1",
			bonds1 = [new Atom([10, 10], [])],
			structure1 = new Structure("name1", bonds1),
			bonds2 = [new Atom([10, 20], [])],
			structure2 = new Structure("name2", bonds2),
			cluster = new StructureCluster(name, [structure1, structure2]);
		expect(cluster.getDefault()).toEqual(structure1);
	});
});