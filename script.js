function toggleInterpreteOptions() {
    const opciones = document.getElementById('interpreteOptions');
    opciones.style.display = opciones.style.display === 'none' ? 'block' : 'none';
}

function toggleParserOptions() {
    const opciones = document.getElementById('parserOptions');
    opciones.style.display = opciones.style.display === 'none' ? 'block' : 'none';
}

function toggleTablaSimbolosOptions() {
    const opciones = document.getElementById('tablaSimbolosOptions');
    opciones.style.display = opciones.style.display === 'none' ? 'block' : 'none';
}

function cargarModulo(modulo, ejemplo = null) {
    let contenidoDiv = document.getElementById('contenido');

    if (modulo === 'interprete') {
        contenidoDiv.innerHTML = `
            <h2>Intérprete</h2>
            <textarea id="codeInput" placeholder="Escribe tu código aquí..."></textarea>
            <div class="buttons">
                <button id="runButton">Ejecutar</button>
                <button id="copyButton">Copiar</button>
            </div>
            <div class="output-section">
                <div id="output">Resultado aparecerá aquí...</div>
            </div>
        `;

        // Añadir event listeners a los botones
        document.getElementById('runButton').addEventListener('click', ejecutarCodigo);
        document.getElementById('copyButton').addEventListener('click', copiarCodigo);

        // Cargar el ejemplo si se especifica
        if (ejemplo) {
            loadEjemplo(ejemplo);
        }

        function ejecutarCodigo() {
            const entradaCodigo = document.getElementById('codeInput').value;
            const elementoSalida = document.getElementById('output');

            try {
                // Llama a la función interpretarCodigo del módulo interprete.js
                const resultado = interpretarCodigo(entradaCodigo);
                elementoSalida.textContent = `Resultado: ${resultado}`;
            } catch (error) {
                elementoSalida.textContent = `Error: ${error.message}`;
            }
        }

        function copiarCodigo() {
            const entradaCodigo = document.getElementById('codeInput');
            entradaCodigo.select();
            document.execCommand('copy');
            alert('Código copiado al portapapeles');
        }

        function loadEjemplo(numeroEjemplo) {
            const ejemplos = [
                `a = 5;\nb = 3;\nc = 2 + a * b;\ncout<<c;`,
                `a = 5;\nb = 3;\nc = (2 + a) * b;\ncout<<c;`,
                `a = 4;\nb = 6;\na = a + b;\ncout<<a;`,
                `x = 2;\ny = x + 3;\nz = x * y + y;\ncout<<z;`,
                `a = 7;\nb = c + 2;\ncout<<b;`
            ];
            document.getElementById('codeInput').value = ejemplos[numeroEjemplo - 1];
        }
    } else if (modulo === 'parser') {
        contenidoDiv.innerHTML = `
            <h2>Parser</h2>
            <textarea id="codeInput" placeholder="Escribe tu código aquí..."></textarea>
            <div class="buttons">
                <button id="runButton">Ejecutar</button>
                <button id="copyButton">Copiar</button>
            </div>
            <div class="output-section">
                <div id="output">Resultado aparecerá aquí...</div>
            </div>
        `;

        // Añadir event listeners a los botones
        document.getElementById('runButton').addEventListener('click', ejecutarCodigo);
        document.getElementById('copyButton').addEventListener('click', copiarCodigo);

        // Cargar el ejemplo si se especifica
        if (ejemplo) {
            loadEjemplo(ejemplo);
        }

        function ejecutarCodigo() {
            const entradaCodigo = document.getElementById('codeInput').value;
            const elementoSalida = document.getElementById('output');

            try {
                // Llama a la función analizarCodigo del módulo parser.js
                const resultado = analizarCodigo(entradaCodigo);
                elementoSalida.innerHTML = `<pre>Resultado: ${resultado}</pre>`;
            } catch (error) {
                elementoSalida.innerHTML = `<div class="error">Error: ${error.message}</div>`;
                console.error('Error al analizar código:', error);
            }
        }

        function copiarCodigo() {
            const entradaCodigo = document.getElementById('codeInput');
            entradaCodigo.select();
            document.execCommand('copy');
            alert('Código copiado al portapapeles');
        }

        function loadEjemplo(numeroEjemplo) {
            const ejemplos = [
                `entero a = 5\nentero b = 3\nentero c = 2 + a * b\n`,
                `real x = 4.5\nreal y = x + 3.2\nsi (y < 10)\n    y = y * 2\nsino\n    y = y - 1\nfinsi\n`,
                `entero i = 0\nmientras (i < 5)\n    i = i + 1\nfinmientras\n`,
                `real r\nreal s = r * 3.0\nentero t = (r + s) / 2\n`,
                `entero j = 7\nreal k = 2.5\nsi (j > )\n    k = k + 3.5\nsino\n    k = k - 1.5\nfinsi\n`
            ];
            document.getElementById('codeInput').value = ejemplos[numeroEjemplo - 1];
        }
    } else if (modulo === 'tablasimbolos') {
        contenidoDiv.innerHTML = `
            <h2>Tabla de Símbolos</h2>
            <textarea id="codeInput" placeholder="Escribe tu código aquí..."></textarea>
            <div class="buttons">
                <button id="runButton">Generar Tabla de Símbolos</button>
            </div>
            <div class="output-section">
                <div id="output">Tabla de símbolos aparecerá aquí...</div>
            </div>
        `;

        // Añadir event listeners a los botones
        document.getElementById('runButton').addEventListener('click', generarTabla);

        if (ejemplo) {
            loadEjemplo(ejemplo);
        }
        function generarTabla() {
            const entradaCodigo = document.getElementById('codeInput').value;
            const elementoSalida = document.getElementById('output');

            try {
                // Llama a la función generarTablaSimbolos del módulo intermedio.js
                const tablaSimbolos = generarTablaSimbolos(entradaCodigo);
                const tablaHTML = displayTablaSimbolos(tablaSimbolos);
                elementoSalida.innerHTML = tablaHTML;
            } catch (error) {
                elementoSalida.textContent = `Error: ${error.message}`;
            }
        }
        function loadEjemplo(numeroEjemplo) {
            const ejemplos = [
                `entero a = 5\nentero b = 3\nentero c = 2 + a * b\n`,
                `real x = 4.5\nreal y = x + 3.2\nsi (y < 10)\n    y = y * 2\nsino\n    y = y - 1\nfinsi\n`,
                `entero i = 0\nmientras (i < 5)\n    i = i + 1\nfinmientras\n`,
                `real r\nreal s = r * 3.0\nentero t = (r + s) / 2\n`,
                `entero j = 7\nreal k = 2.5\nsi (j > )\n    k = k + 3.5\nsino\n    k = k - 1.5\nfinsi\n`
            ];
            document.getElementById('codeInput').value = ejemplos[numeroEjemplo - 1];
        }
    }
}
function analizarCodigo(codigo) {
    const tokens = tokenizer(codigo);
    const ast = parse(tokens);
    return JSON.stringify(ast, null, 2);
}