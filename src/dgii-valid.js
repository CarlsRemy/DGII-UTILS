/**
 * @param {string} RNC
 * @returns {string} RNC 
*/
function clearRNC (RNC = "") {
	return RNC.replace(/\D/g,'');
}

/**
 * @param {string} NCF
 * @returns {string} NCF 
*/
function clearNCF (NCF = "") {
	return NCF.replace(/[^BE0-9]/g, '');
}

/**
 * @param {string} RNC
 * @returns {boolean} isRNC 
*/
function isRNC(Rnc=""){
	Rnc = clearRNC(Rnc);
	const rncRegex = /^[0-9]{9,11}$/;
	return rncRegex.test(Rnc);
}

/**
 * @param {string} ENCF
 * @returns {boolean} isENCF
*/
function isENCF(ENCF = "") {
	ENCF = clearNCF(ENCF);
	const ncfRegex = /^E(?:3[1-4]{1}|41|4[3-7]{1})[0-9]{10}$/;
	return ncfRegex.test(ENCF);
}
/**
 * @param {string} NCF
 * @returns {boolean} isNCF
*/
function isNCF(NCF = "") {
	NCF = clearNCF(NCF);
	const ncfRegex = /^B(?:0[1-4]{1}|1[1-7]{1})[0-9]{8}$/;
	return ncfRegex.test(NCF);
}

function isCarPlate(Code=""){
	const regexPlaca = /^(A|AA|B|C|D|F|G|L|H|I|T|P|U|J|R|S|M|OE|OF|OM|OP|EA|EG|EL|EM|ED|EI|VC|WD|OI|EX|YX|Z|NZ|DD|PP|K)\d{4,6}$/;
	return regexPlaca.test(Code);
}



function isSecureCode(Code=""){
	const secureCodeRegex = /^[a-zA-Z0-9]{6}$/;
	return secureCodeRegex.test(Code);
}

exports.clearRNC = clearRNC;
exports.clearNCF = clearNCF;
exports.isRNC = isRNC;
exports.isENCF = isENCF;
exports.isNCF = isNCF
module.exports = { clearRNC, clearNCF, isRNC , isENCF, isNCF, isCarPlate, isSecureCode};