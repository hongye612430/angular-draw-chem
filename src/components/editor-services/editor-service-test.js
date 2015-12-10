describe("DrawChem service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChem;
	
	beforeEach(inject(function (_DrawChem_) {
		DrawChem = _DrawChem_;
	}));
	
	it("should have a showEditor function", function () {
		expect(DrawChem.showEditor()).toEqual(false); // modal hidden at the beginning
	});
	
	it("should have a runEditor function", function () {		
		DrawChem.runEditor("test");
		expect(DrawChem.showEditor()).toEqual(true); // shows modal
	});
	
	it("should have a getContent and setContent functions", function () {
		DrawChem.setContent("An interesting content", "test"); // explicitly associates content with name
		expect(DrawChem.getContent("test")).toEqual("An interesting content"); // gets explicitly named content 
	});
	
	it("should run the editor and associate the currently active 'instance' with it", function () {
		DrawChem.runEditor("test"); // creates a new 'instance' and sets it to active
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChem.setContent("An interesting content"); // already associated with 'test' 'instance'
		expect(DrawChem.getContent()).toEqual("An interesting content"); // returns content of the currently active 'instance'
	});
	
	it("should run the editor and then close it", function () {
		DrawChem.runEditor("test"); // creates a new 'instance' and sets it to active
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChem.setContent("An interesting content"); // already associated with 'test' 'instance'
		expect(DrawChem.getContent()).toEqual("An interesting content");
		DrawChem.closeEditor(); // hides modal and clears currently active 'instance'
		expect(DrawChem.showEditor()).toEqual(false);
		expect(DrawChem.getContent()).toBeUndefined(); // no active 'instance'
		expect(DrawChem.getContent("test")).toEqual("An interesting content"); // the content was saved, however
	});
	
	it("should be able to create different 'instances' of editor", function () {
		DrawChem.runEditor("test"); // creates a new 'instance' and sets it to active
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChem.setContent("An interesting content"); // already associated with 'test' 'instance'
		expect(DrawChem.getContent()).toEqual("An interesting content");
		DrawChem.closeEditor(); // hides modal and clears currently active 'instance'
		expect(DrawChem.showEditor()).toEqual(false);
		//
		expect(DrawChem.getContent()).toBeUndefined(); // no active 'instance'
		DrawChem.runEditor("test2"); // creates a new 'instance' and sets it to active
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChem.setContent("A more interesting content"); // already associated with 'test' 'instance'
		expect(DrawChem.getContent()).toEqual("A more interesting content");
		DrawChem.closeEditor(); // hides modal and clears currently active 'instance'
		expect(DrawChem.showEditor()).toEqual(false);
		//
		expect(DrawChem.getContent()).toBeUndefined(); // no active 'instance'
		expect(DrawChem.getContent("test")).toEqual("An interesting content"); // the content was saved
		expect(DrawChem.getContent("test2")).toEqual("A more interesting content"); // the content was saved
	});
	
	it("should clear the content of a specified 'instance'", function () {
		DrawChem.runEditor("test"); // creates a new 'instance' and sets it to active
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChem.setContent("An interesting content"); // already associated with 'test' 'instance'
		expect(DrawChem.getContent()).toEqual("An interesting content");
		DrawChem.closeEditor(); // hides modal and clears currently active 'instance'
		expect(DrawChem.showEditor()).toEqual(false);		
		DrawChem.clearContent("test"); // clear the previously set content
		expect(DrawChem.getContent("test")).toEqual("");
	});
	
	it("should clear the content of the currently active 'instance'", function () {
		DrawChem.runEditor("test"); // creates a new 'instance' and sets it to active
		expect(DrawChem.showEditor()).toEqual(true);
		DrawChem.setContent("An interesting content"); // already associated with 'test' 'instance'
		expect(DrawChem.getContent()).toEqual("An interesting content");
		DrawChem.clearContent();
		expect(DrawChem.getContent()).toEqual("");
	});
})