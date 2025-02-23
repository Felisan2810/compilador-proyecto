function cargarModulo(modulo) {
    let contenidoDiv = document.getElementById('contenido');

    // Ejemplos predeterminados
    const ejemplos = {
        lexico: 'int x;\nfloat y;\nx = 5;\ny = 10.5;\ncout << x;',
        sintactico: 'int contador;\ncontador = 5;\ncout << contador;',
        semantico: 'int a;\nint b;\na = 10;\nb = 20;\ncout << a + b;',
        intermedio: 'int x;\nx = 5 + 3 * 2;\ncout << x;',
        optimizacion: 'int result;\nresult = 2 + 2;\nresult = result * 1;\ncout << result;'
    };

    switch (modulo) {
        case 'lexico':
            contenidoDiv.innerHTML = `
                <h2>Análisis Léxico</h2>
                <textarea id="codigoEntradaLexico" placeholder="Ingrese el código a tokenizar">${ejemplos.lexico}</textarea>
                <button onclick="analizarLexico()">Analizar</button>
                <div id="resultadoLexico"></div>
            `;
            break;
        case 'sintactico':
            contenidoDiv.innerHTML = `
                <h2>Análisis Sintáctico</h2>
                <textarea id="codigoEntradaSintactico" placeholder="Ingrese el código a analizar">${ejemplos.sintactico}</textarea>
                <button onclick="analizarSintaxis()">Analizar</button>
                <div id="resultadoSintaxis"></div>
            `;
            break;
        case 'semantico':
            contenidoDiv.innerHTML = `
                <h2>Análisis Semántico y Generación de Código Intermedio</h2>
                <textarea id="codigoEntradaSemantico" placeholder="Ingrese el código a analizar semánticamente">${ejemplos.semantico}</textarea>
                <button onclick="analizarSemantica()">Analizar y Generar Tercetos</button>
                <div id="resultadoSemantico"></div>
            `;
            break;
        case 'automatas':
            contenidoDiv.innerHTML = `
                <h2>Autómatas</h2>
                <p>Selecciona un autómata:</p>
                <select id='automatasSelect' onchange='cargarAutomata(this.value)'>
                    <option value=''>Selecciona un autómata</option>
                    <option value='afd'>AFD</option>
                </select>
                <div id="automataVisualizacion"></div>
                <div id="resultadoAutomatas"></div>
            `;
            break;
        case 'intermedio':
            contenidoDiv.innerHTML = `
                <h2>Generación de Código Intermedio</h2>
                <textarea id="codigoEntradaIntermedio" placeholder="Ingrese el código para generar código intermedio">${ejemplos.intermedio}</textarea>
                <button onclick="generarCodigoIntermedio()">Generar Código Intermedio</button>
                <div id="resultadoIntermedio"></div>
            `;
            break;
        case 'optimizacion':
            contenidoDiv.innerHTML = `
                <h2>Optimización de Código</h2>
                <textarea id="codigoEntradaOptimizacion" placeholder="Ingrese el código para optimizar">${ejemplos.optimizacion}</textarea>
                <button onclick="optimizarCodigo()">Optimizar Código</button>
                <div id="resultadoOptimizacion"></div>
            `;
            break;
        default:
            contenidoDiv.innerHTML = `<h2>${modulo}</h2><p>Contenido del módulo ${modulo}. ¡En construcción!</p>`;
    }
}

function analizarLexico() {
    let codigo = document.getElementById('codigoEntradaLexico').value;
    try {
        let tokens = scanner(codigo);
        document.getElementById('resultadoLexico').innerText = 
            JSON.stringify(tokens, null, 2);
    } catch (error) {
        document.getElementById('resultadoLexico').innerText = 
            "Error en el análisis léxico: " + error.message;
    }
}

function analizarSintaxis() {
    let codigo = document.getElementById('codigoEntradaSintactico').value;
    try {
        tokens = scanner(codigo);
        indiceTokenActual = 0;
        let arbolSintactico = programa();
        document.getElementById('resultadoSintaxis').innerText = 
            JSON.stringify(arbolSintactico, null, 2);
    } catch (error) {
        document.getElementById('resultadoSintaxis').innerText = 
            "Error en el análisis sintáctico: " + error.message;
    }
}

function analizarSemantica() {
    let codigo = document.getElementById('codigoEntradaSemantico').value;
    try {
        tokens = scanner(codigo);
        indiceTokenActual = 0;
        let arbolSintactico = programa();
        
        // Limpiar tabla de símbolos
        tablaSimbolos = {};
        
        // Análisis semántico y generación de código
        if (arbolSintactico) {
            arbolSintactico.forEach(nodo => {
                if (nodo.tipo === "declaracion") {
                    insertarSimbolo(nodo.nombreVariable, nodo.tipoDato, undefined, "global");
                }
            });
            
            let tercetos = generarTercetos(arbolSintactico);
            let tercetosOptimizados = optimizar(tercetos);
            
            document.getElementById('resultadoSemantico').innerHTML = 
                "<b>Tabla de Símbolos:</b><br>" + 
                JSON.stringify(tablaSimbolos, null, 2) +
                "<br><br><b>Tercetos:</b><br>" + 
                JSON.stringify(tercetosOptimizados, null, 2);
        }
    } catch (error) {
        document.getElementById('resultadoSemantico').innerText = 
            "Error en el análisis semántico: " + error.message;
    }
}

function generarCodigoIntermedio() {
    let codigo = document.getElementById('codigoEntradaIntermedio').value;
    try {
        tokens = scanner(codigo);
        indiceTokenActual = 0;
        let arbolSintactico = programa();
        let tercetos = generarTercetos(arbolSintactico);
        document.getElementById('resultadoIntermedio').innerText = 
            JSON.stringify(tercetos, null, 2);
    } catch (error) {
        document.getElementById('resultadoIntermedio').innerText = 
            "Error en la generación de código intermedio: " + error.message;
    }
}

function optimizarCodigo() {
    let codigo = document.getElementById('codigoEntradaOptimizacion').value;
    try {
        tokens = scanner(codigo);
        indiceTokenActual = 0;
        let arbolSintactico = programa();
        let tercetos = generarTercetos(arbolSintactico);
        let tercetosOptimizados = optimizar(tercetos);
        document.getElementById('resultadoOptimizacion').innerText = 
            JSON.stringify(tercetosOptimizados, null, 2);
    } catch (error) {
        document.getElementById('resultadoOptimizacion').innerText = 
            "Error en la optimización: " + error.message;
    }
}

function cargarAutomata(tipo) {
    const automataDiv = document.getElementById('automataVisualizacion');
    if (tipo === 'afd') {
        automataDiv.innerHTML = '<h3>Autómata Finito Determinista</h3>' +
            '<p>Visualización del AFD para el análisis léxico...</p>';
    }
}