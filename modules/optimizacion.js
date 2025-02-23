// modules/optimizacion.js

function optimizarTercetos(tercetos) {
    let tercetosOptimizados = [...tercetos]; 
    let cambiosRealizados = true;

    while (cambiosRealizados) {
        cambiosRealizados = false;

        // 1. Eliminación de Operaciones Redundantes
        for (let i = 0; i < tercetosOptimizados.length; i++) {
            let terceto = tercetosOptimizados[i];

            
            if (terceto[0] === "*" && terceto[2] === "1") {
                tercetosOptimizados.splice(i, 1);
                cambiosRealizados = true;
                i--; 
            }
            
            if (terceto[0] === "+" && terceto[2] === "0") {
                tercetosOptimizados.splice(i, 1);
                cambiosRealizados = true;
                i--; 
            }
        }
    }
    return tercetosOptimizados; 
}
 function plegadoDeConstantes(tercetos) {
        let tercetosOptimizados = [...tercetos]; 
        let cambiosRealizados = true;

        while (cambiosRealizados) {
            cambiosRealizados = false;

            // 2. Plegado de Constantes
            for (let i = 0; i < tercetosOptimizados.length; i++) {
                let terceto = tercetosOptimizados[i];

              if (terceto[0] === "+" || terceto[0] === "-" || terceto[0] === "*" || terceto[0] === "/") {
                    if (typeof terceto[1] === 'number' && typeof terceto[2] === 'number') {
                        let resultado;
                        switch (terceto[0]) {
                            case "+": resultado = terceto[1] + terceto[2]; break;
                            case "-": resultado = terceto[1] - terceto[2]; break;
                            case "*": resultado = terceto[1] * terceto[2]; break;
                            case "/": resultado = terceto[1] / terceto[2]; break;
                        }
                        tercetosOptimizados[i] = ["=", terceto[3], resultado];  // Reemplaza con asignación directa
                        cambiosRealizados = true;
                    }
                }
            }
        }
        return tercetosOptimizados;
    }

    function optimizar(tercetos){
        let tercetosOptimizados = optimizarTercetos(tercetos);
        tercetosOptimizados = plegadoDeConstantes(tercetosOptimizados);
        return tercetosOptimizados
    }