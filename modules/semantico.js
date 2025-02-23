// modules/semantico.js
    let tablaSimbolos = {};

    function insertarSimbolo(nombre, tipo, valor, ambito) {
        if (tablaSimbolos[nombre]) {
            console.warn(`Advertencia: El identificador "${nombre}" ya ha sido declarado.`);
        }
        tablaSimbolos[nombre] = {
            tipo: tipo,
            valor: valor,
            ambito: ambito
        };
    }
    
    function obtenerSimbolo(nombre) {
        return tablaSimbolos[nombre];
    }
    
    function existeSimbolo(nombre) {
        return !!tablaSimbolos[nombre]; // Convierte a booleano
    }
    
    function analizarSemantica() {
        let codigo = document.getElementById('codigoEntradaSemantico').value;
        tokens = scanner(codigo); // Llama a la función scanner
        indiceTokenActual = 0; // Reinicializa el índice
    
         tablaSimbolos={}; //Limpiar la tabla de simbolos
            let arbolSintactico = programa(); // Llama al analizador sintáctico
    
             //Genera tabla de Simbolos
              if(arbolSintactico){
                  arbolSintactico.forEach(nodo => {
                  if(nodo.tipo==="declaracion"){
                    insertarSimbolo(nodo.nombreVariable, nodo.tipoDato, undefined, "global")
                  }
                })
              }
              else{
                console.error("No se pudo crear el arbol sintactico")
              }
    
            tercetos = generarTercetos(arbolSintactico); // Genera tercetos
            let tercetosOptimizados = optimizar(tercetos); // Optmiza
            let codigoIntermedioDiv = document.getElementById('resultadoSemantico');
    
            codigoIntermedioDiv.innerHTML = "<b>Tabla de Símbolos:</b><br>" + JSON.stringify(tablaSimbolos, null, 2) +
                                         "<br><br><b>Código Intermedio Original:</b><br>" + JSON.stringify(tercetos, null, 2) +
                                          "<br><br><b>Código Intermedio Optimizado:</b><br>" + JSON.stringify(tercetosOptimizados, null, 2);
      }

const funcionesTransicionSemantico = {
    estado_inicial: (token, tablaSimbolos) => {
        if (token.tipo === "INT" || token.tipo === "FLOAT") {
            return {
                estado: "estado_declaracion",
                tipoActual: token.tipo
            };
        } else if (token.tipo === "COUT") {
            return {
                estado: "estado_cout"
            };
        }
        return null;
    },
    estado_declaracion: (token, tablaSimbolos, contexto) => {
        if (token.tipo === "IDENTIFICADOR") {
            if (tablaSimbolos[token.valor]) {
                throw new Error(`Variable ${token.valor} ya declarada`);
            }
            tablaSimbolos[token.valor] = {
                tipo: contexto.tipoActual,
                inicializada: false
            };
            return {
                estado: "estado_espera_asignacion",
                identificadorActual: token.valor
            };
        }
        return null;
    },
    estado_espera_asignacion: (token, tablaSimbolos, contexto) => {
        if (token.tipo === "ASIGNACION") {
            return {
                estado: "estado_espera_valor",
                identificadorActual: contexto.identificadorActual
            };
        }
        return null;
    },
    estado_cout: (token, tablaSimbolos) => {
        if (token.tipo === "IDENTIFICADOR") {
            if (!tablaSimbolos[token.valor] || !tablaSimbolos[token.valor].inicializada) {
                throw new Error(`Variable ${token.valor} no inicializada`);
            }
        }
        return { estado: "estado_final" };
    }
};

function analizadorSemantico(tokens) {
    const tablaSimbolos = {};
    let estado = "estado_inicial";
    let contexto = {};

    try {
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const resultado = funcionesTransicionSemantico[estado](token, tablaSimbolos, contexto);

            if (!resultado) {
                throw new Error(`Error semántico: token inesperado ${token.valor} en estado ${estado}`);
            }

            estado = resultado.estado;
            contexto = { ...contexto, ...resultado };

            if (estado === "estado_final") {
                estado = "estado_inicial";
                contexto = {};
            }
        }
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

module.exports = { analizadorSemantico };