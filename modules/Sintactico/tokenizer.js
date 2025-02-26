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
        let tokenEncontrado = false;
        
        for (const patron of patronesTokens) {
            coincidencia = patron.regex.exec(codigo.slice(posicion));
            if (coincidencia && coincidencia.index === 0) {
                if (!patron.ignorar) {
                    tokens.push({ tipo: patron.tipo, valor: coincidencia[0] });
                }
                posicion += coincidencia[0].length;
                tokenEncontrado = true;
                break;
            }
        }

        if (!tokenEncontrado) {
            // En lugar de lanzar un error, creamos un token de tipo "NO_RECONOCIDO"
            const caracterNoReconocido = codigo[posicion];
            tokens.push({ 
                tipo: "NO_RECONOCIDO", 
                valor: caracterNoReconocido,
                posicion: posicion 
            });
            console.warn(`Advertencia: Caracter no reconocido '${caracterNoReconocido}' en la posición ${posicion}`);
            posicion++;
        }
    }
    
    // Verificar si hay tokens no reconocidos
    const tokensNoReconocidos = tokens.filter(t => t.tipo === "NO_RECONOCIDO");
    if (tokensNoReconocidos.length > 0) {
        const errores = tokensNoReconocidos.map(t => 
            `'${t.valor}' en la posición ${t.posicion}`
        ).join(', ');
        throw new Error(`Se encontraron caracteres no reconocidos: ${errores}`);
    }

    return tokens;
}

// Exportar la función tokenizar
window.tokenizer = tokenizar;