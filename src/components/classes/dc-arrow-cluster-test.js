describe("DCArrowCluster service tests", function () {
	beforeEach(module("mmAngularDrawChem"));

	var ArrowCluster;

	beforeEach(inject(function (_DCArrowCluster_) {
		ArrowCluster = _DCArrowCluster_.ArrowCluster;
	}));

	it("should create ArrowCluster object", function () {
		expect(new ArrowCluster()).toBeDefined();
	});
});
