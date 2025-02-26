// modules/parser/parser.js
function parse(tokens) {
    let posicion = 0;
    const variables = new Map();

    function esperar(tipo) {
        if (tokens[posicion] && tokens[posicion].tipo === tipo) {
            return tokens[posicion++];
        } else {
            throw new Error(`Se esperaba ${tipo} pero se encontró ${tokens[posicion] ? tokens[posicion].tipo : 'EOF'}`);
        }
    }

    function declararVariable(nombre) {
        if (!variables.has(nombre)) {
            variables.set(nombre, false); // Inicialmente no inicializada
        }
    }

    function inicializarVariable(nombre) {
        if (variables.has(nombre)) {
            variables.set(nombre, true); // Marcar como inicializada
        } else {
            throw new Error(`Variable "${nombre}" no declarada`);
        }
    }

    function verificarVariableDeclarada(nombre) {
        if (!variables.has(nombre)) {
            throw new Error(`Variable "${nombre}" no declarada`);
        }
    }

    function verificarVariableInicializada(nombre) {
        if (!variables.get(nombre)) {
            throw new Error(`Variable "${nombre}" no inicializada`);
        }
    }

    function parsePrograma() {
        const declaraciones = [];
        while (posicion < tokens.length) {
            declaraciones.push(parseDeclaracion());
        }
        return { tipo: "Programa", cuerpo: declaraciones };
    }

    function parseDeclaracion() {
        if (tokens[posicion].tipo === "PALABRA RESERVADA" && (tokens[posicion].valor === "entero" || tokens[posicion].valor === "real")) {
            return parseDeclaracionVariable();
        } else if (tokens[posicion].tipo === "IDENTIFICADOR") {
            return parseAsignacion();
        } else if (tokens[posicion].tipo === "PALABRA RESERVADA" && tokens[posicion].valor === "si") {
            return parseDeclaracionSi();
        } else if (tokens[posicion].tipo === "PALABRA RESERVADA" && tokens[posicion].valor === "mientras") {
            return parseDeclaracionMientras();
        } else {
            throw new Error(`Token inesperado ${tokens[posicion].valor}`);
        }
    }

    function parseDeclaracionVariable() {
        const tipo = esperar("PALABRA RESERVADA").valor;
        const declaraciones = [];
        while (true) {
            const id = esperar("IDENTIFICADOR").valor;
            let inicial = null;
            declararVariable(id);
            if (tokens[posicion] && tokens[posicion].tipo === "OPERADOR" && tokens[posicion].valor === "=") {
                esperar("OPERADOR");
                inicial = parseExpresion();
                inicializarVariable(id); // Ahora está inicializada
            }
            declaraciones.push({ id, inicial });
            if (tokens[posicion] && tokens[posicion].tipo === "COMA") {
                esperar("COMA");
            } else {
                break;
            }
        }
        return { tipo: "DeclaracionVariable", tipoDato: tipo, declaraciones };
    }

    function parseAsignacion() {
        const id = esperar("IDENTIFICADOR").valor;
        verificarVariableDeclarada(id);  // Asegurarse de que la variable fue declarada antes
        esperar("OPERADOR"); // debe ser "="
        const expresion = parseExpresion();
        inicializarVariable(id);  // Ahora está inicializada
        return { tipo: "Asignacion", id, expresion };
    }

    function parseExpresion() {
        let izquierda = parseTermino();
        while (tokens[posicion] && tokens[posicion].tipo === "OPERADOR" && /^[=+\-*/<>]$/.test(tokens[posicion].valor)) {
            const operador = esperar("OPERADOR").valor;
            const derecha = parseTermino();
            izquierda = { tipo: "ExpresionAsignada", operador, izquierda, derecha };
        }
        return izquierda;
    }

    function parseTermino() {
        let izquierda = parseFactor();
        while (tokens[posicion] && tokens[posicion].tipo === "OPERADOR" && /^[*/]$/.test(tokens[posicion].valor)) {
            const operador = esperar("OPERADOR").valor;
            const derecha = parseFactor();
            izquierda = { tipo: "ExpresionAsignada", operador, izquierda, derecha };
        }
        return izquierda;
    }

    function parseFactor() {
        if (tokens[posicion].tipo === "NUMERO") {
            return { tipo: "Numero", valor: parseFloat(esperar("NUMERO").valor) };
        } else if (tokens[posicion].tipo === "IDENTIFICADOR") {
            const nombre = esperar("IDENTIFICADOR").valor;
            verificarVariableDeclarada(nombre);  // Asegurarse de que la variable esté declarada antes de usarla
            verificarVariableInicializada(nombre);  // Asegurarse de que la variable esté inicializada antes de usarla
            return { tipo: "Identificador", nombre };
        } else if (tokens[posicion].tipo === "PARENTESIS" && tokens[posicion].valor === "(") {
            esperar("PARENTESIS");
            const expresion = parseExpresion();
            esperar("PARENTESIS"); // debe ser ")"
            return expresion;
        } else {
            throw new Error(`Token inesperado ${tokens[posicion].valor}`);
        }
    }

    function parseDeclaracionSi() {
        esperar("PALABRA RESERVADA"); // "si"
        esperar("PARENTESIS"); // "("
        const prueba = parseExpresion();
        esperar("PARENTESIS"); // ")"
        const consecuencia = parseBloque();
        const alternativo = parseClausulasSino();
        return { tipo: "DeclaracionSi", prueba, consecuencia, alternativo };
    }

    function parseClausulasSino() {
        const clausulas = [];
        while (tokens[posicion] && tokens[posicion].tipo === "PALABRA RESERVADA" && (tokens[posicion].valor === "sinosi" || tokens[posicion].valor === "sino")) {
            if (tokens[posicion].valor === "sinosi") {
                esperar("PALABRA RESERVADA"); // "sinosi"
                esperar("PARENTESIS"); // "("
                const prueba = parseExpresion();
                esperar("PARENTESIS"); // ")"
                const consecuencia = parseBloque();
                clausulas.push({ tipo: "ClausulaSinoSi", prueba, consecuencia });
            } else if (tokens[posicion].valor === "sino") {
                esperar("PALABRA RESERVADA"); // "sino"
                const consecuencia = parseBloque();
                clausulas.push({ tipo: "ClausulaSino", consecuencia });
                break; // "sino" debe ser la última cláusula
            }
        }
        if (tokens[posicion] && tokens[posicion].tipo === "PALABRA RESERVADA" && tokens[posicion].valor === "finsi") {
            esperar("PALABRA RESERVADA"); // "finsi"
        } else {
            throw new Error('Se esperaba "finsi"');
        }
        return clausulas;
    }

    function parseDeclaracionMientras() {
        esperar("PALABRA RESERVADA"); // "mientras"
        esperar("PARENTESIS"); // "("
        const prueba = parseExpresion();
        esperar("PARENTESIS"); // ")"
        const cuerpo = parseBloque();
        if (tokens[posicion] && tokens[posicion].tipo === "PALABRA RESERVADA" && tokens[posicion].valor === "finmientras") {
            esperar("PALABRA RESERVADA"); // "finmientras"
        } else {
            throw new Error('Se esperaba "finmientras"');
        }
        return { tipo: "DeclaracionMientras", prueba, cuerpo };
    }

    function parseBloque() {
        const cuerpo = [];
        while (posicion < tokens.length && (tokens[posicion].tipo !== "PALABRA RESERVADA" || (tokens[posicion].valor !== "finsi" && tokens[posicion].valor !== "finmientras" && tokens[posicion].valor !== "sinosi" && tokens[posicion].valor !== "sino"))) {
            cuerpo.push(parseDeclaracion());
        }
        return { tipo: "BloqueDeclaracion", cuerpo };
    }

    return parsePrograma();
}

// Exportar la función parse
window.parse = parse;