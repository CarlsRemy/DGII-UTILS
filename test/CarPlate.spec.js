// test.ts
const { expect, assert } = require("chai");
const { describe, it } = require("mocha");
const { CarPlate,consultCarPlate } = require("../src/dgii-utils");


describe('CarPlate', () => {
	it("valid para Placa 'A123456'", ()=>{
		const result = CarPlate.valid("A123456")
		assert.equal(result, true);
	})


	it("getType para Placa 'A123456'", ()=>{
		const result = CarPlate.getType("A123456")
		assert.equal(result, "Automóvil");
	})
})