// modules/intermedio.js
function generarTablaSimbolos(codigo) {
    const tokens = tokenizer(codigo);
    const ast = parse(tokens);

    const tablaSimbolos = new Map();
    let direccionMemoria = 0;

    function visitarAST(nodo) {
        if (nodo.tipo === "Programa") {
            nodo.cuerpo.forEach(visitarAST);
        } else if (nodo.tipo === "DeclaracionVariable") {
            nodo.declaraciones.forEach(declaracion => {
                const nombre = declaracion.id;
                const tipo = nodo.tipoDato;
                const valor = declaracion.inicial ? evaluarValorInicial(declaracion.inicial) : null;
                
                agregarSimbolo(nombre, tipo, valor);
            });
        }
    }

    function evaluarValorInicial(nodo) {
        if (nodo.tipo === "Numero") {
            return nodo.valor;
        } else if (nodo.tipo === "Identificador") {
            return tablaSimbolos.get(nodo.nombre)?.valor || null;
        }
        return null;
    }

    function agregarSimbolo(nombre, tipo, valor) {
        if (tablaSimbolos.has(nombre)) {
            throw new Error(`La variable "${nombre}" ya ha sido declarada.`);
        }
        tablaSimbolos.set(nombre, {
            tipo,
            tipoElemento: null,
            ambito: 'local',
            '@INI': direccionMemoria,
            dimensiones: [],
            esArreglo: false,
            K: null,
            valor: valor
        });

        direccionMemoria++;
    }

    if (ast && ast.tipo === "Programa") {
        visitarAST(ast);
    } else {
        throw new Error("No se pudo generar el AST.");
    }

    return tablaSimbolos;
}

function displayTablaSimbolos(tablaSimbolos) {
    let tablaHTML = "<table>";
    tablaHTML += "<tr><th>Nombre</th><th>Tipo</th><th>Ambito</th><th>@INI</th><th>Valor</th></tr>";

    for (const [nombre, info] of tablaSimbolos) {
        tablaHTML += `<tr>
                        <td>${nombre}</td>
                        <td>${info.tipo}</td>
                        <td>${info.ambito}</td>
                        <td>${info['@INI']}</td>
                        <td>${info.valor !== null ? info.valor : '-'}</td>
                    </tr>`;
    }

    tablaHTML += "</table>";
    return tablaHTML;
}

function loadEjemploTS(numeroEjemplo) {
    const ejemplos = [
        `entero a = 5\nentero b = 3\nentero c = 2 + a * b\n`,
        `real x = 4.5\nreal y = x + 3.2\nsi (y < 10)\n    y = y * 2\nsino\n    y = y - 1\nfinsi\n`,
        `entero i = 0\nmientras (i < 5)\n    i = i + 1\nfinmientras\n`,
        `real r\nreal s = r * 3.0\nentero t = (r + s) / 2\n`,
        `entero j = 7\nreal k = 2.5\nsi (j > )\n    k = k + 3.5\nsino\n    k = k - 1.5\nfinsi\n`
    ];
    return ejemplos[numeroEjemplo - 1];
}

window.generarTablaSimbolos = generarTablaSimbolos;
window.displayTablaSimbolos = displayTablaSimbolos;
window.loadEjemploTS = loadEjemploTS;