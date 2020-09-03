import { LOOP } from '.';
import { APP_CONFIG } from '..';

import { sleep } from '../tool/time';
import { File } from '../tool/file';
import { Etiqueta } from '../models/etiqueta';
import { CmdPrinter } from 'cmd-printer';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Printer } from '../models/printer';
import { Log } from '../tool/log';

export function configLoop() {
  LOOP.ms = 500
  LOOP.callback = async () => {
    File.makeFolder(APP_CONFIG.loop.input)
    let filename: string[] = readdirSync(APP_CONFIG.loop.input)
    if (!found) {
      found = true
      Log.ok(`Conexión establecida con la carpeta '${APP_CONFIG.loop.input}'\n`)
    }

    const queue: Queue[] = []
    const killer: File[] = []
    for (const name of filename) {
      if (!name.match(/\.txt$/gi)) {
        continue;
      }
      Log.ln(`Archivo encontrado -> "${name}"`)

      // Obtener los formatos de cada archivo entrante
      const etiq = await Etiqueta.readFile(join(APP_CONFIG.loop.input, name))
      const built = await etiq.build()

      for (const form of built) {
        Log.ln(`    - Formato: ${form.descripc}.-`)

        // Generar los formatos
        const file = await form.genPDF(etiq.copyOf)
        killer.push(file)

        // Agregar al Queue
        form.printers.forEach(printer => {
          const i = queue.findIndex(x => x.printer == printer)
          if (i >= 0) {
            queue[i].files.push(file)
          } else {
            queue.push({
              printer: printer,
              files: [ file ]
            })
          }
        })
      }
    }

    // Print All
    for (const item of queue) {
      CmdPrinter.print(
        item.printer.name,
        item.files.map(x => x.path)
      ).catch((err: any) => {
        Log.er(err.message)
      })
    }

    // Delete All
    sleep(APP_CONFIG.loop.timeout).then(() => {
      for (const item of killer) {
        if (item.exist) {
          item.delete()
        }
      }
    })
  }

  let found = false
  LOOP
    .start()
    .catch(async (err: any) => {
      Log.er(err.message)
      Log.ln('Reintentando en 5 seg...\n')
  
      found = false
      await sleep(5000)
      configLoop()
    })
}

interface Queue {
  printer: Printer;
  files: File[];
}