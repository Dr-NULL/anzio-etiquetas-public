import { resolve } from 'path';
import { ConnectionOptions } from 'typeorm';
import { File } from './file';
import { Log } from './log';

export function getOrmConfig(): ConnectionOptions {
    Log.ev('Leyendo archivo "ormconfig.json"...')
    const file = new File('./ormconfig.json')

    if (!file.exist) {
        file.writeTextSync(
                '{\n'
            +   '    "type": "mssql",\n'
            +   '    "host": "--DB_IP--",\n'
            +   '    "port": 1433,\n'
            +   '    "username": "--DB_USER--",\n'
            +   '    "password": "--DB_PASS--",\n'
            +   '    "database": "--DB_NAME--",\n'
            +   '    "encrypt": false,\n'
            +   '    "syncronize": false,\n'
            +   '    "logging": false,\n'
            +   '    "entities": [\n'
            +   '        "dist/models/**/*.js"\n'
            +   '    ],\n'
            +   '    "migrations": [\n'
            +   '        "dist/migrations/**/*.js"\n'
            +   '    ],\n'
            +   '    "cli": {\n'
            +   '        "entitiesDir": "src/models",\n'
            +   '        "migrationsDir": "src/migrations",\n'
            +   '        "subscribersDir": "src/subscribers"\n'
            +   '    }\n'
            +   '}'
        )

        Log.er('No se encontró archivo "ormconfig.json"!')
    } else {
        try {
            const data = JSON.parse(file.readTextSync())
            return data
        } catch (err) {
            Log.er('No se puede leer "ormconfig.json"!')
            Log.ln('El archivo está inaccesible o no se puede parsear.')
            Log.ln('Revise el archivo y vuelva a intentarlo.\n')
    
            process.exit()
        }
    }
}