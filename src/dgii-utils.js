const { clearRNC, clearNCF, clearCarPlate, isRNC, isENCF, isNCF, isSecureCode, isCarPlate } = require('./dgii-valid.js')
const { formatNCF, formatRNC, DGIIReceiptTypes, vehiclePlateTypes, TypeCarPlate } = require('./dgii-format.js')
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const clearText = (Text = "") => {
	return Text.replace(/\s+/g, ' ').trim();
}

const RNC = Object.freeze({
	valid: isRNC,
	format: formatRNC,
	clear: clearRNC,
})

const NCF = Object.freeze({
	valid: isNCF,
	format: formatNCF,
	clear: clearNCF,
})

const ENCF = Object.freeze({
	valid: isENCF,
	format: formatNCF,
	clear: clearNCF,
})

const CarPlate = Object.freeze({
	valid: isCarPlate,
	getType: TypeCarPlate,
	clear: clearCarPlate,
})

const axiosInstance = axios.create({
	baseURL: 'https://www.dgii.gov.do/app/WebApps/ConsultasWeb2/ConsultasWeb/consultas',
	timeout: 13000,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36'
	},
	httpsAgent: agent 
});

async function getAspNetFields(url) {
  try {
		const response = await axiosInstance.get(
			url
		);

    const html = response.data;
    const $ = cheerio.load(html);
		const viewState = $("#__VIEWSTATE").val();
		const eventValidation = $("#__EVENTVALIDATION").val();
		const viewStateGenerator = 	$("#__VIEWSTATEGENERATOR").val();

		return {
				viewState,
				eventValidation,
				viewStateGenerator
		};
  } catch (error) {
    console.error(error.message);
		return {
				viewState: "",
				eventValidation: "",
				viewStateGenerator: ""
		};
  }
}


async function consultRNC(RNC = "") {
	RNC = clearRNC(RNC)

	if (!isRNC(RNC)) {
		throw new Error("El RNC o Cedula debe tener 9 o 11 digitos.");
	}

	const { viewState, eventValidation, viewStateGenerator } = await getAspNetFields("/rnc.aspx");
	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$cphMain$upBusqueda|ctl00$cphMain$btnBuscarPorRNC",
		__EVENTTARGET: "ctl00$cphMain$btnBuscarPorRNC",
		__VIEWSTATEGENERATOR: viewStateGenerator,
		__EVENTARGUMENT: "",
		__VIEWSTATE: viewState,
		__EVENTVALIDATION: eventValidation,
		ctl00$cphMain$txtRNCCedula: RNC,
		ctl00$cphMain$txtRazonSocial: "",
		ctl00$cphMain$hidActiveTab: "",
		__ASYNCPOST: true
	}
	);

	return axiosInstance.post(`/rnc.aspx`, data)
		.then(async response => {
			const html = await response.data
			const results = {};
			const $ = cheerio.load(html);

			if ($) {
				let Elements = $("tr>td:nth-child(2)", "tbody")
				Elements.each((i, elem) => {
					results.facturacion_electronica = "NO";
					results.licencias_vhm = "N/A";
					switch (i) {
						case 0: results.RNC = clearText($(elem).text()); break;
						case 1: results.nombre = clearText($(elem).text()); break;
						case 2: results.nombre_comercial = clearText($(elem).text()); break;
						case 3: results.categoria = clearText($(elem).text()); break;
						case 4: results.regimen_pagos = clearText($(elem).text()); break;
						case 5: results.estado = clearText($(elem).text()); break;
						case 6: results.actividad_economica = clearText($(elem).text()); break;
						case 7: results.administracion_local = clearText($(elem).text()); break;
						case 8: results.facturacion_electronica = clearText($(elem).text()); break;
						case 9: results.licencias_vhm = clearText($(elem).text()); break;
					}
				});
			}
			return results
		})
		.catch(error => {
		  throw error.message
		});
}

async function consultCuidadanos(RNC = "") {
	RNC = clearRNC(RNC)

	if (!isRNC(RNC)) {
		throw new Error("El RNC o Cedula debe tener 9 o 11 digitos.");
	}

	const { viewState, eventValidation, viewStateGenerator } = await getAspNetFields("/ciudadanos.aspx");
	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$cphMain$upBusqueda|ctl00$cphMain$btnBuscarCedula",
		__VIEWSTATEGENERATOR: viewStateGenerator,
		__EVENTARGUMENT: "",
		__VIEWSTATE: viewState,
		__EVENTVALIDATION: eventValidation,
		ctl00$cphMain$txtCedula: RNC,
		ctl00$cphMain$btnBuscarCedula: "Buscar",
		__ASYNCPOST: true
	});

	return axiosInstance.post(`/ciudadanos.aspx`, data)
		.then(async response => {
			const html = await response.data
			const results = {};
			const $ = cheerio.load(html);

			if ($) {
				let Elements = $("tr>td:nth-child(2)", "tbody")
				Elements.each((i, elem) => {
					switch (i) {
						case 0: results.nombre = clearText($(elem).text()); break;
						case 1: results.estado = clearText($(elem).text()); break;
						case 2: results.tipo = clearText($(elem).text()); break;
						case 3: results.RNC = clearText($(elem).text()); break;
						case 4: results.marca = clearText($(elem).text()); break;
					}
				});
			}
			return results
		})
		.catch(error => error);
}


async function _consultNCF(RNC = "", NCF = "", RNCComprador = "", CodigoSeguridad = "") {
	RNC = clearRNC(RNC)
	NCF = clearNCF(NCF)
	RNCComprador = clearRNC(RNCComprador)

	if (!isRNC(RNC)) {
		throw new Error("El RNC o Cedula debe tener 9 o 11 digitos.");
	}

	if (!isNCF(NCF) && !isENCF(NCF)) {
		throw new Error("El NCF debe tener 11 o 13 digitos.");
	}

	if (isENCF(NCF)) {

		if (!isRNC(RNCComprador)) {
			throw new Error("El RNC o Cedula del comprador debe tener 9 o 11 digitos.");
		}

		if (!isSecureCode(CodigoSeguridad)) {
			throw new Error("El Codigo de Seguridad debe tener 6 caracteres alfanumericos.");
		}

	} else {
		RNCComprador = ""
		CodigoSeguridad = ""
	}

	const { viewState, eventValidation, viewStateGenerator } = await getAspNetFields("/ncf.aspx")
	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$upMainMaster|ctl00$cphMain$btnConsultar",
		ctl00$cphMain$txtRNC: RNC,
		ctl00$cphMain$txtNCF: NCF,
		ctl00$cphMain$txtRncComprador: RNCComprador,
		ctl00$cphMain$txtCodigoSeg: CodigoSeguridad,
		__EVENTTARGET: "",
		__EVENTARGUMENT: "",
		__VIEWSTATE: viewState,
		__VIEWSTATEGENERATOR: viewStateGenerator,
		__EVENTVALIDATION: eventValidation,
		__ASYNCPOST: true,
		ctl00$cphMain$btnConsultar: "Buscar"
	});

	if (RNCComprador == "" && CodigoSeguridad == "") {
		return axiosInstance.post(`/ncf.aspx`, data)
			.then(async response => {
				const html = await response.data
				const results = {};
				const $ = cheerio.load(html);
				if ($) {
					$("td", "tbody").each((i, elem) => {
						switch (i) {
							case 0: results.RNC = clearText($(elem).text()); break;
							case 1: results.nombre = clearText($(elem).text()); break;
							case 2: results.comprobante = clearText($(elem).text()); break;
							case 3: results.NCF = clearText($(elem).text()); break;
							case 4: results.estado = clearText($(elem).text()); break;
							case 5: results.vigencia = clearText($(elem).text()); break;
						}
					});
				}
				return results
			})
			.catch(error => error);
	} else {
		return axiosInstance.post(`/ncf.aspx`, data)
			.then(async response => {
				const html = await response.data
				const results = {};
				const $ = cheerio.load(html);

				if ($) {
					$("td>span", "tbody").each((i, elem) => {
						switch (i) {
							case 0: results.RNCEmisor = clearText($(elem).text()); break;
							case 1: results.RNCComprador = clearText($(elem).text()); break;
							case 2: results.eNCF = clearText($(elem).text()); break;
							case 3: results.Codigo = clearText($(elem).text()); break;
							case 4: results.Estado = clearText($(elem).text()); break;
							case 5: results.Total = parseFloat(clearText($(elem).text())); break;
							case 6: results.Itbis = parseFloat(clearText($(elem).text())); break;
							case 7: results.Emision = clearText($(elem).text()); break;
							case 8: results.Firma = clearText($(elem).text()); break;
						}
					});

				}
				return results
			})
			.catch(error => error);
	}
}

async function consultNCF(RNC = "", NCF = "") {
	return _consultNCF(RNC, NCF)
}

async function consultENCF(RNC = "", NCF = "", RNCComprador = "", codigoSeguridad = "") {
	return _consultNCF(RNC, NCF, RNCComprador, codigoSeguridad)
}

async function consultCarPlate(RNC = "", CarPlate = "") {
	RNC = clearRNC(RNC)

	if (!isRNC(RNC)) {
		throw new Error("El RNC o Cedula debe tener 9 o 11 digitos.");
	}

	CarPlate = clearCarPlate(CarPlate)

	if (!isCarPlate(CarPlate)) {
		throw new Error("La placa de vehiculo no es valida.");
	}

	const { viewState, eventValidation, viewStateGenerator } = await getAspNetFields("/placa.aspx");

	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$upMainMaster|ctl00$cphMain$btnConsultar",
		ctl00$cphMain$txtRNC: RNC,
		ctl00$cphMain$txtPlaca: CarPlate,
		__EVENTTARGET: "",
		__EVENTARGUMENT: "",
		__VIEWSTATE: viewState,
		__VIEWSTATEGENERATOR: viewStateGenerator,
		__EVENTVALIDATION: eventValidation,
		ctl00$cphMain$btnConsultar: "Consultar",
		__ASYNCPOST: true
	});

	return axiosInstance.post(`/placa.aspx`, data)
		.then(async response => {
			const html = await response.data
			const results = {}
			const $ = cheerio.load(html);


			if ($) {
				let Elements = $("tr>td", "tbody")
				Elements.each((i, elem) => {
					switch (i) {
						case 0: results.placa = clearText($(elem).text()); break;
						case 1: results.marca = clearText($(elem).text()); break;
						case 2: results.modelo = clearText($(elem).text()); break;
						case 3: results.color = clearText($(elem).text()); break;
						case 4: results.fabricacion = clearText($(elem).text()); break;
						case 5: results.estado = clearText($(elem).text()); break;
					}
				});

				if (Elements != null && Elements.length > 0) {
					results.oposiciones = [];

					let Oposiciones = $("span", "#cphMain_gvOposiciones>tbody>tr>td")
					Oposiciones.each((i, elem) => {
						results.oposiciones.push(clearText($(elem).text()));
					});

				}
			}
			return results
		})
		.catch(error => error);
}


module.exports = { getAspNetFields, DGIIReceiptTypes, RNC, NCF, ENCF, CarPlate, isSecureCode, consultRNC, consultCuidadanos, consultNCF, consultENCF, consultCarPlate };