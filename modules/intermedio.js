// modules/intermedio.js
let tercetos = [];
let contadorTemporales = 0;

function generarNuevoTemporal() {
    return `temp${contadorTemporales++}`;
}

function generarTercetos(ast) {
    tercetos = []; // Limpiar la lista de tercetos
    contadorTemporales = 0; // Reiniciar el contador de temporales

    function generarCodigo(node) {
        switch (node.tipo) {
            case "declaracion":
                // Las declaraciones no generan tercetos directamente,
                // ya que la TS ya contiene la información.
                return;

            case "asignacion":
                let temporalExpresion = generarCodigo(node.expresion);
                tercetos.push(["=", node.nombreVariable, temporalExpresion]);
                return;

            case "cout":
                let temporalCout = generarCodigo(node.expresion);
                tercetos.push(["cout", temporalCout, ""]); // Suponiendo que "cout" es un operador especial
                return;

            case "operacion":
                let temporalIzquierdo = generarCodigo(node.operandoIzquierdo);
                let temporalDerecho = generarCodigo(node.operandoDerecho);
                let temporalResultado = generarNuevoTemporal();
                tercetos.push([node.operador, temporalIzquierdo, temporalDerecho, temporalResultado]);
                return temporalResultado;

            case "variable":
                return node.nombre;

            case "numero":
                return node.valor;

            default:
                console.error(`Tipo de nodo desconocido: "${node.tipo}"`);
                return null;
        }
    }

    if (Array.isArray(ast)) {
        ast.forEach(node => generarCodigo(node));  // Si es un array de sentencias
    } else {
        generarCodigo(ast); // Si es una sola expresión
    }
    return tercetos; //Retornar la lista de tercetos generados
}