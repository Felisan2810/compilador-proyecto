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