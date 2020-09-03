import { randomBytes } from 'crypto';

/**
 * Crea un número que contiene la fecha y hora (17 carácteres), y opcionalmente 
 * un conjunto de números generados de forma aleatoria.
 * @param ext Extensión de archivo (se puede dejar null).
 * @param length Largo de los caracteres que se generarán de forma aleatoria.
 */
export function generateName(ext: string = null, length: number = null) {
  if (ext) {
    ext = ext.replace(/^\.+/gi, '')
    ext = ext.toLowerCase()
    ext = '.' + ext
  
    if (ext.match(/^[a-z0-9\.]+$/gi) == null) {
      throw new Error('La extensión ingresada contiene carácteres no admitidos.')
    }
  } else {
    ext = ''
  }

  return  getDate()
        + getTime()
        + getRand(length)
        + ext
}

function getDate() {
  const now = new Date()
  return  addZero(now.getFullYear(), 4)
        + addZero(now.getMonth() + 1, 2)
        + addZero(now.getDate(), 2)
}

function getTime() {
  const now = new Date()
  return  addZero(now.getHours(), 2)
        + addZero(now.getMinutes(), 2)
        + addZero(now.getSeconds(), 2)
        + addZero(now.getMilliseconds(), 3)
}

function getRand(length?: number) {
  if (length == null) {
    return ''
  }

  const bytes = randomBytes(length)
  let i = 0
  let out = ''
  let con = ''
  while (
    (out.length < length) &&
    (i < bytes.length)
  ) {
    if (con.length === 0) {
      con = bytes[i].toString()
      i++
    }

    out += con.substr(0, 1);
    con = con.substr(1, con.length - 1)
  }
  
  // for (const byte of bytes) {
  //   out += addZero(byte, 3)
  // }
  return out
}

function addZero(input: string | number, length: number) {
  let out = String(input)
  while (out.length < length) {
    out = '0' + out
  }

  return out
}