//modules/sintactico.js
let tokens = []; // Lista de tokens generados por el scanner
let indiceTokenActual = 0;

function consumirToken() {
    if (indiceTokenActual < tokens.length) {
        return tokens[indiceTokenActual++];
    } else {
        return null; // Fin de la entrada
    }
}

function mirarTokenSiguiente() { //Útil para "lookahead"
    if (indiceTokenActual < tokens.length) {
        return tokens[indiceTokenActual];
    }
    return null;
}

const funcionesTransicionSintactico = {
    estado_inicial: (token) => {
        if (token.tipo === "INT" || token.tipo === "FLOAT") {
            return "estado_declaracion";
        } else if (token.tipo === "COUT") {
            return "estado_cout";
        }
        return null;
    },
    estado_declaracion: (token) => {
        if (token.tipo === "IDENTIFICADOR") {
            return "estado_espera_asignacion";
        }
        return null;
    },
    estado_espera_asignacion: (token) => {
        if (token.tipo === "ASIGNACION") {
            return "estado_espera_valor";
        } else if (token.tipo === "PUNTO_Y_COMA") {
            return "estado_final";
        }
        return null;
    },
    estado_espera_valor: (token) => {
        if (token.tipo === "NUMERO") {
            return "estado_espera_punto_y_coma";
        }
        return null;
    },
    estado_espera_punto_y_coma: (token) => {
        if (token.tipo === "PUNTO_Y_COMA") {
            return "estado_final";
        }
        return null;
    },
    estado_cout: (token) => {
        if (token.tipo === "MENORMENOR") {
            return "estado_espera_expresion";
        }
        return null;
    },
    estado_espera_expresion: (token) => {
        if (token.tipo === "IDENTIFICADOR" || token.tipo === "NUMERO") {
            return "estado_espera_punto_y_coma";
        }
        return null;
    }
};

function analizadorSintactico(tokens) {
    let estado = "estado_inicial";
    let errores = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const siguienteEstado = funcionesTransicionSintactico[estado](token);

        if (!siguienteEstado) {
            errores.push(`Error sintáctico: token inesperado ${token.valor} en estado ${estado}`);
            break;
        }

        estado = siguienteEstado;
        if (estado === "estado_final") {
            estado = "estado_inicial";
        }
    }

    return errores.length === 0;
}

module.exports = { analizadorSintactico };

//compilador.js

function programa() {
    let sentencias = [];
    while (mirarTokenSiguiente() !== null) {
        let sentencia = analizarSentencia();
        if (sentencia) {
            sentencias.push(sentencia);
        } else {
            // Error de sintaxis
            console.error("Error de sintaxis: se esperaba una sentencia.");
            return null;
        }
    }
    return sentencias; // Retornar la lista de sentencias
}

function analizarSentencia() {
    let token = mirarTokenSiguiente();
    if (!token) return null;

    switch (token.tipo) {
        case "INT": //Asumiendo que el scanner tokeniza "int" como INT
        case "FLOAT": //Asumiendo que el scanner tokeniza "float" como FLOAT
            return analizarDeclaracion();
        case "IDENTIFICADOR":
            return analizarAsignacion();
        case "COUT":
            return analizarCout();
        default:
            return null; // No es una sentencia válida
    }
}

function analizarDeclaracion() {
    let tipoToken = consumirToken(); // "int" o "float"
    let idToken = consumirToken(); // El identificador
    if (!idToken || idToken.tipo !== "IDENTIFICADOR") {
        console.error("Error de sintaxis: Se esperaba un identificador después del tipo.");
        return null;
    }
    let puntoYComaToken = consumirToken();
    if (!puntoYComaToken || puntoYComaToken.tipo !== "PUNTO_Y_COMA") {
        console.error("Error de sintaxis: Se esperaba ';'");
        return null;
    }

    return {
        tipo: "declaracion",
        tipoDato: tipoToken.valor,
        nombreVariable: idToken.valor
    };
}

function analizarAsignacion() {
    let idToken = consumirToken(); // El identificador
    if (!idToken || idToken.tipo !== "IDENTIFICADOR") {
        console.error("Error de sintaxis: Se esperaba un identificador.");
        return null;
    }

    let asignacionToken = consumirToken();
    if (!asignacionToken || asignacionToken.tipo !== "ASIGNACION") {
        console.error("Error de sintaxis: Se esperaba '='");
        return null;
    }

    let expresion = analizarExpresion();
    if (!expresion) {
        console.error("Error de sintaxis: Se esperaba una expresion después del '='.");
        return null;
    }

    let puntoYComaToken = consumirToken();
    if (!puntoYComaToken || puntoYComaToken.tipo !== "PUNTO_Y_COMA") {
        console.error("Error de sintaxis: Se esperaba ';'");
        return null;
    }
    return {
        tipo: "asignacion",
        nombreVariable: idToken.valor,
        expresion: expresion
    };
}

function analizarCout() {
    let coutToken = consumirToken(); // "cout"
    if (!coutToken || coutToken.tipo !== "COUT") {
        console.error("Error de sintaxis: Se esperaba 'cout'.");
        return null;
    }

    let menorMenorToken = consumirToken(); // "<<"
    if (!menorMenorToken || menorMenorToken.tipo !== "MENORMENOR") { //Suponiendo que el scanner retorna MENORMENOR para "<<"
        console.error("Error de sintaxis: Se esperaba '<<' despues de 'cout'.");
        return null;
    }

    let expresion = analizarExpresion();
    if (!expresion) {
        console.error("Error de sintaxis: Se esperaba una expresion después del '<<'.");
        return null;
    }

    let puntoYComaToken = consumirToken();
    if (!puntoYComaToken || puntoYComaToken.tipo !== "PUNTO_Y_COMA") {
        console.error("Error de sintaxis: Se esperaba ';'");
        return null;
    }
    return {
        tipo: "cout",
        expresion: expresion
    };
}

function analizarExpresion() {
    let terminoIzquierdo = analizarTermino();
    if (!terminoIzquierdo) return null;

    while (mirarTokenSiguiente() && (mirarTokenSiguiente().tipo === "OPERADOR" && (mirarTokenSiguiente().valor === "+" || mirarTokenSiguiente().valor === "-"))) {
        let operadorToken = consumirToken(); // "+" o "-"
        let terminoDerecho = analizarTermino();
        if (!terminoDerecho) {
            console.error("Error de sintaxis: Se esperaba un término después del operador.");
            return null;
        }
        terminoIzquierdo = {
            tipo: "operacion",
            operador: operadorToken.valor,
            operandoIzquierdo: terminoIzquierdo,
            operandoDerecho: terminoDerecho
        };
    }

    return terminoIzquierdo;
}

function analizarTermino() {
    let factorIzquierdo = analizarFactor();
    if (!factorIzquierdo) return null;

    while (mirarTokenSiguiente() && (mirarTokenSiguiente().tipo === "OPERADOR" && (mirarTokenSiguiente().valor === "*" || mirarTokenSiguiente().valor === "/"))) {
        let operadorToken = consumirToken(); // "*" o "/"
        let factorDerecho = analizarFactor();
        if (!factorDerecho) {
            console.error("Error de sintaxis: Se esperaba un factor después del operador.");
            return null;
        }
        factorIzquierdo = {
            tipo: "operacion",
            operador: operadorToken.valor,
            operandoIzquierdo: factorIzquierdo,
            operandoDerecho: factorDerecho
        };
    }

    return factorIzquierdo;
}

function analizarFactor() {
    let token = consumirToken();
    if (!token) return null;

    switch (token.tipo) {
        case "IDENTIFICADOR":
            return {
                tipo: "variable",
                nombre: token.valor
            };
        case "NUMERO":
            return {
                tipo: "numero",
                valor: parseInt(token.valor)
            };
        case "PARENTESIS_ABIERTO":
            let expresion = analizarExpresion();
            if (!expresion) return null;
            let parentesisCerrado = consumirToken();
            if (!parentesisCerrado || parentesisCerrado.tipo !== "PARENTESIS_CERRADO") {
                console.error("Error de sintaxis: Se esperaba ')'");
                return null;
            }
            return expresion;
        default:
            console.error(`Error de sintaxis: Se esperaba un factor, se encontró "${token.valor}"`);
            return null;
    }
}

function analizarSintaxis() {
    let codigo = document.getElementById('codigoEntradaSintactico').value;
    tokens = scanner(codigo); // Llama a la función scanner
    indiceTokenActual = 0; // Reinicializa el índice
    let arbolSintactico = programa(); // Llama al analizador sintáctico
    document.getElementById('resultadoSintaxis').innerText = JSON.stringify(arbolSintactico, null, 2);
}