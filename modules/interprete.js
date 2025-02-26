// modules/interprete.js
function interpretarCodigo(codigo) {
    // Remover líneas vacías y comentarios
    const lineas = codigo.split('\n').map(linea => linea.trim()).filter(linea => linea && !linea.startsWith('//'));

    const variables = {};
    let salida = '';

    lineas.forEach((linea, indice) => {
        try {
            if (linea.startsWith('cout<<')) {
                const expr = linea.slice(6).replace(';', '').trim();
                salida = evaluarExpresion(expr, variables);
            } else {
                const [izquierda, derecha] = linea.split('=');
                if (!izquierda || !derecha) {
                    throw new Error(`Línea ${indice + 1}: Asignación inválida.`);
                }
                const nombreVar = izquierda.trim();
                const expr = derecha.replace(';', '').trim();
                variables[nombreVar] = evaluarExpresion(expr, variables);
            }
        } catch (error) {
            throw new Error(`Línea ${indice + 1}: ${error.message}`);
        }
    });

    return salida;
}

function evaluarExpresion(expr, variables) {
    // Reemplazar variables por sus valores
    const exprReemplazada = expr.replace(/[a-zA-Z_]\w*/g, match => {
        if (variables[match] !== undefined) {
            return variables[match];
        } else {
            throw new Error(`Variable no inicializada: ${match}`);
        }
    });

    // Validar operadores prohibidos
    const operadoresProhibidos = ['++', '--', '==', '!=', '>', '<', '>=', '<='];
    operadoresProhibidos.forEach(op => {
        if (exprReemplazada.includes(op)) {
            throw new Error(`Operador prohibido: ${op}`);
        }
    });

    // Evaluar la expresión aritmética
    try {
        return new Function(`return ${exprReemplazada}`)();
    } catch (err) {
        throw new Error(`Expresión Inválida: ${expr}`);
    }
}

// Exportar la función interpretarCodigo
window.interpretarCodigo = interpretarCodigo; // Para poder llamarla desde el HTML