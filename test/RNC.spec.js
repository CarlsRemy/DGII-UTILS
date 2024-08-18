// test.ts
const { expect, assert } = require("chai");
const { describe, it } = require("mocha");
const { consultRNC, RNC } = require("../src/dgii-utils");

describe('RNC',()=>{
	it("format para RNC '403012656'", ()=>{
		const result = RNC.format("403012656")
		assert.equal(result, "403-01265-6");
	})

	it("format para Cedula '016 0000755 1'", ()=>{
		const result = RNC.format("016 0000755 1")
		assert.equal(result, "016-0000755-1");
	})

	it("valid para RNC '403012656'", ()=>{
		const result = RNC.valid("403012656")
		assert.equal(result, true);
	})

	it("valid para Cedula '016 0000755 1'", ()=>{
		const result = RNC.valid("016 0000755 1")
		assert.equal(result, true);
	})

	it("clear", ()=>{
		const result = RNC.clear("403-01265-6")
		assert.equal(result, "403012656");
	})

})

describe('consultRNC', () => {
	it(`debería devolver Object para el RNC "403-01265-6"`, async () => {
		await consultRNC("403012656").then((response) => {
			const data = {
				RNC: '403-01265-6',
				nombre: 'UNIVERSIDAD AGROFORESTAL FERNANDO ARTURO DE MERINO',
				nombre_comercial: 'UAFAM',
				categoria: '',
				regimen_pagos: 'NORMAL',
				estado: 'ACTIVO',
				facturacion_electronica: 'NO',
				licencias_vhm: 'N/A',
				actividad_economica: 'ENSEÑANZA UNIVERSITARIA EXCEPTO FORMACIÓN DE POSGRADO',
				administracion_local: 'ADM LOCAL LA VEGA'
			};

			expect(response).to.deep.equal(data);
		});
	})

	it(`debería devolver Object para la Cedula "016-0000755-1"`, async () => {
		await consultRNC("016-0000755-1").then((response) => {
			const data = {
				RNC: '016-0000755-1',
				nombre: 'SALOMON RAMIREZ DE LOS SANTOS',
				nombre_comercial: '',
				categoria: '',
				regimen_pagos: 'RST',
				estado: 'ACTIVO',
				facturacion_electronica: 'NO',
				licencias_vhm: 'N/A',
				actividad_economica: 'SERVICIOS RELACIONADOS CON LA SALUD HUMANA N.C.P.',
				administracion_local: 'ADM LOCAL LOS MINA'
			};

			expect(response).to.deep.equal(data);
		});
	})

	it(`debería devolver Object para la Cedula "00800185340"`, async () => {
		await consultRNC("00800185340").then((response) => {
			const data = {
				RNC: '008-0018534-0',
				nombre: 'SALOME DE LOS SANTOS FANI DE ROEDAN',
				nombre_comercial: '',
				categoria: '',
				regimen_pagos: 'NORMAL',
				estado: 'ACTIVO',
				facturacion_electronica: 'NO',
				licencias_vhm: 'N/A',
				actividad_economica: 'PREPARACIÓN Y VENTA DE COMIDAS PARA LLEVAR N.C.P. (INCL. CASAS DE COMIDAS, ROTISERÍAS Y DEMÁS LUGARES QUE NO POSEAN ESPACIO PARA E',
				administracion_local: 'ADM LOCAL VILLA MELLA'
			};

			expect(response).to.deep.equal(data);
		});
	})

	it(`debería devolver Object para LA Cedula "008-0021065-0"`, async () => {
		await consultRNC("00800210650").then((response) => {
		 const data = {
				RNC: '008-0021065-0',
				nombre: 'SALOME VENTURA ARIAS',
				nombre_comercial: '',
				categoria: '',
				regimen_pagos: 'NORMAL',
				estado: 'SUSPENDIDO',
				facturacion_electronica: 'NO',
				licencias_vhm: 'N/A',
				actividad_economica: 'SERVICIO DE TRANSPORTE AUTOMOTOR URBANO REGULAR DE PASAJEROS (INCL. LOS SERVICIOS DE TRASP. REGULAR DE MENOS DE 50 KM.)',
				administracion_local: 'ADM LOCAL VILLA MELLA'
			};

			expect(response).to.deep.equal(data);
		});
	})

	it(`debería devolver Object para el RNC "131-56873-4"`, async () => {
		await consultRNC("131568734").then((response) => {
			const data = {
				RNC: '131-56873-4',
				nombre: 'SALOC BENT EIRL',
				nombre_comercial: 'SALOC BENT',
				categoria: '',
				regimen_pagos: 'NORMAL',
				estado: 'DADO DE BAJA',
				facturacion_electronica: 'NO',
				licencias_vhm: 'N/A',
				actividad_economica: 'SERVICIOS DE ORGANIZACIÓN DE EVENTOS',
				administracion_local: 'ADM LOCAL PUERTO PLATA'
			};

			expect(response).to.deep.equal(data);
		});
	})

	it(`debería devolver Object para la Cedula "001-0446113-2"`, async () => {
		await consultRNC("001-0446113-2").then((response) => {
			const data = {
				RNC: '001-0446113-2',
				nombre: 'SALOMON MORETA FELIZ FELIZ',
				nombre_comercial: '',
				categoria: '',
				regimen_pagos: 'N/D',
				estado: 'SUSPENDIDO',
				facturacion_electronica: 'NO',
				licencias_vhm: 'N/A',
				actividad_economica: 'SERVICIOS DE SEGUROS DE VIDA (INCL. LOS SEGUROS DE VIDA, RETIRO Y SEPELIO)',
				administracion_local: 'ADM LOCAL ZONA ORIENTAL'
			};

			expect(response).to.deep.equal(data);
		});
	})

	it(`debería devolver Object para el RNC "104-59550-5"`, async () => {
		await consultRNC("104- 59550-5").then((response) => {
			const data = {
				RNC: '104-59550-5',
				nombre: 'SALOMON CORTORREAL C POR A',
				nombre_comercial: 'SALOMON CORTORREAL',
				categoria: '',
				regimen_pagos: 'N/D',
				estado: 'DADO DE BAJA',
				facturacion_electronica: 'NO',
				licencias_vhm: 'N/A',
				actividad_economica: 'SERVICIOS INMOBILIARIOS REALIZADOS A CAMBIO DE UNA RETRIB. O POR CONTRATA (INCL. COMPRA, VENTA, ALQUILER, REMATE, TASACIÓN, ADM DE',
				administracion_local: 'ADM LOCAL SAN FCO MACORIS'
			};

			expect(response).to.deep.equal(data);
		});
	})
});