import { File } from './file';
import { Log } from './log';
import { resolve } from 'path';
import { Regex } from './regex';

interface IConfigApp {
  folder: {
    [key: string]: string;
    angular: string;
    session: string;
    fonts: string;
    pdf: string;
    img: string;
    stream: string;
    html: string;
  };
  server: {
    port: number;
    prefix: string;
    cookieSession: string;
  };
  loop: {
    input: string;
    ms: number;
    timeout: number;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

export function getAppConfig(): IConfigApp {
  Log.ev('Leyendo archivo "appconfig.json"...')
  const file = new File('./appconfig.json')

  if (!file.exist) {
    file.writeTextSync(
      '{\n'
      + '  "folder": {\n'
      + '    "angular": "client-web/dist/",\n'
      + '    "session": "data/session/",\n'
      + '    "fonts": "data/fonts/",\n'
      + '    "pdf": "data/pdf/",\n'
      + '    "img": "data/img/",\n'
      + '    "stream": "data/stream/"\n'
      + '  },\n'
      + '  "server": {\n'
      + '    "port": 80,\n'
      + '    "prefix": "/api",\n'
      + '    "cookieSession": "session"\n'
      + '  },\n'
      + '  "loop": {\n'
      + '    "input": "--CARPETA DE ESCUCHA--",\n'
      + '    "ms": 500,\n'
      + '    "timeout": 15000\n'
      + '  },\n'
      + '  "mail": {\n'
      + '    "host": "--RUTA DEL HOST AQUÍ (SMTP O POP3)--",\n'
      + '    "port": 9999,\n'
      + '    "user": "--USUARIO--",\n'
      + '    "pass": "--PASSWORD--"\n'
      + '  }\n'
      + '}'
    )

    Log.er('No se encontró archivo "appconfig.json"!')
  } else {
    try {
      const data: IConfigApp = JSON.parse(file.readTextSync())
      const paths = data.folder

      // Resolve all routes
      for (const key of Object.keys(paths)) {
        let path = resolve('..', paths[key])
        path = path.replace(/\\/gi, '/')

        if (!path.endsWith('/')) {
          path += '/'
        }

        data.folder[key] = path
      }

      // Parse Route
      if (data.loop.input.match(/(\\|\/)$/gi) == null) {
        Regex.switch(
          data.loop.input,
          {
            pattern: /\\/gi,
            callback: () => {
              data.loop.input += '\\'
            }
          },
          {
            pattern: /\//gi,
            callback: () => {
              data.loop.input += '/'
            }
          }
        )
      }

      return data
    } catch (err) {
      Log.er('No se puede leer "appconfig.json"!')
      Log.ln('El archivo está inaccesible o no se puede parsear.')
      Log.ln('Revise el archivo y vuelva a intentarlo.\n')

      process.exit()
    }
  }
}