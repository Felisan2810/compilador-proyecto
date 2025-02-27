// modules/intermedio.js
function generarTablaSimbolosYTercetos(codigo) {
    const tokens = tokenizer(codigo);
    const ast = parse(tokens);

    const tablaSimbolos = new Map();
    let direccionMemoria = 0;
    let longitudTipo = {
        "entero": 2,
        "real": 4
    };
    let tercetos = []; //Aquí almacenaremos los tercetos generados
    let contadorTemporales = 0;

    function nuevoTemporal() {
        return "t" + contadorTemporales++;
    }

    function agregarSimbolo(nombre, tipo, dimensiones = []) {
        if (tablaSimbolos.has(nombre)) {
            throw new Error(`La variable "${nombre}" ya ha sido declarada.`);
        }

        let tipoElemento = null;
        let esArreglo = dimensiones.length > 0;

        if (esArreglo) {
            tipoElemento = tipo;  //Si es un array, guarda el tipo de elemento
            tipo = "array";
        }

        tablaSimbolos.set(nombre, {
            tipo: tipo,
            tipoElemento: tipoElemento,
            ambito: 'local',
            '@INI': direccionMemoria,
            dimensiones: dimensiones,
            esArreglo: esArreglo,
            K: calcularK(nombre, direccionMemoria, dimensiones),
            valor: null
        });


        direccionMemoria += calcularTamanio(tipo, dimensiones);
    }

    function calcularTamanio(tipo, dimensiones) {
        if (dimensiones.length === 0) {
            return longitudTipo[tipo] || 2; // valor por defecto 2 para enteros
        }

        let tamanio = 1;
        dimensiones.forEach(dimension => {
            tamanio *= parseInt(dimension);
        });
        return tamanio * (longitudTipo[tipo] || 2);
    }

    function calcularK(nombre, direccionBase, dimensiones) {
        if (dimensiones.length === 0) return null;

        if (dimensiones.length === 1) {
            return `${direccionBase} + i`;
        } else if (dimensiones.length === 2) {
            return `${direccionBase} + ${dimensiones[1]}i + j`;
        }
        return null;
    }

    function VisitarAST(nodo) {
      if (nodo.tipo === "Programa") {
          nodo.cuerpo.forEach(VisitarAST);
          return;
      }

      if (nodo.tipo === "DeclaracionVariable") {
          nodo.declaraciones.forEach(declaracion => {
              agregarSimbolo(declaracion.id, nodo.tipoDato, declaracion.dimensiones);
          });
          return;
      }

      if (nodo.tipo === "Asignacion") {
         
          console.log("asignaciones");
          return;
      }

      if (nodo.tipo === "DeclaracionSi") {
          console.log("condicionales");
          return;
      }

      if (nodo.tipo === "DeclaracionMientras") {
          console.log("bucles");
          return;
      }
    }

    function traducirExpresion(nodo) {
        if (nodo.tipo === "Numero") {
            return nodo.valor;
        } else if (nodo.tipo === "Identificador") {
            return nodo.nombre;
        } else if (nodo.tipo === "ExpresionAsignada") {
            const temporal = nuevoTemporal();
            tercetos.push([nodo.operador, traducirExpresion(nodo.izquierda), traducirExpresion(nodo.derecha), temporal]);
            return temporal;
        }
        throw new Error(`Tipo de nodo desconocido: ${nodo.tipo}`);
    }

    if (ast && ast.tipo === "Programa") {
        VisitarAST(ast);
    } else {
        throw new Error("No se pudo generar el AST.");
    }

    return { tablaSimbolos, tercetos };
}

function displayTablaSimbolos(tablaSimbolos) {
    let tablaHTML = "<style> table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #4CAF50; color: white; } </style>";
    tablaHTML += "<table>";
    tablaHTML += "<tr><th>Nombre</th><th>Tipo</th><th>Tipo_Elemento</th><th>Ambito</th><th>@INI</th><th>K</th><th>Es Arreglo</th><th>Dimensiones</th></tr>";

    for (const [nombre, info] of tablaSimbolos) {
        tablaHTML += `<tr>
                        <td>${nombre}</td>
                        <td>${info.tipo}</td>
                        <td>${info.tipoElemento !== null ? info.tipoElemento : '-'}</td>
                        <td>${info.ambito}</td>
                        <td>${info['@INI']}</td>
                        <td>${info.K !== null ? info.K : '-'}</td>
                        <td>${info.esArreglo ? 'Sí' : 'No'}</td>
                        <td>${info.dimensiones.length > 0 ? info.dimensiones.join(', ') : '-'}</td>
                    </tr>`;
    }

    tablaHTML += "</table>";

    return tablaHTML;
}
// functions/DisplayTercetos
function displayTercetos(tercetos) {
    let tercetosHTML = "<h2>Tercetos:</h2>";
    tercetosHTML += "<ol>";
    tercetos.forEach((terceto, index) => {
        tercetosHTML += `<li>${index + 1}: ${terceto.join(', ')}</li>`;
    });
    tercetosHTML += "</ol>";
    return tercetosHTML;
}

function loadEjemploTS(numeroEjemplo) {
    const ejemplos = [
        `entero a[3][2], b[4], c[5][3];`,
        `real x = 4.5\nreal y = x + 3.2\nsi (y < 10)\n    y = y * 2\nsino\n    y = y - 1\nfinsi\n`,
        `entero i = 0\nmientras (i < 5)\n    i = i + 1\nfinmientras\n`,
        `real r\nreal s = r * 3.0\nentero t = (r + s) / 2\n`,
        `entero j = 7\nreal k = 2.5\nsi (j > )\n    k = k + 3.5\nsino\n    k = k - 1.5\nfinsi\n`
    ];
    return ejemplos[numeroEjemplo - 1];
}

window.generarTablaSimbolosYTercetos = generarTablaSimbolosYTercetos;
window.displayTablaSimbolos = displayTablaSimbolos;
window.displayTercetos = displayTercetos; 
window.loadEjemploTS = loadEjemploTS;