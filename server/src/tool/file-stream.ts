import { File } from './file';
import { Request } from 'express';
import { APP_CONFIG } from '..';
import { extension } from 'mime-types';
import { generateName } from './name-gen';
import { createWriteStream } from 'fs';

export class FileStream extends File {
  private req: Request;

  private rndLengthValue: number;
  public get rndLength(): number {
    return this.rndLengthValue;
  }
  public set rndLength(v: number) {
    this.rndLengthValue = v;
  }

  public constructor(req: Request, folder: string = APP_CONFIG.folder.stream) {
    // Build Path
    if (folder == null) {
      throw new Error(
        `Folder value must be a valid path String.\n`
        + `Path -> "${folder}"`
      )
    } else if (folder.match(/(\\|\/)$/gi) == null) {
      folder += '/'
    }
    folder = folder.replace(/\\/gi, '/')

    // Build Name
    super(folder + 'temp.raw');
    this.req = req
    this.rndLengthValue = 8;
    this.readHeader();
  }

  private readHeader() {
    // Buscar Llave
    let key: string
    for (const item of Object.keys(this.req.headers)) {
      if (item.toLowerCase() == 'content-disposition') {
        key = item
        break
      }
    }
    if (key == null) {
      return;
    }

    // Buscar Filename en header
    let pair = String(this.req.headers[key]).match(/filename\s*=\s*".+"/gi)
    if (pair == null) {
      return;
    }

    // Parsear Filename
    let value = pair[0].replace(/(filename\s*=\s*"|")/gi, '')
    value = decodeURI(value)

    const name = value.replace(/\.[^\.\\\/]+$/gi, '');
    const ext = value.replace(/^([^\.]+\.)+/gi, '');
    const extMime = extension(this.req.headers["content-type"]);
    
    this.nameValue = name;
    if (extMime != false) {
      this.extValue = extMime as string;
    } else if (ext.length > 0) {
      this.extValue = ext;
    } else {
      this.extValue = 'raw'
    }
  }

  public download() {
    return new Promise<void>((resolve, reject) => {
      this.nameValue = generateName(null, 8);

      const stream = createWriteStream(this.path);
      this.req.pipe(stream);

      // Eventos de Lectura
      this.req.on('end', () => {
        stream.close();
      });
      this.req.on('error', () => {
        reject(new Error(
            `The data transmission by the client `
          + `has been unexpectedly closed.`
        ));
      });

      // Eventos de Escritura
      stream.on('finish', () => {
        resolve();
      });
      stream.on('error', () => {
        reject(new Error(
            `the data written into the disk has `
          + `been unexpecting failed.`
        ));
      })
    })
  }
}