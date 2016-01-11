describe("DrawChemCache service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemCache;
	
	beforeEach(inject(function (_DrawChemCache_) {		
		DrawChemCache = _DrawChemCache_;
	}));

	it("should store data in cachedStructures array and retrieve them", function () {
		var data = "test";
		DrawChemCache.addStructure(data);
		expect(DrawChemCache.removeLastStructure()).toEqual(data);
	});
	
	it("should not exceed 10 elements in cachedStructures array", function () {
		var data = [], i;
		for (i = 0; i < 10; i += 1) {
			data.push("test" + i);
		}
		data.forEach(function (d) {
			DrawChemCache.addStructure(d);
		});		
		
		DrawChemCache.addStructure("test10");
		expect(DrawChemCache.removeLastStructure()).toEqual("test10");
		expect(DrawChemCache.removeFirstStructure()).toEqual("test1");
	});
	
	it("should remember which element in cachedStructures array is currently active", function () {
		var data = [], i;
		for (i = 0; i < 4; i += 1) {
			data.push("test" + i);
		}
		data.forEach(function (d) {
			DrawChemCache.addStructure(d);
		});
		
		expect(DrawChemCache.getCurrentStructure()).toEqual("test3");
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test2");
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test1");
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test0");
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toBeUndefined();
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toBeUndefined();
		DrawChemCache.moveRightInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test0");
		DrawChemCache.moveRightInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test1");
		DrawChemCache.moveRightInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test2");
		DrawChemCache.moveRightInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test3");
		DrawChemCache.moveRightInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test3");
	});
	
	it("should add new data correctly", function () {
		var data = [], i;
		for (i = 0; i < 4; i += 1) {
			data.push("test" + i);
		}
		data.forEach(function (d) {
			DrawChemCache.addStructure(d);
		});
		
		expect(DrawChemCache.getCurrentStructure()).toEqual("test3");
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test2");
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test1");
		DrawChemCache.moveLeftInStructures();
		DrawChemCache.addStructure("andrzej");
		expect(DrawChemCache.getCurrentStructure()).toEqual("andrzej");
		DrawChemCache.moveLeftInStructures();
		expect(DrawChemCache.getCurrentStructure()).toEqual("test0");
		expect(DrawChemCache.getStructureLength()).toEqual(2);
	});
});