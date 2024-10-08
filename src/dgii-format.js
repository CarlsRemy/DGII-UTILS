/**
 * @enum {string} DGIIReceiptTypes
 */
const DGIIReceiptTypes = Object.freeze({
	"B01": "B01",
	"B02": "B02",
	"B03": "B03",
	"B04": "B04",
	"B11": "B11",
	"B12": "B12",
	"B13": "B13",
	"B14": "B14",
	"B15": "B15",
	"B16": "B16",
	"B17": "B17",
	"E31": "E31",
	"E32": "E32",
	"E33": "E33",
	"E34": "E34",
	"E41": "E41",
	"E43": "E43",
	"E44": "E44",
	"E45": "E45",
	"E46": "E46",
	"E47": "E47",
});

/**
 * @enum {string} vehiclePlateTypes
*/

const vehiclePlateTypes = Object.freeze({
	"A": { type: "Automóvil", pattern: /^(A|AA)\d{4,6}$/ },
	"B": { type: "Automóvil Interurbano Público", pattern: /^B\d{4,6}$/ },
	"C": { type: "Automóvil Turístico", pattern: /^C\d{4,6}$/ },
	"D": { type: "Autobús Público Urbano", pattern: /^D\d{4,6}$/ },
	"F": { type: "Remolque", pattern: /^F\d{4,6}$/ },
	"G": { type: "Jeep", pattern: /^G\d{4,6}$/ },
	"L": { type: "Carga", pattern: /^L\d{4,6}$/ },
	"H": { type: "Ambulancia", pattern: /^H\d{4,6}$/ },
	"I": { type: "Autobús Privado", pattern: /^I\d{4,6}$/ },
	"T": { type: "Automóvil Público Urbano", pattern: /^T\d{4,6}$/ },
	"P": { type: "Autobús Turístico", pattern: /^P\d{4,6}$/ },
	"U": { type: "Máquinas Pesadas", pattern: /^U\d{4,6}$/ },
	"J": { type: "Montacargas", pattern: /^J\d{4,6}$/ },
	"R": { type: "Autobús Público Interurbano", pattern: /^R\d{4,6}$/ },
	"S": { type: "Volteo", pattern: /^S\d{4,6}$/ },
	"M": {type: "Carro Fúnebre", pattern: /^M\d{4,6}$/ },
	"OE": { type: "Ejército Nacional", pattern: /^OE\d{4,6}$/ },
	"OF": {type: "Fuerza Aérea", pattern: /^OF\d{4,6}$/ },	
	"OM": {type: "Marina de Guerra", pattern: /^OM\d{4,6}$/ },
	"OP": {type: "Policía Nacional", pattern: /^OP\d{4,6}$/ },
	"EA": { type:"Placa Exonerada Estatal", pattern: /^EA\d{4,6}$/ },
	"EG": { type:"Placa Exonerada Estatal", pattern: /^EG\d{4,6}$/ },
	"EL": { type:"Placa Exonerada Estatal", pattern: /^EL\d{4,6}$/ },
	"EM": { type:"Placa Exonerada Estatal", pattern: /^EM\d{4,6}$/ },
	"ED": { type:"Placa Exonerada Estatal", pattern: /^ED\d{4,6}$/ },
	"EI": { type: "Placa Exonerada Estatal", pattern: /^EI\d{4,6}$/ },
	"VC": { type: "Placa Consular", pattern: /^VC\d{4,6}$/ },
	"WD": { type: "Placa Diplomática", pattern: /^WD\d{4,6}$/ },
	"OI": { type: "Placa de Organismos Internacionales", pattern: /^OI\d{4,6}$/ },
	"EX": { type: "Placa Exonerada", pattern: /^EX\d{4,6}$/ },
	"YX": { type: "Placa Exonerada", pattern: /^YX\d{4,6}$/ },
	"Z": { type: "Placa Exonerada", pattern: /^Z\d{4,6}$/ },
	"NZ": { type: "Placa Exonerada", pattern: /^NZ\d{4,6}$/ },
	"DD": { type: "Placa de Dealer", pattern: /^DD\d{4,6}$/ },
	"PP": { type: "Placa Provisional", pattern: /^PP\d{4,6}$/ },
	"K": { type: "Placa de Motocicleta", pattern: /^K\d{4,6}$/ }
})


/**
 * @param {string} RNC
 * @returns {string} RNC
*/
function formatRNC(RNC = "") {
	RNC = RNC.replace(/\D/g, '');

	if (RNC.length !== 9 && RNC.length !== 11) {
		throw new Error("El RNC o Cedula debe tener 9 o 11 digitos.");
	}

	if (RNC.length === 11) {
		return RNC.replace(/(\d{3})(\d{7})(\d{1})/, '$1-$2-$3');
	}
	return RNC.replace(/(\d{3})(\d{5})(\d{1})/, '$1-$2-$3');
}

/**
 * @param {Enum} DGIIReceipt
 * @param {string} Number
 * @returns {string} NCF
*/
function formatNCF(DGIIReceipt, Number = "") {
	if (!Object.keys(DGIIReceiptTypes).includes(DGIIReceipt)) {
		throw new Error("El DGIIReceipt debe ser como uno de los siguientes: B01, B02, E31, E32, E33.");
	}

	const length = (DGIIReceipt.startsWith("B")) ? 8 : 10;
	return DGIIReceipt + Number.padStart(length, '0');
}

function TypeCarPlate(CarPlate = "") {
	for (let Plate in vehiclePlateTypes) {
		if (vehiclePlateTypes[Plate].pattern.test(CarPlate)) {
			return vehiclePlateTypes[Plate].type;
		}
	}
	return "Desconocido";
}

module.exports = { DGIIReceiptTypes, vehiclePlateTypes, formatNCF, formatRNC, TypeCarPlate };