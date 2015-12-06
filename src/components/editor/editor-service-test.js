describe("Editor service tests", function () {
	beforeEach(module("mmAngularDrawChem"));
	
	var DrawChemEditor;
	
	beforeEach(inject(function (_DrawChemEditor_) {
		DrawChemEditor = _DrawChemEditor_;
	}));
	
	it("should have a showEditor function", function () {
		expect(DrawChemEditor.showEditor()).toEqual(false); // modal hidden at the beginning
	});
	
	it("should have a runEditor function", function () {		
		DrawChemEditor.runEditor("test");
		expect(DrawChemEditor.showEditor()).toEqual(true); // shows modal
	});
	
	it("should have a getContent and setContent functions", function () {
		DrawChemEditor.setContent("An interesting content", "test"); // explicitly associates content with name
		expect(DrawChemEditor.getContent("test")()).toEqual("An interesting content"); // gets explicitly named content 
	});
	
	it("should run the editor and associate the currently active 'instance' with it", function () {
		DrawChemEditor.runEditor("test"); // creates a new 'instance' and sets it to active
		expect(DrawChemEditor.showEditor()).toEqual(true);
		DrawChemEditor.setContent("An interesting content"); // already associated with 'test' 'instance'
		expect(DrawChemEditor.getContent()()).toEqual("An interesting content"); // returns content of the currently active 'instance'
	});
	
	it("should run the editor and then close it", function () {
		DrawChemEditor.runEditor("test"); // creates a new 'instance' and sets it to active
		expect(DrawChemEditor.showEditor()).toEqual(true);
		DrawChemEditor.setContent("An interesting content"); // already associated with 'test' 'instance'
		expect(DrawChemEditor.getContent()()).toEqual("An interesting content");
		DrawChemEditor.closeEditor(); // hides modal and clears currently active 'instance'
		expect(DrawChemEditor.showEditor()).toEqual(false);
		expect(DrawChemEditor.getContent()()).toBeUndefined(); // no active 'instance'
		expect(DrawChemEditor.getContent("test")()).toEqual("An interesting content"); // the content was saved, however
	});
})