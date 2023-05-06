
function eliminarDiacriticos(texto: string) {
	return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

export function eliminarDiacriticosEs(texto: string) {
	return texto
		.normalize('NFD')
		.replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
		.normalize();
}

export function normalizeTxtSingleLine(text: string) {
	return text
		.normalize('NFD')
		// .replace(/\r?\n|\r/g, "")
		.replace(/^\s+|\s+$|\t|\n|\r|\0|\x0B/g, '')
		.replace(/\s{2,}/g, ' ')
		// aceptar solo caracteres...
		// .replace(/[^a-zA-Z0-9ñÑ \-_]/g, '')
		.normalize();
}

export function normalizeTxtMultiLine(text: string) {
	return text
		.normalize('NFD')
		.normalize();
}

export function evalInt(string: string) {
	const testStr = string.replace(/\D/g, '');
	if (!testStr) return;
	return string.replace(/[^\d-]/g, '');
}

export function evalFloat(string: string) {
	const testStr = string.replace(/\D/g, '');
	if (!testStr) return;
	return string.replace(/[^\d\.-]/g, '');
}
