const TOKENS = {
  IDENTIFICADOR: /^[a-zA-Z_][a-zA-Z0-9_]*/,
  NUMERO: /^[0-9]+/,
  OPERADOR: /^[+\-*/]/,
  ASIGNACION: /^=/,
  PUNTO_Y_COMA: /^;/,
  PARENTESIS_CERRADO: /^\)/,
  COUT: /^cout/, // Modificado: solo "cout"
  MENORMENOR: /^<</, // Nuevo token para "<<"
  INT: /^int/,
  FLOAT: /^float$/
};

const CLASES_CARACTERES = {
  letra: /[a-zA-Z_]/,
  digito: /[0-9]/,
  operador: /[+\-*/]/,
  espacio: /\s/, // Espacio en blanco, tabulación, salto de línea
};

function transicionEstadoInicial(caracter) {
  if (CLASES_CARACTERES.letra.test(caracter)) {
      return "estado_identificador";
  } else if (CLASES_CARACTERES.digito.test(caracter)) {
      return "estado_numero";
  } else if (CLASES_CARACTERES.operador.test(caracter)) {
      return "estado_operador";
  } else if (caracter === "=") {
      return "estado_asignacion";
  } else if (caracter === ";") {
      return "estado_punto_y_coma";
  } else if (caracter === "(") {
      return "estado_parentesis_abierto";
  } else if (caracter === ")") {
      return "estado_parentesis_cerrado";
  } else if (caracter === "c") {
      return "estado_cout_c";
  } else if (caracter === "<") {
      return "estado_menor";
  } else if (caracter === "i") {
      return "estado_int_i";
  } else if (caracter === "f") {
      return "estado_float_f";
  } else if (CLASES_CARACTERES.espacio.test(caracter)) {
      return "estado_inicial"; // Ignorar espacios
  } else {
      return null; // Caracter inesperado
  }
}
// (Las demás funciones de transición no necesitan cambios)
function transicionEstadoCoutC(caracter) {
  if (caracter === "o") {
      return "estado_cout_co";
  } else {
      return null; //Error
  }
}

function transicionEstadoCoutCO(caracter) {
  if (caracter === "u") {
      return "estado_cout_cou";
  } else {
      return null; //Error
  }
}

function transicionEstadoCoutCou(caracter) {
  if (caracter === "t") {
      return "estado_cout";
  } else {
      return null; //Error
  }
}

function transicionEstadoCout(caracter) {
  return "estado_final";
}

const funcionesTransicion = {
    estado_inicial: transicionEstadoInicial,
    estado_identificador: (caracter) => {
        if (CLASES_CARACTERES.letra.test(caracter) || CLASES_CARACTERES.digito.test(caracter)) {
            return "estado_identificador";
        }
        return "estado_final";
    },
    estado_numero: (caracter) => {
        if (CLASES_CARACTERES.digito.test(caracter)) {
            return "estado_numero";
        }
        return "estado_final";
    },
    estado_operador: () => "estado_final",
    estado_asignacion: () => "estado_final",
    estado_punto_y_coma: () => "estado_final",
    estado_parentesis_abierto: () => "estado_final",
    estado_parentesis_cerrado: () => "estado_final",
    estado_cout_c: transicionEstadoCoutC,
    estado_cout_co: transicionEstadoCoutCO,
    estado_cout_cou: transicionEstadoCoutCou,
    estado_cout: transicionEstadoCout,
    estado_menor: (caracter) => {
        if (caracter === "<") {
            return "estado_menormenor";
        }
        return null;
    },
    estado_menormenor: () => "estado_final",
    estado_int_i: (caracter) => {
        if (caracter === "n") {
            return "estado_int_in";
        }
        return "estado_identificador";
    },
    estado_int_in: (caracter) => {
        if (caracter === "t") {
            return "estado_int";
        }
        return "estado_identificador";
    },
    estado_int: (caracter) => {
        if (CLASES_CARACTERES.letra.test(caracter) || CLASEES_CARACTERES.digito.test(caracter)) {
            return "estado_identificador";
        }
        return "estado_final";
    },
    estado_float_f: (caracter) => {
        if (caracter === "l") {
            return "estado_float_fl";
        }
        return "estado_identificador";
    },
    estado_float_fl: (caracter) => {
        if (caracter === "o") {
            return "estado_float_flo";
        }
        return "estado_identificador";
    },
    estado_float_flo: (caracter) => {
        if (caracter === "a") {
            return "estado_float_floa";
        }
        return "estado_identificador";
    },
    estado_float_floa: (caracter) => {
        if (caracter === "t") {
            return "estado_float";
        }
        return "estado_identificador";
    },
    estado_float: (caracter) => {
        if (CLASES_CARACTERES.letra.test(caracter) || CLASES_CARACTERES.digito.test(caracter)) {
            return "estado_identificador";
        }
        return "estado_final";
    }
};

function scanner(codigo) {
  let tokens = [];
  let estadoActual = "estado_inicial";
  let lexemaActual = "";

  for (let i = 0; i < codigo.length; i++) {
      const caracter = codigo[i];

      let claseCaracter = "otro"; // Asumir "otro" por defecto
      if (CLASES_CARACTERES.letra.test(caracter)) {
          claseCaracter = "letra";
      } else if (CLASES_CARACTERES.digito.test(caracter)) {
          claseCaracter = "digito";
      } else if (CLASES_CARACTERES.operador.test(caracter)) {
          claseCaracter = "operador";
      } else if (CLASES_CARACTERES.espacio.test(caracter)) {
          claseCaracter = "espacio";
      }

      console.log(`Caracter: ${caracter}, Estado: ${estadoActual}, Lexema: ${lexemaActual}, Clase: ${claseCaracter}`); // Depuración

      const siguienteEstado = funcionesTransicion[estadoActual](caracter); // Obtener el siguiente estado

      if (siguienteEstado) {
          if (siguienteEstado === "estado_final") {
              if (lexemaActual !== "") {
                  // Determinar el tipo de token
                  let tipoToken = null;
                  for (const tipo in TOKENS) {
                      if (TOKENS[tipo].test(lexemaActual)) {
                          tipoToken = tipo;
                          break;
                      }
                  }

                  if (tipoToken === "COUT") {
                      tokens.push({
                          tipo: tipoToken,
                          valor: lexemaActual
                      });

                      //Manejo especial de << despues de cout
                      let j = i + 1;
                      while (j < codigo.length && CLASES_CARACTERES.espacio.test(codigo[j])) {
                          j++;
                      } //Omitir espacios

                      if (j < codigo.length && codigo.substring(j, j + 2) === "<<") {
                          tokens.push({
                              tipo: "MENORMENOR",
                              valor: "<<"
                          });
                          i = j + 1; //Avanzar el indice principal
                      } else {
                          console.error("Error: Se esperaba '<<' después de 'cout'");
                      }

                  } else {
                      tokens.push({
                          tipo: tipoToken,
                          valor: lexemaActual
                      });
                  }

                  lexemaActual = "";
              }
              estadoActual = "estado_inicial"; // Volver al estado inicial
              if (caracter.trim() !== "") { //Procesa el caracter actual si no es espacio en blanco
                  i--; //Para procesar el caracter de final en la siguiente iteración
              }

          } else {
              estadoActual = siguienteEstado;
              lexemaActual += caracter;
          }
      } else {
          // Manejar errores (caracter inesperado)
          console.error(`Error: Carácter inesperado "${caracter}" en el estado "${estadoActual}"`);
          lexemaActual = "";
          estadoActual = "estado_inicial";
      }
  }

  // Procesar el lexema restante al final del código
  if (lexemaActual !== "") {
      let tipoToken = null;
      for (const tipo in TOKENS) {
          if (TOKENS[tipo].test(lexemaActual)) {
              tipoToken = tipo;
              break;
          }
      }
      tokens.push({
          tipo: tipoToken,
          valor: lexemaActual
      });
  }

  return tokens;
}