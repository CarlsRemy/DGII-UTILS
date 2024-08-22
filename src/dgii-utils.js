const { clearRNC, clearNCF, clearCarPlate, isRNC, isENCF, isNCF, isSecureCode, isCarPlate } = require('./dgii-valid.js')
const { formatNCF, formatRNC, DGIIReceiptTypes, vehiclePlateTypes, TypeCarPlate } = require('./dgii-format.js')
const axios = require('axios');
const cheerio = require('cheerio');

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
	}
});

async function consultRNC(RNC = "") {
	RNC = clearRNC(RNC)

	if (!isRNC(RNC)) {
		throw new Error("El RNC o Cedula debe tener 9 o 11 digitos.");
	}

	const viewState = "cmJAurOULC9dG0bI8Oz0bAXSeuLRRkRr3zXxlLme0a01Xjet+nK7/2lHxlCV2b1fQW5KW2TzKWEEaRM8lXaTIvsB7P8P0sRWzojCm51iaZRNniwXmZU+/MhDuIt/ilnU7hbrkFQr+roUuVHtZyZA2pLsTKC256NftxcEto9TtS4DQ9noKFP66JeXt9LaGc3R4YcWlA3RedIetRLi5Jut4PnIp684jXn61DgpUzkm/dTJuWIUFe5fcApgy+l0dWPEd3TBuyJxXYMzH+7ilkzTGQif5e+LQmh9r2Rt1xzw30UL2kLlIhrd1Q0U3/GG2CjrJyy/ei03tCj9CZ1oK5BCaoW/JHS0/c4Smow6FOC9or15QJChQChXFOmvX9fpBZg91bVVEA=="
	const eventValidation = "CjLylaRlNSCrMI4OAlCzjSprgPSns7lo+1vND45LdQYi/ZQnHhGgHT2F4mfsEnqMFxfWMxnlyLFr3aSE6UXIr4u7kkouBQAtbsCWjO1SsnR/znmBtVODFxHV1pu/MAoBuv/rpJjYGY8v+yNfGdoTAozVlWr0UIHZ0ygM70NByQaLTCuWA90ftJbHpSY1rll2DdASHB8h9P/C8bzW5/3rHwdGYuE2cWboLwz02A2aBj8Myxe+dGWc1TaDDNf53JMHHFkqjq/ABbr+qH5PSvIlVxUJD1Y="

	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$cphMain$upBusqueda|ctl00$cphMain$btnBuscarPorRNC",
		__EVENTTARGET: "ctl00$cphMain$btnBuscarPorRNC",
		__VIEWSTATEGENERATOR: "4F4BAA71",
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
		.catch(error => error);
}

async function consultCuidadanos(RNC = "") {
	RNC = clearRNC(RNC)

	if (!isRNC(RNC)) {
		throw new Error("El RNC o Cedula debe tener 9 o 11 digitos.");
	}

	const viewState = "INBOPhFTWza2+0135J7r2u2PE8yqzRvCc2euJq0jXM/nibpkcKdcGTsgVFInaRQYG3q623lxgmNJTc8Zenqd732featAv+6xaGECzv/rSAd1NL8uHNkGlj+ynuIcXHqk9ghizcuFWZ5hnf5e7pkSAfduinDwt2443M4GDdlCMMb+RHBuYdYNsr3sZ4ZR8ioz9jRG5uTv7z4aAuaQK7GBdYL20TOsFvr3xu5cOw2/UbVL1RDMduAfMFGJOE9eTw+2NG4yOIVplaH7wVsNG2UyiUuPZfKh8gUGItiI18PMZ4pgUj2tsLcnei02FjVTnNlkUVi1rpeaAvVKCLtj6o5VvKAWYANdOYwIhuGNUJ/24MWIDRC7zKFvn2Ysg5Pt0FF23Eepe4HPycH2PXUgWzSwW8mVesU="
	const eventValidation = "BY9Sp0yI3eq0nrdkX/evlB6WRkFN4c0BNzNx7WxZsOPXY47RWUV3t6ZzeTJJt3iMSXAqTavMMWTWQ8+Gm9TyhCi9iWi7QhNNS7K6++85tFpB3yazSUA2GJRw8ElHUHDVu/bddheieCMyH+sRKoSy4A8tzCWaaaIm0corZndU0xlLDlMN"

	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$cphMain$upBusqueda|ctl00$cphMain$btnBuscarCedula",
		__VIEWSTATEGENERATOR: "C8A53969",
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

	const viewState = "pxnVanPQem/C/Zqg4vmdhAuTkdIPB8KP+q9AJ6Us4Oq0Mr1cJzPrCAuAE9G9c3hqm1kwACtIqN7ew5o5ImKFH4reFIvuBM23dZqMj/CxwktO+H2Td/f2LXmb6zYoIkuY7edLaUlsse9DDJZCstX4eNrKq0DmWQAjvrJcmz+K3hprNCtofctCr/C+tCHSoe5blSGl2E+1gcUqKdn4pKOEYuHUidFPfcX9k2UQWFJMDGnf2iTy4/rRnGgbWno4aNNfOkJx4N+JFTRLbp6oq/6yOujWheKYOZbvJ9usT5YedgeZZWsXP14ZEwaK92EIvtZZRmbwcsp4/+IfEABFEOtxgXEigg/nkHtxZ2v7z9mCc53NYklN+g1XrSKRdWdwzhpzgdZ0VSNSpekpr4ZEFUzivrA1kAIVkQYnesadrGsy4WMslqCSoZeUl8nU8dd0WtbxOTzE4E/nlJMk0TFDLTSGWospDG2GSjbTOkTyHrIv1t63ZyBZVqWJd5JS0W0VBGB+J6RNMf+VqKaYqYncsWLb4ehEka0=";
	const eventValidation = "w/vZnN4oakS1pbjmnlg6591RbWD3KHfEhCQHpjSAkrGa4R7+PQpfrikWM6vTMMm2KfCHSkIgct85BeyToMc7nvrq9kWAz1g47ZxqmYreUTvIVIp/x7Txq+aFEQffUyi6AjdU6Atza81kzZ4oEzRFyy6Qk4DdXUbMTaeUIay+1eyfFF3BmYRV4zpmFnE2/Iki0dHMVFKapjzmJKB5+AxVymP8P+UGIVjEdTtPFZaBqwCx2qan";

	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$upMainMaster|ctl00$cphMain$btnConsultar",
		ctl00$cphMain$txtRNC: RNC,
		ctl00$cphMain$txtNCF: NCF,
		ctl00$cphMain$txtRncComprador: RNCComprador,
		ctl00$cphMain$txtCodigoSeg: CodigoSeguridad,
		__EVENTTARGET: "",
		__EVENTARGUMENT: "",
		__VIEWSTATE: viewState,
		__VIEWSTATEGENERATOR: "43758EFE",
		__EVENTVALIDATION: eventValidation,
		__ASYNCPOST: true,
		ctl00$cphMain$btnConsultar: "Buscar"
	});
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

	const viewState = "U+HFsdofOzsyWH4HLkslQ7aOjxFpFmXKSFruNOClbmUXUVfYSn+CzaFOn90eitGPIsdY42DFfd11oKkKsqclyGAim8Qt6zcP1MSligQmscKDJD4V0PaVEhE6szrE93geATHItk1X5aBu/wVchZeZjtiGph6iPJ0uSys4nAOYT/XE0zOdhcdZHoSKboI1kkpNuyr2Qrhu2Tzy9eg443+pjrAlurv8AMA+xScUXpaCuY8Z96LqLSPDx8oKt4G2izr2BiahYHWedLIoDQBF5DFmx8wjPDDqZWB7Xr+DYw+6L6R5yJ/99RL+n2atUKIJ8sJSvClXUSwNeEshsEOQdrWmquycq8sYrth541io+HXCnXbZHYCM+sLSDzVcx89xVdjrYvsm8ICpyqibzofimBC+8Cjj0EBIRWufczUl4aP3pDYy1bZGYVXlaz3jFgVoCHNNIsVFLPEuav0S43t7UkGZTEfl5UJDb1fAWH+K9PhZ/N+nCvbZJ2pwBP3SgyqHpirXBYUHVgF3+vBDccOTTN6aEcITby1PLqwKY3HWQs9dUNOcVXCcFFXQC5CCKVePQVSfLk6PShowUpHWfsKf95Ee2nGOg40GNe/yzRgFCNyw2eKj5xGxrM3N5anGxDRlDS78J7TmdFeyq3zP1I05Eab742GFh41JjPoV7Bt47KbR8Y0J+9foYGzi10wwjIpFyvY2onC7qUSa5ZCMi6ycxwztg0xMlb/OX+f4IHlFcZiM8+NgUW5+MI5UJiSKzx6dMU1BDY5i12RlI5bAKXSH7A610Kf1fl4MQ5wl0Q4XkDSWHrPK4E7+fWyPqRxvvTWTKTwFQ0PoQzdKp7noK2xDnuI3igWdGZZFFWY3kEN3Kx1wWwIgzcNvSUIAutbWxrGDVvYo+uN0reypfYm2FMhA+nlvF8JNONI8ow30KO6SFldGPXphm3r308RUYI44mCrjNoP33YBCDFfghSS2dChJvTX+KL5gVwiCtu7JFq3wkJLyq2dfrOQAgSSB0vIQtXL3r0v5yAIpJvItqwFdHyOGiWRlyXsGPJAgXJMbN0A5iZub+c/zzJKkLIQUPYpoVrm3YcHITFt29KTVIOY/Fn4xAwP1dOeu/cVuiK70SVz7PZN7Uvxo6ITi53F4vgOsbmy9C/o81Y/cG19Tb0f4eD35ZlrCuhjH0PCpmaBI/ClG2TPbEZeAZs4L+ENRMgfHMhQ5O1woB+NrKRuuHpm95Vv8HDs4gNDwvP2rUgmimnW75xgzBEVxmOIjgz5sU/iuQKUF0AfHKzQrg6UcRU7Snhcvaa/pSGGc/IbGFPafPApM52PZnpU1IxZ+"
	const eventValidation = "bTFEsYrDtu8R6Hl+RGlHYeSAVyBNCxPOIg2YLHxtfB1p8dpCrzXWIyW9eKXTxe4Q2vXXB71ZRnuoN0MIlAdXDlRuziccKqqDpVJDY+e44EllGeSxmmECOvOoO5mtqyB2Vh2cFwUiH60eVOIyKkfPRASsFD22vL1ddegG7ePl8G2c4Y2xrufK8o0bidD4KwGTZ9a1Iw=="

	const data = new URLSearchParams({
		ctl00$smMain: "ctl00$upMainMaster|ctl00$cphMain$btnConsultar",
		ctl00$cphMain$txtRNC: RNC,
		ctl00$cphMain$txtPlaca: CarPlate,
		__EVENTTARGET: "",
		__EVENTARGUMENT: "",
		__VIEWSTATE: viewState,
		__VIEWSTATEGENERATOR: "D99DA1C5",

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


module.exports = { DGIIReceiptTypes, RNC, NCF, ENCF, CarPlate, isSecureCode, consultRNC, consultCuidadanos, consultNCF, consultENCF, consultCarPlate };