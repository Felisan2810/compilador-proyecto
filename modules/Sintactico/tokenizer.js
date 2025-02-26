// modules/parser/tokenizer.js
function tokenizar(codigo) {
    const patronesTokens = [
        { tipo: "PALABRA RESERVADA", regex: /\b(entero|real|si|sinosi|sino|mientras|finsi|finmientras)\b/ },
        { tipo: "IDENTIFICADOR", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/ },
        { tipo: "NUMERO", regex: /\b\d+(\.\d+)?\b/ },
        { tipo: "OPERADOR", regex: /[=+\-*/<>]/ },
        { tipo: "PARENTESIS", regex: /[()]/ },
        { tipo: "COMA", regex: /,/ },
        { tipo: "ESPACIO EN BLANCO", regex: /\s+/, ignorar: true }
    ];

    let posicion = 0;
    const tokens = [];
    while (posicion < codigo.length) {
        let coincidencia = null;
        for (const patron of patronesTokens) {
            coincidencia = patron.regex.exec(codigo.slice(posicion));
            if (coincidencia && coincidencia.index === 0) {
                if (!patron.ignorar) {
                    tokens.push({ tipo: patron.tipo, valor: coincidencia[0] });
                }
                posicion += coincidencia[0].length;
                break;
            }
        }
        if (!coincidencia) {
            throw new Error(`Token inesperado en la posición ${posicion}`);
        }
    }
    return tokens;
}

// Exportar la función tokenizar
window.tokenizer = tokenizar;