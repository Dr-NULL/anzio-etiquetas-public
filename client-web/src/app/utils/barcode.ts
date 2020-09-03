export class Barcode {
  public static to128: (value: string) => string = (input) => {
      //No admitir cadenas vacías
      if (input.length == 0) {
          return "";
      }
      
      //No admitir caracteres incompatibles
      for (let i = 0; i < input.length; i++) {
          let char = input.charCodeAt(i);

          if ((char < 32) || ((char > 126) && (char != 203))) {
              return "";
          }
      }
      
      //Comprobar si es compatible con Tabla C
      let isTableC = (i: number) => {
          if (i >= (input.length - 1)) {
              return false;
          } else {
              let out = true;
              let ref = input.substr(i, 2).split("");
              
              ref.forEach(char => {
                  if (out) {
                      let ascii = char.charCodeAt(0);
                      
                      if ((ascii < 48) || (ascii > 57)) {
                          out = false;
                      }
                  }
              })

              return out;
          }
      };

      let output: string = "";
      let tableC = false;
      for (let i = 0; i < input.length; i++) {
          if (isTableC(i)) {
              //Table C
              let num = parseInt(input.substr(i, 2));
              if (num < 95) {
                  num = num + 32;
              } else {
                  num = num + 105;
              }

              //Prefijo Table C
              if (i == 0) {
                  output += String.fromCharCode(210);
              } else if(!tableC) {
                  output += String.fromCharCode(204);
              }

              tableC = true;
              output += String.fromCharCode(num);
              i++;
          } else {
              //Prefijo Table B
              if (i == 0) {
                  output += String.fromCharCode(209);
              } else if(tableC) {
                  output += String.fromCharCode(205);
              }

              tableC = false;
              output += input.substr(i, 1);
          }
      }

      //Calcular Dígito de Control
      let checksum = 0
      for (let i = 0; i < output.length; i++) {
          let ascii = output.charCodeAt(i);
          if (ascii < 127) {
              ascii = ascii - 32;
          } else {
              ascii = ascii - 105;
          }
          
          if (i == 0) {
              checksum = ascii;
          } else {
              checksum = (checksum + i * ascii) % 103;
          }

      }

      //Buscar su equivalente en ASCII
      if (checksum < 95) {
          checksum += 32;
      } else {
          checksum += 105;
      }

      //Agregar Checksum y Carácter de Stop
      output += String.fromCharCode(checksum);
      output += String.fromCharCode(211);
      return output;
  }
}
