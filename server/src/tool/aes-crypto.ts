import { randomBytes, createCipheriv, CipherGCMTypes, CipherCCMTypes } from 'crypto';
import { resolve } from 'path';
import { File } from './file';
import atob from 'atob';
import btoa from 'btoa';

interface AESAuth {
  key: number[];
  iv: number[];
}

export class AESCrypto implements AESAuth {
  private type: CipherGCMTypes | CipherCCMTypes;
  public key: number[];
  public iv: number[];
  
  public constructor(type: CipherGCMTypes | CipherCCMTypes, password?: string) {
    this.type = type;
    if (password) {
      // Base64 → String
      let raw: string;
      try {
        raw = atob(password)
      } catch {
        throw new Error('The password given its invalid.')
      }

      // String → Object
      let obj: AESAuth;
      try {
        obj = JSON.parse(raw)
        
        // Check Array
        if (
          (Object.getPrototypeOf(obj.key).constructor.name != 'Array') ||
          (Object.getPrototypeOf(obj.key).constructor.name != 'Array')
        ) {
          throw new Error()
        }
        
        // Check Bytes
        for (const item of obj.key) {
          if (typeof item != 'number') {
            throw new Error()
          }
        }
        for (const item of obj.iv) {
          if (typeof item != 'number') {
            throw new Error()
          }
        }

        // Check Length
        if (
          (obj.key.length != 16) ||
          (obj.iv.length != 8)
        ) {
          throw new Error()
        }

        this.key = obj.key
        this.iv = obj.iv
      } catch {
        throw new Error('The password given cannot be parsed.')
      }
    } else {
      const num = parseInt(this.type.replace(/[^0-9]/gi, ''), 10)

      this.key = randomBytes(num / 8).toJSON().data
      this.iv = randomBytes(8).toJSON().data
    }
  }

  public static load() {
    const file = new File(resolve('secret.txt'))
    if (file.exist) {
      const txt = file.readTextSync()
      const aes = new AESCrypto('aes-128-gcm', txt)
      return aes

    } else {
      const aes = new AESCrypto('aes-128-gcm')
      file.writeTextSync(aes.generate())
      return aes
    }
  }

  public generate() {
    const data: AESAuth = {
      key: this.key,
      iv: this.iv
    }

    return btoa(JSON.stringify(data, null, '  '))
  }

  public encrypt(text: string) {
    let binKey = Buffer.from(this.key)
    let binIv = Buffer.from(this.iv)

    let cipher = createCipheriv(this.type, binKey, binIv)
    let data = Buffer.concat([
      cipher.update(text),
      cipher.final()
    ])

    return data.toString("hex")
  }

  public decrypt(text: string) {
    let binKey = Buffer.from(this.key)
    let binIv = Buffer.from(this.iv)

    let cipher = createCipheriv(this.type, binKey, binIv)
    let data = Buffer.concat([
      cipher.update(Buffer.from(text, "hex")),
      cipher.final()
    ])

    return data.toString("utf8")
  }
}
