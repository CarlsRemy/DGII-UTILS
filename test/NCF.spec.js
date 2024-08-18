// test.ts
const { expect, assert } = require("chai");
const { describe, it } = require("mocha");
const { DGIIReceiptTypes, NCF, ENCF, consultNCF, consultENCF } = require("../src/dgii-utils");

describe('NCF', () => {
	it("format para NCF 'B0100000258'", () => {
		const result = NCF.format(DGIIReceiptTypes.B01, "258")
		assert.equal(result, "B0100000258");
	})

	it("format para NCF 'E320000000001'", () => {
		const result = NCF.format("E32", "1")
		assert.equal(result, "E320000000001");
	})

	it("valid para NCF 'B0100000258'", () => {
		const result = NCF.valid("B0100000258")
		assert.equal(result, true);
	})

	it("valid para NCF 'E320000000001'", () => {
		const result = NCF.valid("E320000000001")
		assert.equal(result, false);
	})

	it("valid para ENCF 'E320000000001'", () => {
		const result = ENCF.valid("E320000000001")
		assert.equal(result, true);
	})

	it("clear", () => {
		const result = NCF.clear("E32000 GFD 0000001")
		assert.equal(result, "E320000000001");
	})

})

describe('consultNCF', () => {
	it(`debería devolver Object para el NCF "B0100000258"`, async () => {
		await consultNCF("403012656","B0100000258").then((response) => {
			const data = {
				RNC: '403012656',
				nombre: 'UNIVERSIDAD AGROFORESTAL FERNANDO ARTURO DE MERINO',
				comprobante: 'FACTURA DE CRÉDITO FISCAL',
				NCF: 'B0100000258',
				estado: 'VIGENTE',
				vigencia: '31/12/2025'
			};

			expect(response).to.deep.equal(data);
		});
	})
});