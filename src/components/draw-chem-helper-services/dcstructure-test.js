describe("DrawChemEditor directive tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DCStructure;
	
	beforeEach(inject(function (_DCStructure_) {
		DCStructure = _DCStructure_;
	}));
	
	it("should create a new Structure object", function () {
		var name = "name",
			struct = [],
			structure = new DCStructure.Structure(name, struct);
		expect(structure).toBeDefined();
		expect(structure.name).toEqual("name");
		expect(structure.structure).toEqual([]);
		structure.setTransform("translate", [10, 10]);
		expect(structure.getTransform("translate")).toEqual([10, 10]);
	});
});