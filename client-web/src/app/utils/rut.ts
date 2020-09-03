import { Iterator } from './iterator';

export class Rut {
  constructor() { }

  public static format(input: string) {
    input = input.replace(/(\.|-)/gi, '').trim().toLowerCase();
    const arr = input.split('').reverse();
    let out = '';

    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        out = `-${arr[i]}`;

      } else if ((i % 3 === 0) && (i < (arr.length - 1))) {
        out = `.${arr[i]}${out}`;
      } else {
        out = `${arr[i]}${out}`;
      }
    }

    return out;
  }

  public static isValid(input: string) {
    // Rechazar cadenas vacías
    if (input.length === 0) {
      return false;
    }

    // Inicialización
    const serie = new Iterator(2, 3, 4, 5, 6, 7);
    const raw = input.replace(/(\.|-([0-9]|k))/gi, '').split('').reverse();
    let acum = 0;

    // Sumar serie de multiplicaciones
    for (const char of raw) {
      const num = parseInt(char, 10);
      acum += num * serie.next();
    }

    // Calc Mod 11
    const done = 11 - (acum % 11);
    let verif: string;
    switch (done) {
      case 11:
        verif = '0';
        break;
      case 10:
        verif = 'k';
        break;
      default:
        verif = String(done);
        break;
    }

    // Return result
    if (verif === input[input.length - 1].toLowerCase()) {
      return true;
    } else {
      return false;
    }
  }
}
